import { Row } from "react-bootstrap";
import { useTranslation } from "react-i18next";
import TaskBoxCard from "../../../shared/components/UI/TaskBoxCard/TaskBoxCard";

interface ViewTaskInterface {
    editFormattedresponse: any;
    currentDrawerState: boolean | string;
    toggleDrawer: (anchor: any, open: boolean, cardData?: any) => any;
    handleOpenTaskDialog: (task: any) => any;
}

const ViewTaskList = ({editFormattedresponse, currentDrawerState, toggleDrawer, handleOpenTaskDialog}: ViewTaskInterface) => {
    const { t } = useTranslation();

    return (
        <div className="task-card-wrapper">
            <div className="task-heading py-3">
                {t("Tasks")}
            </div>
            {editFormattedresponse?.Tasks?.length > 0 ?
                <div className="task-card-wrapp">
                    <Row className=" h-100 align-items-center row">
                        {editFormattedresponse?.Tasks && editFormattedresponse?.Tasks.map((item: any, index: any) => (
                            <TaskBoxCard
                                isView={true}
                                key={index}
                                task={item}
                                index={index}
                                currentDrawerState={currentDrawerState}
                                toggleDrawer={toggleDrawer} 
                                openTaskDialog={handleOpenTaskDialog}/>

                        ))}
                    </Row>
                </div>
                :
                <div className="nodata pt-2 pb-4">{t("No Data")}</div>
            }
        </div>
    )
}

export default ViewTaskList;
