import DataGrid, { Column, SearchPanel } from "devextreme-react/data-grid";
import { useTranslation } from "react-i18next";

interface GridListItem {
    ID_: number;
    Status: string;
    "User Name": string;
    "Contact Name": string | null;
    "Mail Id": string;
    "Status Remarks": string;
    "Status Date": string;
}


interface StatusGridInterface {
    gridList: GridListItem[]
}

const MeetingStatusGrid = ({ gridList }: StatusGridInterface) => {
    
    const { t } = useTranslation();

    return (
        <DataGrid
            dataSource={gridList}
            allowColumnReordering={true}
            rowAlternationEnabled={true}
            showBorders={true}
        >
            <SearchPanel visible={true} highlightCaseSensitive={true} />
            <Column caption={t("User Name")} dataField='User Name' dataType="string" />
            <Column caption={t("Contact Name")} dataField='Contact Name' dataType="string" />
            <Column caption={t("Email ID")} dataField='Email ID' dataType="string" />
            <Column caption={t("Status")} dataField='Status' dataType="string" />
            <Column caption={t("Status Date")} dataField={t('Status Date')} dataType="date" format="dd-MMM-yyyy" />
            <Column caption={t("Status Remarks")} dataField={t('Status Remarks')} dataType="string" /> 
        </DataGrid>
    )
}

export default MeetingStatusGrid;
