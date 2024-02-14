import { Button, Dialog, DialogContent, DialogTitle, IconButton,Box,Tab } from "@mui/material"
import React, { useEffect, useState } from "react";
import PixOutlinedIcon from "@mui/icons-material/PixOutlined";
import CloseIcon from "@mui/icons-material/Close";
import axios from "axios";
import TabList from "@mui/lab/TabList";
import TabPanel from "@mui/lab/TabPanel";
import { Col, Row } from "react-bootstrap";
import { HiOutlinePencilSquare, HiOutlineTrash } from "react-icons/hi2";
import { CultureId } from "../../../common/application/i18n";
import localStore from "../../../common/browserstore/localstore";
import ApiService from "../../../core/services/axios/api";
import { EventIcon } from "../../../assets/images/svgicons/svgicons";
import { t } from "i18next";
import { useTranslation } from "react-i18next";

export const NewEventPopup = (props: any) => {
    const { open, onClose, serviceType } = props;
    const { t, i18n } = useTranslation();
    const [scroll, setScroll] = React.useState("paper");
    const lang = CultureId();
    const userData = localStore.getLoggedInfo();
    const userID = userData && JSON.parse(userData).USER_ID;
    const [tabValue, setTabValue] = useState('1');
    const [selectionChangeResponse, setSelectionChangeResponse] = useState<any>(
        {
            roleList: [],            
            additionalRoleList: null,
        }
    );
    useEffect(()=>{
       
        initialLoad();
    },[])
    const handleChangeTab = (event: React.SyntheticEvent, newValue: string) => {
        setTabValue(newValue);
    };

    const initialLoad = async() => {
        const mailRoleParam = {
            id: serviceType,
            CultureId: lang
        }
        const additionalRoleParams = {
            UserId: userID,
            Id: serviceType,
            CultureId: lang,
        }
        try {
            const [ roleList, additionalRoles] =
                await axios.all([                  
                    ApiService.httpPost('MailRoles/read', mailRoleParam),
                    ApiService.httpPost('ServiceTypeMails/read', additionalRoleParams),
                ]);

                console.log(serviceType);
                setSelectionChangeResponse({
                    /* roleList: sampleResponse,
                    copyOfRoleList: sampleResponse, */
                    roleList: (roleList.Valid > 0 && roleList.Data?.length) ? roleList.Data : null,
                  
                    additionalRoleList: (additionalRoles.Valid > 0 && additionalRoles.Data?.length) ? additionalRoles.Data : null,
                });
             //   const roleOptions = (roleOptionList.Valid > 0 && roleOptionList.Data?.length) ? formatOptionsArray(roleOptionList.Data, 'ROLE_NAME', 'ROLE_ID') : null;
               
            } catch (error) {
                console.error(error);
            }
    
}
    return (
        <React.Fragment>
            <Dialog onClose={onClose} open={open} fullWidth={true} maxWidth={'sm'}>
                <DialogTitle sx={{ m: 0, p: 2 }} className="dialog_title_wrapper">
                    <p className="dialog_title">
                        {/* <PixOutlinedIcon className="head-icon" /> */}
                        <img src={EventIcon} alt="" />
                        <span className="mx-2">{t("Add New Event")}
                        </span>
                    </p>
                    <IconButton
                        aria-label="close"
                        className="head-close-bttn"
                        onClick={() => onClose(true)}
                        sx={{
                            position: "absolute",
                            right: 8,
                            top: 8,
                            color: (theme) => theme.palette.grey[500],
                        }}
                    >
                        <CloseIcon />
                    </IconButton>
                </DialogTitle>
                <DialogContent dividers={scroll === "paper"}>

                <div className="outlined-box mb-3 pb-3">
                            <Box sx={{ width: '100%' }} className="frm__tab__head">

                            </Box>
                        </div>


                </DialogContent>




                {/*  <Button 
             type="submit"
             variant="contained"
             className="colored-btn"
            
            onClick={onClose}>Close</Button>
     */}
            </Dialog>

        </React.Fragment>
    )

}
