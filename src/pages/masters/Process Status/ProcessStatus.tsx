import React, { useContext, useEffect, useState } from "react";
import { useForm } from 'react-hook-form';
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import {
    Button,
    DialogActions,
    DialogContent,
    DialogTitle,
    IconButton,
} from "@material-ui/core";
import CloseIcon from "@mui/icons-material/Close";
import { enumDet, getRole, ProcessFormValues } from "../../../common/typeof/MasterTypeof";
import {  readEnums,  readProcessStatus, saveProcessStatus } from "../../../common/api/masters.api";
import { toast } from "react-toastify";
import { Col, Row } from "react-bootstrap";
import { FormControlLabel} from "@mui/material";
import { fullViewRowDataContext } from "../../../common/providers/viewProvider";
import PixOutlinedIcon from "@mui/icons-material/PixOutlined";
import { FormInputSelect } from "../../../shared/components/form-components/FormInputSelect";
import { FormInputText } from "../../../shared/components/form-components/FormInputText";
import { useTranslation } from "react-i18next";
import {  MenuId, fullGridDataAction } from "../../../common/database/enums";
import { styled } from '@mui/material/styles';
import Switch from '@mui/material/Switch';
import { CultureId } from "../../../common/application/i18n";
import localStore from "../../../common/browserstore/localstore";
import { useConfirm } from "../../../shared/components/dialogs/confirmation";
import DataGridActionContext from "../../../common/providers/datagridActionProvider";


export interface FranchiseRequestDialogProps {
    onCloseDialog: (value: boolean) => void;
    popupConfiguration: any;
}

