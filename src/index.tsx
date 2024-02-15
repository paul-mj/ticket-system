import { Suspense } from "react";
import ReactDOM from "react-dom/client";
import i18next from "i18next";
import { initReactI18next } from "react-i18next";
import HttpApi from "i18next-http-backend";
import LanguageDetector from "i18next-browser-languagedetector";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "react-perfect-scrollbar/dist/css/styles.css";
import reportWebVitals from "./reportWebVitals";
import { Provider } from "react-redux";

import { BrowserRouter } from "react-router-dom";
import App from "./App";
import store from "./redux/store/store";
import { ConfirmDialogProvider } from "./shared/components/dialogs/confirmation"; 

const homepagePath = process.env.PUBLIC_URL;

i18next
    .use(HttpApi)
    .use(LanguageDetector)
    .use(initReactI18next)
    .init({
        supportedLngs: ["en", "ar"],
        fallbackLng: "en",
        debug: false,
        // Options for language detector
        detection: {
            order: ["path", "cookie", "htmlTag"],
            caches: ["cookie"],
        },
        // react: { useSuspense: false },
        backend: {
            loadPath: `${homepagePath}/assets/locales/{{lng}}/translation.json`,
        },
    });

const loadingMarkup = (
    <div className="page-loader">
        <div className="loader"></div>
    </div>
);


console.log = function() {};
console.error = function() {};
console.warn = function() {}; 

let root = ReactDOM.createRoot(document.getElementById("root") as HTMLElement);

/* window.addEventListener('beforeunload', () => {
    localStorage.setItem('currentRoute', window.location.pathname);
}); */

root.render(
    <Suspense fallback={loadingMarkup}>
        {/* <React.StrictMode> */}
        <Provider store={store}>
            <BrowserRouter basename={homepagePath}>
                <ConfirmDialogProvider>
                    {/* <AxiosInterceptor /> */} 
                    <App />
                    <ToastContainer className={"frm__toast__wrapper"} position="bottom-center"
                        autoClose={3000}
                        hideProgressBar
                        newestOnTop
                        closeOnClick
                        rtl={false}
                        pauseOnFocusLoss
                        draggable
                        pauseOnHover
                        theme="light" />
                </ConfirmDialogProvider>
            </BrowserRouter>
        </Provider>
        {/* </React.StrictMode> */}
    </Suspense>
);

reportWebVitals();
