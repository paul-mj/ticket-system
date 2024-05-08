import DataGrid, { Column, SearchPanel } from "devextreme-react/data-grid";
import { useTranslation } from "react-i18next";

export const ReceipentTable = (props: any) => {
    const { receipentTableInfo } = props;
    const { t, i18n } = useTranslation();

    return (
        <DataGrid
            dataSource={receipentTableInfo}
            allowColumnReordering={true}
            rowAlternationEnabled={true}
            showBorders={true}
            rtlEnabled={i18n.dir() === "rtl"}
        > 
            <SearchPanel visible={true} highlightCaseSensitive={true} />

            <Column caption={t("Operator")} dataField="Franchise" dataType="date" />
            <Column caption={t("Origin of Entry")} dataField="Entry Origin" dataType="string" />
            <Column caption={t("Contact Name")} dataField="Contact Name" dataType="string" />
            <Column caption={t("Inner Group Name")} dataField="Inner Group Name" dataType="string" />
            <Column caption={t("Email ID")} dataField="Mail ID" dataType="string" />
            <Column caption={t("Orgin Group Name")} dataField="Origin Group Name" dataType="string" />
            <Column caption={t("Role")} dataField="Role" dataType="string" />
            <Column caption={t("User Name")} dataField="User Name" dataType="string" />
        </DataGrid>
    ) 
}
