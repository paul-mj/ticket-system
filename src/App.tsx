import React, { useCallback, useEffect } from "react";
import { Navigate, Outlet, Route, Routes, useLocation, useNavigate } from "react-router-dom";
import "devextreme/dist/css/dx.light.css";
import "./index.scss";
import "./arabic.scss";
import DxDataGrid from "./shared/components/fullview/dx-grid";
import FullCalender from "./pages/event/fullcalendar/calender";
import { useTranslation } from "react-i18next";
import CorrespondenceBrowse from "./pages/correspondence/correspondence-browse";
import { prefixer } from "stylis";
import rtlPlugin from "stylis-plugin-rtl";
import createCache from "@emotion/cache";
import { CacheProvider, ThemeProvider } from "@emotion/react";
import { createTheme, CssBaseline } from "@material-ui/core";
import DynamicFormTest from "./pages/masters/dynamic-form-test";
import PublicRoutes from "./common/application/public-route";
import { ProtectedRoutes } from "./common/application/protected-route";
import "./assets/fonts/font-file.scss";
import i18next from "i18next";
import { useDispatch, useSelector } from "react-redux";
import { useConfirm } from "./shared/components/dialogs/confirmation";
import localStore from "./common/browserstore/localstore";
import { updateConfig } from "./redux/reducers/common.reducer";
import ApiService from "./core/services/axios/api";
import MyActionQueue from "./pages/MyActionQueue";
import ForgotPassword from "./pages/auth/ForgotPassword";
import Acknowledgement from "./pages/auth/Acknowledgement";
import { DashboardOne } from "./pages/dashboard/Dashboard/dashboardOne";
import NetworkStatus from "./components/NetworkStatus";
import { UserType } from "./common/database/enums";
import StaticLayout from "./shared/components/static-layout/static-layout-browse";
import CommonUtils from "./common/utils/common.utils";
import ReportLayout from "./shared/components/Report/ReportLayout";
import ReportGrid from "./shared/components/Report/Pages/ReportGrid";
import ReportChart from "./shared/components/Report/Pages/ReportChart";
import ReportPivot from "./shared/components/Report/Pages/ReportPivot";
import ReportViewerLayout from "./shared/components/Report/ReportViewerLayout";
import { CorrespondenceView } from "./pages/correspondence/correspondance-view";
import { OperatorRegistrationView } from "./pages/transactions/operator-registration-requests/operatorResgistrationViewDialog";
import Viewer from "./pages/Viewer";

const Login = React.lazy(() => import("./pages/auth/login/login"));
const NotFoundPage = React.lazy(() => import("./pages/errors/404"));
const DefaultLayout = React.lazy(() => import("./layouts/DefaultLayout"));
const Dashboard = React.lazy(() => import("./pages/dashboard/Dashboard"));


