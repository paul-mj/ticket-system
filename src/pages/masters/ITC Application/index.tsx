import { useContext, useEffect, useState } from "react";
import { Button, Checkbox, DialogActions, DialogContent, DialogTitle, IconButton } from "@mui/material";
import { Col, Row } from "react-bootstrap";
import * as yup from "yup";
import CloseIcon from "@mui/icons-material/Close";
import PixOutlinedIcon from "@mui/icons-material/PixOutlined";
import { useTranslation } from "react-i18next";
import { CultureId } from "../../../common/application/i18n";
import localStore from "../../../common/browserstore/localstore";
import { useConfirm } from "../../../shared/components/dialogs/confirmation";
import { useSelector } from "react-redux";
import { fullViewRowDataContext } from "../../../common/providers/viewProvider";
import { useForm } from "react-hook-form";
import { FormValues } from "../../../common/typeof/MasterTypeof";
import { yupResolver } from "@hookform/resolvers/yup";
import ApiService from "../../../core/services/axios/api";
import { MenuId, fullGridDataAction } from "../../../common/database/enums";
import TabContext from "@mui/lab/TabContext";
import { Box, Tab } from "@mui/material";
import TabList from "@mui/lab/TabList";
import TabPanel from "@mui/lab/TabPanel";
import DataGrid, { Column, Editing, Scrolling, Selection } from "devextreme-react/data-grid";
import { FormInputText } from "../../../shared/components/form-components/FormInputText";
import { formatAutoCompleteOptionsArray } from "../../../common/application/shared-function";
import { FormInputSelect } from "../../../shared/components/form-components/FormInputSelect";
import { toast } from "react-toastify";
import './itc-application.scss';
import { HiOutlineTrash } from "react-icons/hi2";
import { FormInputCheckbox } from "../../../shared/components/form-components/FormInputCheckbox";
import DataGridActionContext from "../../../common/providers/datagridActionProvider";
import DataSource from "devextreme/data/data_source";

export interface FranchiseRequestDialogProps {
    onCloseDialog: (value: boolean) => void;
    popupConfiguration: any;
}

const validationSchema = yup.object().shape({
    objEnumBooolean: yup.boolean(),
    objObjectBoolean: yup.boolean(),
    objName: yup.string().required(''),
    objNameArabic: yup.string().required('')
});

