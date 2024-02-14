import React, { useCallback, useEffect, useReducer, useState } from "react";
import { Col, Row } from "react-bootstrap";
import FormDateRangePickerController from "../../../shared/components/form-components/FormDateRangePicker/FormDateRangePickerController";
import ColumnChart from "../../../shared/components/Charts/ColumnChart";
import { Badge, Box, Card, CardContent, IconButton, Tab, Tabs, Typography } from "@mui/material";
import ApiService from "../../../core/services/axios/api";
import localStore from "../../../common/browserstore/localstore";
import { CultureId } from "../../../common/application/i18n";
import { formatDateTime, getAdditionalGreeting, getTimeOfDay } from "../../../common/application/shared-function";
import TaskWidget from "../../../shared/components/Widgets/TaskWidget";
import RequestWidget from "../../../shared/components/Widgets/RequestWidget";
import ChartConfig from "../../../shared/components/Charts/chart.config";
import ResetButton from "../../../shared/components/Buttons/IconButtons/ResetButton";
import { CardSlider } from "./Components/CardSlider";
import { Afternoon, Evening, Morning } from "../../../assets/images/png/pngimages";
import AreaSplineChart from "../../../shared/components/Charts/AreaChart/AreaSplineChart";
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { StatusGrid } from "./Components/StatusGrid";
import './dashboard.scss';
import RecentWidget from "../../../shared/components/Widgets/RecentWidget";
import CommonUtils from "../../../common/utils/common.utils";
import { UserType } from "../../../common/database/enums";
import SkeletonLoader from "../../../shared/components/UI/Loader/SkeletonLoader";
import { BadgeLoader, GraphLoader, TransListLoader } from "./Components/DashboardLoader";



const getInitialDate = () => {


    const curr = new Date();
    const startDate = new Date(curr.setMonth(curr.getMonth() - 1));
    const endDate = new Date();
    // const startDate = new Date(curr.setDate(curr.getDate() - curr.getDay()));
    // const endDate = new Date(curr.setDate(curr.getDate() - curr.getDay() + 6));
    return {
        startDate,
        endDate
    }
}

