import React, { useContext, useEffect, useRef, useState } from "react";
import { Col, Row } from "react-bootstrap";
import FormInputTreelistCheckbox from "../../shared/components/form-components/FormInputTreelistCheckbox";
import { FormInputText } from "../../shared/components/form-components/FormInputText";
import { FormInputDate } from "../../shared/components/form-components/FormInputDate";
import { useFormContext } from "react-hook-form";
import TinyMceEditor from "./tiny-mce";
import { Button, Drawer } from "@mui/material";
import { IconButton } from "@mui/material";
import { UploadFile } from "../../shared/file-controler/file-upload/upload";
import RemoveRedEyeOutlinedIcon from '@mui/icons-material/RemoveRedEyeOutlined';
import { SwitchField } from "../../shared/components/form-components/FormSwitch";
import { LimitTagsController } from "../../shared/components/form-components/FormAutoCompleteSearchChip";
import { fileUploadaMimeTypeCheck, fileUploadMaxSizeCheck } from "../../common/application/image-config";
import AutocompleteField from "../../shared/components/form-components/FormAutoCompleteSelect";
import ApiService from "../../core/services/axios/api";
import axios from "axios";
import localStore from "../../common/browserstore/localstore";
import { CultureId } from "../../common/application/i18n";
import { formatAutoCompleteOptionsArray } from "../../common/application/shared-function";
import { validateFile } from "../../core/validators/fileValidator";
import { toast } from "react-toastify";
import { HiOutlinePencilSquare, HiOutlineTrash, HiOutlineEye } from "react-icons/hi2";
import { LimitTagsGroupController } from "../../shared/components/form-components/FormAutoCompleteGroupSearchChip";
import PerfectScrollbar from "react-perfect-scrollbar";
import { AddedTask, Task } from "../../assets/images/png/pngimages";
import { useTranslation } from "react-i18next";
import { TaskDetails } from "../../core/interfaces/task.interface";
import styled from "@emotion/styled";
import { FormInputSelect } from "../../shared/components/form-components/FormInputSelect";
import CloseIcon from "@mui/icons-material/Close";
import { MasterId, MenuId } from "../../common/database/enums";
import { Doc, Jpg, Pdf, Png, Xlsx, jpeg } from "../../assets/images/file/fileicon";
import { CorrespondanceTask } from "./correspondance-task";
import { API } from "../../common/application/api.config";

import DateRangeIcon from "@mui/icons-material/DateRange";
import { ViewConfiguredRole } from "./viewConfiguredrole";
import { FormattedRecipientList, SaveMailServiceType } from "./correspondence-param-formatter";
import { CorrespondanceEditorContext, fullViewRowDataContext } from "../../common/providers/viewProvider";
import { ReactFileViewer } from "../../shared/components/dialogs/Preview/react-file-viewer";

import { ViewReceipent } from "./viewReceipent";
import { FormInputCheckbox } from "../../shared/components/form-components/FormInputCheckbox";
import { FormInputDateTime } from "../../shared/components/form-components/FormInputDateTime";
import TextIconWhiteCloseButton from "../../shared/components/Buttons/TextIconButtons/Curved/TextIconWhiteButton";
import TreeCheckListController from "../../shared/components/form-components/TreeCheckList/TreeCheckListController";
import { DatePickerFields } from "./pickerFields";
import { FormInputMultiSelect } from "../../shared/components/form-components/FormInputMultiSelect";


/* const optionListResponse = [
    { label: 'The Shawshank Redemption', value: 1994 },
    { label: 'The Godfather', value: 1972 },
    { label: 'The Godfather: Part II', value: 1974 },
    { label: 'The Dark Knight', value: 2008 },
    { label: '12 Angry Men', value: 1957 },
];


const operatorList = [
    {
        id: 1,
        text: "Parent 1",
        isLeaf: 1,
        items: [
            { id: 2, text: "Child 1.1", isLeaf: 0 },
            { id: 3, text: "Child 1.2", isLeaf: 0 },
            {
                id: 4,
                text: "Parent 1.1",
                isLeaf: 1,
                items: [
                    { id: 5, text: "Child 1.1.1", isLeaf: 0 },
                    { id: 6, text: "Child 1.1.2", isLeaf: 0 },
                ],
            },
        ],
    },
    {
        id: 7,
        text: "Parent 2",
        isLeaf: 1,
        items: [
            { id: 8, text: "Child 2.1", isLeaf: 0 },
            { id: 9, text: "Child 2.2", isLeaf: 0 },
            { id: 10, text: "Child 2.3", isLeaf: 0 },
        ],
    },
];
const selectedOperators = [1, 2, 3, 5, 6]; */

