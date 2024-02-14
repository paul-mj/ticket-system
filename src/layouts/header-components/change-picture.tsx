import { Button, Checkbox, Dialog, DialogActions, DialogContent, DialogTitle, IconButton } from "@mui/material"
import PixOutlinedIcon from "@mui/icons-material/PixOutlined";
import CloseIcon from "@mui/icons-material/Close";
import { Col, Row } from "react-bootstrap";
import { useTranslation } from "react-i18next";
import { useEffect, useState } from "react";
import { convertToBase64 } from "../../common/application/shared-function";
import { UserDefaultImage } from "../../assets/images/png/pngimages";
import ApiService from "../../core/services/axios/api";
import localStore from "../../common/browserstore/localstore";
import { toast } from "react-toastify";
import { Pen } from "../../assets/images/svgicons/svgicons";
import { useFieldArray, useForm } from 'react-hook-form';
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { FormInputText } from "../../shared/components/form-components/FormInputText";
import { CultureId } from "../../common/application/i18n";
import { FormInputCheckbox } from "../../shared/components/form-components/FormInputCheckbox";
import { forEach } from "lodash";
import { AndroidSwitchField } from "../../shared/components/form-components/FormAndroidSwitch";
import { SwitchField } from "../../shared/components/form-components/FormSwitch";


const SaveImageLoader = () => {
    const { t, i18n } = useTranslation();

    return (
        <>
            <div className="mail-save-box-wrapper">
                <div className="mail-save-box-wrap">
                    <div className="loader-text">
                        <p className="save-mail-msg">{t("Saving Your Profile Picture...")}</p>
                        <p className="save-mail-msg mt-1" >{t("Just give us a moment to process your choice")}</p>
                    </div>
                </div>
            </div>
            <div className="mail-save-overlay"></div>
        </>

    )
}