const App = () => {
    const { t, i18n } = useTranslation();
    const { configs } = useSelector((state: any) => state.commonReducer);
    const dispatch = useDispatch();
    const confirm = useConfirm();
    const navigate = useNavigate();
    const { UserId, CultureId } = CommonUtils.userInfo;

    useEffect(() => {
        i18next.on("languageChanged", () => {
            window.location.reload();
        });
    }, [t]);
    const triggerPopup = useCallback(async () => {
        const choice = await confirm({
            ui: 'warning',
            complete: true,
            title: `${t('Session Expired')}`,
            description: `${t('Your Session has been expired. Please log out and continue.')}`,
            confirmBtnLabel: `${t('Okay')}`,
        });
        if (choice) {
            const logData = localStore.getItem('helpdeskLoginData')
            const loginData = logData && JSON.parse(logData);
            if (loginData?.USER_TYPE !== UserType.Franchise) {
                navigate(`/auth/login`)
                localStore.clearAll();
            } else {
                navigate(`/auth/login`);
                localStore.clearAll();
            }
            window.location.reload();
            dispatch(updateConfig({ action: 'triggerLogoutPopup', payload: { isLogout401: false } }))
        }
    }, [confirm, dispatch])
    useEffect(() => {
        if (configs?.isLogout401) {
            triggerPopup();
        }
    }, [configs?.isLogout401, triggerPopup])

    const cacheLtr = createCache({
        key: "muiltr",
    });
    const cacheRtl = createCache({
        key: "muirtl",
        stylisPlugins: [prefixer, rtlPlugin],
    });
    const ltrTheme = createTheme({
        direction: "ltr",
        palette: {
            primary: {
                main: "#003A5D",
                //main: "#1B3E6D;",
            },
        },
        components: {
            MuiInputBase: {
                defaultProps: {
                    autoComplete: "off",
                },
            },
            MuiInput: {
                styleOverrides: {
                    colorSecondary: '#5E6161'
                }
            },
        },
        typography: {
            fontFamily: `Poppins, sans-serif`,
            fontSize: 12,
            fontWeightLight: 300,
            fontWeightRegular: 400,
            fontWeightMedium: 500,
        },
    });
    const rtlTheme = createTheme({
        direction: "rtl",
        palette: {
            primary: {
                main: "#003A5D",
                //main: "#1B3E6D",
            },
            text: {
                primary: "#5E6161"
            }
        },
        components: {
            MuiInputBase: {
                defaultProps: {
                    autoComplete: "off",
                },
            },
        },
        typography: {
            fontFamily: "",
            fontSize: 10,
            fontWeightLight: 300,
            fontWeightRegular: 400,
            fontWeightMedium: 500,
        },
    });
    const theme = i18n.dir() === "ltr" ? ltrTheme : rtlTheme;
    /*   const navigate = useNavigate();
      React.useEffect(() => {
          navigate('/dashboard');
      }, []); */

    /* useEffect(() => {
        getStatusColors();
    }, [getStatusColors]) */

    return (
        <>
            <CacheProvider value={i18n.dir() === "rtl" ? cacheRtl : cacheLtr}>
                <ThemeProvider theme={theme}>
                    <CssBaseline />
                    <NetworkStatus />
                    <Routes>
                        <Route path="/" element={<Navigate to="/auth/login" />} />
                        <Route path="/">
                            <Route path="view" element={<Viewer />} />
                        </Route>
                        <Route path="/" element={<ProtectedRoutes />}>
                            <Route path="/" element={<DefaultLayout />}>
                                <Route path="dashboard" element={<Dashboard />} />
                                <Route path="fullview/:id" element={<DxDataGrid />} />
                                <Route path="event" element={<FullCalender />} />
                                <Route path="correspondence" element={<CorrespondenceBrowse />} />
                                <Route path="action-queue" element={<MyActionQueue />} />
                                <Route path="correspondenceview/:transid" element={<CorrespondenceView />} />
                                <Route path="dynamicform" element={<DynamicFormTest />} />
                                <Route path="report/:type/:id" element={<ReportLayout />} />
                            </Route>
                        </Route>
                        <Route path="/" element={<ProtectedRoutes />}>
                            <Route path="/reportViewer" element={<ReportViewerLayout />}>
                                <Route path="grid/:id" element={<ReportGrid />} />
                                <Route path="pivot/:id" element={<ReportPivot />} />
                                <Route path="chart/:id" element={<ReportChart />} />
                            </Route>
                        </Route>
                        <Route path="operator" element={<PublicRoutes />}>  
                            <Route path="view/:transid" element={<OperatorRegistrationView />} />
                        </Route>
                        <Route path="auth" element={<PublicRoutes />}>
                            {/* <Route path="operatorlogin" element={<Login />} /> */}
                            <Route path="login" element={<Login />} />
                            <Route path="forgot-password" element={<ForgotPassword />} />
                            <Route path="acknowledgement" element={<Acknowledgement />} />
                        </Route>

                        <Route path="404" element={<NotFoundPage />} />
                        <Route path="*" element={<Navigate replace to="/404" />} />
                    </Routes>
                </ThemeProvider>
            </CacheProvider>
        </>
    );
};
export default App;