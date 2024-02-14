import React, { useCallback, useEffect, useState } from "react";
import { Outlet, useLocation } from "react-router-dom";
import AppHeader from "./AppHeader";
import AppSidebar from "./AppSidebar";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import "./layout.scss";
import { IconButton } from "@mui/material";
import { TransitionGroup, CSSTransition } from "react-transition-group";
import ApiService from "../core/services/axios/api";
import CommonUtils from "../common/utils/common.utils";
import { useSelector } from "react-redux";
import StatusColor from "../components/StatusColor";


const DefaultLayout: React.FC = () => {
    const { configs: { reportActiveMenu } } = useSelector((state: any) => state.commonReducer);
    const [toggleStatus, setToggleStatus] = useState(false);
    const location = useLocation();
    const myDiv = document.getElementById('my-div');

    // if (myDiv) {
    //   let hoverTimer:any;
    //   myDiv.addEventListener('mouseenter', () => {
    //     hoverTimer = setTimeout(() => {
    //         setToggleStatus(toggleStatus ? false : true)    
    //     }, 1000);
    //   });

    //   myDiv.addEventListener('mouseleave', () => {
    //     setToggleStatus(toggleStatus ? false : true)
    //     clearTimeout(hoverTimer);
    //   });
    // }

    const handleChildComponentResponse = (data: any) => {
        if (data) {
            setToggleStatus(toggleStatus ? false : true)
        }
    };
    useEffect(() => {
        if(reportActiveMenu){
            setToggleStatus(true)
        }
    },[reportActiveMenu])
    return (
        <>
            {/* <div className="frm_layout_wrapper">
                <div className="frm_layout_components">
                    <div className={`frm_layout_sidebar ${toggleStatus ? "expand" : ""}`}>
                        <div className="arrow-btn">
                            <IconButton
                                aria-label="delete"
                                size="small"
                                onClick={() => setToggleStatus(toggleStatus ? false : true)} >
                                <ChevronRightIcon fontSize="inherit" />
                            </IconButton>
                        </div>
                        <div className="sidebar_inner_wrap">
                            <AppSidebar toggleStatusInput={toggleStatus} />
                        </div>
                    </div>
                    <div className="frm_layout_outlet_wrapper">
                        <div className="frm_layout_header">
                            <AppHeader />
                        </div>
                        <div className="frm_layout_body">
                            <div className="top-bg"></div>
                            <div className="h-100 position-relative">
                                <Outlet />
                            </div>
                        </div>
                    </div>
                </div>
            </div> */}


            <StatusColor/>
            <div className="frm_layout_wrapper">
                <div className="frm_layout_components">
                    <div className="frm_layout_header">
                        <AppHeader response={handleChildComponentResponse} />
                    </div>

                    <div className="frm_layout_outlet_wrapper">
                        {/* <div className={`${toggleStatus ? "overlay-outer" : ""}`}></div> */}
                        <div id="my-div" className={`frm_layout_sidebar ${toggleStatus ? "expand" : ""}`}>
                            <div className="arrow-btn"> 
                                <IconButton
                                    aria-label="delete"
                                    size="small"
                                    onClick={() => setToggleStatus(toggleStatus ? false : true)} >
                                    <ChevronRightIcon fontSize="inherit" />
                                </IconButton>
                            </div> 
                            <div className="sidebar_inner_wrap">
                                <AppSidebar toggleStatusInput={toggleStatus} />
                            </div>
                        </div>
                        <div className="frm_layout_body">
                            <div className="top-bg"></div>
                            <div className="h-100 position-relative">
                               {/*  <TransitionGroup className="transition-wrapper">
                                    <CSSTransition
                                        key={location.key}
                                        classNames="fade"
                                        timeout={300}
                                    > */}
                                        <Outlet />
                                    {/* </CSSTransition>
                                </TransitionGroup> */}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

        </>
    );
};

export default DefaultLayout;
