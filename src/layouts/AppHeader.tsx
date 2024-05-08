import { Badge, IconButton, Stack } from "@mui/material";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { Col, Row } from "react-bootstrap";
import {
    CalendarSvg,
    EtArrow,
    FavoriteSvg,
    Hamburger,
    HomeSvg,
    InsertChartSvg,
    LanguageNewSvg,
    NotificationsSvg,
    SpaceDashboardSvg,
    chat,
    gallery,
    noticeBoard
} from "../assets/images/svgicons/svgicons";
import Language from "../shared/components/language/language";
import AppHeaderSearch from "./header-components/search";
import AppHeaderUser from "./header-components/user";
import "./layout.scss";
import "./header.scss";
import { useNavigate } from "react-router-dom";
import { ExpandedLogo } from "../assets/images/png/pngimages";
import { CultureId } from "../common/application/i18n";
import localStore from "../common/browserstore/localstore";
import ApiService from "../core/services/axios/api";
import { styled, alpha } from '@mui/material/styles';
import Menu, { MenuProps } from '@mui/material/Menu';
import { MenuItem } from "@material-ui/core";
import { addKeyToMenu, resetTemporaryOnClick } from "../redux/reducers/sidebar.reducer";
import { Link } from "react-router-dom";
import { menuicons } from "../assets/images/menuicons/menuicons";
import NoticeBoardMessages from "./header-components/notice-board-messages";
import { NavLink } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import { t } from "i18next";
import { useTranslation } from "react-i18next";
import { ThunkDispatch } from "@reduxjs/toolkit";
const AppHeader = (props: any) => {
    const navigate = useNavigate();
    const dispatch = useDispatch<ThunkDispatch<any, any, any>>();
    const clickToNavigatePage = (navPage: string) => {
        navigate(`${navPage}`);
    };
    const { badgeCount: badgeCountStore } = useSelector(
        (state: any) => state.gridUpdate
    );
    const { response } = props;
    const lang = CultureId();
    const userData = localStore.getLoggedInfo();
    const userID = userData && JSON.parse(userData).USER_ID;
    const franchiseId = userData && JSON.parse(userData).FRANCHISE_ID;
    const [favListData, setFavList] = useState<any>();
    const [showNoticeBoard, setShowNoticeBoard] = useState<any>(false);
    const [badgeCount, setBadgeCount] = useState<any>();
    const [hamburgerStatus, setHamburgerStatus] = useState<any>(false);
    const [items, setItems] = useState<[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const { t, i18n } = useTranslation();
    const fetchFavData = async () => {
        const favParam = {
            Id: userID,
            CultureId: lang,
        }
        try {
            const favList = await ApiService.httpPost('data/getFavorites', favParam)
            setFavList(addKeyToMenu(favList.Menus));
        } catch (error) {
            console.error(error);
        }
    }
    const StyledMenu = styled((props: MenuProps) => (
        <Menu
            elevation={0}
            anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'right',
            }}
            transformOrigin={{
                vertical: 'top',
                horizontal: 'right',
            }}
            {...props}
        />
    ))(({ theme }) => ({
        '& .MuiPaper-root': {
            borderRadius: 6,
            marginTop: theme.spacing(1),
            minWidth: 180,
            color:
                theme.palette.mode === 'light' ? 'rgb(55, 65, 81)' : theme.palette.grey[300],
            boxShadow:
                'rgb(255, 255, 255) 0px 0px 0px 0px, rgba(0, 0, 0, 0.05) 0px 0px 0px 1px, rgba(0, 0, 0, 0.1) 0px 10px 15px -3px, rgba(0, 0, 0, 0.05) 0px 4px 6px -2px',
            '& .MuiMenu-list': {
                padding: '4px 0',
            },
            '& .MuiMenuItem-root': {
                '& .MuiSvgIcon-root': {
                    fontSize: 18,
                    color: theme.palette.text.secondary,
                    marginRight: theme.spacing(1.5),
                },
                '&:active': {
                    backgroundColor: alpha(
                        theme.palette.primary.main,
                        theme.palette.action.selectedOpacity,
                    ),
                },
            },
        },
    }));
    const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
    const open = Boolean(anchorEl);
    const handleClick = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget);
        fetchFavData()
    };
    const handleClose = () => {
        setAnchorEl(null);
    };
    const resetOnClick = () => {
        dispatch(resetTemporaryOnClick({}));
        handleClose();
    }
    /* ================   NOTIFICATION   ================== */
    const [notificationAnchorEl, setNotificationAnchorEl] = React.useState<null | HTMLElement>(null);
    const notificationOpen = Boolean(notificationAnchorEl);
    const handleClickNotification = (event: React.MouseEvent<HTMLElement>) => {
        setNotificationAnchorEl(event.currentTarget);
    };
    const handleCloseNotification = () => {
        setNotificationAnchorEl(null);
    };
    /* Notice board messages */
    useEffect(() => {
        noticeBoardMessages();
    }, [])
    const getBadgeCounts = useCallback(async () => {
        const param = {
            CultureId: lang,
            UserId: userID,
            FranchiseId: franchiseId,
            IsCountOnly: 1
        }
        const gridData = await ApiService.httpPost('data/getActionQueue', param);
        if (gridData?.Valid > 0) {
            setBadgeCount(gridData?.Data[0]);
        }
    }, [franchiseId, lang, userID])
    useEffect(() => {
        getBadgeCounts();
    }, [badgeCountStore, getBadgeCounts])
    const noticeBoardMessages = async (buttonClick?: boolean) => {
        const param = {
            CultureId: lang,
            FranchiseId: franchiseId,
            UserId: userID,
        };
        try {
            const response = await ApiService.httpPost('trans/readNoticeBoard', param);
            try {
                if (response?.Valid !== 0) {
                    setShowNoticeBoard(true);
                    const updatedItems = await downloadDocs(response.Items);
                    console.log(updatedItems)
                    setItems(updatedItems);
                    // const itemsWithUpdatedAttachments = {
                    //     ...updatedItems,
                    //     Attachments: updatedItems?.Attachments.map((attachment : any)=> ({
                    //         ...attachment,
                    //         ext: attachment.ATTACHMENT_NAME.split('.').pop(),
                    //         isExist: true,
                    //     })),
                    // };
                    // console.log(itemsWithUpdatedAttachments)
                    // setItems(itemsWithUpdatedAttachments);
                } else {
                    if (buttonClick) {
                        toast.error(`${t('No Noticeboard Message')}`);
                    }
                }
            } catch (error) { }
            finally {
                setIsLoading(false);
            }
        } catch (error) {
            setIsLoading(false);
        }
    };
    const resetNoticeBoardStatus = (event: boolean) => {
        setShowNoticeBoard(event);
    }
    const downloadDocs = async (items: any): Promise<any> => {
        const updatedItems: any = [];
        for (const item of items) {
            const downloadedDocs: any = [];
            for (const doc of (item.Docs ?? [])) {
                try {
                    const response = await ApiService.httpGetBlob(`file/downloadDoc?docpath=${doc.DOC_NAME}`);
                    if (response) {
                        const base64 = await blobToBase64(response);
                        downloadedDocs.push({ base64 });
                    }
                } catch (error) {
                    console.log(error);
                }
            }
            item.downloadedDocs = downloadedDocs;
            updatedItems.push(item);
        }
        return updatedItems;
    };
    const blobToBase64 = (blob: Blob): Promise<string> => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onloadend = () => resolve(reader.result as string);
            reader.onerror = reject;
            reader.readAsDataURL(blob);
        });
    };
    const handleHamburger = () => {
        const newHamburgerStatus = true;
        setHamburgerStatus(newHamburgerStatus);
        response(newHamburgerStatus);
    };
    return (
        <>
            <div className="header-wrapper">
                <div className="logo-search-section">
                    <div className="logo-img">
                        <img src={ExpandedLogo} alt="" />
                    </div>
                    <div className="search-section">
                        <div className="home-btn">
                            <NavLink className={({ isActive }) => (isActive ? 'Menulink-active' : 'Menulink-inactive')} to='/dashboard'>
                                <img className="home-icon" src={HomeSvg} alt="" />
                            </NavLink>
                            <img className="hamburger-icon" src={Hamburger} alt="" onClick={() => handleHamburger()} />
                        </div>
                        {/* <div className="search-sec">
                            <AppHeaderSearch />
                        </div> */}
                    </div>
                </div>
                <div className="icons-section">
                    <div className="frm-icons featured-icons">
                        {/* <Language uiType={"icon"} /> */}
                        <IconButton aria-label="favorite" size="large" className="header-fav" title={`${t("Favorites")}`} onClick={handleClick}>
                            <img src={FavoriteSvg} alt="" />
                        </IconButton>
                        <StyledMenu
                            id="demo-customized-menu"
                            MenuListProps={{
                                'aria-labelledby': 'demo-customized-button',
                            }}
                            className="fav-icon-wrap"
                            anchorEl={anchorEl}
                            open={open}
                            onClose={handleClose}
                        >
                            <Row>
                                {favListData?.length ? favListData.map((menu: any) => (
                                    <FavoriteList key={menu.MenuId} menu={menu} resetOnClick={resetOnClick} />
                                )) :
                                    <div className="p-5 text-center no-fav">
                                        <p className="m-0">{t("You don't have any Favorite")}</p>
                                    </div>
                                }
                            </Row>
                        </StyledMenu>
                        <NavLink className={({ isActive }) => (isActive ? 'Menulink-active' : 'Menulink-inactive')} to='/event'>
                            <IconButton
                                aria-label="calendar"
                                size="large"
                                className="header-calender"
                                title={`${t("Calendar")}`}
                                onClick={() => clickToNavigatePage("event")}
                            >
                                <img src={CalendarSvg} alt="" />
                            </IconButton>
                        </NavLink>
                        <IconButton
                            aria-label="Notice Board"
                            size="large"
                            className="noticeboard-icon"
                            title={`${t("Notice Board")}`}
                            onClick={() => noticeBoardMessages(true)}
                        >
                            <img src={noticeBoard} alt="" />
                        </IconButton>
                        <NavLink className={({ isActive }) => (isActive ? 'Menulink-active' : 'Menulink-inactive')} to='/action-queue'>
                            <IconButton
                                aria-label="spaceboard"
                                size="large"
                                className="board"
                                title={`${t("Action Queue")}`}
                                onClick={() => clickToNavigatePage("action-queue")}
                            >
                                {badgeCount && badgeCount.ACTION_QUEUE_COUNT !== undefined && badgeCount.ACTION_QUEUE_COUNT !== null ? (
                                    <Badge badgeContent={badgeCount.ACTION_QUEUE_COUNT} color="secondary">
                                        <img src={SpaceDashboardSvg} alt="" />
                                    </Badge>
                                ) : (
                                    <img src={SpaceDashboardSvg} alt="" />
                                )}
                            </IconButton>
                        </NavLink>
                    </div>
                    <div className="frm-profile">
                        <AppHeaderUser />
                    </div>
                </div>
            </div>
            <div>
                <NoticeBoardMessages isLoading={isLoading} dialogOpen={showNoticeBoard} noticeBoardItems={items} resetNoticeBoardStatus={resetNoticeBoardStatus} />
            </div>
            {/* NOTIFICATION MENU */}
            {/* <Menu
                anchorEl={notificationAnchorEl}
                id="Notification-menu"
                open={notificationOpen}
                onClose={handleCloseNotification}
                onClick={handleCloseNotification}
                PaperProps={{
                    elevation: 0,
                    sx: {
                        overflow: 'visible',
                        filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.32))',
                        mt: 1.5,
                        '& .MuiAvatar-root': {
                            width: 32,
                            height: 32,
                            ml: -0.5,
                            mr: 1,
                        },
                        '&:before': {
                            content: '""',
                            display: 'block',
                            position: 'absolute',
                            top: 0,
                            right: 14,
                            width: 10,
                            height: 10,
                            bgcolor: 'background.paper',
                            transform: 'translateY(-50%) rotate(45deg)',
                            zIndex: 0,
                        },
                    },
                }}
                transformOrigin={{ horizontal: 'right', vertical: 'top' }}
                anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
            >
                <MenuItem onClick={handleCloseNotification}>
                    <p>Lorem, ipsum dolor sit amet consectetur adipisicing elit. Exercitationem molestias ipsa beatae sed. Temporibus dolorum saepe vero, fugit animi odit et maiores a tempora iure deleniti fugiat sapiente soluta illum.</p>
                </MenuItem>
            </Menu> */}
        </>
    );
};
export default AppHeader;

const FavoriteList = (props: any) => {
    const { menu, resetOnClick } = props
    return (
        <Col md={4} className="mb-2 favlist">
            {menu.CriteriaMode !== 0 ? (
                <MenuItem className="each-icon-wrap" onClick={resetOnClick} disableRipple>
                    <img className="fav-icon-img" src={menuicons[menu.icon]} alt="" />
                    <p className="fav-title m-0" title={menu.title} >{menu.title}</p>
                </MenuItem>
            ) : (
                <Link to={menu.redirectUrl} title={menu.title}>
                    <MenuItem className="each-icon-wrap" onClick={resetOnClick} disableRipple>
                        <img className="fav-icon-img" src={menuicons[menu.icon]} alt="" />
                        <p className="fav-title m-0" title={menu.title}>{menu.title}</p>
                    </MenuItem>
                </Link>
            )}
        </Col>
    )
}