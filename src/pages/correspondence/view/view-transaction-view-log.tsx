import { useTranslation } from "react-i18next";
import TitleBox from "../../../shared/components/TitleBox";
import DataGrid, { Column, SearchPanel } from "devextreme-react/data-grid";



interface TagsInterface {
    editFormattedresponse: any
}

const ViewTransactionViewLog = ({ editFormattedresponse }: TagsInterface) => {
    const { t,i18n } = useTranslation();

    return (
        <>
            {editFormattedresponse?.TransactionViewLogs?.length > 0 &&
                <TitleBox header={<>{t('Transaction View Log')}</>}
                    content={<>

                        <div className="additional-role-sec transaction-view">

                            <DataGrid
                                dataSource={editFormattedresponse?.TransactionViewLogs}
                                allowColumnReordering={true}
                                rowAlternationEnabled={true}
                                showBorders={true}
                                rtlEnabled={i18n.dir() === "rtl"}
                            >
                                <SearchPanel visible={true} highlightCaseSensitive={true} />

                                <Column caption={t("Franchise Name")} dataField="FRANCHISE_NAME" dataType="date" />
                                <Column caption={t("User Name")} dataField="USER_FULL_NAME" dataType="string" />
                                <Column caption={t("First Viewed Date And Time")} dataField="FIRST_VIEWED_DATE" dataType="date" format="dd-MMM-yyyy HH:mm:ss" />
                                <Column caption={t("Last Viewed Date And Time")} dataField="LAST_VIEWED_DATE" dataType="date" format="dd-MMM-yyyy HH:mm:ss" />
                            </DataGrid>

                        </div>
                    </>
                    }
                />
            }
        </>
    )
}

export default ViewTransactionViewLog;

