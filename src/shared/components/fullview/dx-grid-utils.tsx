import { MasterId } from "../../../common/database/enums";

export const removeUnderscoreFromColumns = (columns: any) => {
    return columns.map((column: any) => {
        if (column.dataField.endsWith("_")) {
            column.dataField = column.dataField.slice(0, -1);
            console.log(column.dataField);
        }
        return column;
    });
};

export const removeUnderscores = (cellData: any) => {
    const value = cellData.value;
    const newValue = value.endsWith('_') ? value.slice(0, -1) : value;
    return <span>{newValue}</span>;
}


export const gridRowModification = (e: any, masterID: any) => {
    switch (masterID) {
        case MasterId.Tasks:
            break;

        default:
            break;
    }
}
export const gridColumnModification = (e: any, masterID: any) => {
    switch (masterID) {
        case MasterId.Tasks:
            break;

        default:
            break;
    }
} 