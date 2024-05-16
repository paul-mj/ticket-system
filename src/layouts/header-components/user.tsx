import { Dialog, DialogActions, DialogContent, DialogTitle, Menu, MenuProps, Paper } from "@mui/material";
import React, { useEffect, useState } from "react";
import { Button, Col, Row } from "react-bootstrap";
import { UserDefaultImage } from "../../assets/images/png/pngimages";
import "./header-component.scss";
import { styled, alpha } from '@mui/material/styles';
import MenuItem from '@mui/material/MenuItem';
import EditIcon from '@mui/icons-material/Edit';
import Divider from '@mui/material/Divider';
import FileCopyIcon from '@mui/icons-material/FileCopy';

import LogoutOutlinedIcon from '@mui/icons-material/LogoutOutlined';
import localStore from "../../common/browserstore/localstore";
import ApiService from "../../core/services/axios/api";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { CultureId } from "../../common/application/i18n";
import { t } from "i18next";
import { useTranslation } from "react-i18next";
import { CiSaveUp2 } from "react-icons/ci";
import { MdCheck, MdClose } from "react-icons/md";
import { ChangePicture } from "./change-picture";
import ChangePassword from "./ChangePassword";
import CommonUtils from "../../common/utils/common.utils";
import { UserType } from "../../common/database/enums";
import { ItcUserManual, OperatorUserManual } from "../../assets/usermanual";
import DownloadingOutlinedIcon from '@mui/icons-material/DownloadingOutlined';


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


