import { Dialog, DialogContent, DialogTitle, IconButton  } from "@mui/material"
import React  from "react";
import PixOutlinedIcon from "@mui/icons-material/PixOutlined";
import CloseIcon from "@mui/icons-material/Close"; 
import { ReceipentTable } from "./recipientsTable";
import { t } from "i18next";
import { useTranslation } from "react-i18next";

export const ViewReceipent = (props: any) => {
    const { open, onClose, receipentInfo } = props;
    const { t, i18n } = useTranslation();
    const [scroll, setScroll] = React.useState("paper");  
    
    return (
        <React.Fragment>
            <Dialog onClose={onClose} open={open} fullWidth={true} maxWidth={'xl'}>
                <DialogTitle sx={{ m: 0, p: 2 }} className="dialog_title_wrapper">
                    <p className="dialog_title">
                        <PixOutlinedIcon className="head-icon" />
                        <span className="mx-2">{t("View Receipent")}
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
                    <ReceipentTable receipentTableInfo={receipentInfo} />
                </DialogContent> 
            </Dialog>

        </React.Fragment>
    )

}
