import { ClickAwayListener, Popper } from "@mui/material";
import React, { useEffect, useState } from "react";
import PasswordPolicy from "..";
import InfoIcon from '@mui/icons-material/Info';
import "../passwordPolicy.scss";
import { useTranslation } from "react-i18next";

const PasswordPolicyControl = ({ list, onValidate }: { list: any[], onValidate?: any }) => {
    const [isValid, setIsValid] = useState(false);
    const { t, i18n } = useTranslation();
    const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
    const handleClick = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(anchorEl ? null : event.currentTarget);
    };
    const open = Boolean(anchorEl);
    const id = open ? 'simple-popper' : undefined;
    useEffect(() => {
        const isInValid = list.some((item: any) => !item.pass);
        setIsValid(!isInValid);
    }, [list])
    useEffect(() => {
        onValidate(isValid)
    },[isValid, onValidate])
    return (
        <ClickAwayListener onClickAway={() => setAnchorEl(null)}>
            <div className="d-inline">
                <button aria-describedby={id} type="button" className={`policy-info ${isValid ? 'success' : 'failed'}`} onClick={handleClick}>
                    <InfoIcon /> {t("Password Policy")}
                </button>
                <Popper id={id} open={open} anchorEl={anchorEl} placement="bottom-start" sx={{ zIndex: 9999 }}>
                    <div className="poper-wrapper">
                        <PasswordPolicy list={list} />
                    </div>
                </Popper>
            </div>
        </ClickAwayListener>
    )
}
export default PasswordPolicyControl;