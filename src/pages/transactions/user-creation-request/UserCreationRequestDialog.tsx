import {
    Box,
    Button,
    Checkbox,
    DialogActions,
    DialogContent,
    DialogTitle,
    IconButton,
    Tab,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { Col, Row } from "react-bootstrap";
import { FormInputDate } from "../../../shared/components/form-components/FormInputDate";
import { useForm } from 'react-hook-form';
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import FormInputPhone from "../../../shared/components/form-components/FormInputPhone";
import DeleteOutlineOutlinedIcon from '@mui/icons-material/DeleteOutlineOutlined';
import UploadFileOutlinedIcon from '@mui/icons-material/UploadFileOutlined';
import RemoveRedEyeOutlinedIcon from '@mui/icons-material/RemoveRedEyeOutlined';
import React, { useContext, useEffect, useRef, useState } from 'react';
import PixOutlinedIcon from "@mui/icons-material/PixOutlined";
import "./user-creation.scss";
import { PreviewUpload } from "../../../shared/file-controler/file-with-preview-upload/previewUpload";
import { ColumnUpload } from "../../../shared/file-controler/file-column-upload/columnUpload";
import { FormInputCheckbox } from "../../../shared/components/form-components/FormInputCheckbox";
import { UserDefaultImage } from "./../../../assets/images/png/pngimages";
import { FcCalendar, FcLibrary } from "react-icons/fc";
import axios from "axios";
import ApiService from "../../../core/services/axios/api";
import { CultureId } from "../../../common/application/i18n";
import { API } from "../../../common/application/api.config";
import { formatOptionsArray } from "../../../common/application/shared-function";
import { useConfirm } from "../../../shared/components/dialogs/confirmation";
import { toast } from "react-toastify";
import localStore from "../../../common/browserstore/localstore";
import { v4 as uuidv4, v4 } from "uuid";
import { useSelector } from "react-redux";
import { MenuId, fullGridDataAction } from "../../../common/database/enums";
import { PreviewCreation } from "../../../shared/components/dialogs/Preview/preview";
import { validateEidCheckSum } from "../../../core/validators/validations";
import { fullViewRowDataContext } from "../../../common/providers/viewProvider";
import { blobToBase64 } from "../../../core/validators/imageValidators";
import { Eye, PrevArrowBtn, emiratesId } from "../../../assets/images/svgicons/svgicons";
import { ParamVars } from "../../../common/database/app.paramVars";
import { Procedures } from "../../../common/database/app.dbVars";
import DataGridActionContext from "../../../common/providers/datagridActionProvider";
import { PreviewColumnUpload } from "../../../shared/file-controler/file-preview-column-upload/preview-column-upload";
import { FormInputSelect } from "../../../shared/components/form-components/FormInputSelect";
import { FormInputText } from "../../../shared/components/form-components/FormInputText";
import { FormInputPassword } from "../../../shared/components/form-components/FormInputPassword";
import DoneIcon from '@mui/icons-material/Done';
import RadioButtonCheckedIcon from '@mui/icons-material/RadioButtonChecked';
import UserCreateSkelton from "../UserCreationSkeleton";
import { useDispatch } from "react-redux";
import { setUpdateRow, updateMyActionBadge } from "../../../redux/reducers/gridupdate.reducer";
import { t } from "i18next";
import { useTranslation } from "react-i18next";
import TabContext from "@mui/lab/TabContext/TabContext";
import TabList from "@mui/lab/TabList/TabList";
import TabPanel from "@mui/lab/TabPanel/TabPanel";
import SuccessBox from "../../correspondence/browse-components/success-box";

export const UserCreation = (props: any) => {
    const dispatch = useDispatch();
    const { t, i18n } = useTranslation();
    const confirm = useConfirm();
    const { rowData, activeAction } = useContext(fullViewRowDataContext);
    const { gridActionChangeEvent } = useContext(DataGridActionContext);
    const { onCloseDialog, popupConfiguration } = props;
    const [selectedFile, setSelectedFile] = useState<any>({
        file: '',
        readerResult: '',
        fileName: '',
        default: UserDefaultImage,
        errorVal: false,
        previewIcon: false
    });
    const [selectedColumnFile, setSelectedColumnFile] = useState<any>({
        file: '',
        readerResult: '',
        url: '',
        default: emiratesId,
        name: '',
        fileName: '',
        fileExtension: '',
        errorVal: false
    });
    const [selectedPdfColumnFile, setSelectedPdfColumnFile] = useState<any>({
        file: '',
        url: UserDefaultImage,
        name: '',
        fileName: '',
        fileExtension: '',
        errorVal: false
    });
    const [today, setToday] = useState<Date>(new Date());
    const lang = CultureId();
    const userData = localStore.getLoggedInfo();
    const userID = userData && JSON.parse(userData).USER_ID;
    const [dropdownData, setDropdownData] = useState<any>();
    const [tableData, setTableData] = useState<any>();
    const [readUserId, setReadUser] = useState<any>();
    const [activeRoles, setActiveRoles] = useState<any>();
    const [sourceSystem, setSourceSystem] = useState<any>();
    const [sourceSystemName, setSourceSystemName] = useState<any>();
    const [showInputSection, setShowInputSection] = useState(true);
    const [toggleUserCreation, setToggleUserCreation] = useState(false);
    const [toggleUserName, setToggleUserName] = useState(false);
    const [tradeLicense, setTradeLicence] = useState<any>();
    const [masterId, setMasterId] = useState<any>();
    const [saveResponse, setSaveResponse] = useState(false);
    const [actionbtns, setactionbtns] = useState<any>(
        // [{
        //     buttonName: "Approve",
        //     value: 30101
        // },
        // {
        //     buttonName: "Reject",
        //     value: 30102
        // },
        // ]
    );
    const [selectedAction, setSelectedAction] = useState<any>();
    const { activeDetails } = useSelector(
        (state: any) => state.menus.activeDetails
    );
    const [pageState, setPageState] = useState({
        isNew: false,
        isView: false,
        isEdit: false,
        isChangeStatus: false
    });

    const [previewParam, setPreviewParam] = useState({
        popupOpenState: false,
        previewPath: ''
    });

    const [refUser, setRefUser] = useState<any>();
    const [mailSuccess, setMailSuccess] = useState<any>();
    const [showUserIdDropDown, setshowUserIdDropDown] = useState<any>(false);
    const [editPasswordHide, setEditPasswordHide] = useState<any>(true);
    const [checkBoxError, setcheckBoxError] = useState<any>(false);
    const [dropdownUserData, setDropdownUserData] = useState<any>();
    const [passwordConfig, setPasswordConfig] = useState<any>();
    const [validateBtton, setValidateBtn] = useState<boolean>(false);
    const [UserNameAndEmail, setUserNameEmail] = useState<boolean>(true);
    const [browseLoader, setBrowseLoader] = useState(false);
    const [validations, setValidations] = useState({
        length: false,
        digits: false,
        specialChars: false,
        upperLowercase: false,
        history: false,
        autoExpiry: false,
    });

    /* Find Current Page */
    useEffect(() => {
        let MenuIDVal = false;
        switch (popupConfiguration.action.MenuId) {
            case MenuId.New:
                setPageState(prevState => ({ ...prevState, isNew: true }));
                MenuIDVal = true;
                break;
            case MenuId.View:
                setPageState(prevState => ({ ...prevState, isView: true }));
                break;
            case MenuId.Edit:
                setPageState(prevState => ({ ...prevState, isEdit: true }));
                break;
            case MenuId.ChangeStatus:
                setPageState(prevState => ({ ...prevState, isChangeStatus: true }));
                break;
            default:
                setPageState({
                    isNew: false,
                    isView: false,
                    isEdit: false,
                    isChangeStatus: false
                });
        }
        fetchInitailData(MenuIDVal);
        handleButtonList();
    }, [])


    const fetchInitailData = async (MenuVal: any) => {
        const transId = rowData ? rowData?.ID_ : -1
        const param = {
            TransId: transId,
            UserId: userID,
            CultureId: lang,
            RefUserId: -1
        }
        const params = {
            Id: 323,
            CultureId: lang
        }
        // const roleParam = {
        //     TransId: transId,
        //     CultureId: lang,
        //     RefUserId: ((activeDetails[0]?.Master.MASTER_ID === 2026) && MenuVal) ? userID : -1
        // }
        const passwordConfigParam = {
            Procedure: "APP_MASTER.APPLICATION_PASSWORD_SETTING_SPR",
            UserId: userID,
            CultureId: lang,
            Criteria: []
        }

        try {
            setBrowseLoader(true)
            const [readUser, passConfig, getTitle] = await axios.all([
                ApiService.httpPost('Trans/readUser', param),
                // ApiService.httpPost('Trans/readUserRoles', roleParam),
                ApiService.httpPost('data/getTable', passwordConfigParam),
                ApiService.httpPost(`${API.getEnums}`, params),


            ]);

            setDropdownData(formatOptionsArray(getTitle.Data, 'ENUM_NAME', 'ENUM_ID'));
            const roleParam = {
                TransId: transId,
                CultureId: lang,
                RefUserId: ((activeDetails[0]?.Master.MASTER_ID === 2026) && MenuVal) ? userID : -1
            }
            if ((activeDetails[0]?.Master.MASTER_ID === 2025) || (rowData?.ACTION_TYPE_ID_ === 32601)) {
                const readRoles = await ApiService.httpPost('Trans/readUserRoles', roleParam);
                setTableData(readRoles.Data);
            }
            console.log(readUser.Data.REF_USER_ID)

            if (rowData?.ACTION_TYPE_ID_ === 32601) {
                const activeRolesParam = {
                    Procedure: "FRM_MOB.USER_ROLE_INFO_SPR",
                    UserId: readUser.Data.REF_USER_ID,
                    CultureId: lang,
                }
                const getActiveRoles = await ApiService.httpPost('data/getTable', activeRolesParam);
                setActiveRoles(getActiveRoles.Data)
            }
            //setTableData(readRoles.Data);
            setReadUser(readUser.Data);
            setSourceSystem((readUser.Data && readUser.Data.SOURCE_SYSTEM_ID) || null)
            setSourceSystemName((readUser.Data && readUser.Data.SOURCE_SYSTEM_NAME) || null)
            setTradeLicence(readUser.Data.TRADE_LICENSE_NO)
            if ((readUser.Data.SOURCE_SYSTEM_ID > 0) && (popupConfiguration.action.MenuId === MenuId.New)) {
                setToggleUserCreation(true)
            } else {
                setToggleUserCreation(false)
            }
            setPasswordConfig(passConfig.Data[0]);
            if (popupConfiguration.action.MenuId !== MenuId.New) {
                patchValue(readUser.Data)
                // handleModifyEdit(readUser.Data)
                setEditPasswordHide(false)
            } else {
                setBrowseLoader(false)
            }

            if (((activeDetails[0]?.Master.MASTER_ID === 2026) && (popupConfiguration.action.MenuId === MenuId.Edit)) || ((activeDetails[0]?.Master.MASTER_ID === 2026) && (popupConfiguration.action.MenuId === MenuId.View))) {

                handleModifyEdit(readUser.Data)
            } else {
                setBrowseLoader(false)
            }


        } catch (error) {
            console.error(error);
            setBrowseLoader(false)
        }
    }
    /* Set Current Master Id */
    useEffect(() => {
        setMasterId(activeDetails[0]?.Master.MASTER_ID);
        if ((activeDetails[0]?.Master.MASTER_ID === 2026) || (activeDetails[0]?.Master.MASTER_ID === 2027)) {
            setToggleUserCreation(false)
            setshowUserIdDropDown(true);
            setEditPasswordHide(false);
            userListDropdown();
        }
        if ((activeDetails[0]?.Master.MASTER_ID === 2025) && (pageState.isNew)) {
            setUserNameEmail(false)
        } else {
            setUserNameEmail(true)
        }

    }, [activeDetails, readUserId]);

    let validationSchema = yup.object().shape({
        TitleId: yup.string().required(),
        UserFullNameAr: yup.string().required(),
        UserFullNameEn: yup.string().required(),
        UserName: yup.string().notRequired(),
        EmailId: yup.string().email("Invalid Format").required(),
        MobileNo: yup.string().required(),
        Remarks: yup.string().when('action', {
            is: 30102,
            then: yup.string().required('Remarks are required when rejecting.'),
            otherwise: yup.string().notRequired(),
        }),
       /*  EidNo: yup.string().required().test('eid-checksum', '', function (eid) {
            if (!eid) {
                return true; // allow empty values
            }
            return validateEidCheckSum(eid);
        }),
        EidExpiryDate: yup.string().nullable().required().test('is-future-date', 'Expiration date should be in the future', function (value) {
            if (!value || 30102) {
                return true; // Allow empty values (nullable)
            }
            const currentDate = new Date();
            const selectedDate = new Date(value);
            currentDate.setHours(0, 0, 0, 0);
            selectedDate.setHours(0, 0, 0, 0);

            return selectedDate >= currentDate;
        }), */
        SystemUserName: yup.string()
    });

    if (editPasswordHide) {
        validationSchema = validationSchema.concat(
            yup.object().shape({
                password: yup.string()
                    .required("Password is required")
                    .min(passwordConfig?.MIN_PWD_LENGTH, `Password must be at least ${passwordConfig?.MIN_PWD_LENGTH} characters`)
                    .matches(new RegExp(`^(?=.*\\d.*\\d).+$`), `Password must contain at least ${passwordConfig?.MIN_PWD_DIGITS} digits spread across the password`),
                UserPassword: yup.string()
                    .oneOf([yup.ref('password')], 'Passwords must match')
                    .required("Confirm Password is required")
            })
        );
    }

    console.log(rowData?.ACTION_TYPE_ID_ === 32601)

    const {
        control,
        handleSubmit,
        formState: { errors },
        reset,
        setValue,
        trigger,
        setError,
        clearErrors,
        getValues,
        watch
    } = useForm<any>({
        resolver: yupResolver(validationSchema),
        defaultValues: {
            UserFullNameAr: "",
            UserFullNameEn: "",
            UserName: "",
            UserPassword: "",
            EidExpiryDate: "",
            EmailId: "",
            EidNo: "",
            password: "",
            Remarks: "",
            OfficeNo: "",
            MobileNo: "",
            EmplPosition: "",
            TitleId: "",
            EmployeeImg: false,
            EmiratedIDImage: false,
            action: ''
        },
    });

    const [isValidationComplete, setIsValidationComplete] = useState(false);

    const validateRemarks = async (btnValue: any) => {
        if (btnValue === 30102) {
            validationSchema = validationSchema.concat(
                yup.object().shape({
                    Remarks: yup
                        .string()
                        .required('Remarks are required')
                        .test('touch-remark', 'Touching Remark Field', (value: any) => {
                            const modifiedValue = value.toUpperCase();
                            return modifiedValue;
                        }),
                })
            );
        }
        setIsValidationComplete(true);
    };

    const userListDropdown = async () => {
        const param = {
            Procedure: Procedures.FRM_TRANS.USER_LOOKUP_SPR,
            UserId: userID,
            CultureId: lang,
            Criteria: [
                {
                    Name: ParamVars.ID,
                    Value: readUserId && readUserId.FRANCHISE_ID,
                    IsArray: false
                }
            ]
        }
        if (readUserId) {
            const response = await ApiService.httpPost(`data/getTable`, param);
            setDropdownUserData(formatOptionsArray(response.Data, 'USER_FULL_NAME', 'USER_ID'));
        }
    }

    const [modifyUserRoles, setModifyUserRoles] = useState<any>(((activeDetails[0]?.Master.MASTER_ID === 2026) && (pageState.isEdit)) ? true : false);


    /* User dropdown change */
    const handleModifyEdit = async (Data: any) => {

        try {
            const roleParam = {
                TransId: Data.TRANS_ID,
                CultureId: lang,
                RefUserId: -1
            }
            const readRoles = await ApiService.httpPost('Trans/readUserRoles', roleParam);

            setTableData(readRoles.Data);

        } catch (error) {

        } finally {

        }

    }
    const [modifytrial, setTrial] = useState<any>((activeDetails[0]?.Master.MASTER_ID === 2026) ? false : true);

    /* User dropdown change */
    const handleUserDropdown = async (event: any) => {
        console.log(event)
        setBrowseLoader(true)

        const transId = rowData ? rowData?.ID_ : -1
        const param = {
            TransId: transId,
            UserId: userID,
            CultureId: lang,
            RefUserId: event
        }
        try {
            const getUserDropDownData = await ApiService.httpPost('Trans/readUser', param);
            setRefUser(getUserDropDownData.Data)
            if (getUserDropDownData.Valid < 0) {
                toast.error(`${t("No Data Found")}`);
                patchValue([])
                setTrial(false)
                setSelectedColumnFile({
                    file: '',
                    readerResult: '',
                    url: '',
                    default: emiratesId,
                    name: '',
                    fileName: '',
                    fileExtension: '',
                    errorVal: false
                })
            } else {
                const roleParam = {
                    TransId: transId,
                    CultureId: lang,
                    RefUserId: getUserDropDownData.Data.REF_USER_ID
                }
                const readRoles = await ApiService.httpPost('Trans/readUserRoles', roleParam);
                patchValue(getUserDropDownData?.Data)
                setTableData(readRoles.Data);
                const activeRolesParam = {
                    Procedure: "FRM_MOB.USER_ROLE_INFO_SPR",
                    UserId: getUserDropDownData.Data.REF_USER_ID,
                    CultureId: lang,
                }
                const getActiveRoles = await ApiService.httpPost('data/getTable', activeRolesParam);
                console.log(getActiveRoles.Data)
                setActiveRoles(getActiveRoles.Data)
                setTrial(true)
                setModifyUserRoles((activeDetails[0]?.Master.MASTER_ID === 2026) ? true : false);
            }
        } catch (error) {

        } finally {
            setTimeout(() => {
                setBrowseLoader(false)
            }, 2500);

        }

    }

    /* User get ButtonsList */
    const handleButtonList = async () => {
        const transId = rowData ? rowData?.ID_ : -1
        const param = {
            TransId: transId,
            UserId: userID,
            CultureId: lang,
        }
        const getUserDropDownData = await ApiService.httpPost('trans/readUserCreationActions', param);
        setactionbtns(getUserDropDownData.Data)

    }

    const patchValue = async (Data: any) => {
        console.log(Data)
        const editResponse = {
            User: Data?.UP_USER_ID,
            UserFullNameAr: Data?.USER_FULL_NAME_AR || Data?.UserFullNameAR,
            UserFullNameEn: Data?.USER_FULL_NAME_EN || Data?.UserFullNameEN,
            EmplPosition: Data?.EMPL_POSITION,
            TitleId: Data?.TITLE_ID,
            UserName: Data?.USER_NAME || Data?.UserName,
            // password: Data.USER_PASSWORD,
            // UserPassword: Data.USER_PASSWORD,
            MobileNo: Data?.MOBILE_NO || Data?.MobileNo,
            OfficeNo: Data?.OFFICE_NO,
            EmailId: Data?.EMAIL_ID || Data?.MailID,
            // Remarks: Data?.REMARKS,
            EidNo: Data?.EID_NO,
            EidExpiryDate: Data?.EID_EXPIRY_DATE,
            SourceSystemName: sourceSystemName
        }
        setSelectedFile((previousValue: any) => ({
            ...previousValue,
            errorVal: false,
            readerResult: Data?.EMPL_IMAGE ? 'data:image/png;base64,' + Data?.EMPL_IMAGE : null,
            fileName: Data?.EMPL_IMAGE ? Data?.EMPL_IMAGE : '',
        }))
        setSelectedColumnFile((previousValue: any) => ({
            ...previousValue,
            fileName: Data?.EID_DOC_NAME,
            name: Data?.EID_DOC_NAME,
            fileExtension: Data?.EID_DOC_NAME?.split('.').slice(-1)[0]
        }))
        if (!((activeDetails[0]?.Master.MASTER_ID === 2025) && (pageState.isNew)) && Data?.EID_DOC_NAME) {
            const response = await ApiService.httpGetBlob(`file/downloadDoc?docpath=${Data?.EID_DOC_NAME}`);
            if (response) {
                blobToBase64(response)
                    .then(base64 => {
                        setSelectedColumnFile((previousValue: any) => ({ ...previousValue, url: base64 }))
                    })
                    .catch(error => {
                        console.log(error)
                    })
            }
        }

        reset(editResponse)
        setBrowseLoader(false)
    }

    const handleFileSelect = (file: any) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onloadend = (e) => {
            setSelectedFile({
                file: file,
                fileName: file.name,
                readerResult: reader.result,
                previewIcon: true
            });
        };
    };

    const handleFileDelete = (event: any) => {
        event && setSelectedFile({
            file: null,
            readerResult: null,
            default: UserDefaultImage
        });
    };

    const handleColumnFileSelect = (file: any) => {
        const docname = v4() + '.' + file?.name.split('.').pop();
        const fileName = file?.name.split('.');
        const extension = fileName?.length ? fileName[fileName.length - 1] : '';
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onloadend = (e) => {
            setSelectedColumnFile({
                file: file,
                fileName: file.name,
                url: reader.result,
                name: docname,
                fileExtension: extension
            })
        };
    };

    const handleColumnFileDelete = (event: any) => {
        event && setSelectedColumnFile({
            file: null,
            url: '',
            readerResult: UserDefaultImage
        });
    };

    const handleColumnPreview = async () => {
        setPreviewParam({
            popupOpenState: true,
            previewPath: selectedColumnFile.url
        })
    }

    const handlePreview = () => {
        setPreviewParam({
            popupOpenState: true,
            previewPath: selectedFile.readerResult
        })
    }

    const handleclosePreview = () => {
        setPreviewParam({
            popupOpenState: false,
            previewPath: ''
        })
    }

    const handleCloseDialog = () => {
        onCloseDialog(false);
        setcheckBoxError(false)
    };
    const [showDiv, setShowDiv] = useState(false);

    const handlePasswordChange = (event: any) => {
        const password = event;
        setShowDiv(password !== '');
        const digitRegex = /\d/g;
        const digitMatches = password.match(digitRegex);
        const hasValidDigits = digitMatches !== null && digitMatches.length >= 2;

        setValidations({
            length: password.length >= passwordConfig.MIN_PWD_LENGTH,
            digits: hasValidDigits,
            specialChars: password.match(/[-!$%^&*()_+|~=`{}\[\]:";'<>?,.@#\/]/),
            upperLowercase: passwordConfig.PWD_IS_UPPER_LOWER_CASE === 1
                ? password.match(/^(?=.*[a-z])(?=.*[A-Z])/)
                : true,
            history: passwordConfig.PASSWORD_HISTORY === 0,
            autoExpiry: passwordConfig.PASSWORD_AUTO_EXPIRY === 0,
        });
    };
    const [showEmailDiv, setShowEmailDiv] = useState(false);

    const handleEmailIdChange = (event: any) => {
        const emailUserName = event;
        setShowEmailDiv(emailUserName !== '');
        setTimeout(() => {
            setShowEmailDiv(false);
        }, 10000);
    }

    const validatePassword = async (password: string) => {
        try {
            await validationSchema.validate({ password });
            return true; // Password is valid
        } catch (error: any) {
            return false; // Password is invalid
        }
    };

    const handlePasswordBlur = async (event: any) => {
        const password = event.target.value;
        if (await validatePassword(password)) {
            setValidations({
                ...validations,
                length: true,
                digits: true,
                specialChars: true,
                upperLowercase: true,
            });
        } else {

        }
    };

    // console.log((rowData?.IS_EDIT_))
    // console.log((popupConfiguration?.action.MenuId === MenuId.Edit))
    const [hideEditSec, setHideEditsec] = useState<any>(false);

    // if ((popupConfiguration?.action.MenuId === MenuId.Edit) && (rowData?.IS_EDIT_ === 0)) {
    //     console.log("check check check")
    //     setHideEditsec(true)
    // }

    useEffect(() => {
        if ((popupConfiguration?.action.MenuId === MenuId.Edit) && (rowData?.IS_EDIT_ === 0)) {
            console.log("check check check")
            setHideEditsec(true)
        }
    }, []);


    /* On Submit */
    const onSubmit = (data: any, btnStatusID: any) => onSubmitUserCreate(data, btnStatusID);

    /* Test Log */
    const onError = (errors: any, e: any) => console.log(errors, e);

    /* Submit Save*/
    const onSubmitUserCreate = async (data: any, btnStatusID: any) => {
        console.log(btnStatusID)
        console.log(data)
        await validateRemarks(btnStatusID);
        setSelectedAction(btnStatusID);
        if (btnStatusID === 4) {
            const isValid = await trigger(['Remarks']);
            if (!isValid) {
                return; // Return early if validation fails
            }
        }

        // if (btnStatusID === 3) {
        //     const isValid = await trigger(['EidExpiryDate']);
        //     if (!isValid) {
        //         return; // Return early if validation fails
        //     }
        // }

        //const { EidExpiryDate } = getValues();
        // if (btnStatusID === 3) {
        //     setError('EidExpiryDate', { message: `${t('Expiry Data should be in future')}`, type: "required" })
        //     return;
        // } else {
        //     clearErrors('EidExpiryDate');
        // }

        
        /* if (!selectedFile.fileName || !selectedColumnFile.fileName) {
            if (!selectedFile.fileName) {
                setSelectedFile((prev: any) => ({
                    ...prev,
                    errorVal: true
                }));
            } else if (!selectedColumnFile.fileName) {
                setSelectedColumnFile({
                    errorVal: true
                });
            }
            return;
        } */

        if (!selectedFile.fileName) {
            setSelectedFile((prev: any) => ({
                ...prev,
                errorVal: true
            }));
            return;
        }

        if (!CheckBoxCheck() && ((activeDetails[0]?.Master.MASTER_ID !== 2027))) {
            return;
        }

        const { password, UserName, ...rest } = data;
        const json = {
            ...rest,
            TransId: rowData ? rowData?.ID_ : -1,
            UserId: userID,
            MasterId: masterId,
            Lines: CheckboxId().filter((id: any) => id !== null),
            RefUserId: (activeDetails[0]?.Master.MASTER_ID !== 2025) ? refUser?.REF_USER_ID : -1,
            FranchiseId: readUserId?.FRANCHISE_ID,
            StatusId: 1,
            EidDocName: selectedColumnFile.name,
            EidDocExtension: selectedColumnFile.fileExtension,
            ApplFormDocName: selectedPdfColumnFile.name,
            ApplFormDocExtension: selectedPdfColumnFile.fileExtension,
            SourceSystemId: systemID ? sourceSystem : null,
            CultureId: lang,
            UserName: !!data.UserName ? data.UserName : data.EmailId,
            // EmailId: UserNameAndEmail ? data.EmailId : data.UserNameAndEmail
            //UserName: data.UserName,
            //EmailId: data.EmailId
        }
        console.log(json)

        const changeStatusParams = {
            TransId: rowData ? rowData?.ID_ : -1,
            UserId: userID,
            StatusId: btnStatusID,
            Remarks: data.Remarks,
            CultureId: lang
        }

        const formData = new FormData();
        formData.append('json', JSON.stringify(json));
        formData.append('photo', selectedFile.file ? selectedFile.file : null);
        /* formData.append('file', selectedColumnFile.file ? selectedColumnFile.file : null); */

        const choice = await confirm({
            ui: 'confirmation',
            title: `${t('User Creation Requests')}`,
            description: `${t('Do you wish to save this Data?')}`,
            confirmBtnLabel: `${t('Save')}`,
            cancelBtnLabel: `${t('Cancel')}`,
        });
        if (choice) {
            let response;
            if (pageState?.isChangeStatus || rowData?.ACTION_TYPE_ID_ === 32601) {
                response = await ApiService.httpPost('trans/saveUserStatus', changeStatusParams);
            } else {
                response = await ApiService.httpPost('Trans/saveUser', formData);
            }
            if (response && response.Id > 0) {
                dispatch(setUpdateRow({ action: 'actionQueue', payload: { response, type: 'update' } }))
                dispatch(updateMyActionBadge({ action: 'badgeCount', payload: {} }))
                fullviewRowAddUpdate(response.Id);
                setMailSuccess(response?.Message);
                setSaveResponse(true)
                //toast.success(response.Message);
                setTimeout(() => {
                    setSaveResponse(false)
                    onCloseDialog(true)
                }, 2500);
                //onCloseDialog(true);
            } else {
                toast.error(response.Message);
                setSaveResponse(false)
            }
        }
    }

    const fullviewRowAddUpdate = (responseId: number) => {
        gridActionChangeEvent({ id: responseId, status: pageState.isNew ? fullGridDataAction.InsertRow : fullGridDataAction.UpdateRow });
    }

    const RoleCheckBoxChange = (event: any, item: any) => {
        const updatedTableData = tableData.map((data: any) => {
            if (data.ID_ === item.ID_) {
                return {
                    ...data,
                    IS_MARKED: event.target.checked ? 1 : 0,
                };
            }
            return data;
        });
        const checkBoxCheck = updatedTableData.some((data: any) => data.IS_MARKED === 1);
        if (checkBoxCheck) {
            checkBoxError && setcheckBoxError(false)
        }
        setTableData(updatedTableData);
    };

    const CheckboxId = () => {
        return tableData.map((data: any) => data.IS_MARKED === 1 ? data.ID_ : null)
    }

    // const CheckBoxCheck = () => {
    //     const checkBoxCheck = tableData.some((data: any) => data.IS_MARKED === 1);

    //     checkBoxCheck ? setcheckBoxError(false) : setcheckBoxError(true)
    //     return checkBoxCheck;
    // }

    const CheckBoxCheck = () => {
        const checkBoxCheck = tableData.some((data: any) => data.IS_MARKED === 1);
        const isActionType32601 = rowData?.ACTION_TYPE_ID_ === 32601;

        if (checkBoxCheck || isActionType32601) {
            setcheckBoxError(false);
        } else {
            setcheckBoxError(true);
        }

        return checkBoxCheck || isActionType32601;
    }


    const handleYesClick = () => {
        setShowInputSection(true);
    };

    const handleNoClick = () => {
        setToggleUserCreation(false);
    };

    const BackBtnClick = () => {
        setShowInputSection(false);
    };

    const [inputValue, setInputValue] = useState("");
    const [systemID, setSystem] = useState<any>(false);
    const [inputValidator, setInputValidator] = useState<any>(false);


    const handleValidateClick = async () => {

        if (inputValue === '') {
            setInputValidator(true)
        } else {
            setInputValidator(false)
        }

        const param = {
            systemId: sourceSystem,
            Data: {
                TradeLicenseNo: tradeLicense,
                CultureId: lang,
                UserName: inputValue
            }
        }
        const getSourceSystemUserInfo = await ApiService.httpPost('sourceSystem/getUserInfo', param);
        if (getSourceSystemUserInfo.Valid > 0) {
            setSystem(true)
            setUserNameEmail(true)
            toast.success(getSourceSystemUserInfo?.ResponseMessage, { autoClose: 3000 });
            patchValue(getSourceSystemUserInfo.Data[0])
            setEditPasswordHide(false)
            setToggleUserCreation(false)
            setToggleUserName(true)
        } else {
            toast.error(getSourceSystemUserInfo?.ResponseMessage, { autoClose: 3000 });
        }
    }

    const [tabValue, setTabValue] = useState('1');

    const handleChangeTab = (event: React.SyntheticEvent, newValue: string) => {
        setTabValue(newValue);
    };

    const hideLoaderBox = () => {
        setSaveResponse(false);
        onCloseDialog(true)
    }


    return (
        <>
            <DialogTitle sx={{ m: 0, p: 2 }} className="dialog_title_wrapper">
                <div className="title-wraap">
                    <p className="dialog_title">
                        <PixOutlinedIcon className="head-icon" />
                        <span className="mx-2">
                            {popupConfiguration && popupConfiguration.DialogHeading}
                        </span>
                    </p>
                    <div className="user-deatils">
                        <div className="transation-id-no"> 
                            {rowData ?
                                <> - {rowData?.ID_}</>
                                : ''}
                        </div>
                        <div className="transation-id">
                            <div className="try"><FcCalendar /></div> {today.toLocaleDateString("en-GB", { day: "2-digit", month: "2-digit", year: "numeric" }).replace(/\//g, '-')}
                        </div>
                        <div className="transation-id" title={readUserId && readUserId.FRANCHISE_NAME}>
                            <div className="try"> <FcLibrary /> </div> <div className="elip-class">{readUserId && readUserId.FRANCHISE_NAME}</div>
                        </div>
                    </div>
                </div>
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
            {!browseLoader ? <DialogContent dividers className={`px-3 ${(activeDetails[0]?.Master.MASTER_ID === 2026) || (activeDetails[0]?.Master.MASTER_ID === 2027) || pageState.isEdit || pageState.isView || pageState.isChangeStatus ? "disabled-view" : ""}`}>

                {toggleUserCreation && 
                    <div className="outer-box-ss position-relative">
                        {!showInputSection && 
                            <div className="ss-text">
                                {t("Do you wish to sync the data from source system -")} {sourceSystemName}?
                            </div>
                        }
                        {showInputSection && <>
                            <div className="arrow-style">
                                <img src={PrevArrowBtn} alt="" onClick={BackBtnClick} />
                            </div>
                            <div className="ss-text">
                                {t("Enter User Name to validate from source system - ")}{sourceSystemName}
                            </div></>
                        }
                        <div className="ss-select-box">
                            {!showInputSection && 
                                <div className="ss-btn-wrap">
                                    <div className="yes-btn">
                                        <Button
                                            type="submit"
                                            variant="contained"
                                            className="colored-btn"
                                            onClick={handleYesClick}>
                                            {t("Yes")}
                                        </Button>
                                    </div>
                                    <div className="class"> <Button autoFocus onClick={handleNoClick}>{t("No")}</Button></div>
                                </div>
                            }

                            {showInputSection && <div className="validate-section"> 
                                <input
                                    type="text"
                                    placeholder={t("User Name") ?? "User Name"}
                                    value={inputValue}
                                    className={`${inputValidator ? 'error-input' : ''}`}
                                    onChange={(e) => setInputValue(e.target.value)}
                                />
                                <Button
                                    type="submit"
                                    variant="contained"
                                    className="colored-btn"
                                    onClick={handleValidateClick}>
                                    {t("Validate")}
                                </Button>
                            </div>}
                        </div>
                    </div>
                }

                {hideEditSec && (<div className="outer-box-ss">
                    <div className="ss-text">
                        {t("Transaction not in editable stage")}
                    </div>
                </div>)}

                {!toggleUserCreation && !hideEditSec && (<div className="wrapping-up">
                    <Row className="no-gutters">
                        <Col md={9} className="p-0">
                            <Row className="no-gutters">
                                <Row>
                                    {showUserIdDropDown && <Col md={6} className="mb-3">
                                        <FormInputSelect
                                            name="User"
                                            control={control}
                                            label={t("User")}
                                            options={dropdownUserData}
                                            errors={errors}
                                            onChange={handleUserDropdown}
                                            hideError={true}
                                        />
                                    </Col>}
                                </Row>
                                <Col md={2} className="mb-2">
                                    <FormInputSelect
                                        name="TitleId"
                                        control={control}
                                        label={t("Title")}
                                        options={dropdownData}
                                        errors={errors}
                                        hideError={true}
                                        disabled={(activeDetails[0]?.Master.MASTER_ID === 2026) || (activeDetails[0]?.Master.MASTER_ID === 2027) || pageState.isEdit || pageState.isView || pageState.isChangeStatus || rowData?.ACTION_TYPE_ID_ === 32601}
                                        readOnly={(activeDetails[0]?.Master.MASTER_ID === 2026) || (activeDetails[0]?.Master.MASTER_ID === 2027) || pageState.isEdit || pageState.isView || pageState.isChangeStatus || rowData?.ACTION_TYPE_ID_ === 32601}
                                    />
                                </Col>
                                <Col md={5} className="mb-3 direct">
                                    <FormInputText
                                        name="UserFullNameAr"
                                        control={control}
                                        label={t("User Full Name (Arabic)")}
                                        errors={errors}
                                        hideError={true}
                                        disabled={(activeDetails[0]?.Master.MASTER_ID === 2026) || (activeDetails[0]?.Master.MASTER_ID === 2027) || pageState.isEdit || pageState.isView || pageState.isChangeStatus || rowData?.ACTION_TYPE_ID_ === 32601}
                                        readOnly={(activeDetails[0]?.Master.MASTER_ID === 2026) || (activeDetails[0]?.Master.MASTER_ID === 2027) || pageState.isEdit || pageState.isView || pageState.isChangeStatus || rowData?.ACTION_TYPE_ID_ === 32601}
                                    />
                                </Col>
                                <Col md={5} className="mb-3">
                                    <FormInputText
                                        name="UserFullNameEn"
                                        control={control}
                                        label={t("User Full Name (English)")}
                                        errors={errors}
                                        hideError={true} 
                                        disabled={(activeDetails[0]?.Master.MASTER_ID === 2026) || (activeDetails[0]?.Master.MASTER_ID === 2027) || pageState.isEdit || pageState.isView || pageState.isChangeStatus || rowData?.ACTION_TYPE_ID_ === 32601}
                                        readOnly={(activeDetails[0]?.Master.MASTER_ID === 2026) || (activeDetails[0]?.Master.MASTER_ID === 2027) || pageState.isEdit || pageState.isView || pageState.isChangeStatus || rowData?.ACTION_TYPE_ID_ === 32601}
                                    />
                                </Col>
                                {/* {(!pageState.isNew)} */}
                                {!UserNameAndEmail && <Col md={4} className="mb-3 setUserNameTag">
                                    <FormInputText
                                        name="EmailId"
                                        control={control}
                                        label={t("Email ID")}
                                        errors={errors}
                                        hideError={true} 
                                        noInputId={true}
                                        onChange={handleEmailIdChange}
                                    />
                                    {showEmailDiv && <div className="emailUserName">
                                        <p>Email ID will be set as User Name</p>
                                    </div>}
                                </Col>}
                                {(UserNameAndEmail) && <Col md={4} className="mb-3">
                                    <FormInputText
                                        name="UserName"
                                        control={control}
                                        label={t("User Name")}
                                        errors={errors}
                                        hideError={true}
                                        noInputId={false}
                                        disabled={(activeDetails[0]?.Master.MASTER_ID === 2026) || (activeDetails[0]?.Master.MASTER_ID === 2027) || pageState.isEdit || pageState.isView || pageState.isChangeStatus || rowData?.ACTION_TYPE_ID_ === 32601 || toggleUserName}
                                        readOnly={(activeDetails[0]?.Master.MASTER_ID === 2026) || (activeDetails[0]?.Master.MASTER_ID === 2027) || pageState.isEdit || pageState.isView || pageState.isChangeStatus || rowData?.ACTION_TYPE_ID_ === 32601 || toggleUserName}
                                    />
                                </Col>}
                                {editPasswordHide && <Col md={4} className="mb-3 pass-policy">
                                    <FormInputPassword
                                        name="password"
                                        control={control}
                                        label={t("Password")}
                                        endAdornment={true}
                                        endAdornmentPosition="end"
                                        muiIcon="RemoveRedEyeOutlined"
                                        errors={errors}
                                        password={true}
                                        type="password"
                                        hideError={true}
                                        onChange={handlePasswordChange}
                                        onBlur={handlePasswordBlur}
                                    />

                                    {showDiv && <div className="div-pass-policy" style={{ display: validations?.length && validations?.digits && validations?.specialChars && validations?.upperLowercase ? "none" : "block" }}>
                                        <p className="password-heading">
                                            {t("Password Policy")}
                                        </p>

                                        <div className="each-policy">
                                            {
                                                validations?.length ? <><DoneIcon className="done-icon" /></> : <><CloseIcon className="close-icon" /></>

                                            }
                                            <p style={{ color: validations.length ? "green" : "red" }}>
                                                {t("Password must have at least")} {passwordConfig?.MIN_PWD_LENGTH} {t("characters")}
                                            </p></div>
                                        <div className="each-policy">
                                            {
                                                validations?.digits ? <><DoneIcon className="done-icon" /></> : <><CloseIcon className="close-icon" /></>

                                            }
                                            <p style={{ color: validations.digits ? "green" : "red" }}>
                                                {t("Password must have at least")} {passwordConfig?.MIN_PWD_DIGITS} {t("digits")}
                                            </p> </div>
                                        <div className="each-policy">
                                            {
                                                validations?.specialChars ? <><DoneIcon className="done-icon" /></> : <><CloseIcon className="close-icon" /></>

                                            }
                                            <p style={{ color: validations.specialChars ? "green" : "red" }}>
                                                {t("Password must have at least")} {passwordConfig?.MIN_SPECIAL_CHARS} {t("special characters")}
                                            </p> </div>
                                        <div className="each-policy">
                                            {
                                                validations?.upperLowercase ? <><DoneIcon className="done-icon" /></> : <><CloseIcon className="close-icon" /></>

                                            }
                                            <p style={{ color: validations.upperLowercase ? "green" : "red" }}>
                                                {t("Password must have at least")} {passwordConfig?.PWD_IS_UPPER_LOWER_CASE} {t("characters")}
                                            </p> </div>
                                        <div className="each-policy">
                                            {
                                                <RadioButtonCheckedIcon className="expiry-radio-btn" />

                                            }
                                            <p>
                                                {t("Password expires every")} {passwordConfig?.PASSWORD_AUTO_EXPIRY} {t("Days")}
                                            </p> </div>
                                    </div>}

                                </Col>}
                                {editPasswordHide && <Col md={4} className="mb-3">
                                    <FormInputPassword
                                        name="UserPassword"
                                        control={control}
                                        label={t("Confirm Password")}
                                        endAdornment={true}
                                        endAdornmentPosition="end"
                                        muiIcon="RemoveRedEyeOutlined"
                                        errors={errors}
                                        hideError={true}
                                        password={true}
                                        type="password"
                                    />
                                </Col>}

                                <Col md={4} className="mb-3">
                                    <FormInputText
                                        name="EmplPosition"
                                        control={control}
                                        label={t("Employee Position")}
                                        errors={errors}
                                        hideError={true}
                                        disabled={(activeDetails[0]?.Master.MASTER_ID === 2027) || pageState.isView || pageState.isChangeStatus || rowData?.ACTION_TYPE_ID_ === 32601}
                                        readOnly={(activeDetails[0]?.Master.MASTER_ID === 2027) || pageState.isView || pageState.isChangeStatus || rowData?.ACTION_TYPE_ID_ === 32601}
                                    />
                                </Col>
                                <Col md={4} className="mb-3">
                                    <FormInputPhone
                                        name="MobileNo"
                                        control={control}
                                        label={t("Mobile No.")}
                                        errors={errors}
                                        mask="(999) 999-9999" 
                                        disabled={(activeDetails[0]?.Master.MASTER_ID === 2027) || pageState.isView || pageState.isChangeStatus || rowData?.ACTION_TYPE_ID_ === 32601}
                                        readOnly={(activeDetails[0]?.Master.MASTER_ID === 2027) || pageState.isView || pageState.isChangeStatus || rowData?.ACTION_TYPE_ID_ === 32601}
                                        hideError={true}
                                    />
                                </Col>
                                <Col md={4} className="mb-3">
                                    <FormInputPhone
                                        name="OfficeNo"
                                        control={control}
                                        label={t("Office No.")}
                                        errors={errors}
                                        mask="(99) 999-9999"
                                        disabled={(activeDetails[0]?.Master.MASTER_ID === 2026) || (activeDetails[0]?.Master.MASTER_ID === 2027) || pageState.isEdit || pageState.isView || pageState.isChangeStatus || rowData?.ACTION_TYPE_ID_ === 32601}
                                        readOnly={(activeDetails[0]?.Master.MASTER_ID === 2026) || (activeDetails[0]?.Master.MASTER_ID === 2027) || pageState.isEdit || pageState.isView || pageState.isChangeStatus || rowData?.ACTION_TYPE_ID_ === 32601}
                                        hideError={true}
                                    />
                                </Col>
                                {(UserNameAndEmail) && <Col md={4} className="mb-3">
                                    <FormInputText
                                        name="EmailId"
                                        control={control}
                                        label={t("Email ID")}
                                        errors={errors}
                                        hideError={true}
                                        disabled={(activeDetails[0]?.Master.MASTER_ID === 2026) || (activeDetails[0]?.Master.MASTER_ID === 2027) || pageState.isEdit || pageState.isView || pageState.isChangeStatus || rowData?.ACTION_TYPE_ID_ === 32601}
                                        readOnly={(activeDetails[0]?.Master.MASTER_ID === 2026) || (activeDetails[0]?.Master.MASTER_ID === 2027) || pageState.isEdit || pageState.isView || pageState.isChangeStatus || rowData?.ACTION_TYPE_ID_ === 32601}
                                    />
                                </Col>}
                                {toggleUserName && <Col md={4} className="mb-3">
                                    <FormInputText
                                        name="SourceSystemName"
                                        control={control}
                                        label={t("Source System Name")}
                                        errors={errors}
                                        hideError={true} 
                                        disabled={(activeDetails[0]?.Master.MASTER_ID === 2026) || (activeDetails[0]?.Master.MASTER_ID === 2027) || pageState.isEdit || pageState.isView || pageState.isChangeStatus || rowData?.ACTION_TYPE_ID_ === 32601 || !toggleUserCreation}
                                        readOnly={(activeDetails[0]?.Master.MASTER_ID === 2026) || (activeDetails[0]?.Master.MASTER_ID === 2027) || pageState.isEdit || pageState.isView || pageState.isChangeStatus || rowData?.ACTION_TYPE_ID_ === 32601 || !toggleUserCreation}
                                    />
                                </Col>}
                                <Col md={(activeDetails[0]?.Master.MASTER_ID === 2026) || (activeDetails[0]?.Master.MASTER_ID === 2027) ? 12 : 8} className="mb-3">
                                    <FormInputText
                                        name="Remarks"
                                        control={control}
                                        label={t("Status Remarks")}
                                        errors={errors}
                                        hideError={true} 
                                        multiline={true}
                                    />
                                </Col>
                            </Row>
                        </Col>
                        <Col md={3} className="p-0">
                            <Row className="no-gutters">
                                <Col md={12}>
                                    <div className="upload-info">
                                        <div className="container-upload">
                                            <div className="avatar-uploads">
                                                {/* <div className={`avatar-preview ${selectedFile.errorVal ? "errorVal-border" : ""}`}> */}
                                                <div className={`avatar-preview ${selectedFile.errorVal ? 'errorVal-border' : ''}`}>
                                                    <div id="imagePreview" style={{ backgroundImage: `url(${selectedFile.readerResult ? selectedFile.readerResult : selectedFile.default})` }}></div>
                                                    {/* <RemoveRedEyeOutlinedIcon onClick={handlePreview} /> */}
                                                    {selectedFile.readerResult && (
                                                        <img src={Eye} alt="" onClick={handlePreview} />
                                                    )}
                                                </div>

                                            </div>
                                            {(readUserId?.IS_SUBMITTED !== 1) && <PreviewUpload onFileSelect={handleFileSelect} onFileDelete={handleFileDelete} fileExists={selectedFile.file} />}
                                        </div>
                                    </div>
                                </Col>
                            </Row>
                        </Col>
                    </Row >

                    <Row className="no-gutters input-wrapper">
                        <div className="border-sec">{t("Emirates ID")}</div>
                        <Row className="border-body no-gutters">
                            <Col md={4} className="mb-3 mt-3">
                                <FormInputPhone
                                    name="EidNo"
                                    control={control}
                                    label={t("Emirates ID Number")}
                                    errors={errors}
                                    mask="999-9999-9999999-9"
                                    disabled={(activeDetails[0]?.Master.MASTER_ID === 2027) || pageState.isView || pageState.isChangeStatus || rowData?.ACTION_TYPE_ID_ === 32601}
                                    readOnly={(activeDetails[0]?.Master.MASTER_ID === 2027) || pageState.isView || pageState.isChangeStatus || rowData?.ACTION_TYPE_ID_ === 32601}
                                    hideError={true}
                                />
                            </Col>
                            <Col md={4} className="mb-3 mt-3">
                                <FormInputDate
                                    name="EidExpiryDate"
                                    control={control}
                                    label={t("Expiry Date")}
                                    errors={errors}
                                    inputFormat="DD/MM/YYYY"
                                    minDate={new Date()}
                                    hideError={true} 
                                    disabled={(activeDetails[0]?.Master.MASTER_ID === 2027) || pageState.isView || pageState.isChangeStatus || rowData?.ACTION_TYPE_ID_ === 32601}
                                />
                            </Col>
                            <Col md={4} className="mb-3 mt-3">
                                <div className={`emirates-id-upload ${selectedColumnFile.errorVal ? 'errorVal-border' : ''}`}>
                                    <div className="eidimagePreview" id="imagePreview" style={{ backgroundImage: `url(${selectedColumnFile.url ? selectedColumnFile.url : selectedColumnFile.default})` }}></div>
                                    <div className="eid-name"> {selectedColumnFile.fileName ? selectedColumnFile.fileName : `${t('Emirates ID')}`}</div>
                                    <div className="d-flex align-items-centre justify-content-between">

                                        {(activeDetails[0]?.Master.MASTER_ID === 2027) || rowData?.ACTION_TYPE_ID_ === 32601 || pageState.isView || pageState.isChangeStatus || pageState.isEdit || selectedColumnFile.url && <DeleteOutlineOutlinedIcon onClick={handleColumnFileDelete} />}
                                        <PreviewColumnUpload onFileSelect={handleColumnFileSelect} columnFileExists={selectedColumnFile.url} />
                                        {selectedColumnFile.fileName && <RemoveRedEyeOutlinedIcon onClick={handleColumnPreview} />}
                                    </div>
                                </div>
                            </Col>
                        </Row>
                    </Row>
                    {modifytrial && <TabContext value={tabValue}>
                        <Box sx={{ borderBottom: 1, borderColor: 'divider', width: '100%' }}>
                            <TabList onChange={handleChangeTab} className="add" aria-label="lab API tabs example">
                                <Tab label={t("User Roles")} value="1" />
                                {((activeDetails[0]?.Master.MASTER_ID === 2026) || (rowData?.MASTER_ID !== 2027)) && <Tab label={t("Active Roles")} value="2" />}
                            </TabList>
                        </Box>
                        <TabPanel value="1" className="pt-1 p-2">
                            {rowData?.MASTER_ID !== 2027 && (
                                ((modifyUserRoles) || !(activeDetails[0]?.Master.MASTER_ID === 2027)) && (
                                    <div className="table-wrapper pt-2">
                                        <div className={`table-outer user-creation ${checkBoxError ? "errorVal-border" : ""}`}>
                                            <div className="table-header">
                                                <div className="element">#</div>
                                                <div className="element">{t("Roles")}</div>
                                                <div className="element">{t("Select")}</div>
                                            </div>
                                            {tableData?.length && tableData.map((item: any, index: any) => (
                                                <div className="table-body" key={index}>
                                                    <div className="element">{index + 1}</div>
                                                    <div className="element">{item.ROLE_NAME}</div>
                                                    <div className="element">
                                                        <Checkbox checked={item.IS_MARKED} disabled={(activeDetails[0]?.Master.MASTER_ID === 2027) || pageState.isView || pageState.isChangeStatus || rowData?.ACTION_TYPE_ID_ === 32601} onChange={(event: any) => RoleCheckBoxChange(event, item)} />
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                ))}
                        </TabPanel>
                        {activeRoles?.length > 0 ?
                            <TabPanel value="2" className="pt-1 p-2">
                                {((activeDetails[0]?.Master.MASTER_ID === 2026) || (rowData?.ACTION_TYPE_ID_ === 32601)) && <>
                                    <div className="table-wrapper pt-2">
                                        <div className={`table-outer user-creation ${checkBoxError ? "errorVal-border" : ""}`}>
                                            <div className="table-header">
                                                <div className="element">#</div>
                                                <div className="element w-100">{t("User Roles")}</div>
                                                {/* <div className="element">{t("Select")}</div> */}
                                            </div>
                                            {activeRoles?.length && activeRoles.map((item: any, index: any) => (
                                                <div className="table-body" key={index}>
                                                    <div className="element">{index + 1}</div>
                                                    <div className="element w-100 p-3">{item.ROLE_NAME}</div>
                                                    {/* <div className="element">{item.ROLE_ID}</div> */}
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </>}
                            </TabPanel> : <div className="nodata">{t("No Active Roles")}</div>}
                    </TabContext>}


                </div>)}
            </DialogContent > :
                <UserCreateSkelton />
            }
            <DialogActions>
                <DialogActions className="dialog-action-buttons">
                    <Button autoFocus onClick={() => handleCloseDialog()}>{t("Cancel")}</Button>
                    {/* {(rowData?.ACTION_TYPE_ID_ === 32601) ||  (!pageState.isView && !pageState.isChangeStatus) && (
                        <Button
                            type="submit"
                            variant="contained"
                            className="colored-btn"
                            onClick={handleSubmit(onSubmit, onError)}
                        >
                            {t("Submit")}
                        </Button>
                    )} */}
                    {((rowData?.ACTION_TYPE_ID_ !== 32601) && (readUserId?.IS_SUBMITTED !== 1) && (!pageState.isView && !pageState.isChangeStatus)) && !toggleUserCreation && (
                        <Button
                            type="submit"
                            variant="contained"
                            className="colored-btn"
                            // onClick={handleSubmit(onSubmit, onError)}
                            onClick={handleSubmit((data) => {
                                setValue('action', 30101);
                                onSubmit(data, {});
                            }, onError)}>
                            {t("Submit")}

                        </Button>
                    )}

                    {(pageState.isChangeStatus || rowData?.ACTION_TYPE_ID_ === 32601) && (
                        actionbtns &&
                        actionbtns.map((btn: any) => (
                            <Button
                                type="submit"
                                variant="contained"
                                className={`${btn.STATUS_TYPE === 30102 ? "rejct-red" : "approve-green"}`}
                                key={btn.value}
                                onClick={handleSubmit((data) => {
                                    setValue('action', btn.STATUS_TYPE);
                                    onSubmit(data, btn.STATUS_ID);
                                }, onError)}
                            >
                                {btn.ACTION_NAME}
                            </Button>
                        ))
                    )}

                </DialogActions>
            </DialogActions>
            <PreviewCreation previewParentProps={previewParam} onClose={handleclosePreview}> </PreviewCreation>
            {saveResponse && <SuccessBox mailSuccess={mailSuccess} hideLoaderBox={hideLoaderBox} />}
        </>
    );
};
