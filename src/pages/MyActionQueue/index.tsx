import React, { useCallback, useEffect, useRef, useState } from "react";
import SearchOutlinedIcon from '@mui/icons-material/SearchOutlined';
import ApiService from "../../core/services/axios/api";
import { CultureId } from "../../common/application/i18n";
import localStore from "../../common/browserstore/localstore";
import { actionQueuePopup } from "../../shared/components/pageviewer/popup-component";
import { isObjectEmpty } from "../../core/services/utility/utils";
import PageViewer from "../../shared/components/pageviewer/pageviewer";
import { fullViewRowDataContext } from "../../common/providers/viewProvider";
import { Badge, IconButton } from "@mui/material";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import { resetUpdatedRow } from "../../redux/reducers/gridupdate.reducer";
import { MasterId } from "../../common/database/enums";
import { useTranslation } from "react-i18next";
import RotateLeftIcon from '@mui/icons-material/RotateLeft';
import { CircleLoader } from "../../shared/components/UI/Loader/CircleLoader/CircleLoader";
import { NextArrowBtn, PrevArrowBtn } from "../../assets/images/svgicons/svgicons";
import { Asc, Des } from "../../assets/images/png/pngimages";
import './action-queue.scss';

const SortObject = {
    "CUR_STATUS_NAME": false,
    "NEXT_ACTION": false,
    "SUBJECT_TEXT": false,
    "REQ_TYPE_NAME": false,
    "dt_STATUS_TIME": false,
    "TRANS_DATE": false,
    "TRANS_NO": false
}

