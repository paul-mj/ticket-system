import { Button, Drawer, IconButton } from "@mui/material";
import styled from "@emotion/styled";
import CloseIcon from "@mui/icons-material/Close";
import { FormInputText } from "../../shared/components/form-components/FormInputText";
import { Col, Row } from "react-bootstrap";
import { useEffect, useRef, useState } from "react";
import TinyMceEditor from "./tiny-mce";
import { validateFile } from "../../core/validators/fileValidator";
import { toast } from "react-toastify";
import { HiOutlineTrash, HiOutlineEye, HiOutlinePencilSquare } from "react-icons/hi2";
import { Doc, Jpg, Pdf, Png, Xlsx, jpeg } from "../../assets/images/file/fileicon";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { FormProvider, useForm } from "react-hook-form";
import { FormInputDate } from "../../shared/components/form-components/FormInputDate";
import { FormInputSelect } from "../../shared/components/form-components/FormInputSelect";
import { SwitchField } from "../../shared/components/form-components/FormSwitch";
import ApiService, { Url } from "../../core/services/axios/api";
import axios from "axios";
import { AddedTask } from "../../assets/images/png/pngimages";
import { FileUpload } from "../../assets/images/svgicons/svgicons";
import { ReactFileViewer } from "../../shared/components/dialogs/Preview/react-file-viewer";
import { useConfirm } from "../../shared/components/dialogs/confirmation";
import { ImageComponent } from "../../shared/components/DocsView/docs";
import PrimaryButton from "../../shared/components/Buttons/TextButtons/Curved/PrimaryButton";
import TextCurvedCloseButton from "../../shared/components/Buttons/TextButtons/Curved/TextCloseButton";
import { t } from "i18next";
import { useTranslation } from "react-i18next";
import DownloadIconButton from "../../shared/components/Buttons/IconButtons/DownloadIconButton";
import CommonUtils from "../../common/utils/common.utils";
import TaskBoxCard from "../../shared/components/UI/TaskBoxCard/TaskBoxCard";
import { CorrespondanceTaskContext } from "../../common/providers/viewProvider";
import AttachmentUpload from "../../shared/file-controler/attachment-upload/attachment-upload";


/* width: 800px; */
const DrawerBox = styled.div`
width: calc(100vw - 800px);
height: 100%;
`;
const DrawerWrapper = styled.div`
height: 100%;
`;
const DrawerHeader = styled.div`
height: 7%;
padding: 15px;
`;
const DrawerBody = styled.div`
height: 86%;
overflow-y: auto;
overflow-x: hidden;
padding: 15px;
`;
const DrawerFooter = styled.div`
position: absolute;
    left: 0;
    right: 0;
    bottom: 0;
    width: 100%;
    padding: 15px;
`;
type Anchor = "right" | "left";

const Schema = yup.object().shape({
    TASK_TITLE: yup.string().required(""),
    TASK_CONTENT: yup.string().required(""),
    TASK_REMINDER_ID: yup.string().required(""),
    PRIORITY_ID: yup.string().required(""),
    START_DATE: yup.date().required("").typeError(""),
    DUE_DATE: yup.date().required("").typeError("")
    /* START_DATE: yup.date().nullable().typeError(''),
    DUE_DATE: yup.date().nullable().typeError('') */
});



interface TaskDefValue {
    TASK_TITLE: string;
    TASK_REF_NO: string;
    TASK_ID: number | string;
    PRIORITY_ID: number | string;
    TASK_REMINDER_ID: number | string;
    START_DATE: Date | null | undefined;
    DUE_DATE: Date | null | undefined;
    TASK_CONTENT: string;
    CONTENT_EDITOR_CULTURE_ID: boolean;
    TASK_ORDER: any;
    Attachments: any;
}

const defValues: TaskDefValue = {
    TASK_TITLE: "",
    TASK_REF_NO: "",
    TASK_ID: "",
    PRIORITY_ID: "",
    TASK_REMINDER_ID: "",
    START_DATE: new Date(),
    DUE_DATE: null,
    TASK_CONTENT: "",
    CONTENT_EDITOR_CULTURE_ID: true,
    TASK_ORDER: "",
    Attachments: []
};