const LogoutPopup = ({ show, onClose }: any) => {

    const navigate = useNavigate();

    const logout = async () => {
        const accessToken = localStore.getToken();
        const paramData = {
            Token: accessToken,
            AppId: 2,
        };
        ApiService.httpPost('user/logout', paramData);
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
    }
    return (
        <Dialog open={show} className={`confirm__dialog confirmation`}>
            <Paper style={{ maxWidth: '430px', minWidth: '350px' }}>
                <DialogTitle>
                    <Row className='confirm-heading text-center'>
                        <Col md={12}>
                            <div className='action-icon'>
                                <CiSaveUp2 />
                            </div>
                        </Col>
                        <Col md={12}>
                            <h4 className='mt-3 pb-1'>
                                {t("Confirmation")}
                            </h4>
                        </Col>

                    </Row>
                </DialogTitle>
                <DialogContent className='confirm-body'>
                    <p className='text-center m-0 pt-4 pb-2'>
                        {t("Are you sure you want to Logout?")}
                    </p>
                </DialogContent>
                <DialogActions className='confirm-footer-buttons'>
                    <Row className='no-gutters w-100 justify-content-end'>

                        <Col md={6} className='mb-2'>
                            <Button className="no mx-1 w-100 d-flex align-items-center gap-2 justify-content-center" onClick={onClose}>
                                <MdClose />
                                <p className='mx-2 my-0'>{t("Cancel")}</p>
                            </Button>

                        </Col>

                        <Col md={6}>
                            <Button className="yes mx-1 w-100 d-flex align-items-center gap-2 justify-content-center" color="primary" autoFocus onClick={logout}>
                                <MdCheck />
                                {t("Confirm")}
                            </Button>
                        </Col>
                    </Row>
                </DialogActions>
            </Paper>
        </Dialog>
    )
}
const AppHeaderUser: React.FC<any> = () => {
    const [showLogout, setShowLogout] = useState(false);
    const [showChangePwd, setShowChangePwd] = useState<boolean>(false);
    const userData = localStore.getLoggedInfo();
    const { userType, UserId } = CommonUtils.userInfo;
    const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
    const open = Boolean(anchorEl);
    const { t, i18n } = useTranslation();
    const handleClick = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget);
    };
    const dispatch = useDispatch();
    const handleClose = async (action?: string) => {
        createActionFunction(action);
        setAnchorEl(null);
    };
    const lang = CultureId();
    const [readUserData, setUserData] = useState<any>();
    const [userImage, setUserImage] = useState<any>({
        readerResult: '',
        default: UserDefaultImage,
    });
    const [openChangePassword, setOpenChangePassword] = React.useState(false);
    const [version, setVersion] = React.useState('');


    const createActionFunction = (action: any) => {
        switch (action) {
            case 'profile':
                Profile();
                break;
            case 'changepwd':
                ChangePasswordHandler();
                break;
            case 'logout':
                Logout();
                break;
            default:
                break;
        }
    }


    /* Profile */
    const Profile = () => {
        setOpenChangePassword(true);
    }
    const handlePictureClose = () => {
        setOpenChangePassword(false);
    }

    /* Change password */
    const ChangePasswordHandler = () => {
        setShowChangePwd(true)
    }
    /* Logout */
    const Logout = async () => {
        setShowLogout(true)
        // dispatch(updateConfig({ action: 'triggerLogoutPopup', payload: { isLogoutUser: true } }))
    };

    useEffect(() => {
        getUserDetails();
    }, []);

    const getUserDetails = async () => {

        const param = {
            CultureId: lang,
            Id: UserId,
        }
        const userDetails = await ApiService.httpPost('user/readUserInfo', param);
        setUserData(userDetails.Data)
        setUserImage({
            readerResult: userDetails?.Data?.UserImage ? 'data:image/png;base64,' + userDetails.Data.UserImage : null,
            default: UserDefaultImage,
        });
    }

    const updatePicture = (e: any) => {
        setUserImage({
            readerResult: e.profileImage,
            default: UserDefaultImage,
        });
    }


    useEffect(() => {
        const config = window['config'];
        setVersion(config.version);
    }, [])

    return (
        <>
            <ChangePassword show={showChangePwd} onClose={() => setShowChangePwd(false)} />
            <LogoutPopup show={showLogout} onClose={() => { setShowLogout(false) }} />
            <div className="user-blk" onClick={handleClick}>
                <div className="text-right user-data">
                    <h5 className="m-0">{readUserData?.EmplName}</h5>
                    <p className="m-0">{readUserData?.MailId}</p>
                </div>
                <div className="user-img">
                    <div className="user-image-view" style={{ backgroundImage: `url(${userImage.readerResult || userImage.default})` }}></div>
                </div>
            </div>


            <StyledMenu
                id="demo-customized-menu"
                MenuListProps={{
                    'aria-labelledby': 'demo-customized-button',
                }}
                anchorEl={anchorEl}
                open={open}
                onClose={() => handleClose()}
            >
                <MenuItem onClick={() => handleClose('profile')} disableRipple>
                    <EditIcon />
                    {t("User Details")}
                </MenuItem>
                {userType === UserType.Franchise && (
                    <>
                        <Divider sx={{ my: 0.5 }} />
                        <MenuItem onClick={() => handleClose('changepwd')} disableRipple>
                            <FileCopyIcon />
                            {t("Change Password")}
                        </MenuItem>
                    </>
                )} 
                <Divider sx={{ my: 0.5 }} />
                <MenuItem disableRipple>
                    <DownloadingOutlinedIcon />
                    <a className="usermanual" href={`${UserId === UserType.ITC ? OperatorUserManual : ItcUserManual}`} download="UserManual"> Download User Manual
                    </a>
                </MenuItem> 
                <Divider sx={{ my: 0.5 }} />
                <MenuItem onClick={() => handleClose('logout')} disableRipple>
                    <LogoutOutlinedIcon />
                    {t("Logout")}
                </MenuItem>

                <Divider sx={{ my: 0.5 }} />
                <p className="m-0 version-name px-3 py-2"> {t("Version")} : {version}</p>

            </StyledMenu>
            {
                (readUserData && openChangePassword) &&
                <ChangePicture userDetails={readUserData} openChangePassword={openChangePassword} handlePictureClose={handlePictureClose} updatedProfilePic={updatePicture} />
            }

        </>
    )
};

export default AppHeaderUser;