type Image = {
    id: number;
    src: string;
    fileName: string;
    file: any;
    ext: any;
    isExist: boolean;
};
type Anchor = "right" | "left";


const CorrespondenceForm = (props: any) => {
    const { isTinyExpanded, tinyLanguage, resetTinyExpansion, onImagesChange, resetChildItems, currentPage, popupConfiguration, schema, initialApiDropdownResponse, USER_TYPE, MasterIdProp, onchnageCustomer } = props;
 
    const fields = Object.keys(schema.fields);
    const { t, i18n } = useTranslation();
    const currLang = i18n.dir();
    const { rowData, activeAction } = useContext(fullViewRowDataContext);
    const userData = localStore.getLoggedInfo();
    const userType = userData && JSON.parse(userData).USER_TYPE;
    const userID = userData && JSON.parse(userData).USER_ID;
    const Franchise_id = userData && JSON.parse(userData).FRANCHISE_ID;
    const lang = CultureId();
    const [open, setOpen] = useState(false);
    const [invertWheel, setInvertWheel] = useState(false);
    const [previewParam, setPreviewParam] = useState({
        popupOpenState: false,
        image: null
    });
    /* Scroll Options */
    const options = {
        suppressScrollX: true,
        wheelPropagation: true,
        scrollbarY: true,
        invertWheel: invertWheel,
        forceVisible: true,
    };
    const [fileData, setFileData] = useState(null);
    const [optionList, setOptionList] = React.useState();
    const currentDrawerState = currLang === "ltr" ? "right" : "left";
    const [drawerState, setDrawerState] = useState({
        [currentDrawerState]: false,
    });
    const [clickedCardData, setClickedCardData] = useState<TaskDetails | any>(
        null
    );
    const IdInputRef = useRef<HTMLInputElement>(null);
    const [isDataLoaded, setIsDataLoaded] = useState(false);
    const [drawerOpen, setDrawerOpen] = useState(false);

    ///Ragesh
    const [manageDialog, setManageDialog] = useState<any>({
        open: '',
        onclose: null

    })

    const [receiptData, setReceiptData] = useState<any>();
    const closeDialog = async () => {
        setManageDialog({ open: null });
    };
    ////
    const [pageState, setPageState] = useState({
        isNew: false,
        isView: false,
        isEdit: false
    });
    const [images, setImages] = useState<Image[]>([]);
    const [taskList, setTaskList] = useState<any[]>([]); // initialize taskList as an empty array
    const [browseLoader, setBrowseLoader] = useState(false);


    const toggleInvertWheel = () => {
        setInvertWheel(!invertWheel);
    };

    const toggleDrawer = (anchor: Anchor, open: boolean, cardData?: TaskDetails) => {
        setDrawerState({ ...drawerState, [anchor]: open });
        setClickedCardData(cardData);
    };

    /* Reset Fields After Save */
    useEffect(() => {
        if (resetChildItems) {
            setImages([]);
            onImagesChange([]);
        }
    }, [resetChildItems]);

    const handleDialogClose = (data: any) => {
        setOpen(false);
        setFileData(data);
        //console.log(fileData);
    };

    const {
        control,
        formState: { errors },
        setValue,
        getValues,
        watch
    } = useFormContext();

    const handleAutocompleteReceiptsChange = async (newInputValue: any) => {
        const param = {
        }
        const response = await ApiService.httpPost('', param);
    }

    const handleAutocompleteRelateditemsChange = (newInputValue: any) => {
        //console.log(newInputValue);
        /* Call API And Set Response */
        //setOptionList(optionListResponse)
    }

    const handleAutocompleteTagsChange = (newInputValue: any) => {
        //console.log(newInputValue);
        /* Call API And Set Response */
        //setOptionList(optionListResponse)
    }

    const columnUploadButton = () => {
        IdInputRef.current?.click();
    }

    /* Upload Image */
    const handleColumnFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target?.files?.[0] || null;
        const result = await validateFile(file, ['jpg', 'jpeg', 'png', 'pdf', 'docx', 'xlsx'], 5);
        if (result.valid && file) {
            const reader = new FileReader();
            reader.onload = () => {
                const id = images.length ? images[images.length - 1].id + 1 : 0;
                const src = reader.result as string;
                const fileName = file.name;
                const ext = file?.name?.split(".").pop();
                const isExist = false;
                setImages([...images, { id, src, fileName, file, ext, isExist }]);
                onImagesChange([...images, { id, src, fileName, file, ext, isExist }]);
            }
            reader.readAsDataURL(file);
        } else {
            toast.error(result.message);
        }
    };

    const handleImageDelete = (id: number) => {
        const filteredImages = images.filter((image: any) => image.id !== id);
        setImages(filteredImages);
        onImagesChange(filteredImages);
    };

    const handleFormInputChange = (name: any, value: any) => {
        // update the value of the form control with the given name
        // using the setValue function from your form library
        setValue(name, value);
    }




    /////Ragesh for viewConfig Dialog
    const viewConfigClick = () => {
        setManageDialog({ open: "View" })

    }


    const receipientDet = async () => {
        const showCommentsField: any = watch("configureRole");
        const receipientDet: any = makeReceipientData(popupConfiguration);
        const operatorDet: any = watch("Operator");
        const json = {
            TransId: -1,
            CultureId: lang,
            ServiceType: SaveMailServiceType(USER_TYPE, MasterIdProp),
            FranchiseId: Franchise_id,
            SendToConfiguredRoles: showCommentsField ? 1 : 0,
            Recipients: FormattedRecipientList(receipientDet),
            Franchisee: operatorDet ? operatorDet : []
        }
        try {
            const response = await ApiService.httpPost("trans/getActualRecipients", json);
            console.log(response);
            if (response.Valid > 0) {
                setManageDialog({ open: "Receipt" });
                setReceiptData(response?.Data);
                //console.log(response?.Data)
            }

        } catch (e: any) {
            toast.error(e?.message)
        }
    }

    const makeReceipientData = (popupConfig: any) => {
        let receipientDet: any = [];
        switch (popupConfig.MasterId) {
            case MasterId.Meetings:
                receipientDet = [...watch("Attendees"), ...watch("OptionalAttendees")]
                break;
            case MasterId.Communication:
                receipientDet = [...watch("to"), ...watch("cc")]
                break;
            default:
                receipientDet = watch("Receipts");
                break;
        }
        return receipientDet;
    }

    const handleImageView = (image: any) => {
        setPreviewParam({
            popupOpenState: true,
            image: image
        })
    }

    const handleclosePreview = () => {
        setPreviewParam({
            popupOpenState: false,
            image: null
        })
    }

    const isApplicationControl = (requestType: any, requestList: any) => {
        const foundObject = requestList.find((item: any) => item.OBJECT_ID === Number(requestType));
        const found = foundObject ? foundObject.OBJECT_TYPE === 33102 : null;
        return found || false;
    };


    return (
        <>

            <>
                <div className="outlined-box pt-3 mb-3">
                    <Row className="no-gutters">
                        {fields.includes('ReferenceNumber') && (
                            <Col md={2} className="mb-3">
                                <FormInputText
                                    name="ReferenceNumber"
                                    control={control}
                                    label={t("Reference Number")}
                                    errors={errors}
                                    hideError={true}
                                />
                            </Col>)
                        }

                        {fields.includes('CircularNumber') && (
                            <Col md={2} className="mb-3">
                                <FormInputText
                                    name="CircularNumber"
                                    control={control}
                                    label={t("Circular Number")}
                                    errors={errors}
                                    hideError={true}
                                />
                            </Col>)
                        }

                        {fields.includes('ResolutionNumber') && (
                            <Col md={2} className="mb-3">
                                <FormInputText
                                    name="ResolutionNumber"
                                    control={control}
                                    label={t("Resolution Number")}
                                    errors={errors}
                                    hideError={true}
                                />
                            </Col>
                        )}

                        {fields.includes('Subject') && (
                            <Col md={5} className="mb-3">
                                <FormInputText
                                    name="Subject"
                                    control={control}
                                    label={t("Subject")}
                                    errors={errors}
                                    //clearField={true}
                                    hideError={true}
                                />
                            </Col>
                        )} 



                        {((popupConfiguration?.MasterId !== MasterId.Requests) || (userType !== 31401 && userType !== 31402)) &&
                            !((popupConfiguration?.MasterId === MasterId.Correspondence) && (userType === 31402)) && (
                                <>
                                   {/*  <Col md={5} className="mb-3">
                                        <Row> */}
                                            {fields.includes('configureRole') && (
                                                <>
                                                    <Col md={2} className="text-center">
                                                        <SwitchField name="configureRole" control={control} label={`${currentPage !== MenuId.New ? t("Send to default Roles") : t("Send To Configured Roles")}`} fontSize="9px" />
                                                    </Col>
                                                    <Col md={2} className="mb-3">
                                                        <TextIconWhiteCloseButton icon={RemoveRedEyeOutlinedIcon} text={`${t("View Config")}`} onClick={viewConfigClick} fontSize="9px" />
                                                    </Col>
                                                </>
                                            )}
                                            {

                                                (![MasterId.NoticeBoardDesign].includes(popupConfiguration?.MasterId)) &&
                                                <Col md={2}>
                                                    <TextIconWhiteCloseButton icon={RemoveRedEyeOutlinedIcon} text={`${t("View Receipient")}`} onClick={receipientDet} fontSize="9px" />
                                                </Col>
                                            }
                                        {/* </Row>
                                    </Col> */}
                                </>
                            )}
 

                        {/* </Row>
                    <Row className="no-gutters"> */}
                        {fields.includes('Department') && (
                            <Col md={2} className="mb-3">
                                <FormInputSelect
                                    name="Department"
                                    control={control}
                                    label={t("Department")}
                                    options={initialApiDropdownResponse.department}
                                    errors={errors}
                                    hideError={true}
                                />
                            </Col>
                        )}


                        {/* Date Pickers */}
                        <DatePickerFields
                            popupConfiguration={popupConfiguration}
                            fields={fields}
                            control={control}
                            errors={errors}
                            setValue={setValue}
                            getValues={getValues}
                            watch={watch} />

                        {fields.includes('TaskPriority') && (
                            <Col md={1} className="mb-3">
                                <FormInputSelect
                                    name="TaskPriority"
                                    control={control}
                                    label={t("Task Priority")}
                                    options={initialApiDropdownResponse.priority}
                                    errors={errors}
                                    hideError={true}
                                />
                            </Col>
                        )}

                        {fields.includes('SendTo') && (
                            <Col md={2} className="mb-3">
                                <FormInputText
                                    name="SendTo"
                                    control={control}
                                    label={t("Send To")}
                                    errors={errors}
                                    hideError={true}
                                />
                            </Col>
                        )}

                        {fields.includes('Location') && (
                            <Col md={3} className="mb-3">
                                <FormInputSelect
                                    name="Location"
                                    control={control}
                                    label={t("Location")}
                                    options={initialApiDropdownResponse.location}
                                    errors={errors}
                                />
                            </Col>
                        )}

                        {fields.includes('LocationDECR') && (
                            <Col md={3} className="mb-3">
                                <FormInputText
                                    name="LocationDECR"
                                    control={control}
                                    label={t("Location")}
                                    errors={errors}
                                    hideError={true}
                                />
                            </Col>
                        )}

                        {fields.includes('Reminder') && (
                            <Col md={2} className="mb-3">
                                <FormInputSelect
                                    name="Reminder"
                                    control={control}
                                    label={t("Reminder")}
                                    options={initialApiDropdownResponse.reminder}
                                    errors={errors}
                                    hideError={true}
                                />
                            </Col>
                        )}
                        {fields.includes('Keywords') && (
                            <Col md={5} className="mb-3">
                                <FormInputText
                                    name="Keywords"
                                    control={control}
                                    label={t("Keywords")}
                                    errors={errors}
                                    hideError={true}
                                />
                            </Col>
                        )}



                        {fields.includes('RequestType') && (
                            <Col md={2} className="mb-3">
                                <FormInputSelect
                                    name="RequestType"
                                    control={control}
                                    label={t("Request Type")}
                                    options={initialApiDropdownResponse.request}
                                    errors={errors}
                                    hideError={true}
                                />
                            </Col>
                        )}

                        {isApplicationControl(watch('RequestType'), initialApiDropdownResponse.requestOriginal) && fields.includes('Application') && (
                            <Col md={2} className="mb-3">
                                <FormInputSelect
                                    name="Application"
                                    control={control}
                                    label={t("ITC Application")}
                                    options={initialApiDropdownResponse.application}
                                    errors={errors}
                                    hideError={true}
                                />
                            </Col>
                        )}

                        {([MasterId.Tasks].includes(popupConfiguration?.MasterId)) && (
                            <Col md={2} className="mb-3">
                                <FormInputSelect
                                    name="TaskSubType"
                                    control={control}
                                    label={t("Task Sub Type")}
                                    options={initialApiDropdownResponse.transSubType}
                                    errors={errors}
                                    hideError={true}
                                />
                            </Col>
                        )}
  
                        {fields.includes('Customers') && (
                            <Col md={2} className="mb-3">
                                <FormInputSelect
                                    name="Customers"
                                    control={control}
                                    label={t("Customers")}
                                    options={initialApiDropdownResponse.Customers}
                                    onChange={onchnageCustomer}
                                    errors={errors}
                                    hideError={true}
                                />
                            </Col>
                        )} 

                        {(fields.includes('Customers') && fields.includes('Users')) && (
                            <Col md={2} className="mb-3">
                                <FormInputSelect
                                    name="Users"
                                    control={control}
                                    label={t("Users")}
                                    options={initialApiDropdownResponse.Users}
                                    errors={errors}
                                    hideError={true}
                                />
                            </Col>
                        )} 

                        {fields.includes('Schedule') && (
                            <Col md={1} className="mb-3 red">
                                <FormInputCheckbox
                                    name="Schedule"
                                    control={control}
                                    label={t("Schedule")}
                                    errors={errors}
                                />
                            </Col>
                        )}

                        {/* Schedule Date Time Picker */}
                        {watch('Schedule') && (
                            <Col md={2} className="mb-3">
                                <FormInputDateTime
                                    name="ScheduleDate"
                                    control={control}
                                    label={t("Schedule Date")}
                                    errors={errors}
                                    inputFormat="DD/MM/YYYY"
                                />
                            </Col>
                        )}

                        {fields.includes('Operator') && (
                            <Col md={12} className="mb-3">
                                {
                                /* {
                                    initialApiDropdownResponse.operator &&
                                    <TreeCheckListController
                                        name="Operator"
                                        label={t("Operators")}
                                        options={initialApiDropdownResponse.operator}
                                        selectedOperators={getValues().Operator}
                                        errors={errors}
                                        getUpdatedValue={handleFormInputChange}
                                    />
                                } */}

                                <FormInputMultiSelect
                                    name="Operator"
                                    control={control}
                                    label={t("Operators")}
                                    options={initialApiDropdownResponse.operator}
                                    errors={errors}
                                    hideError={true}
                                />
                            </Col>
                        )}
                    </Row>

                    <Row className="no-gutters">
                        {fields.includes('to') && (
                            <Col md={12} className="mb-3">
                                <LimitTagsGroupController
                                    name="to"
                                    control={control}
                                    label={t("To")}
                                    placeholder={t("Type and Search")}
                                    limitTags={5}
                                    defaultValue={[]}
                                    isOnchangeNew={false}
                                    errors={errors}
                                    optionList={initialApiDropdownResponse.recipients}
                                    handleAutocompleteChange={handleAutocompleteReceiptsChange}
                                    selectedAttendees={fields.includes('cc') ? watch('cc') : []} // Pass selectedAttendees only if cc field is included
                                />
                            </Col>
                        )}
                        {fields.includes('cc') && (
                            <Col md={12} className="mb-3">
                                <LimitTagsGroupController
                                    name="cc"
                                    control={control}
                                    label={t("CC")}
                                    placeholder={t("Type and Search")}
                                    limitTags={5}
                                    defaultValue={[]}
                                    isOnchangeNew={false}
                                    errors={errors}
                                    optionList={initialApiDropdownResponse.recipients}
                                    handleAutocompleteChange={handleAutocompleteReceiptsChange}
                                    selectedAttendees={fields.includes('to') ? watch('to') : []} />
                            </Col>
                        )}
                    </Row>
                    <Row className="no-gutters">
                        {fields.includes('Attendees') && (
                            <Col md={12} className="mb-3">
                                <LimitTagsGroupController
                                    name="Attendees"
                                    control={control}
                                    label={t("Attendees")}
                                    placeholder={t("Type and Search")}
                                    limitTags={5}
                                    defaultValue={[]}
                                    isOnchangeNew={false}
                                    errors={errors}
                                    optionList={initialApiDropdownResponse.recipients}
                                    handleAutocompleteChange={handleAutocompleteReceiptsChange}
                                    selectedAttendees={fields.includes('OptionalAttendees') ? watch('OptionalAttendees') : []} // Pass selectedAttendees only if OptionalAttendees field is included
                                />
                            </Col>
                        )}
                        {fields.includes('OptionalAttendees') && (
                            <Col md={12} className="mb-3">
                                <LimitTagsGroupController
                                    name="OptionalAttendees"
                                    control={control}
                                    label={t("OptionalAttendees")}
                                    placeholder={t("Type and Search")}
                                    limitTags={5}
                                    defaultValue={[]}
                                    isOnchangeNew={false}
                                    errors={errors}
                                    optionList={initialApiDropdownResponse.recipients}
                                    handleAutocompleteChange={handleAutocompleteReceiptsChange}
                                    selectedAttendees={fields.includes('Attendees') ? watch('Attendees') : []} />
                            </Col>
                        )}
                    </Row>


                </div>
                <div className="outlined-box pt-3 mb-3">
                    <Row className="no-gutters">
                        <Col md={12} className="mb-3" >
                            <TinyMceEditor
                                control={control}
                                name="TransContent"
                                isExpanded={isTinyExpanded}
                                tinyLanguage={tinyLanguage}
                                onFullscreenChange={resetTinyExpansion}
                                resetChildItems={resetChildItems}
                                setValue={handleFormInputChange}
                            />
                        </Col>
                    </Row>
                    <Row className="no-gutters">
                        {fields.includes('Receipts') && (
                            <Col md={12} className="mb-3">
                                <LimitTagsGroupController
                                    name="Receipts"
                                    control={control}
                                    label={t("Recipients")}
                                    placeholder={t("Type and Search")}
                                    limitTags={5}
                                    defaultValue={[]}
                                    isOnchangeNew={false}
                                    errors={errors}
                                    optionList={initialApiDropdownResponse.recipients}
                                    handleAutocompleteChange={handleAutocompleteReceiptsChange} />
                            </Col>
                        )}
                    </Row>
                    <Row className="no-gutters">

                        {fields.includes('Tags') && (
                            <Col md={12} className="mb-3">
                                <LimitTagsController
                                    name="Tags"
                                    control={control}
                                    errors={errors}
                                    label={t("Tags")}
                                    placeholder="Enter ';' for Create New Tags"
                                    limitTags={5}
                                    isOnchangeNew={true}
                                    optionList={initialApiDropdownResponse.tags}
                                    handleAutocompleteChange={handleAutocompleteTagsChange} />
                            </Col>
                        )}

                        {fields.includes('Relateditems') && (
                            <Col md={12} className="mb-3">
                                <LimitTagsController
                                    name="Relateditems"
                                    control={control}
                                    label={t("Related Items")}
                                    placeholder={t("Type and Search")}
                                    limitTags={5}
                                    defaultValue={[]}
                                    isOnchangeNew={false}
                                    optionList={initialApiDropdownResponse.relatedItems}
                                    handleAutocompleteChange={handleAutocompleteRelateditemsChange} />
                            </Col>
                        )}
                    </Row>




                    <ViewConfiguredRole open={manageDialog.open === "View"} onClose={closeDialog} serviceType={SaveMailServiceType(USER_TYPE, MasterIdProp)} />
                    <ViewReceipent open={manageDialog.open === "Receipt"} onClose={closeDialog} receipentInfo={receiptData} />
                </div>
            </>

            <ReactFileViewer previewParentProps={previewParam} onClose={handleclosePreview} > </ReactFileViewer>

        </>
    );
};

export default CorrespondenceForm;


