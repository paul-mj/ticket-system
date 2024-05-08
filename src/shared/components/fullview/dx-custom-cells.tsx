import { GridDown, GridUp } from "../../../assets/images/svgicons/svgicons";
import { MasterId, MenuId } from "../../../common/database/enums";
import Avatar from 'react-avatar';
import FormatField from "../UI/FormatField";
import Status from "../UI/Status";
import { AddedTask } from "../../../assets/images/png/pngimages";
import { useSelector } from "react-redux";
import { popupComponent } from "../pageviewer/popup-component";
import { useState } from "react";
import { isObjectEmpty } from "../../../core/services/utility/utils";
import { fullViewRowDataContext } from "../../../common/providers/viewProvider";
import PageViewer from "../pageviewer/pageviewer";
import { useTranslation } from "react-i18next";

export const isGridCellCustomized = (field: any, masterId: any) => {
    let cellComponentName;
    switch (masterId) {
        case MasterId.Designations:
        case MasterId.ITCApplications:
        case MasterId.Departments:
        case MasterId.MeetingLocations:
        case MasterId.ITCEntities:
        case MasterId.ITCSubEntities:
        case MasterId.WorkFlow:
        case MasterId.EmailGroup:
        case MasterId.Contact:
        case MasterId.Customers:
            if (field === "Trans No") {
                cellComponentName = TransNumberComponent;
            }
            if (field === "Title") {
                cellComponentName = TitleComponent;
            }
            if (field === "Active") {
                cellComponentName = ActiveComponent;
            } else if (field === "Updated By") {
                cellComponentName = CreatedByComponent;
            }
            break;
        case MasterId.FranchiseRequestType:
            if (field === "Updated By") {
                cellComponentName = CreatedByComponent;
            }
            break;
        case MasterId.Correspondence:
        case MasterId.Announcements:
        case MasterId.Circulars:
        case MasterId.Tasks:
        case MasterId.Resolutions:
        case MasterId.Events:
        case MasterId.Requests:
        case MasterId.Meetings:
        case MasterId.Communication:
        case MasterId.NoticeBoardDesign:
        case MasterId.Gallery:
            switch (field) {
                case "Trans No":
                case "Task No":
                    cellComponentName = TransNumberComponent;
                    break;
                case "Title":
                    cellComponentName = TitleComponent;
                    break;
                case "Active":
                    cellComponentName = ActiveComponent;
                    break;
                case "Status":
                    cellComponentName = TableStatusComponent;
                    break;
                case "Created by":
                    cellComponentName = CreatedByComponent;
                    break;
                case "Direction":
                    cellComponentName = DirectionComponent;
                    break;
                case "Published":
                    cellComponentName = PublishedComponent;
                    break;
                case "Due Date":
                    cellComponentName = DueDateComponent;
                    break;
                case "Task Count":
                    cellComponentName = TaskCountComponent;
                    break;
                default:
                    // Handle the default case here, if needed
                    break;
            }
            break;
    }
    return cellComponentName;
};

export const customizeDxCell = (cell: any, column: any, CellComponent: any) => {
    if (CellComponent) {
        return (
            CellComponent && (
                <CellComponent value={cell.data[column.dataField]} cell={cell} />
            )
        );
    }
    return cell;
};


const ActiveComponent = (cell: any) => {
    const cellValue = cell.value;
    return (
        <>
            <div className="published">
                {
                    cellValue === 'Yes' ? <span className="yes">Yes</span> : <span className="no">No</span>

                }

            </div>
        </>
    );
};

const TransNumberComponent = (cell: any) => {
    const cellValue = cell.value;
    return (
        <>
            <span className={`trans__number`}>
                {cellValue ? cellValue : 'xxxx-xxxxxx'}
            </span>
        </>
    );
};

const TitleComponent = (cell: any) => {
    const cellValue = cell.value;
    const rowData = cell.cell.data;
    const { t } = useTranslation()
    const activeAction = {
        MenuName: "View",
        MenuId: MenuId.View,
    }
    const [open, setOpen] = useState(false);
    const [popupConfiguration, setPopupConfiguration] = useState<any>(null);
    const { activeDetails } = useSelector((state: any) => state.menus.activeDetails);
    const ViewGridRow = async () => {
        const popupConfig = popupComponent(activeDetails[0].Master, activeAction, rowData);
        if (!isObjectEmpty(popupConfig)) {
            setOpen(true);
            setPopupConfiguration(popupConfig);
        }
    }
    const closeDialog = async () => {
        setOpen(false);
    };
    const fullViewContext = {
        rowData,
        activeAction,
    }


    return (
        <>
            <span className={`grid__title`} onClick={ViewGridRow} title={`${t('Click to view transactoin')}`}>
                {cellValue}
            </span>

            <fullViewRowDataContext.Provider value={fullViewContext}>
                {popupConfiguration && <PageViewer open={open} onClose={closeDialog} popupConfiguration={popupConfiguration} />}
            </fullViewRowDataContext.Provider>
        </>
    );
};

const StatusComponent = (cell: any) => {
    const cellValue = cell.value;
    return (
        <>
            <span className="my_class">{cellValue}</span>
        </>
    );
};

const CorrespondenceStatusComponent = (cell: any) => {
    const cellValue = cell.value;
    return (
        <>
            <span className={`cell-class ${cellValue}`}>{cellValue}</span>
        </>
    );
};

const CodeComponent = (cell: any) => {
    const cellValue = cell.value;
    return (
        <>
            <span className="code">{cellValue}</span>
        </>
    );
};


const DirectionComponent = (cell: any) => {
    const cellValue = cell.value;
    return (
        <div className="direction">
            {
                cellValue === "IN" ?
                    <img className={`${cellValue} img-fluid`} src={GridDown} alt="" />
                    :
                    <img className={`${cellValue} img-fluid`} src={GridUp} alt="" />
            }
        </div>
    );
};


const PublishedComponent = (cell: any) => {
    const cellValue = cell.value;
    return (
        <div className="published">
            {
                cellValue === 1 ? <span className="yes">Yes</span> : <span className="no">No</span>

            }

        </div>
    );
};

const CreatedByComponent = (cell: any) => {
    const cellValue = cell.value;
    return (
        <>
            <div className="created-by-wrap">
                {cellValue && <>
                    <Avatar name={cellValue} size="25" round={true} textSizeRatio={2.55} />
                    <span className="code px-2" title={cellValue} >{cellValue}</span>
                </>}
            </div>
        </>
    );
};
const DueDateComponent = ({ value, cell }: any) => {
    const { data: { FORE_COLOR_, BACK_COLOR_ } } = cell;
    return (
        <>
            <div className="dueDate-cell" style={{ background: BACK_COLOR_, color: FORE_COLOR_ }}>
                <FormatField type='date' format="dd/mm/yyyy" delimiter="/" value={value} />
            </div>
        </>
    );
};
const TableStatusComponent = ({ cell }: any) => {
    const { data: { Status: label, STATUS_ID_: status } } = cell;
    return (
        <Status label={label} status={status} cssClass="table-cell-status" />
    )
}

const TaskCountComponent = ({ cell }: any) => {
    const cellValue = cell.value;
    return (
        <div className="task-data d-flex align-items-center justify-content-end mx-3">
            {cellValue > 0 && <> <img className={`task-full-img`} src={AddedTask} alt="" /> <span>{cellValue}</span> </>}
        </div >
    );
};
