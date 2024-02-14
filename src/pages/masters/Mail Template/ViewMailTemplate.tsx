import { Button, Dialog, DialogContent, DialogTitle, IconButton, Box, Tab } from "@mui/material"
import React, { useEffect, useState } from "react";
import PixOutlinedIcon from "@mui/icons-material/PixOutlined";
import CloseIcon from "@mui/icons-material/Close";
import { CultureId } from "../../../common/application/i18n";
import localStore from "../../../common/browserstore/localstore";
import { t } from "i18next";
import { useTranslation } from "react-i18next";



export const ViewMailTemplate = (props: any) => {
    const { open, onClose, mailcontent } = props;
    const { t, i18n } = useTranslation();
    const [scroll, setScroll] = React.useState("paper");
    const lang = CultureId();
    const userData = localStore.getLoggedInfo();
    const userID = userData && JSON.parse(userData).USER_ID;   

    return (
        <React.Fragment>
            <Dialog onClose={onClose} open={open} fullWidth={true} maxWidth={'lg'}>
                <DialogTitle sx={{ m: 0, p: 2 }} className="dialog_title_wrapper">
                    <p className="dialog_title">
                        <PixOutlinedIcon className="head-icon" />
                        <span className="mx-2">{t("View Template")}
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
                    <div className="greetings" dangerouslySetInnerHTML={{ __html: mailcontent}}></div>
                </DialogContent>
              
            </Dialog>

        </React.Fragment>
    )


}