export const ChangePicture = (props: any) => {

    const { userDetails, openChangePassword, handlePictureClose, updatedProfilePic } = props;
    const { t, i18n } = useTranslation();
    const lang = CultureId();
    const userData = localStore.getLoggedInfo();
    const userID = userData && JSON.parse(userData).USER_ID;
    const [images, setImages] = useState({
        profileImage: '',
        imageLoader: false,
        newlyUploaded: false
    })
    const [mailExecutionList, setMailExecutionList] = useState<any>()
    const [imageUploadLoader, setImageUploadLoader] = useState<any>(false)



    // const schema = yup.object().shape({
    //     MailExclusionList: yup.array().of(
    //         yup.object().shape({
    //             EXCLUDE_REASON: yup.string().required("Required").typeError('Required')

    //         }))
    // });


    const { control, handleSubmit, reset, trigger, setError, setValue, formState: { errors, isValid } } = useForm({
        // resolver: yupResolver(schema)
    });

    const { fields, append, remove } = useFieldArray({
        control,
        name: "MailExclusionList"
    });


    useEffect(() => {
        setImages((prevState: any) => ({
            ...prevState,
            profileImage: userDetails?.UserImage ? 'data:image/png;base64,' + userDetails.UserImage : UserDefaultImage
        }))

    }, [userDetails]);

    useEffect(() => {
        getMailExclusionList();
    }, []);

    const handleFileUpload = async (e: any) => {
        const file = e.target.files[0];
        const base64 = await convertToBase64(file);
        setImages((prevState: any) => ({
            ...prevState,
            profileImage: base64,
            newlyUploaded: true
        }));
    };

    const saveNewProfilePicture = async () => {
        setImageUploadLoader(true)
        if (images?.newlyUploaded) {
            setImages((prevState: any) => ({
                ...prevState,
                imageLoader: true
            }));
            // const param = {
            //     UserId: userID,
            //     Image: images.profileImage.replace('data:image/jpeg;base64,', '')
            // }

            const param = {
                UserId: userID,
                Image: images.profileImage
                    .replace('data:image/jpeg;base64,', '')
                    .replace('data:image/png;base64,', '')
            }
            const imageSaveResponse = await ApiService.httpPost('User/saveProfileImage', param);

            if (imageSaveResponse.Id > 0) {
                setImages((prevState: any) => ({
                    ...prevState,
                    newlyUploaded: false
                }));
                updatedProfilePic(images);
                setImageUploadLoader(false)
                toast.success(imageSaveResponse.Message);
            }
        }
    }

    const savePreference = async () => {
        handleSubmit(async (data) => {
            const { MailExclusionList } = data
            const Lines = MailExclusionList.map((item: any) => {
                return {
                    ...item,
                    IS_MARKED: Number(item.IS_MARKED)
                }
            })
            const param = {
                UserId: userID,
                Lines: Lines,
            }
            const imageSaveResponse = await ApiService.httpPost('servicetypemails/saveMailExclusionList', param);
            if (imageSaveResponse.Id > 0) {
                toast.success(imageSaveResponse?.Message, { autoClose: 3000 });
                onHandleClose();
            } else {
                toast.error(imageSaveResponse?.Message, { autoClose: 3000 });
            }

        })()

    }

    const getMailExclusionList = async () => {

        const param = {
            Id: userID,
            CultureId: lang,
        }
        const { Data = [] } = await ApiService.httpPost('servicetypemails/getMailExclusionList', param);
        console.log(Data)
        setMailExecutionList(Data)
        Data.forEach((item: any) => {
            const {
                MAIL_TYPE,
                IS_MARKED,
                EXCLUDE_REASON,
            } = item

            append({ EXCLUDE_REASON, MAIL_TYPE, IS_MARKED })
        })
        // append({ EXCLUDE_REASON: '', MAIL_TYPE: '', IS_MARKED: '' })

    }

    const onHandleClose = () => {
        handlePictureClose()
        // setValue('MailExclusionList', [])

    }

    return (
        <>
            <Dialog onClose={onHandleClose} open={openChangePassword} fullWidth={true} maxWidth={'lg'} >
                <DialogTitle sx={{ m: 0, p: 2 }} className="dialog_title_wrapper">
                    <p className="dialog_title">
                        <PixOutlinedIcon className="head-icon" />
                        <span className="mx-2">
                            {t("User Details")}
                        </span>
                    </p>
                    <IconButton
                        aria-label="close"
                        className="head-close-bttn"
                        onClick={handlePictureClose}
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
                <DialogContent className="bgWithImg">

                    <Row>
                        <Col md={4} sm={6}>
                            <div className="h-100 w-100 avatar-sec">
                                <Row className="justify-content-center">
                                    <div className="edit-heading">{t("Edit Profile Picture")}</div>
                                    <Col md={12} className="avatar-upload">
                                        <div className="avatar-edit">
                                            <input type='file' id="imageUpload" accept=".png, .jpg, .jpeg" onChange={(e) => handleFileUpload(e)} />
                                            <label htmlFor="imageUpload">
                                                <img src={Pen} alt="" />
                                            </label>
                                        </div>
                                        <div className="avatar-preview">
                                            <div id="imagePreview" style={{ backgroundImage: `url(${images.profileImage})` }}></div>
                                        </div>
                                    </Col>
                                    <Col md={12} className="d-flex w-100 justify-content-center p-0">
                                        <Button
                                            type="submit"
                                            variant="contained"
                                            className="colored-btn"
                                            onClick={saveNewProfilePicture}
                                        >
                                            {t("Save Profile")}
                                        </Button>
                                    </Col>
                                </Row>

                            </div>
                        </Col>

                        <Col md={8} sm={6}>
                            <div className="d-flex justify-content-between w-100 mb-2 align-items-center edit-header">
                                <div className="edit-head">{t("Mail Exclusion List")}</div>
                                <Button
                                    type="submit"
                                    variant="contained"
                                    className="colored-btn"
                                    onClick={savePreference}>
                                    {t("Save Preference")}
                                </Button>
                            </div>
                            <Row className="mailListSec">
                                {/* {mailExecutionList?.length && mailExecutionList.map((item: any, index: any) => (
                                    <MailExclusionList item={item} key={index} submitValue={handleSubmitValue} />
                                ))} */}
                                {fields.map((item: any, index) => (
                                    <Col md={6} className="mb-3" key={item.id}>
                                        <div className="mail-card" style={{ border: item.IS_MARKED ? '1px solid #FF7979' : '1px solid transparent' }}>
                                            <div className="d-flex checkbox-toggle align-items-center">
                                                {/* <FormInputCheckbox
                                                    name={`MailExclusionList.${index}.IS_MARKED`}
                                                    control={control}
                                                    label={t("")}
                                                    errors={errors}
                                                /> */}
                                                {/* <AndroidSwitchField
                                                    name={`MailExclusionList.${index}.IS_MARKED`}
                                                    control={control}
                                                    label={t("Exclude")}
                                                    errors={errors}
                                                    fontSize={13}
                                                /> */}
                                                <SwitchField
                                                    name={`MailExclusionList.${index}.IS_MARKED`}
                                                    control={control}
                                                    label={t("Exclude")}
                                                    
                                                />
                                                <div className="mail-det w-100">
                                                    <div className="mail-name">
                                                        <span>{mailExecutionList[index]?.MAIL_TYPE_NAME}</span>
                                                    </div>
                                                    {/* <div className="mail-ipt">
                                                    <FormInputText
                                                        name={`MailExclusionList.${index}.EXCLUDE_REASON`}
                                                        control={control}
                                                        label={t("")}
                                                        errors={errors}
                                                        multiline={true}
                                                    />
                                                </div> */}
                                                </div>
                                            </div>
                                            <div className="mail-ipt">
                                                <FormInputText
                                                    name={`MailExclusionList.${index}.EXCLUDE_REASON`}
                                                    control={control}
                                                    label={t("Remarks")}
                                                    errors={errors}
                                                    multiline={true}
                                                />
                                            </div>
                                        </div>
                                    </Col>
                                ))}
                            </Row>
                        </Col>
                    </Row>

                    {imageUploadLoader && <>
                        <SaveImageLoader />

                    </>}

                </DialogContent>
                <DialogActions className="dialog-action-buttons">
                    {/* <Button
                        autoFocus
                        onClick={handlePictureClose}
                        className="mx-3"
                    >
                        {t("Close")}
                    </Button> */}

                </DialogActions>
            </Dialog>
        </>
    )
}