const DashboardCard = ({ children, title }: any) => {
    return (
        <Card className="h-100 mb-3 widget-card-wrap">
            <CardContent className="widget-card-content">
                <div className="widget-title px-2">
                    {/* <img src={PencilNotation} className="img-fluid" alt="" /> */} {title}
                </div>
                {children}
            </CardContent>
        </Card>
    )
}
const NoDataDashboard = () => {
    const { t } = useTranslation();
    return (
        <div className="d-flex h-100 align-items-center justify-content-center data-wrap">
            <p className="my-4">{t("No Data Found")}</p>
        </div>
    )
}
const localReducer = (state: any, action: any) => {
    switch (action.type) {
        case 'activity':
            return {
                ...state,
                activity: {
                    data: [{
                        data: action.payload.data,
                        name: 'activity'
                    }],
                    options: {
                        xaxis: {
                            categories: action.payload.labels,
                            labels: {
                                show: false
                            }
                        }
                    }
                }
            }
        case 'activityStacked':
            return {
                ...state,
                activityStacked: {
                    data: action.payload.data,
                    options: {
                        colors: action.payload.colors,
                        xaxis: {
                            categories: action.payload.labels,
                            labels: {
                                show: false
                            }
                        }
                    }
                }
            }
        case 'activityPie':
            return {
                ...state,
                activityPie: {
                    data: action.payload.data,
                    options: {
                        colors: action.payload.colors,
                        labels: action.payload.labels
                    }
                }
            }
        case 'tasks':
            return {
                ...state,
                tasks: action.payload.data
            }
        case 'requests':
            return {
                ...state,
                requests: action.payload.data
            }
        default:
            break;
    }
}
function Dashboard() {
    const [range, setRange] = useState(getInitialDate());
    const [dashboardData, localDispatch] = useReducer(localReducer, { pieChart: null, activity: null, tasks: [], requests: [] });
    const [cardData, setCardData] = useState<any>();
    const userData = localStore.getLoggedInfo();
    const [tabValue, setTabValue] = useState('1');
    const navigate = useNavigate();
    const [badgeCount, setBadgeCount] = useState<any>();
    const [recentTrans, setRecentTrans] = useState<any>();
    const { t } = useTranslation();
    const [isLoading, setIsLoading] = useState({
        graphLoader: false,
        tableLoader: false,
        badgeLoader: false,
        transactionLoader: false,
    });


    const { USER_ID: userID, FRANCHISE_ID, USER_NAME } = userData && JSON.parse(userData);
    const lang = CultureId();
    const buildGraphs = (data: any, DashboardType: number) => {
        switch (DashboardType) {
            case 33201:
                localDispatch({ type: 'activity', payload: { data: data.data, labels: data.categories } });
                break;
            case 33202:
                const dataset = data.Data;
                const getTotal = (list: number[]) => {
                    return list.reduce((a: number, b: number) => a + b, 0)
                }
                const pieData: number[] = [];
                const pieLabel: string[] = [];
                const colors: any = [];
                dataset.forEach((status: any) => {
                    const total = getTotal(status.data);
                    pieData.push(total)
                    pieLabel.push(status.name);
                    colors.push(`var(--status-backColor-${status.id})`)
                });
                console.log({ data: dataset, labels: data.categories, colors }, 'data: dataset, labels: data.categories, colors ')
                localDispatch({ type: 'activityStacked', payload: { data: dataset, labels: data.categories, colors } });
                localDispatch({ type: 'activityPie', payload: { data: pieData, labels: pieLabel, colors } });
                break;
            default:
                break;
        }
    }
    const buildDashboard = (data: any, DashboardType: number) => {
        switch (DashboardType) {
            case 33203:
                localDispatch({ type: 'requests', payload: { data } });
                break;
            case 33204:
                localDispatch({ type: 'tasks', payload: { data } });
                break;
            case 33207:
                setCardData(data);
                //setCardData(data);
                break;

            default:
                break;
        }
    }

    const getDashboardGraphData = useCallback(async (DashboardType: number) => {
        try {
            const apiData = {
                CultureId: lang,
                DashboardType,
                UserId: userID,
                FranchiseId: FRANCHISE_ID,
                FromDate: formatDateTime(range.startDate),
                ToDate: formatDateTime(range.endDate)
            };
            setIsLoading((prevLoading) => ({ ...prevLoading, graphLoader: true }));
            const { Data } = await ApiService.httpPost('data/getDashboardChartData', apiData);
            buildGraphs(Data, DashboardType);
        } catch (error) { }
        finally {
            setIsLoading((prevLoading) => ({ ...prevLoading, graphLoader: false }));
        }
    }, [FRANCHISE_ID, lang, range.endDate, range.startDate, userID]);


    const getDashboardTableData = useCallback(async (DashboardType: number) => {
        try {
            const apiData = {
                CultureId: lang,
                DashboardType,
                UserId: userID,
                FranchiseId: FRANCHISE_ID,
                FromDate: formatDateTime(range.startDate),
                ToDate: formatDateTime(range.endDate)
            };
            setIsLoading((prevLoading) => ({ ...prevLoading, tableLoader: true }));
            const { Data } = await ApiService.httpPost('data/getDashboardTableData', apiData);
            buildDashboard(Data, DashboardType);
        } catch (error) { }
        finally {
            setIsLoading((prevLoading) => ({ ...prevLoading, tableLoader: false }));
        }
    }, [FRANCHISE_ID, lang, range.endDate, range.startDate, userID])

    const handleChangeTab = (event: React.SyntheticEvent, newValue: string) => {
        setTabValue(newValue);
    };

    const getBadgeCounts = useCallback(async () => {
        try {
            const param = {
                CultureId: lang,
                UserId: userID,
                FranchiseId: FRANCHISE_ID,
                IsCountOnly: 1
            }
            const gridData = await ApiService.httpPost('data/getActionQueue', param);
            setIsLoading((prevLoading) => ({ ...prevLoading, badgeLoader: true }));
            if (gridData?.Valid > 0) {
                setBadgeCount(gridData?.Data[0]);
            }
        } catch (error) { }
        finally {
            setIsLoading((prevLoading) => ({ ...prevLoading, badgeLoader: false }));
        }
    }, [FRANCHISE_ID, lang, userID]);

    const getRecentTransactions = useCallback(async () => {
        try {
            const param = {
                cultureId: lang,
                UserId: userID,
                FranchiseId: FRANCHISE_ID,
                FromDate: formatDateTime(range.startDate),
                ToDate: formatDateTime(range.endDate)
            }
            setIsLoading((prevLoading) => ({ ...prevLoading, transactionLoader: true }));
            const { Data, Valid } = await ApiService.httpPost('data/getDashboardRecentTrans', param);
            console.log(Data);
            if (Valid > 0) {
                setRecentTrans(Data);
            }
        } catch (error) { }
        finally {
            setIsLoading((prevLoading) => ({ ...prevLoading, transactionLoader: true }));
        }
    }, [FRANCHISE_ID, lang, range.endDate, range.startDate, userID])

    const getAllDashboardData = useCallback(() => {
        getDashboardGraphData(33201);
        getDashboardGraphData(33202);
        getDashboardTableData(33203);
        getDashboardTableData(33204);
        getDashboardTableData(33207);
        getBadgeCounts();
        getRecentTransactions();
    }, [getBadgeCounts, getDashboardGraphData, getDashboardTableData, getRecentTransactions]);
    useEffect(() => {
        getAllDashboardData();
    }, [getAllDashboardData, range]);


    const redirectToActionQueue = () => {
        navigate('/action-queue');
    }

    return (
        <>
            <div className="dashboard-main-wrapper h-100 position-relative">
                <Row className="no-gutters">
                    <Col md={9}>
                        <Row className="py-3 align-items-center">
                            <Col md={6} className="greeting">

                                <div className="d-flex align-items-center justify-content-start">
                                    <div>
                                        <img src={getTimeOfDay() === 'Good Morning' ? Morning : getTimeOfDay() === 'Good Afternoon' ? Afternoon : Evening} alt="" />
                                    </div>
                                    <div className="mx-2">
                                        <h5 className="user-greeting m-0"> {t(getTimeOfDay())},<span className="user_name"> {USER_NAME}</span>!</h5>
                                        {getAdditionalGreeting() && <p className="user-sub-greeting m-0"> <span>{t(getAdditionalGreeting())}!</span></p>}
                                    </div>
                                </div>
                            </Col>
                            <Col md={6}>
                                <div className="d-flex justify-content-end align-items-center">
                                    <FormDateRangePickerController onChange={setRange} range={range} />
                                    <ResetButton onClick={() => { setRange(getInitialDate()) }} />
                                </div>
                            </Col>
                        </Row>
                        <div className="dashboard-body-scroll">

                            <Row className="no-gutters pt-2">
                                <Col md={3}>
                                    {
                                        isLoading.badgeLoader ?
                                            <BadgeLoader />
                                            :
                                            <div className="static__card p-4">
                                                <div className="card__row">
                                                    <h4 className="m-0">{t("Action Queue")}</h4>
                                                    <div className="d-flex align-items-center">
                                                        <p className="count mb-0">{badgeCount ? badgeCount.ACTION_QUEUE_COUNT : 0} </p>
                                                        <IconButton
                                                            aria-label="calendar"
                                                            size="small"
                                                            className="px-1 mx-3"
                                                            onClick={redirectToActionQueue}
                                                        >
                                                            <OpenInNewIcon />
                                                        </IconButton>
                                                    </div>
                                                </div>
                                            </div>
                                    }
                                </Col>
                                <Col md={9}>
                                    {
                                        isLoading.badgeLoader ?
                                            <BadgeLoader />
                                            :
                                            (cardData) ? <CardSlider cardDatas={cardData} /> : <NoDataDashboard />

                                    }
                                </Col>
                            </Row>
                            <Row className="mx-0 mt-4">
                                <Col md={5} className="mb-4">
                                    {
                                        isLoading.graphLoader ?
                                            <GraphLoader />
                                            :
                                            (dashboardData.activityPie?.data) &&
                                            <div className="chart-wrapper px-0">
                                                {(cardData) ? <StatusGrid cardDatas={cardData} /> : <NoDataDashboard />}
                                            </div>

                                    } 
                                </Col>
                                <Col md={7} className="mb-4">
                                    {
                                        isLoading.graphLoader ?
                                            <GraphLoader />
                                            :
                                            (dashboardData.activityStacked?.data) &&
                                            <div className="chart-wrapper">
                                                <h4 className="mb-3">{t("Status Details")}</h4>
                                                {(dashboardData.activityStacked?.data) ? <ColumnChart data={dashboardData.activityStacked?.data} options={{ ...ChartConfig.ColumnStackedChartConfig, ...dashboardData.activityStacked?.options }} height={320} /> : <NoDataDashboard />}
                                            </div>
                                    }
                                </Col>

                                <Col md={12} className="mb-4">
                                    {
                                        isLoading.graphLoader ?
                                            <GraphLoader />
                                            :
                                            (dashboardData.activity?.data) &&
                                            <div className="chart-wrapper">
                                                <h4 className="mb-3">{t("Activity Count")}</h4>
                                                {(dashboardData.activity?.data) ? <AreaSplineChart data={dashboardData.activity?.data} options={dashboardData.activity?.options} height={300} /> : <NoDataDashboard />}
                                            </div>
                                    }
                                </Col>
                            </Row>

                        </div>
                    </Col>
                    <Col md={3} className="position-static static-card-dashboard" style={{ right: 0 }}>
                        <div className="block-height">
                            <DashboardCard title={
                                <h4 className="tab-label-head">
                                    {t("Recent Transactions")}
                                    <Badge
                                        badgeContent={recentTrans?.length}
                                        color="secondary"
                                    />
                                </h4>
                            }>
                                <div className="scroll-widget scrollbar-dashboard">
                                    {isLoading.tableLoader ? <TransListLoader /> : recentTrans?.length ? <RecentWidget list={recentTrans} /> : <NoDataDashboard />}
                                </div>
                            </DashboardCard>
                            <RecentTransactions dashboardData={dashboardData} isLoading={isLoading} />
                        </div>
                    </Col>
                </Row>
            </div>
        </>
    );
}

