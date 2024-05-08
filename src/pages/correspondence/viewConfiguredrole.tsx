import { Button, Dialog, DialogContent, DialogTitle, IconButton,Box,Tab } from "@mui/material"
import React, { useEffect, useState } from "react";
import PixOutlinedIcon from "@mui/icons-material/PixOutlined";
import CloseIcon from "@mui/icons-material/Close";
import localStore from "../../common/browserstore/localstore";
import { CultureId } from "../../common/application/i18n";
import axios from "axios";
import TabContext from "@mui/lab/TabContext";
import TabList from "@mui/lab/TabList";
import TabPanel from "@mui/lab/TabPanel";
import ApiService from "../../core/services/axios/api";
import { API } from "../../common/application/api.config";
import { formatOptionsArray } from "../../common/application/shared-function";
import { Col, Row } from "react-bootstrap";
import { HiOutlinePencilSquare, HiOutlineTrash } from "react-icons/hi2";
import { TableNoData } from "../../shared/components/table/no-data";
import { t } from "i18next";
import { useTranslation } from "react-i18next";

export const ViewConfiguredRole = (props: any) => {
    const { open, onClose, serviceType } = props;
    const [scroll, setScroll] = React.useState("paper");
    const lang = CultureId();
    const { t, i18n } = useTranslation();
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
            <Dialog onClose={onClose} open={open} fullWidth={true} maxWidth={'md'}>
                <DialogTitle sx={{ m: 0, p: 2 }} className="dialog_title_wrapper">
                    <p className="dialog_title">
                        <PixOutlinedIcon className="head-icon" />
                        <span className="mx-2">{t("View Configuration")}
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
                                <TabContext value={tabValue}>
                                    <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                                        <TabList onChange={handleChangeTab} aria-label="lab API tabs example">
                                            <Tab label={t("Role List")} value="1" />
                                            <Tab label={t("Additional Role List")} value="2" />
                                        </TabList>
                                    </Box>
                                    <TabPanel value="1" className="pt-4 p-2">
                                        <Row className="no-gutters">
                                            <Col md={12} className="frm_htm_tble px-0">
                                                <table>
                                                    <tr className="htm__table__head">
                                                        <th>{t("Roles")}</th>
                                                       
                                                    </tr>
                                                    {
                                                        selectionChangeResponse?.roleList?.length ? (
                                                            selectionChangeResponse?.roleList.map((role: any, index: number) => (
                                                                <tr key={index}>
                                                                    <td>{role.ROLE_NAME}</td>
                                                                   
                                                                </tr>
                                                            ))
                                                        ) : (
                                                            <> <TableNoData colSpan={2} message={t('No Data')} /> </>
                                                        )
                                                    }
                                                </table>
                                            </Col>
                                        </Row>
                                    </TabPanel>
                                    <TabPanel value="2" className="pt-4 p-2">
                                        <Row className="no-gutters">
                                            <Col md={12} className="frm_htm_tble px-0">
                                                <table>
                                                    <tr className="htm__table__head">
                                                        <th>{t("Type")}</th>
                                                        <th>{t("Name")}</th>
                                                        <th>{t("Email ID")}</th>
                                                        <th>{t("Sub Entity")}</th>
                                                    </tr>
                                                    {
                                                        selectionChangeResponse?.additionalRoleList ? (
                                                            selectionChangeResponse?.additionalRoleList.map((adRole: any, index: number) => (
                                                                <tr key={index}>
                                                                    <td>{adRole.RECORD_TYPE}</td>
                                                                    <td>{adRole.CONTACT_DET}</td>
                                                                    <td>{adRole.EMAIL_ID}</td>
                                                                    <td>{adRole.SUB_ENTITY_NAME}</td>
                                                                </tr>
                                                            ))
                                                        ) : (
                                                            <> <TableNoData colSpan={4} message={t('No Data')} /> </>
                                                        )
                                                    }
                                                </table>
                                            </Col>
                                        </Row>
                                    </TabPanel>
                                </TabContext>
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
