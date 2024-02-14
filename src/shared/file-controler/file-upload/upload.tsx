import React, { useState } from "react";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import InputLabel from "@mui/material/InputLabel";
import Input from "@mui/material/Input";
import FormControl from "@mui/material/FormControl";
import IconButton from "@mui/material/IconButton";
import PhotoCamera from "@mui/icons-material/PhotoCamera";
import { t } from "i18next";
import { useTranslation } from "react-i18next";

export const UploadFile = (props: any) => {
    const { onClose, open } = props;
    const [file, setFile] = useState(null);
    const { t, i18n } = useTranslation();
    const [multiple, setMultiple] = useState(true);

    const handleClose = () => {
        onClose({ file, multiple });
    };

    const handleFileInputChange = (event:any) => { 
        if (event.target.files.length > 0) {
            setFile(event.target.files[0]);
        }
    };

    return (
        <Dialog onClose={handleClose} open={open}>
            <DialogTitle>{t("Customized Dialog")}</DialogTitle>
            <DialogContent>
                <FormControl>
                    <InputLabel htmlFor="file-upload">
                        {multiple ? "Choose Multiple Files" : "Choose a File"}
                    </InputLabel>
                    <Input
                        id="file-upload"
                        type="file"
                        onChange={handleFileInputChange}
                         
                        inputProps={{ accept: "image/*" }}
                    />
                    <input
                        accept="image/*"
                        id="icon-button-file"
                        type="file"
                        onChange={handleFileInputChange}
                        style={{ display: "none" }}
                        multiple={multiple}
                    />
                    <label htmlFor="icon-button-file">
                        <IconButton
                            color="primary"
                            aria-label="upload picture"
                            component="span"
                        >
                            <PhotoCamera />
                        </IconButton>
                    </label>
                </FormControl>
                {/* <FormControl>
                    <InputLabel shrink>Multiple?</InputLabel>
                    <Input
                        type="checkbox"
                        checked={multiple}
                        onChange={(event) => setMultiple(event.target.checked)}
                    />
                </FormControl> */}
            </DialogContent>
            <DialogActions>
                <Button onClick={handleClose}>{t("Cancel")}</Button>
                <Button
                    onClick={handleClose}
                    variant="contained"
                    disabled={!file}
                >
                    {t("Save")}
                </Button>
            </DialogActions>
        </Dialog>
    );
};