export default Dashboard;

function a11yProps(index: number) {
    return {
        id: `simple-tab-${index}`,
        'aria-controls': `simple-tabpanel-${index}`,
    };
}

const RecentTransactions = (props: any) => {
    const { dashboardData, isLoading } = props;
    const { t } = useTranslation();
    const { userType } = CommonUtils.userInfo;

    const [value, setValue] = useState(userType === UserType.ITC ? 0 : 1);

    const tabs = [
        {
            label: t('Requests'),
            length: dashboardData?.requests?.length,
            content: dashboardData?.requests?.length ? (<RequestWidget list={dashboardData.requests} />) : (<NoDataDashboard />),
        },
        {
            label: t('Tasks'),
            length: dashboardData?.tasks?.length,
            content: dashboardData?.tasks?.length ? (<TaskWidget list={dashboardData.tasks} />) : (<NoDataDashboard />),
        },
    ];

    const handleChange = (event: React.SyntheticEvent, newValue: number) => {
        setValue(newValue);
    };

    useEffect(() => {
        setValue(userType === UserType.ITC ? 0 : 1);
    }, [userType]);

    return (
        <DashboardCard
            title={
                <Tabs value={value} onChange={handleChange} aria-label="basic tabs example">
                    {tabs.map((tab, index) => (
                        <Tab
                            key={index}
                            label={
                                <h4 className="tab-label-head">{tab.label}
                                    <Badge
                                        badgeContent={tab.length}
                                        color="secondary"
                                    /></h4>}
                            {...a11yProps(index)}
                        />
                    ))}
                </Tabs>
            }
        >
            <div>
                <div className="scroll-widget-task scrollbar-dashboard">

                    {isLoading.tableLoader ? <TransListLoader /> : tabs[value].content}
                </div>
            </div>
        </DashboardCard>
    );
};



