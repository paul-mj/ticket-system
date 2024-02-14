import { Col, Row } from "react-bootstrap";
import { AddedTask } from "../../../../assets/images/png/pngimages";
import { IconButton } from "@mui/material";
import { HiOutlinePencilSquare, HiOutlineTrash } from "react-icons/hi2";
import FormatField from "../FormatField";
import "./TaskBoxCard.scss";
import { BsEye } from "react-icons/bs";

interface TaskCard {
    isView?: boolean | null;
    task: any;
    index: number;
    currentDrawerState: any;
    handleTaskEdit?: (task: any) => void;
    handleTaskDelete?: (task: any) => void;
    openTaskDialog: (task: any) => void;
    toggleDrawer?: (anchor: any, open: boolean, cardData?: any) => void;
}

const TaskBoxCard = ({
    isView,
    task,
    index,
    currentDrawerState,
    handleTaskEdit,
    handleTaskDelete,
    openTaskDialog,
    toggleDrawer,
}: TaskCard) => {



    return (
        <Col md={6} className="mb-2 w-100" key={task.TASK_ID}>
            <Row className="each-img-sec align-items-center no-gutters task-smp-card position-relative" style={{ animation: 'slowTransition 1s ease-out' }}>
                {/*  {JSON.stringify(task)} */}
                <Col md={2}>
                    <div className="sel-items-wrap-task">
                        <img className="task-img" src={AddedTask} alt="" />
                    </div>
                </Col>
                <Col md={7} >
                    <Row>
                        <Col md={12}><p className="task-title m-0" title={task.TASK_TITLE}>{task.TASK_TITLE}</p></Col>
                        <Col md={12}>
                            <div className="d-flex align-items-center justify-content-between">
                                <p className="task-sub m-0">
                                    <span className="tsk-title">Task No : </span>
                                    <span className="tsk-val">{task?.TASK_NO ? task?.TASK_NO : '#######'} </span>
                                </p>
                                <p className="task-sub m-0">
                                    <span className="tsk-title">Due Date : </span>
                                    <span className="tsk-val"><FormatField type='date' format="dd-mmm-yyyy" delimiter="-" value={task.DUE_DATE} /></span>
                                </p>
                            </div>
                        </Col>
                    </Row>
                </Col>

                <Col md={3} >
                    <Row className="justify-content-end align-items-center no-gutters">
                        {(!isView && handleTaskDelete && handleTaskEdit) &&
                            <>
                                <IconButton
                                    aria-label="trash"
                                    size="small"
                                    className="mx-2 px-1 delete-trash"
                                    onClick={() => handleTaskDelete(task)}
                                >
                                    <HiOutlineTrash />
                                </IconButton>
                                <IconButton
                                    aria-label="pencil"
                                    size="small"
                                    className="mx-2 px-1 edit-pencil"
                                    onClick={() => handleTaskEdit(task)}
                                >
                                    <HiOutlinePencilSquare />
                                </IconButton>
                                {/* <button onClick={() => openTaskDialog(task)}>Task Dialog</button>*/}
                            </>
                        }
                        {isView &&
                            <>
                                <IconButton
                                    aria-label="eye"
                                    size="small"
                                    className="mx-2 px-1 view-eye"
                                    onClick={() => toggleDrawer && toggleDrawer(currentDrawerState, true, task)}
                                >
                                    <BsEye />
                                </IconButton>
                                {/* <button onClick={() => openTaskDialog(task)}>Task Dialog</button> */}
                            </>
                        }
                    </Row>
                </Col>
            </Row>
        </Col>

    )
}

export default TaskBoxCard;