export const CorrespondanceTask = (props: any) => {
    const { initialApiDropdownResponse, taskCardDatas, formattedTaskList, addTask, isDrawerClose } = props;
    const confirm = useConfirm();
    const { i18n } = useTranslation();
    const currLang = i18n.dir();
    const [invertWheel, setInvertWheel] = useState(false);
    const IdInputRef = useRef<HTMLInputElement>(null);
    const [tinyLanguage, setIsTinyLanguage] = useState(true); // change this based on current lang
    const [isUploading, setIsUploading] = useState(false);
    const [progress, setProgress] = useState(0);
    const [taskList, setTaskList] = useState<any[]>([]);
    const [resetChildItems, setResetChildItems] = useState(false);
    const currentDrawerState = currLang === "ltr" ? "right" : "left";
    const [drawerState, setDrawerState] = useState({
        [currentDrawerState]: false,
    });
    const [showDropDiv, setShowDropDiv] = useState(false);
    const [previewParam, setPreviewParam] = useState({
        popupOpenState: false,
        image: null
    });
    const [taskId, setTaskId] = useState<number | null>(null);
    const toggleInvertWheel = () => {
        setInvertWheel(!invertWheel);
    };

    const options = {
        suppressScrollX: true,
        wheelPropagation: true,
        scrollbarY: true,
        invertWheel: invertWheel,
        forceVisible: true,
    };

    const methods = useForm({
        resolver: yupResolver(Schema),
        defaultValues: defValues,
    });

    const handleclosePreview = () => {
        setPreviewParam({
            popupOpenState: false,
            image: null
        })
    }
    const handleOnEditorChange = (event: any) => {
        setIsTinyLanguage(event);
    }

    const handleFormInputChange = (name: any, value: any) => {
        methods.setValue(name, value);
    }

    const resetTinyExpansion = () => { };

    /* Task List Preparation */
    useEffect(() => {
        setTaskList(formattedTaskList);
    }, []);

    /* Task Card Delete */
    const handleTaskDelete = async (task: any) => {
        const choice = await confirm({
            ui: 'delete',
            title: `${t('You Are About To Delete')}`,
            description: `${t('Are you sure you want to delete this?')}`,
            confirmBtnLabel: `${t('Continue')}`,
            cancelBtnLabel: `${t('Cancel')}`,
        });
        if (choice) {
            const updatedTaskList = taskList.filter(item => item.TASK_ID !== task.TASK_ID);
            setTaskList(updatedTaskList);
        }
    }

    /* Task Card Edit */
    const handleTaskEdit = (task: any) => {
        methods.reset(task);
        toggleDrawer(currentDrawerState, true, task);
    }

    /* ================================================= */
    /* ================================================= */
    /* CORRESPONDANCE ATTACHMENT   ==============    START */
    /* ================================================= */
    /* ================================================= */

    const columnUploadButton = () => {
        IdInputRef.current?.click();
    }
    /* File Upload */
    const handleDrop = (event: any) => {
        event.preventDefault();
        setShowDropDiv(false); // Reset showDropDiv state 
        const files = Array.from(event.dataTransfer.files);
        handleColumnFileSelect(files)
    };

    const handleFileInputChange = (event: any) => {
        const files = Array.from(event.target.files);
        handleColumnFileSelect(files)
    };

    const removeAttachment = async (index: number) => {
        const choice = await confirm({
            ui: 'delete',
            title: `${t('You Are About To Delete')}`,
            description: `${t('Are you sure you want to delete this?')}`,
            confirmBtnLabel: `${t('Continue')}`,
            cancelBtnLabel: `${t('Cancel')}`,
        });
        if (choice) {
            const attachments = methods.getValues().Attachments;
            attachments.splice(index, 1);
            methods.setValue('Attachments', attachments);
            methods.trigger();
        }
    };

    /* Preview Selecred Images */
    const handleImageView = (image: any) => {
        setPreviewParam({
            popupOpenState: true,
            image: image
        })
    }

    const handleDragEnter = (event: any) => {
        event.preventDefault();
        if (!event.target.classList.contains('drop-files-block')) {
            setShowDropDiv(true);
        }
    };

    const handleDragLeave = (event: any) => {
        event.preventDefault();
        if (!event.relatedTarget || !event.relatedTarget.classList.contains('drop-files-block')) {
            setShowDropDiv(false);
        }
    };

    const handleColumnFileSelect = async (files: any) => {
        if (files && files.length > 0) {
            const attachments = methods.getValues().Attachments || [];
            for (let i = 0; i < files.length; i++) {
                const file = files[i];
                const result = await validateFile(file, ['jpg', 'jpeg', 'png', 'pdf', 'docx', 'xlsx'], 5);
                if (result.valid) {
                    const reader = new FileReader();
                    reader.onload = () => {
                        const newImage = {
                            DISPLAY_NAME: file.name,
                            src: reader.result as string,
                            file: file,
                            ext: file?.name?.split('.').pop(),
                            isExist: false,
                        };
                        attachments.push(newImage);
                        methods.setValue('Attachments', attachments);
                        methods.trigger(); // Trigger revalidation of the form
                    };

                    reader.readAsDataURL(file);
                } else {
                    toast.error(result.message);
                }
            }
        }
    };

    /* ================================================= */
    /* ================================================= */
    /* CORRESPONDANCE ATTACHMENT   ==============    END */
    /* ================================================= */
    /* ================================================= */

    /* On Submit Task */
    const onSubmit = async (data: any) => {
        try {
            setIsUploading(true);
            if (!data.TASK_ID) {
                data.TASK_ID = (taskList && taskList?.length) ? -(taskList?.length + 1) : -1;
                data.Attachments.forEach((attachment: any) => {
                    attachment.TASK_ID = data.TASK_ID;
                });
            } else {
                data.Attachments.forEach((attachment: any) => {
                    attachment.TASK_ID = data.TASK_ID;
                });
            }
            let totalProgress: number = 0;
            let images = data.Attachments;

            for (let i = 0; i < images.length; i++) {
                if (images[i].file) {
                    const formData = new FormData();
                    formData.append(`file`, images[i].file);

                    const onUploadProgress = (progressEvent: any) => {
                        const progress = Math.round((progressEvent.loaded / progressEvent.total) * 100);
                        totalProgress += progress;
                        setProgress(Math.min(Math.round(totalProgress / images.length), 100));
                    }

                    const response = await axios.post(Url('file/writeDoc'), formData, {
                        headers: {
                            'Content-Type': 'multipart/form-data',
                        },
                        onUploadProgress,
                    });
                    if (response && response.data.Id > 0) {
                        images[i].ATTACHMENT_NAME = response && response.data.Message;
                        images[i].ATTACHMENT_PATH = response && response.data.Message.substring(0, response.data.Message.lastIndexOf("\\"));
                        images[i].SORT_ORDER = i + 1;
                    }
                    await new Promise(resolve => setTimeout(resolve, 1000));
                }
            }
            saveCorrespondanceTask(data);
        } catch (error) {
            console.error(error);
        } finally {
            setIsUploading(false);
        }
    }

    /* Send Data To Browse page after Doc Write */
    const saveCorrespondanceTask = (data: any) => {
        const index = taskList.findIndex(task => task.TASK_ID === data.TASK_ID);
        if (index !== -1) {
            // Replace existing item
            const updatedTaskList = [...taskList];
            updatedTaskList[index] = data;
            setTaskList(updatedTaskList);
        } else {
            // Add new item
            setTaskList(prevTaskList => [...prevTaskList, data]);
        }
    }

    /* After saveCorrespondanceTaskit will call */
    useEffect(() => {
        taskCardDatas(taskList);
        methods.reset(defValues);
        setResetChildItems(true);
        toggleDrawer(currentDrawerState, false, undefined);
    }, [taskList])

    useEffect(() => {
        if (addTask) {
            toggleDrawer(currentDrawerState, true, {});
        }
    }, [addTask])

    /* Drawer Handler */
    const toggleDrawer = (anchor: Anchor, open: boolean, task?: any) => {
        console.log(task);
        const isEmpty = task && Object.keys(task).length === 0;
        isEmpty && patchTaskOrder();
        if (!open) {
            isDrawerClose(true);
            methods.reset(defValues);
        }
        setDrawerState({ ...drawerState, [anchor]: open });
    };

    const patchTaskOrder = () => {
        const order = taskList.length ? nextLargeNumber() : 1;
        methods.setValue('TASK_ORDER', order);
    }

    const nextLargeNumber = () => {
        let maxOrder = -Infinity;
        for (let i = 0; i < taskList.length; i++) {
            const currentObj = taskList[i];
            const currentOrder = currentObj.TASK_ORDER;

            if (currentOrder > maxOrder) {
                maxOrder = currentOrder;
            }
        }

        return maxOrder + 1;
    }

    const onChangeTaskOrder = (e: any) => {
        const enteredOrder = Number(e);

        if (enteredOrder <= 0) {
            methods.setValue('TASK_ORDER', "");
            toast.error(`${t("Please enter a positive number for the task order.")}`);
            return;
        }

        const isExistOrder =
            taskList &&
            taskList.length &&
            taskList.some((x) => x.TASK_ORDER === enteredOrder);

        if (isExistOrder) {
            methods.setValue('TASK_ORDER', "");
            toast.error(`${t("The entered order already exists in the task list.")}`);
            return;
        }
    };


    const handleOpenTaskDialog = (task: any) => {
        console.log(task)
    }


    return (
        <>

            <Col md={12} className="mb-3">

                {taskList && taskList.length ? (
                    <div className="image-list-wrap no-items-in-corrs">
                        <Row className=" h-100 align-items-center selected_doc_corr row no-gutters">
                            {taskList.map((task: any, index: number) => (
                                <TaskBoxCard
                                    isView={false}
                                    key={index}
                                    task={task}
                                    index={index}
                                    handleTaskDelete={handleTaskDelete} 
                                    handleTaskEdit={handleTaskEdit}
                                    openTaskDialog={handleOpenTaskDialog}
                                    currentDrawerState={currentDrawerState}
                                    toggleDrawer={toggleDrawer} />
                            ))}
                        </Row>
                    </div>
                ) : <>
                    <div className="no-items-in-corr px-2">
                        <p className="m-0">{t("No Tasks Available, Please click the Add Button and Create")}</p>
                    </div>
                </>}
            </Col>


            <Drawer
                anchor={currentDrawerState}
                open={drawerState[currentDrawerState]}
                onClose={() => toggleDrawer(currentDrawerState, false)}
                className="task-drawer"
                ModalProps={{
                    BackdropProps: {
                        onClick: (event: any) => {
                            event.stopPropagation();
                        },
                    },
                }}
            >
                <div className="task-drawer-box">

                    <DrawerBox>
                        {
                            isUploading ?
                                <>
                                    <div className="corr-loader-wrapper">
                                        <div className="corr-loader"></div>
                                    </div>
                                </>
                                :
                                <DrawerWrapper>
                                    <div className="drawer-wrapper">
                                        <DrawerHeader>
                                            <div className="heading-wrapper">
                                                <div className="tsk-wrapper">
                                                    <div className="tsk">{t("Tasks")}</div>
                                                    <div className="tsk-new">{t("New")}</div>
                                                </div>
                                                <div className="d-flex justify-content-center align-items-center corr_lang_bttn">
                                                    <p className="m-0 px-2">{t("English")}</p>
                                                    <SwitchField name="CONTENT_EDITOR_CULTURE_ID" control={methods.control} label="" onChange={handleOnEditorChange} />
                                                    <p className="m-0 px-2">{t("Arabic")}</p>
                                                </div>
                                                <div className="close-btn-tsk">
                                                    <IconButton
                                                        aria-label="close"
                                                        onClick={() => toggleDrawer(currentDrawerState, false)}
                                                    >
                                                        <CloseIcon />
                                                    </IconButton>
                                                </div>
                                            </div>
                                        </DrawerHeader>
                                        <DrawerBody>
                                            {
                                                initialApiDropdownResponse &&
                                                <>
                                                    <Row>
                                                        <Col md={12} className="mb-3 mt-3">
                                                            <FormInputText
                                                                name="TASK_TITLE"
                                                                control={methods.control}
                                                                label={t("Task Name")}
                                                                errors={methods.formState.errors}
                                                            />
                                                        </Col>
                                                    </Row>
                                                    <Row>
                                                        <Col md={4} className="mb-3">
                                                            <FormInputText
                                                                name="TASK_REF_NO"
                                                                control={methods.control}
                                                                label={t("Reference No")}
                                                                errors={methods.formState.errors}
                                                            />
                                                        </Col>

                                                        <Col md={4} className="mb-3">
                                                            <FormInputSelect
                                                                name="PRIORITY_ID"
                                                                control={methods.control}
                                                                label={t("Task Priority")}
                                                                options={initialApiDropdownResponse.priority}
                                                                errors={methods.formState.errors}
                                                            />
                                                        </Col>
                                                        <Col md={4} className="mb-3">
                                                            <FormInputSelect
                                                                name="TASK_REMINDER_ID"
                                                                control={methods.control}
                                                                label={t("Reminder")}
                                                                options={initialApiDropdownResponse.reminder}
                                                                errors={methods.formState.errors}
                                                            />
                                                        </Col>
                                                        <Col md={4} className="mb-3">
                                                            <FormInputDate
                                                                name="START_DATE"
                                                                control={methods.control}
                                                                label={t("Start Date")}
                                                                errors={methods.formState.errors}
                                                                inputFormat="DD/MM/YYYY"
                                                                minDate={new Date()}
                                                                maxDate={methods.watch('DUE_DATE')}
                                                            />
                                                        </Col>
                                                        <Col md={4} className="mb-3">
                                                            <FormInputDate
                                                                name="DUE_DATE"
                                                                control={methods.control}
                                                                label={t("Due Date")}
                                                                errors={methods.formState.errors}
                                                                inputFormat="DD/MM/YYYY"
                                                                minDate={methods.watch('START_DATE')}
                                                            />
                                                        </Col>
                                                        <Col md={4} className="mb-3">
                                                            <FormInputText
                                                                name="TASK_ORDER"
                                                                type="number"
                                                                control={methods.control}
                                                                label={t("Task Order")}
                                                                minLength={0}
                                                                errors={methods.formState.errors}
                                                                onChange={(e: any) => { onChangeTaskOrder(e) }}
                                                            />
                                                        </Col>
                                                    </Row>
                                                    <div className={`${methods.formState.errors.TASK_CONTENT ? 'error-red-mce' : ''}`}>
                                                        <TinyMceEditor
                                                            control={methods.control}
                                                            name="TASK_CONTENT"
                                                            tinyLanguage={tinyLanguage ? 1 : 0}
                                                            resetChildItems={resetChildItems}
                                                            onFullscreenChange={resetTinyExpansion}
                                                            setValue={handleFormInputChange}
                                                        />
                                                    </div>


                                                    <Row className="attachment-wrap">
                                                        <Col md={12}>
                                                            <Row>
                                                                <FormProvider {...methods}>
                                                                    <CorrespondanceTaskContext.Provider value={{ width: 800, height: 600 }}>
                                                                        <AttachmentUpload
                                                                            showPanel={true} />
                                                                    </CorrespondanceTaskContext.Provider>
                                                                </FormProvider>
                                                            </Row>
                                                        </Col>
                                                    </Row>
                                                </>
                                            }
                                        </DrawerBody>
                                        <DrawerFooter>
                                            <div className="d-flex justify-content-between align-items-center dialog-action-buttons footer-sec">
                                                <TextCurvedCloseButton onClick={() => toggleDrawer(currentDrawerState, false)} />
                                                <div className="mx-3">
                                                    <PrimaryButton text={t("Save")} onClick={methods.handleSubmit(onSubmit)} />
                                                </div>
                                            </div>
                                        </DrawerFooter>
                                    </div>
                                </DrawerWrapper>
                        }
                    </DrawerBox>
                </div>
            </Drawer>
            <ReactFileViewer previewParentProps={previewParam} onClose={handleclosePreview} > </ReactFileViewer>
        </>
    )
}