const MyActionQueue = () => {
    const [open, setOpen] = useState(false);
    const [objSort, setObjeSort] = useState<any>(SortObject);
    const { t, i18n } = useTranslation();
    const [popupConfiguration, setPopupConfiguration] = useState<any>(null);
    const [fullViewContext, setFullViewContext] = useState<any>();
    const { actionQueueRow } = useSelector((state: any) => state.gridUpdate);
    const dispatch = useDispatch();

    const closeDialog = async (e: any) => {
        setOpen(false);
        if (e) {
            getGridData()
        }
    };
    const [filteredArray, setfilteredarray] = useState<any>();
    const [arraygridData, setGridData] = useState<any>();
    const [gridLoader, setGridLoader] = useState<any>(false);
    const [handleFilter, sethandleFilter] = useState<any>();
    const [handleDuplicate, sethandleDuplicate] = useState<any>();
    const lang = CultureId();
    const userData = localStore.getLoggedInfo();
    const userID = userData && JSON.parse(userData).USER_ID;
    const franchiseID = userData && JSON.parse(userData).FRANCHISE_ID;

    const getGridData = useCallback(async () => {
        setGridLoader(true);
        try {
            const param = {
                CultureId: lang,
                UserId: userID,
                FranchiseId: franchiseID
            }
            const gridData = await ApiService.httpPost('data/getActionQueue', param);
            setGridData(gridData.Data)
            sethandleFilter(gridData.Data)
            sethandleDuplicate(gridData.Data)

            const updatedFilter = gridData.Filter.map((fiteritem: any) => {
                return {
                    ...fiteritem,
                    Count: gridData.Data.filter((dataitem: any) => dataitem.MASTER_ID === fiteritem.MasterId).length
                }
            })

            const allData: any = [{
                ReqTypeName: "All",
                active: true
            }]
            const FilteredAll: any[] = [...allData];

            if (gridData.Filter && Symbol.iterator in Object(gridData.Filter)) {
                FilteredAll.push(...updatedFilter);
            }
            setfilteredarray(FilteredAll)
            console.log(FilteredAll)

            setTimeout(() => {
                handleOverflowCheck();
            }, 250);
        } catch (error) { }
        finally {
            setGridLoader(false);
        }
    }, [franchiseID, lang, userID])
    const handlefilterData = (item?: any, index?: any) => {
        const toggleFilterColor = filteredArray.map((item: any, filterindex: any) => {
            if (index === filterindex) {
                return {
                    ...item,
                    active: true,
                }
            }
            else {
                return {
                    ...item,
                    active: false
                }
            }
        })
        setfilteredarray(toggleFilterColor)
        if (item && item?.MasterId) {
            const clickfilter = (handleFilter.filter((value: any) => value.MASTER_ID === item.MasterId))
            setGridData(clickfilter)
            console.log(clickfilter)
        }
        else {
            setGridData(handleFilter)
            console.log(handleFilter)
        }
    }
    const formatRowData = (item: any) => {
        let row = item;
        switch (item.MASTER_ID) {
            case MasterId.Tasks:
                row = {
                    ...item,
                    TASK_ID_: item.ID_,
                    ID_: item.TRANS_ID
                }
                break;

            default:
                break;
        }
        return row;
    }
    const onClickActionRow = (item: any) => {
        const popupConfig = actionQueuePopup(item);
        if (!isObjectEmpty(popupConfig)) {
            setOpen(true);
            setPopupConfiguration(popupConfig);
            const fullViewContext = {
                rowData: formatRowData(item),
                activeAction: "",
            }
            setFullViewContext(fullViewContext)
        }
    }

    const handleSearch = (event: any) => {
        const searchValue = event.target.value;
        if (searchValue) {
            const results = arraygridData?.filter((item: any) =>
                (item?.SUBJECT_TEXT?.toLowerCase().includes(searchValue.toLowerCase())) ||
                (item?.TRANS_NO?.toLowerCase().includes(searchValue.toLowerCase()))
            );
            setGridData(results);
        } else {
            setGridData(handleDuplicate);
        }
    }
    const gridUpdate = useCallback((row: any) => {
        if (row) {
            getGridData();
            dispatch(resetUpdatedRow({ action: 'actionQueue' }))
        }
    }, [dispatch, getGridData])
    useEffect(() => {
        getGridData()
    }, [getGridData]);
    useEffect(() => {
        gridUpdate(actionQueueRow)
    }, [actionQueueRow, gridUpdate])


    const elementRef = useRef<any>(null);
    const wrap = useRef<any>(null);
    const [arrowDisable, setArrowDisable] = useState(true);

    const handleHorizantalScroll = (element: any, speed: any, distance: any, step: any) => {
        let scrollAmount = 0;
        const slideTimer = setInterval(() => {
            element.scrollLeft += step;
            scrollAmount += Math.abs(step);
            if (scrollAmount >= distance) {
                clearInterval(slideTimer);
            }
            if (element.scrollLeft === 0) {
                setArrowDisable(true);
            } else {
                setArrowDisable(false);
            }
        }, speed);
    };

    const [isOverflowing, setIsOverflowing] = useState(false);
    const handleOverflowCheck = () => {
        const showButton = wrap.current?.clientWidth < elementRef.current?.scrollWidth
        setIsOverflowing(showButton);

    };

    useEffect(() => {
        handleOverflowCheck();
        window.addEventListener('resize', handleOverflowCheck);
        return () => {
            window.removeEventListener('resize', handleOverflowCheck);
        };
    }, []);

    const resetSortState = () => {
        const restSort = {}
        for (const key in objSort) {
            if (Object.prototype.hasOwnProperty.call(objSort, key)) {
                restSort[key] = false;
            }
        }
        return restSort
    }

    const sortAlphabetical = (keyName: any) => {
        const mode = Number(!objSort[keyName])
        const AlphaArray = [...arraygridData].sort((a: any, b: any) => {
            console.log(a[keyName])
            if (a[keyName] < b[keyName]) {
                return mode ? 1 : -1
            }
            if (a[keyName] > b[keyName]) {
                return mode ? -1 : 1
            }
            return 0
        })
        setGridData(AlphaArray)
        const ArraySort = { ...resetSortState(), [keyName]: !objSort[keyName] }
        setObjeSort(ArraySort)
    }


    return (
        <>
            <div className="action-queue-wrap">
                <div className="top-sec">
                    <div className="action-queue-heading">{t("Action Queue")}</div>
                    <div className="search-filter">
                        <div className="filter-section">
                            <IconButton
                                aria-label="Refresh Grid"
                                size="large"
                                className={`px-1 reset-grid ${gridLoader ? 'rotate' : ''}`}
                                onClick={getGridData}
                                title={`${t('Refresh Grid')}`}
                            >
                                <RotateLeftIcon />
                            </IconButton>
                        </div>
                        {/* <div className="filter-section">
                            <IconButton
                                aria-label="delete"
                                className="filter-grid"
                                size="large"
                            >
                                <FilterAltOutlinedIcon fontSize="small" />
                            </IconButton>
                        </div> */}
                        <div className="search-section">
                            <div className="search-wrapper">
                                <div className="search-ip-wrap position-relative">
                                    <input type="text" placeholder={t("Search") ?? 'Search'} className="w-100" onChange={(event) => handleSearch(event)} />
                                    <div className="search-icon">
                                        <SearchOutlinedIcon fontSize="inherit" />
                                    </div>
                                </div>
                                <div className="search-result-wrap">

                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="queue-sec-wrap" ref={wrap}>

                    {isOverflowing && <div className="button-contianer">
                        <div className="btn-bg"></div>
                        <button className="left-btn"
                            onClick={() => {
                                handleHorizantalScroll(elementRef.current, 50, 250, -90);
                            }}

                        >
                            <img src={PrevArrowBtn} alt="" />
                        </button>
                        <div className="btn-bg-right"></div>
                        <button className="right-btn"
                            onClick={() => {
                                handleHorizantalScroll(elementRef.current, 50, 250, 90);
                            }}

                        >
                            <img src={NextArrowBtn} alt="" />
                        </button>

                    </div>}

                    {/* {JSON.stringify(filteredArray)} */}

                    <div className="queue-sec" ref={elementRef}>
                        {filteredArray?.length && filteredArray.map((item: any, index: any) => (
                            <div className="badge-sec" key={`${item.MasterId}-${index}`}>
                                <div onClick={() => handlefilterData(item, index)} className={`each-queue ${item.active ? 'each-color' : ''}`}>
                                    {item.ReqTypeName}
                                </div>
                                <div className="badge-icon">
                                    <Badge badgeContent={item.Count} className="badge-col" ></Badge>
                                </div>
                            </div>
                        ))}
                    </div>

                </div>
                <div className="table-sec-wrapper">
                    {
                        gridLoader &&
                        <>
                            <CircleLoader />
                            <div className="body-loader-overlay"></div>
                        </>
                    }
                    <div className="table-sec-outer action-table">
                        <div className="table-sec-header">
                            <div className="action-item" onClick={() => sortAlphabetical('REQ_TYPE_NAME')}>
                                {t("Request Type")}
                                <img src={objSort.REQ_TYPE_NAME ? Asc : Des} alt="" />
                            </div>
                            <div className="action-item" onClick={() => sortAlphabetical('TRANS_NO')}>
                                {t("Trans No")}
                                <img src={objSort.TRANS_NO ? Asc : Des} alt="" />
                            </div>
                            <div className="action-item" onClick={() => sortAlphabetical('SUBJECT_TEXT')}>
                                {t("Subject")}
                                <img src={objSort.SUBJECT_TEXT ? Asc : Des} alt="" />
                            </div>
                            <div className="action-item" onClick={() => sortAlphabetical('TRANS_DATE')}>
                                {t("Trans Date")}
                                <img src={objSort.TRANS_DATE ? Asc : Des} alt="" />
                            </div>
                            <div className="action-item" onClick={() => sortAlphabetical('NEXT_ACTION')}>
                                {t("Next Action")}
                                <img src={objSort.NEXT_ACTION ? Asc : Des} alt="" />
                            </div>
                            <div className="action-item" onClick={() => sortAlphabetical('CUR_STATUS_NAME')} >
                                {t("Current Status")}
                                <img src={objSort.CUR_STATUS_NAME ? Asc : Des} alt="" />
                            </div>
                            <div className="action-item" onClick={() => sortAlphabetical('dt_STATUS_TIME')}>
                                {t("Status Time")}
                                <img src={objSort.dt_STATUS_TIME ? Asc : Des} alt="" />
                            </div>
                        </div>
                        {/* {JSON.stringify(arraygridData)} */}
                        {arraygridData?.length > 0 && <div className="body-sec-wrapper">
                            {arraygridData?.length && arraygridData.map((item: any, index: any) => (
                                <div className="table-sec-body" key={`${item.ID_}-${index}`} onClick={() => onClickActionRow(item)}>
                                    <div className="action-item">
                                        {item.REQ_TYPE_NAME}
                                    </div>
                                    <div className="action-item">
                                        <span className="trans-no-queue"> {item.TRANS_NO}</span>
                                    </div>
                                    <div className="action-item">
                                        <div className="subject-txt">
                                            {item.SUBJECT_TEXT}
                                        </div>
                                    </div>
                                    <div className="action-item">
                                        {new Date(item.TRANS_DATE).toLocaleDateString("en-GB", { day: "2-digit", month: "2-digit", year: "numeric" }).split('/').join('-')}
                                    </div>

                                    <div className="action-item">
                                        <div className={`action-status ${item.NEXT_ACTION === 'Publishing' ? 'publishing-class' : item.NEXT_ACTION === 'Approval' ? 'approval-class' : ''}`}>
                                            {item.NEXT_ACTION}
                                        </div>
                                    </div>
                                    <div className="action-item">
                                        <div className="action-status-user">
                                            <div className="action-user-name">{item.CUR_STATUS_NAME}</div>
                                        </div>
                                    </div>

                                    <div className="action-item">
                                        {new Date(item.dt_STATUS_TIME).toLocaleString("en-GB", { day: "2-digit", month: "2-digit", year: "numeric", hour: "2-digit", minute: "2-digit", hour12: true }).split('/').join('-')}
                                    </div>
                                </div>
                            ))}
                        </div>}
                        {!arraygridData?.length && <div className="nodata">
                            {t("No Data")}
                        </div>}
                    </div>

                </div>
            </div>
            <fullViewRowDataContext.Provider value={fullViewContext}>
                {popupConfiguration && <PageViewer open={open} onClose={closeDialog} popupConfiguration={popupConfiguration} />}
            </fullViewRowDataContext.Provider>
        </>

    );
};

export default MyActionQueue;