const ProcessStatus = (props: FranchiseRequestDialogProps) => {
   
    const validationSchema = yup.object().shape({
        objName: yup.string().required('Status Name  in English is required'),
        objNameArabic: yup.string().required('Status Name in Arabic is required'),
        actionNameArabic: yup.string().required('Action Name in Arabic is required'),
        actionName: yup.string().required('Action Name in English is required'),
        objEnumBooolean: yup.boolean(),
        objectEnum: yup.string().nullable().required('Select Status Type'),
    });

    const {  reset, control, handleSubmit, setValue,  formState: { errors } } = useForm<ProcessFormValues>({
        resolver: yupResolver(validationSchema),
        defaultValues: {
            objectEnum: null,
            objName: '',
            actionName: '',
            objNameArabic: '',
            actionNameArabic: '',
            statusEmail: '',
            statusEmailArabic: '',
            shortName: '',
            remarks: '',
            rmkMandatory: true
        }
    });
    const lang = CultureId();
    const userData = localStore.getLoggedInfo();
    const userID = userData && JSON.parse(userData).USER_ID;
    const [compName, setCompName] = useState<number | null>();
    const [emName, setEmName] = useState<number | null>();
    const [isRemark, setIsRemark] = useState(false);   
    const [editValue, setEditValue] = useState<boolean>(false);
    const [statusIDValue, setStatusIDValue] = useState<number>();
    const [viewMenu, setViewMenu] = useState<boolean>(false);
    // const processStatusContext = useContext(fullViewRowDataContext);
    const { rowData, activeAction } = useContext(fullViewRowDataContext);
    const [readEnumDet, setreadEnumDet] = useState<enumDet>();
    const { t, i18n } = useTranslation();
    const { onCloseDialog, popupConfiguration } = props;
    const currentPage = popupConfiguration && popupConfiguration.action.MenuId;
    const { gridActionChangeEvent } = useContext(DataGridActionContext);
    const confirm = useConfirm();
    const handleCloseDialog = () => {
        onCloseDialog(true);
    };

    useEffect(() => { readMasterData() }, []);

    const readMasterData = async () => {
        const paramEnum = {
            Id: 301,
            CultureId: lang,
        };
        const responseEnum = await readEnums(paramEnum);
        const optionValue: any = [];
        responseEnum.Data.map((e: any) =>
            optionValue.push({ value: e.ENUM_ID, label: e.ENUM_NAME })
        );
        setValue("objEnumBooolean", true)
        setreadEnumDet(optionValue);

    };
    /////////////////Style
    const Android12Switch = styled(Switch)(({ theme }) => ({
        padding: 8,
        '& .MuiSwitch-track': {
            borderRadius: 22 / 2,
            '&:before, &:after': {
                content: '""',
                position: 'absolute',
                top: '50%',
                transform: 'translateY(-50%)',
                width: 16,
                height: 16,
            },
            '&:before': {
                backgroundImage: `url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" height="16" width="16" viewBox="0 0 24 24"><path fill="${encodeURIComponent(
                    theme.palette.getContrastText(theme.palette.primary.main),
                )}" d="M21,7L9,19L3.5,13.5L4.91,12.09L9,16.17L19.59,5.59L21,7Z"/></svg>')`,
                left: 12,
            },
            '&:after': {
                backgroundImage: `url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" height="16" width="16" viewBox="0 0 24 24"><path fill="${encodeURIComponent(
                    theme.palette.getContrastText(theme.palette.primary.main),
                )}" d="M19,13H5V11H19V13Z" /></svg>')`,
                right: 12,
            },
        },
        '& .MuiSwitch-thumb': {
            boxShadow: 'none',
            width: 16,
            height: 16,
            margin: 2,
        },
    }));
    /////////////////

    useEffect(() => {
        if (activeAction.MenuId === MenuId.Edit || activeAction.MenuId === MenuId.View) {
            readEditValue();
        }
    }, []);

    const fullviewRowAddUpdate = (responseId: number) => {
        gridActionChangeEvent({
            id: responseId,
            status:
                currentPage === MenuId.New
                    ? fullGridDataAction.InsertRow
                    : fullGridDataAction.UpdateRow,
        });
      //  onCloseDialog(true);
    };

    const readEditValue = async () => {
        setEditValue(true);
        if (activeAction.MenuId === MenuId.View)
        {
            setViewMenu(true);
        }
        const response = await readProcessStatus(rowData?.ID_);
        setStatusIDValue(response?.Data[0].STATUS_ID);
        setCompName(response.Data[0]?.STATUS_TYPE ? response.Data[0]?.STATUS_TYPE : 0)
        setValue('objectEnum', response?.Data[0].STATUS_TYPE);
        setValue('objName', response?.Data[0].STATUS_NAME);
        setValue('actionName', response?.Data[0].ACTION_NAME);
        setValue('objNameArabic', response?.Data[0].STATUS_NAME_AR);
        setValue('actionNameArabic', response?.Data[0].ACTION_NAME_AR);
        setValue('statusEmail', response?.Data[0].STATUS_EMAIL_NAME);
        setValue('statusEmailArabic', response?.Data[0].STATUS_EMAIL_NAME_AR);
        setIsRemark(response?.Data[0].IS_REMARKS_REQUIRED === 1 ? true : false);
        setValue('remarks', response?.Data[0].REMARKS);

    }


    const activeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setIsRemark(e.target.checked);
    }

    const handleChange = () => {
        ////Avoid Validation red
    }

    const onSubmit = handleSubmit(async (data: ProcessFormValues) => {
        const param = {
            Data: {
                STATUS_TYPE: data?.objectEnum === 0 ? null : Number(data?.objectEnum),
                STATUS_ID: editValue ? statusIDValue : -1,
                STATUS_NAME: data?.objName,
                ACTION_NAME: data?.actionName,
                STATUS_NAME_AR: data?.objNameArabic,
                ACTION_NAME_AR: data?.actionNameArabic,
                STATUS_EMAIL_NAME: data?.statusEmail,
                STATUS_EMAIL_NAME_AR: data?.statusEmailArabic,
                IS_REMARKS_REQUIRED: isRemark ? 1 : 0,
                REMARKS: data?.remarks,
            },

            UserId: userID
        }
        const choice = await confirm({
            ui: 'confirmation',
            title: `${t('You Are About To Save')}`,
            description: `${t('Are you sure you want to Save this?')}`,
            confirmBtnLabel: `${t('Continue')}`,
            cancelBtnLabel: `${t('Cancel')}`,
        });
        if (choice) {
            try {
                const response = await saveProcessStatus(param);
                if (response.Id > 0) {
                    fullviewRowAddUpdate(response.Id);
                    toast.success(response.Message)
                    if (editValue) {
                        handleCloseDialog();
                    }
                    reset();
                    setCompName(null);
                    setEmName(null);
                    setIsRemark(false);
                }
                else {
                    toast.error(response?.Message)
                }
            } catch (e: any) {
                toast.error(e?.message)
            }
        }
    });

    return (
        <>
            <DialogTitle sx={{ m: 0, p: 2 }} className="dialog_title_wrapper">
                <p className="dialog_title">
                    <PixOutlinedIcon className="head-icon" />
                    <span className="mx-2">
                        {popupConfiguration && popupConfiguration.DialogHeading}
                    </span>
                </p>
                <IconButton
                    aria-label="close"
                    className="head-close-bttn"
                    onClick={() => handleCloseDialog()}
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
            <DialogContent dividers className="dialog-content-wrapp">
                <Row>
                    <div className="outlined-box ">
                        <h5 className="outlined-box-head my-3">
                            {t("Process status Details")}
                        </h5>
                        <Row>
                            {readEnumDet && (
                                <Col md={6} className="mb-3">
                                    <FormInputSelect
                                        name="objectEnum"
                                        control={control}
                                        label={t("Status Type")}
                                        errors={errors}
                                        options={readEnumDet}
                                        onChange={handleChange}
                                        readOnly={viewMenu}
                                    />
                                </Col>

                            )}
                            <Col md={6} className="mb-3">
                                <FormControlLabel
                                    control={<Android12Switch checked={isRemark}
                                        onChange={activeChange}
                                        disabled={viewMenu}
                                    />
                                    }

                                    label={t("Remarks Mandatory")}
                                />
                            </Col>
                            <Col md={6} className="mb-3">
                                <FormInputText
                                    name="objNameArabic"
                                    control={control}
                                    label={t("Status Name in Arabic")}
                                    errors={errors}
                                    align={{ textAlign: 'right' }}
                                   
                                    readOnly={viewMenu}
                                />
                            </Col>
                            <Col md={6} className="mb-3">
                                <FormInputText
                                    name="objName"
                                    control={control}
                                    label={t("Status Name in English")}
                                    errors={errors}
                                    readOnly={viewMenu}
                                />
                            </Col>
                            <Col md={6} className="mb-3">
                                <FormInputText
                                    name="actionNameArabic"
                                    control={control}
                                    label={t("Action Name in Arabic")}
                                    errors={errors}
                                    align={{ textAlign: 'right' }}
                                   
                                    readOnly={viewMenu}
                                />
                            </Col>
                            <Col md={6} className="mb-3">
                                <FormInputText
                                    name="actionName"
                                    control={control}
                                    label={t("Action Name in English")}
                                    errors={errors}
                                    readOnly={viewMenu}
                                />
                            </Col>
                            <Col md={6} className="mb-3">
                                <FormInputText
                                    name="statusEmailArabic"
                                    control={control}
                                    label={t("Status Email in Arabic")}
                                    // errors={errors}
                                    align={{ textAlign: 'right' }}
                                  
                                    readOnly={viewMenu}
                                />
                            </Col>
                            <Col md={6} className="mb-3">
                                <FormInputText
                                    name="statusEmail"
                                    control={control}
                                    label={t("Status Email in English")}
                                    readOnly={viewMenu}
                                // errors={errors}
                                />
                            </Col>

                            <Col md={12} className="mb-3">
                                <FormInputText
                                    name="remarks"
                                    control={control}
                                    label={t("Remarks")}
                                    multiline={true}
                                    maxLength={250}
                                    readOnly={viewMenu}
                                />
                            </Col>
                        </Row>
                        {/* {readObject &&
                        <Col lg={6} md={6} sm={12} xs={12} className="mb-3" >
                            <FormControl fullWidth error={Boolean(errors?.objParentID)}>
                                <InputLabel id="ObjectName">Select Role </InputLabel>
                                <Select
                                    label="Select Role"
                                    variant='outlined'
                                    className="w-100"
                                    defaultValue={null}
                                    {...register('objParentID')}
                                    error={Boolean(errors?.objParentID)}
                                    onChange={(e: any) => setCompName(e.target.value)}
                                    value={compName || 0}
                                >
                                    {
                                        readObject && readObject.map((item, index) => {
                                            return (<MenuItem value={item?.ROLE_ID} key={index} > {item?.ROLE_NAME} </MenuItem>)
                                        })
                                    }
                                </Select>
                                <FormHelperText>{errors?.objParentID?.message} </FormHelperText>
                            </FormControl>
                        </Col>
                    }
 */}

                        {/* <Col lg={6} md={6} sm={12} xs={12} className="mb-3">
                            <FormControl fullWidth >
                                <TextField
                                    type="text"
                                    label="Status Name"
                                    variant='outlined'
                                    focused={editValue}
                                    className="w-100"
                                    {...register('objName')}
                                    error={errors.objName ? true : false}
                                    helperText={errors.objName?.message?.toString()}
                                />
                            </FormControl>
                        </Col> */}



                        {/* <Col lg={6} md={6} sm={12} xs={12} className="mb-3">
                            <TextField
                                type="text"
                                label="Status Name in Arabic"
                                variant='outlined'
                                focused={editValue}
                                className="w-100"
                                {...register('objNameArabic')}
                            />
                        </Col> */}

                        {/* <Col lg={6} md={6} sm={12} xs={12} className="mb-3">
                            <TextField
                                type="text"
                                label="Action Name"
                                variant='outlined'
                                focused={editValue}
                                className="w-100"
                                {...register('actionName')}
                            />
                        </Col> */}

                        {/* <Col lg={6} md={6} sm={12} xs={12} className="mb-3">
                            <TextField
                                type="text"
                                label="Action Name in Arabic"
                                variant='outlined'
                                focused={editValue}
                                className="w-100"
                                {...register('actionNameArabic')}
                            />
                        </Col>
 */}                        {/* <Col lg={6} md={6} sm={12} xs={12} className="mb-3">
                            <TextField
                                type="text"
                                label="Status Email"
                                variant='outlined'
                                className="w-100"
                                focused={editValue}
                                {...register('statusEmail')}
                            />
                        </Col>
                        <Col lg={6} md={6} sm={12} xs={12} className="mb-3">
                            <TextField
                                type="text"
                                label="Status Email in Arabic"
                                variant='outlined'
                                focused={editValue}
                                className="w-100"
                                {...register('statusEmailArabic')}
                            />
                        </Col> */}

                        {/* <Col lg={6} md={6} sm={12} xs={12} className="mb-3">
                            <FormControlLabel
                                label="Remarks required?"
                                control={<Checkbox
                                    checked={isRemark}
                                    onChange={activeChange}
                                />}
                            />
                        </Col>
                        {isRemark &&
 */}
                        {/* <Col lg={12} md={12} sm={12} xs={12} className="mb-3">
                            <TextField
                                type="text"
                                label="Remarks"
                                variant='outlined'
                                className="w-100"
                                focused={editValue}
                                {...register('remarks')}
                                multiline={true}
                                inputProps={{
                                    maxLength: 250,
                                }}
                            />
                        </Col>
                        }
 */}                    </div>
                </Row>

            </DialogContent>
            <DialogActions className="dialog-action-buttons">

                <div className="d-flex justify-content-end">
                    <Button
                        autoFocus
                        onClick={() => handleCloseDialog()}
                        className="mx-3"
                    >
                       {t("Close")}
                    </Button>
                    {!viewMenu &&
                        <Button
                            type="submit"
                            variant="contained"
                            className="colored-btn"
                            onClick={onSubmit}
                        >
                            {t("Save")}
                        </Button>
                    }
                </div>
            </DialogActions>
        </>
    );
};

export default ProcessStatus;