export const ItcApplication = (props: FranchiseRequestDialogProps) => {

    const confirm = useConfirm();
    const { gridActionChangeEvent } = useContext(DataGridActionContext);
    const { onCloseDialog, popupConfiguration } = props;
    const currentPage = popupConfiguration && popupConfiguration.action.MenuId;
    const { t, i18n } = useTranslation();
    const lang = CultureId();
    const userData = localStore.getLoggedInfo();
    const userID = userData && JSON.parse(userData).USER_ID;
    const { activeDetails } = useSelector((state: any) => state.menus.activeDetails);
    const { rowData, activeAction } = useContext(fullViewRowDataContext);
    const [tabValue, setTabValue] = useState('1');
    const [entityGrid, setEntityGrid] = useState<any>([]);
    const [userRights, setUserRights] = useState<any>([]);
    const [selectedUserRights, setSelectedUserRights] = useState<any>([]);
    const [viewMenu, setViewMenu] = useState<boolean>(false);
    const [selectAllGrid, setSelectAll] = useState<any>({
        value: false,
        indeterminate: false
    });

    /* Handle Close Dialog */
    const handleCloseDialog = () => {
        onCloseDialog(true);
    };

    useEffect(() => {
        if (activeAction.MenuId !== MenuId.New) {
            setViewMenu(true);
            readPatchData()
        }
        getInitialData();
    }, []);

    const getInitialData = async () => {
        const paramSubEntity = {
            UserId: userID,
            MailGroupId: activeAction.MenuId === MenuId.Edit ? rowData?.ID_ : activeAction.MenuId === MenuId.View ? rowData?.ID_ : -1,
            CultureId: lang
        }
        const tableParam = {
            Procedure: "FRM_MASTER.ITC_APP_SUPPORT_USERS_LOOKUP_SPR",
            UserId: userID,
            CultureId: lang,
            Criteria: []
        }
        const Fork: any = [
            {
                url: 'mailgroups/getSubEntities',
                method: 'post',
                data: paramSubEntity
            },
            {
                url: 'data/getTable',
                method: 'post',
                data: tableParam
            }
        ];
        try {
            const response = await ApiService.httpForkJoin(Fork);
            setEntityGrid(response[0]?.Data);
            const formattedUsers = formatAutoCompleteOptionsArray(response[1]?.Data, 'USER_FULL_NAME', 'USER_ID');
            setUserRights(formattedUsers);
        } catch (error) {
            console.error(error);
        }
    };

    /* Form Initializing */
    const methords = useForm({
        resolver: yupResolver(validationSchema),
        defaultValues: {
            objParentID: 0,
            objectEnum: 0,
            objEnumBooolean: false,
            objObjectBoolean: false,
            objCode: '',
            objName: '',
            objNameArabic: '',
            shortName: '',
            remarks: '',
            Active: true,
            UserRights: '',
            objectId: ''
        }
    });

    const readPatchData = async () => {
        const readParam = {
            MasterId: activeDetails[0]?.Master.MASTER_ID,
            ObjectId: rowData?.ID_,
            UserId: userID
        };
        const responseObject = await ApiService.httpPost('objects/read', readParam);
        if (responseObject.Valid > 0) {
            const item = responseObject.Data;
            loadUserRights(responseObject.Data);
            const patchObj = {
                objParentID: item.PARENT_ID,
                objectEnum: item.OBJECT_TYPE,
                objEnumBooolean: false,
                objObjectBoolean: false,
                objCode: item.OBJECT_CODE,
                objName: item.OBJECT_NAME,
                objNameArabic: item.OBJECT_NAME_AR,
                shortName: item.SHORT_NAME,
                remarks: item.REMARKS,
                Active: item.Active === 1 ? true : false,
                objectId: item.OBJECT_ID,
            }
            methords.reset(patchObj);
        }
    }

    const loadUserRights = async (responseData: any) => {
        const param = {
            Procedure: "APP_MASTER.OBJECT_USER_RIGHTS_SPR",
            UserId: userID, // pass the user id
            CultureId: lang,
            Criteria: [
                {
                    Name: '@OBJECT_ID',
                    Value: responseData.OBJECT_ID, // pass the ID
                    IsArray: false
                }
            ]
        };
        const response = await ApiService.httpPost('data/getTable', param);
        const formattedUsers = formatAutoCompleteOptionsArray(response?.Data, 'USER_FULL_NAME', 'USER_ID');
        setSelectedUserRights(formattedUsers);
    }

    useEffect(() => {
        if (userRights?.length && selectedUserRights?.length) {
            disableIfEdit();
        }
    }, [userRights, selectedUserRights]);

    const disableIfEdit = () => {
        const updatedUserRights = userRights.map((right: any) => {
            const matchingFormatted = selectedUserRights.find((f: any) => f.value === right.value);
            if (matchingFormatted) {
                return { ...right, disabled: true };
            }
            return right;
        });

        setUserRights(updatedUserRights);
    }

    /* Tab Switch */
    const handleChangeTab = (event: React.SyntheticEvent, newValue: string) => {
        setTabValue(newValue);
    };

    /* Add User Rights */
    const selectedGroupChange = (event: any) => {
        console.log(event);
        const selectedValue = parseInt(event);
        const selectedItem = userRights.find((item: any) => item.value === selectedValue);
        const updatedItem = { ...selectedItem, disabled: true };
        const updatedUserRights = userRights.map((item: any) =>
            item.value === selectedValue ? updatedItem : item
        );
        setSelectedUserRights((prevSelectedUserRights: any) => [
            ...prevSelectedUserRights,
            updatedItem,
        ]);
        setUserRights(updatedUserRights);
    };

    /* Remove Item */
    const removeSelectedItem = (index: number) => {
        const updatedSelectedUserRights = [...selectedUserRights];
        const removedItem = updatedSelectedUserRights.splice(index, 1)[0];
        const updatedUserRights = userRights.map((item: any) =>
            item.value === removedItem.value ? { ...item, disabled: false } : item
        );
        setSelectedUserRights(updatedSelectedUserRights);
        setUserRights(updatedUserRights);
        methords.setValue('UserRights', '');
    };

    const onSubmit = (data: any, e: any) => submitItcApplication(data);
    /* Test Log */
    const onError = (errors: any, e: any) => { console.log(errors, 'errors'); console.log(e, 'event') };

    const submitItcApplication = async (data: any) => {
        console.log(data);
        const choice = await confirm({
            ui: 'confirmation',
            title: `${t('You Are About To Save')}`,
            description: `${t('Are you sure you want to Save this?')}`,
            confirmBtnLabel: `${t('Continue')}`,
            cancelBtnLabel: `${t('Cancel')}`,
        });

        if (choice) {
            const param = {
                Data: {
                    PARENT_ID: data?.objParentID === 0 ? null : data?.objParentID,
                    OBJECT_TYPE: data?.objectEnum === 0 ? null : data?.objectEnum,
                    OBJECT_ID: data?.objectId ? data?.objectId : -1,
                    OBJECT_CODE: data?.objCode,
                    OBJECT_NAME: data?.objName,
                    SHORT_NAME: data?.shortName,
                    OBJECT_NAME_AR: data?.objNameArabic,
                    SORT_ORDER: 0,
                    REMARKS: data?.remarks,
                    DATA_VALUE: 0,
                    DECIMAL_01: 0,
                    DECIMAL_02: 0,
                    TEXT_01: "",
                    TEXT_02: ""
                },
                IsActive: data?.Active ? 1 : 0,
                UserId: userID,
                MasterId: activeDetails[0]?.Master.MASTER_ID,
                SubEntities: entityGrid.filter((item: any) => item.IS_MARKED === true || item.IS_MARKED === 1).map((item: any) => item.ID_),
                UserRights: selectedUserRights.map((item: any) => item.value)
            }
            try {
                const response = await ApiService.httpPost('objects/save', param);
                if (response.Id > 0) {
                    fullviewRowAddUpdate(response.Id);
                    toast.success(response?.Message)
                    if (activeAction.MenuId === MenuId.Edit) {
                        handleCloseDialog();
                    }
                    methords.reset();
                    getInitialData();
                    setTabValue('1');
                }
                else {
                    toast.error(response?.Message)
                }
            } catch (e: any) {
                toast.error(e?.message)
            }
        }
    }

    const fullviewRowAddUpdate = (responseId: number) => {
        gridActionChangeEvent({
            id: responseId,
            status: currentPage === MenuId.New ? fullGridDataAction.InsertRow : fullGridDataAction.UpdateRow,
        });
    };

    const handlerowUpdate = (e: any) => {
        setTimeout(() => {
            console.log(e)
            console.log(entityGrid)
            const hasAny = entityGrid.some((item: any) => !!item.IS_MARKED)
            const hasAll = entityGrid.every((item: any) => !!item.IS_MARKED)
            console.log(hasAny)
            console.log(hasAll)

            setSelectAll((prev: any) => {
                const indeterminate = hasAll ? false : hasAny;
                return {
                    value: hasAny,
                    indeterminate
                }
            })
        });

    }

    const renderTitleHeader = () => {

        const handleSelectAllClick = (e: any) => {
            console.log(e);
            console.log(entityGrid)
            setSelectAll((prev: any) => {
                return {
                    indeterminate: false,
                    value: e.target.checked
                }
            })
            setEntityGrid((prev: any) => {
                const newValue = prev.map((item: any) => {
                    return {
                        ...item,
                        IS_MARKED: e.target.checked
                    }
                })
                return newValue
            })

        }

        return (
            <>
                <div className="d-flex align-items-center">
                    <Checkbox className="select-all-itc" onChange={handleSelectAllClick} indeterminate={selectAllGrid.indeterminate} checked={selectAllGrid.value} />
                    <div className="header">{t("Applicable")}</div>
                </div>
            </>)
    }



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
                    onClick={handleCloseDialog}
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

            <DialogContent dividers className="dialog-content-wrapp ">
                <Row>
                    <div className="outlined-box ">
                        <h5 className="outlined-box-head my-3"> </h5>
                        <Row>
                            <Col md={6} col={12} className="mb-3">
                                <FormInputText
                                    name="objCode"
                                    control={methords.control}
                                    label={t("Code")}
                                    readOnly={activeAction.MenuId === MenuId.View}
                                />
                            </Col>
                            <Col md={6} col={12} className="mb-3">
                                <FormInputText
                                    name="objNameArabic"
                                    control={methords.control}
                                    label={t("ITC Applications In Arabic")}
                                    errors={methords.formState.errors}
                                    align={{ textAlign: 'right' }}
                                    readOnly={activeAction.MenuId === MenuId.View}
                                />
                            </Col>
                            <Col md={6} col={12} className="mb-3">
                                <FormInputText
                                    name="objName"
                                    control={methords.control}
                                    label={t("ITC Applications In English")}
                                    errors={methords.formState.errors}
                                    align={{ textAlign: 'right' }}
                                    readOnly={activeAction.MenuId === MenuId.View}
                                />
                            </Col>
                            <Col md={6} col={12} className="mb-3">
                                <FormInputText
                                    name="shortName"
                                    control={methords.control}
                                    label={t("Short Name")}
                                    readOnly={activeAction.MenuId === MenuId.View}
                                />
                            </Col>
                            <Col col={12} className="mb-3">
                                <FormInputText
                                    name="remarks"
                                    control={methords.control}
                                    label={t("Remarks")}
                                    multiline={true}
                                    maxLength={250}
                                    readOnly={activeAction.MenuId === MenuId.View}
                                />
                            </Col>
                        </Row>
                    </div>

                    <div className="outlined-box pb-3 my-3">
                        <TabContext value={tabValue}>
                            <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                                <TabList onChange={handleChangeTab} aria-label="lab API tabs example">
                                    <Tab label={t("Sub Entities")} value="1" />
                                    <Tab label={t("User Rights")} value="2" />
                                </TabList>
                            </Box>
                            <TabPanel value="1" className="p-0">
                                <Row className="mt-3">
                                    <Col lg={12} md={12} sm={12} xs={12}>
                                        <div className="dx-grid-inner-wrapper">
                                            <DataGrid
                                                dataSource={entityGrid}
                                                showBorders={true}
                                                width="100%"
                                                key="ID_"
                                                height="100%"
                                                showColumnLines={true}
                                                showRowLines={true}
                                                rowAlternationEnabled={true}
                                                rtlEnabled={i18n.dir() === "rtl"}
                                                onRowUpdating={handlerowUpdate}
                                            >
                                                <Scrolling
                                                    mode="virtual"
                                                    rowRenderingMode="virtual"
                                                />

                                                <Editing
                                                    mode="cell"
                                                    allowUpdating={true}
                                                />

                                                <Column
                                                    dataField="SUB_ENTITY_NAME"
                                                    width={400}
                                                    allowSorting={false}
                                                    caption={t("Sub Entity Name")}
                                                    allowEditing={false}
                                                ></Column>

                                                <Column
                                                    dataField="IS_MARKED"
                                                    width={50}
                                                    allowSorting={false}
                                                    caption={t("Applicable")}
                                                    dataType="boolean"
                                                    allowEditing={activeAction.MenuId !== MenuId.View}
                                                    headerCellRender={renderTitleHeader}

                                                ></Column>
                                                {/* <Selection mode="multiple"
                                                    selectAllMode='allPages'
                                                    showCheckBoxesMode='always'
                                                    allowSelectAll={true} /> */}
                                            </DataGrid>
                                        </div>
                                    </Col>
                                </Row>
                            </TabPanel>
                            <TabPanel value="2" className="p-0">
                                <Row className="mt-3">
                                    <Col lg={12} md={12} sm={12} xs={12}>
                                        <FormInputSelect
                                            name="UserRights"
                                            control={methords.control}
                                            label={t("User List")}
                                            errors={methords.formState.errors}
                                            options={userRights}
                                            readOnly={activeAction.MenuId === MenuId.View}
                                            onChange={selectedGroupChange}
                                        />
                                    </Col>
                                </Row>
                                <Row className="mt-3">

                                    <div className="table-wrapper">
                                        <div className="table-outer itc-approval-user">
                                            <div className="table-header">
                                                <div className="element">{t("User Name")}</div>
                                                <div className="element">{t("Action")}</div>
                                            </div>
                                            {selectedUserRights && selectedUserRights.length ? (
                                                selectedUserRights.map((item: any, index: any) => (
                                                    <div key={index} className="table-body">
                                                        <div className="element justify-content-start">
                                                            {item.label}
                                                        </div>
                                                        <div className="element justify-content-center">
                                                            <IconButton
                                                                aria-label="delete"
                                                                size="small"
                                                                className="delete-trash"
                                                                onClick={() => removeSelectedItem(index)}
                                                            >
                                                                <HiOutlineTrash />
                                                            </IconButton>
                                                        </div>
                                                    </div>

                                                ))
                                            ) : (
                                                <>
                                                    <div className="no-data-table d-flex align-items-center justify-content-center py-5">
                                                        <p>{t("No Data")}</p>
                                                    </div>
                                                </>
                                            )}
                                        </div>
                                    </div>
                                </Row>
                            </TabPanel>
                        </TabContext>
                    </div>

                </Row>
            </DialogContent>

            <DialogActions className="dialog-action-buttons">
                <Row className="w-100 justify-content-between no-gutters">
                    <Col md={6}>
                        <FormInputCheckbox
                            name="Active"
                            control={methords.control}
                            label={t("Active")}
                            errors={methords.formState.errors}
                            disabled={activeAction.MenuId === MenuId.View}
                        />
                    </Col>
                    <Col md={6}>
                        <div className="d-flex justify-content-end">
                            <Button autoFocus onClick={handleCloseDialog} className="mx-3">{t("Close")}</Button>
                            <Button
                                type="submit"
                                variant="contained"
                                className="colored-btn"
                                //onClick={() => submitApprovalEscalation()}
                                onClick={methords.handleSubmit(
                                    onSubmit,
                                    onError
                                )}
                            >
                                {t("Save")}
                            </Button>
                        </div>
                    </Col>
                </Row>

            </DialogActions>

        </>
    )
} 
