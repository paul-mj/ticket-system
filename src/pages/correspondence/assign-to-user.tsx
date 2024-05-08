import { Button, Dialog, DialogContent, DialogTitle, IconButton, Box, Tab, DialogActions } from "@mui/material"
import React, { useEffect, useState } from "react";
import PixOutlinedIcon from "@mui/icons-material/PixOutlined";
import CloseIcon from "@mui/icons-material/Close";
import localStore from "../../common/browserstore/localstore";
import { CultureId } from "../../common/application/i18n";
import "./viewTask.scss";
import SearchOutlinedIcon from '@mui/icons-material/SearchOutlined';
import ApiService from "../../core/services/axios/api";
import { CheckboxTicked, CheckboxUnticked, NextArrowBtn, Person, PrevArrowBtn } from "../../assets/images/svgicons/svgicons";
import { DragDropContext, Draggable, Droppable } from "react-beautiful-dnd";
import axios from "axios";
import { Col } from "react-bootstrap";
import { FormInputText } from "../../shared/components/form-components/FormInputText";
import { useForm } from 'react-hook-form';
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useConfirm } from "../../shared/components/dialogs/confirmation";
import { toast } from "react-toastify";
import { t } from "i18next";
import { useTranslation } from "react-i18next";


const schema = yup.object().shape({
    Remarks: yup.string().notRequired()
});

export const AssignToUser = (props: any) => {
    const { open, onClose, taskId, response } = props;
    // console.log(taskId)
    const confirm = useConfirm();
    const { t, i18n } = useTranslation();
    const [scroll, setScroll] = React.useState("paper");
    const lang = CultureId();
    const userData = localStore.getLoggedInfo();
    const userID = userData && JSON.parse(userData).USER_ID;
    const franchiseID = userData && JSON.parse(userData).FRANCHISE_ID;
    const [fromUser, setFromUser] = useState<any>();
    const [fromUserDuplicate, setFromUserDuplicate] = useState<any>();
    const [toUser, setToUser] = useState<any>();
    const [toUserDuplicate, setToUserDuplicate] = useState<any>();
    const [searchKey, setSearchKey] = useState<any>();

    const { control, handleSubmit, formState: { errors }, watch, trigger } = useForm({
        resolver: yupResolver(schema),
        defaultValues: {
            Remarks: "",
        },
    });

    useEffect(() => {
        fetchInitailData();
    }, []);

    // const fetchInitailData = async () => {
    //     const ViewTableParam = {
    //         Procedure: "FRM_TRANS.FRANCHISE_USER_LIST_SPR",
    //         UserId: userID,
    //         CultureId: lang,
    //         Criteria: [
    //             {
    //                 Name: "@FRANCHISE_ID",
    //                 Value: franchiseID, // pass the user franchise id
    //                 IsArray: false
    //             }
    //         ]
    //     }
    //     const Recipientsresponse = await ApiService.httpPost("data/getTable", ViewTableParam);

    //     const filteredResponse = Recipientsresponse.Data && Recipientsresponse.Data.map((c: any) => {
    //         return { ...c, isClicked: false }
    //     })
    //     setFromUser(filteredResponse)
    //     setFromUserDuplicate(filteredResponse)
    // };

    const fetchInitailData = async () => {
        const ViewTableParam = {
            Procedure: "FRM_TRANS.FRANCHISE_USER_LIST_SPR",
            UserId: userID,
            CultureId: lang,
            Criteria: [
                {
                    Name: "@FRANCHISE_ID",
                    Value: franchiseID, // pass the user franchise id
                    IsArray: false
                }
            ]
        }

        const RightTableParam = {
            Procedure: "FRM_TRANS.TASK_ASSIGN_USER_LIST_SPR",
            UserId: userID, // pass the user id
            CultureId: lang,
            Criteria: [
                {
                    Name: "@FRANCHISE_ID",
                    Value: franchiseID, // pass the user franchise id
                    IsArray: false
                },
                {
                    Name: "@TASK_ID",
                    Value: taskId, // pass the task id
                    IsArray: false
                }
            ]
        }

        try {
            const [readLeftTableDetails, readRightTableDetails] = await axios.all([
                ApiService.httpPost('data/getTable', ViewTableParam),
                ApiService.httpPost('data/getTable', RightTableParam)

            ]);
            const fromData = readLeftTableDetails.Data.filter((item: any) => {
                const isDuplicate = readRightTableDetails.Data.some((rightItem: any) => rightItem.USER_ID === item.USER_ID);
                return !isDuplicate
            })
            response(readRightTableDetails.Data)
            const filteredResponse = fromData && fromData.map((c: any) => {
                return { ...c, isClicked: false }
            })
            setFromUser(filteredResponse)
            setFromUserDuplicate(filteredResponse)

            const filteredRightResponse = readRightTableDetails.Data && readRightTableDetails.Data.map((c: any) => {
                return { ...c, isClicked: false }
            })
            setToUser(filteredRightResponse)
            setToUserDuplicate(filteredRightResponse)

        } catch (error) {
            console.error(error);
        }
    }


    const handleSearch = (event: any) => {
        if (event.target.value) {
            setSearchKey(event.target.value)
            const results = fromUser?.filter((item: any) =>
                item?.USER_NAME?.toLowerCase().includes(searchKey.toLowerCase()))
            setFromUser(results)
        } else {
            setFromUser(fromUserDuplicate)
        }

    }

    const handleRightSearch = (event: any) => {
        if (event.target.value) {
            setSearchKey(event.target.value)
            const results = toUser?.filter((item: any) =>
                item?.USER_NAME?.toLowerCase().includes(searchKey.toLowerCase()))
            setToUser(results)
        } else {
            setToUser(toUserDuplicate)
        }

    }

    const filterSelectedItems = (userDet: any) => {
        // console.log(userDet)
        setFromUser((Array: any) => Array.map((item: any) => item.USER_NAME === userDet.USER_NAME ? { ...item, isClicked: !item.isClicked } : item));
        // console.log(fromUser)
    }

    const filterSelectedItemsBack = (userDet: any) => {
        // console.log(userDet)
        setToUser((sentArrayBack: any) => sentArrayBack.map((item: any) => item.USER_NAME === userDet.USER_NAME ? { ...item, isClicked: !item.isClicked } : item));
        // console.log(fromUser)
    }

    const pushSelectedItems = () => {
        const filteredXArray = fromUser.filter((a: any) => a.isClicked === true);
        const removedArray = fromUser.filter((item: any) => !item.isClicked);
        const updatedYArray = [...toUser, ...filteredXArray.filter((item: any) => item.isClicked).map((item: any) => ({ ...item, isClicked: false }))];
        setToUser(updatedYArray);
        setFromUser(removedArray)
        // console.log(filteredXArray)
        // console.log(updatedYArray)
    }

    const pushBackSelectedItems = () => {
        const filteredArrayBack = toUser.filter((a: any) => a.isClicked === true);
        const removedArray = toUser.filter((item: any) => !item.isClicked);
        const updatedYArray = [...fromUser, ...filteredArrayBack.filter((item: any) => item.isClicked).map((item: any) => ({ ...item, isClicked: false }))];
        setToUser(removedArray);
        setFromUser(updatedYArray)
        // console.log(filteredArrayBack)
        // console.log(updatedYArray)
    }



    // const handleDragEnd = (result: any) => {
    //     const { source, destination } = result;

    //     // If dropped outside the droppable area or no destination is specified, do nothing
    //     if (!destination) {
    //         return;
    //     }

    //     // Copy the dragged item from the source list
    //     const draggedItem = source.droppableId === "fromUser"
    //         ? fromUser[source.index]
    //         : toUser[source.index];

    //     // Remove the item from the source list
    //     let updatedFromUser = [...fromUser];
    //     let updatedToUser = [...toUser];
    //     if (source.droppableId === "fromUser") {
    //         updatedFromUser.splice(source.index, 1);
    //     } else {
    //         updatedToUser.splice(source.index, 1);
    //     }

    //     // Insert the dragged item into the destination list at the specified index
    //     if (destination.droppableId === "fromUser") {
    //         updatedFromUser.splice(destination.index, 0, draggedItem);
    //     } else {
    //         updatedToUser.splice(destination.index, 0, draggedItem);
    //     }

    //     setFromUser(updatedFromUser);
    //     setToUser(updatedToUser);
    // };

    const handleDragEnd = (result: any) => {
        const { source, destination } = result;

        // If dropped outside the droppable area or no destination is specified, do nothing
        if (!destination) {
            return;
        }

        // Copy the dragged item from the source list
        const draggedItem = source.droppableId === "fromUser"
            ? fromUser[source.index]
            : toUser[source.index];

        // Remove the item from the source list
        let updatedFromUser = [...fromUser];
        let updatedToUser = [...toUser];
        if (source.droppableId === "fromUser") {
            updatedFromUser.splice(source.index, 1);
        } else {
            updatedToUser.splice(source.index, 1);
        }

        // Insert the dragged item into the destination list at the specified index
        if (destination.droppableId === "fromUser") {
            updatedFromUser.splice(destination.index, 0, draggedItem);
        } else {
            updatedToUser.splice(destination.index, 0, draggedItem);
        }

        // If the destination list is empty, add the dragged item to the toUser array
        if (destination.droppableId === "toUser" && updatedToUser.length === 0) {
            updatedToUser = [draggedItem];
        }

        // Update the state using the useState hook
        setFromUser(updatedFromUser);
        setToUser(updatedToUser);
    };




    const onClickChangeStatus = async () => {
        if(!toUser.length){
            toast.error(t('Select User'), { autoClose: 3000 });
            return;
        }
        const isValid = await handleSubmit(async (data) => {
            const { Remarks } = data;
            const userIds = toUser.map((user: any) => user.USER_ID);
            const param = {
                CultureId: lang,
                FranchiseId: franchiseID,
                TaskId: taskId,
                UserId: userID,
                Lines: userIds,
                Remarks: Remarks
            }
            const choice = await confirm({
                ui: "confirmation",
                title: `${t("Assign Users")}`,
                description: `${t("Do you wish to submit?")}`,
                confirmBtnLabel: `${t("Yes")}`,
                cancelBtnLabel: `${t("No")}`,
            });

            if (!choice) {
                return;
            }

            const response = await ApiService.httpPost("trans/assignTask", param);
            if (response.Id > 0) {
                toast.success(response?.Message, { autoClose: 3000 });
                onClose(true);
                fetchInitailData();
                console.log(response);
            } else {
                toast.error(response?.Message, { autoClose: 3000 });
            }
        })();
    };





    return (
        <React.Fragment>
            <Dialog onClose={onClose} open={open} fullWidth={true} maxWidth={'lg'}>
                <DialogTitle sx={{ m: 0, p: 2 }} className="dialog_title_wrapper">
                    <p className="dialog_title">
                        <img src={Person} alt="" />
                        <span className="mx-2">{t("Assign To User")}
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

                    {/* <div className="assign-to-user-wrap">
                        <div className="left-section">
                            <div className="left-search">
                                <div className="search-wrapper">
                                    <div className="search-ip-wrap position-relative">
                                        <input type="text" placeholder="Search" className="w-100" onChange={(event) => handleSearch(event)} />
                                        <div className="search-icon">
                                            <SearchOutlinedIcon fontSize="inherit" />
                                        </div>
                                    </div>
                                    <div className="search-result-wrap">
                                    </div>
                                </div>
                            </div>
                            <div className="left-body">
                                {fromUser && fromUser.map((item: any, index: any) => (
                                    <div className="each-item-wrap" key={index} onClick={() => filterSelectedItems(item)}>
                                        <img
                                            src={item?.isClicked === true ? CheckboxTicked : CheckboxUnticked}
                                            alt=""
                                            style={item?.isClicked ? { filter: 'invert(37%) sepia(63%) saturate(847%) hue-rotate(77deg) brightness(94%) contrast(84%)' } : {}}
                                        />
                                        <div className="each-item">{item.USER_NAME}</div>
                                    </div>
                                ))}
                                {fromUser?.length === 0 &&
                                    <div className="nodata">No Data</div>
                                }
                            </div>

                        </div>
                        <div className="assign-btn-wrap">
                            <button onClick={() => pushSelectedItems()}>
                                <img src={NextArrowBtn} alt="" />
                            </button>
                            <button onClick={() => pushBackSelectedItems()}>
                                <img src={PrevArrowBtn} alt="" />
                            </button>
                        </div>
                        <div className="right-section">
                            <div className="right-search">
                                <div className="search-wrapper">
                                    <div className="search-ip-wrap position-relative">
                                        <input type="text" placeholder="Search" className="w-100" />
                                        <div className="search-icon">
                                            <SearchOutlinedIcon fontSize="inherit" />
                                        </div>
                                    </div>
                                    <div className="search-result-wrap">
                                    </div>
                                </div>
                            </div>
                            <div className="right-body">
                                {toUser && toUser.map((item: any, index: any) => (
                                    <div className="each-item-wrap" key={index} onClick={() => filterSelectedItemsBack(item)}>
                                        <img
                                            src={item?.isClicked === true ? CheckboxTicked : CheckboxUnticked}
                                            alt=""
                                            style={item?.isClicked ? { filter: 'invert(37%) sepia(63%) saturate(847%) hue-rotate(77deg) brightness(94%) contrast(84%)' } : {}}
                                        />
                                        <div className="each-item">{item.USER_NAME}</div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div> */}

                    <DragDropContext onDragEnd={handleDragEnd}>
                        <div className="assign-to-user-wrap">
                            <div className="left-section">
                                <div className="left-search">
                                    <div className="search-wrapper">
                                        <div className="search-ip-wrap position-relative">
                                            <input type="text" placeholder={t("Search")?? 'Search'} className="w-100" onChange={handleSearch} />
                                            <div className="search-icon">
                                                <SearchOutlinedIcon fontSize="inherit" />
                                            </div>
                                        </div>
                                        <div className="search-result-wrap"></div>
                                    </div>
                                </div>
                                <p className="mb-0 user-list-title">{t('User List')}</p>
                                <div className="left-body">
                                    <Droppable droppableId="fromUser">
                                        {(provided) => (
                                            <div {...provided.droppableProps} ref={provided.innerRef}>
                                                {fromUser.map((item: any, index: any) => (
                                                    <Draggable key={item.USER_ID} draggableId={item.USER_ID.toString()} index={index}>
                                                        {(provided) => (
                                                            <div
                                                                {...provided.draggableProps}
                                                                {...provided.dragHandleProps}
                                                                ref={provided.innerRef}
                                                            >
                                                                <div className="each-item-wrap" onClick={() => filterSelectedItems(item)}>
                                                                    <img
                                                                        src={item.isClicked ? CheckboxTicked : CheckboxUnticked}
                                                                        alt=""
                                                                        style={item.isClicked ? { filter: 'invert(37%) sepia(63%) saturate(847%) hue-rotate(77deg) brightness(94%) contrast(84%)' } : {}}
                                                                    />
                                                                    <div className="each-item">{item.USER_NAME}</div>
                                                                </div>
                                                            </div>
                                                        )}
                                                    </Draggable>
                                                ))}
                                                {provided.placeholder}
                                            </div>
                                        )}
                                    </Droppable>

                                    {fromUser?.length === 0 && <div className="nodata">{t("No Data")}</div>}
                                </div>
                            </div>
                            <div className="assign-btn-wrap">
                                <button onClick={pushSelectedItems}>
                                    <img src={NextArrowBtn} alt="" />
                                </button>
                                <button onClick={pushBackSelectedItems}>
                                    <img src={PrevArrowBtn} alt="" />
                                </button>
                            </div>
                            <div className="right-section">
                                <div className="right-search">
                                    <div className="search-wrapper">
                                        <div className="search-ip-wrap position-relative">
                                            <input type="text" placeholder={t("Search")?? 'Search'} className="w-100" onChange={handleRightSearch} />
                                            <div className="search-icon">
                                                <SearchOutlinedIcon fontSize="inherit" />
                                            </div>
                                        </div>
                                        <div className="search-result-wrap"></div>
                                    </div>
                                </div>
                                <p className="mb-0 user-list-title">{t('Assigned User List')}</p>
                                <div className="right-body">
                                    <Droppable droppableId="toUser">
                                        {(provided) => (
                                            <div
                                                {...provided.droppableProps}
                                                ref={provided.innerRef}
                                                style={{ height: "100%" }} // Set the desired height here
                                            >
                                                {toUser?.length === 0 ? (
                                                    <>
                                                        <div className="nodata">{t("No Data")}</div>
                                                        <div className="nodata">{t("Add Users using")} {'–>'} {t("or Drag and drop from the list")} </div>
                                                    </>
                                                ) : (
                                                    <>
                                                        {toUser.map((item: any, index: any) => (
                                                            <Draggable key={item.USER_ID} draggableId={item.USER_ID.toString()} index={index}>
                                                                {(provided) => (
                                                                    <div
                                                                        {...provided.draggableProps}
                                                                        {...provided.dragHandleProps}
                                                                        ref={provided.innerRef}
                                                                    >
                                                                        <div className="each-item-wrap" onClick={() => filterSelectedItemsBack(item)}>
                                                                            <img
                                                                                src={item.isClicked ? CheckboxTicked : CheckboxUnticked}
                                                                                alt=""
                                                                                style={item.isClicked ? { filter: 'invert(37%) sepia(63%) saturate(847%) hue-rotate(77deg) brightness(94%) contrast(84%)' } : {}}
                                                                            />
                                                                            <div className="each-item">{item.USER_NAME}</div>
                                                                        </div>
                                                                    </div>
                                                                )}
                                                            </Draggable>
                                                        ))}
                                                        {provided.placeholder}
                                                    </>
                                                )}
                                            </div>
                                        )}
                                    </Droppable>

                                </div>
                            </div>
                        </div>
                    </DragDropContext>
                    <Col md={12} className="pt-3">
                        <FormInputText
                            name="Remarks"
                            control={control}
                            label={t("Remarks")}
                            errors={errors}
                        />
                    </Col>
                </DialogContent>
                <DialogActions>
                    <DialogActions className="assign-action-buttons">
                        <div className="comment-head">
                            <Button autoFocus onClick={() => onClose(true)}>{t("Cancel")}</Button>
                            <Button
                                type="submit"
                                variant="contained"
                                className="colored-btn"
                                onClick={() => onClickChangeStatus()}
                            >
                                {t("Submit")}
                            </Button>
                        </div>
                    </DialogActions>
                </DialogActions>

                {/*  <Button 
             type="submit"
             variant="contained"
             className="colored-btn"
            
            onClick={onClose}>Close</Button>
     */}
            </Dialog>

        </React.Fragment >
    )

}
