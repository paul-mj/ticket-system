import { useTranslation } from "react-i18next";
import { ReceipentTable } from "../recipientsTable";
import TitleBox from "../../../shared/components/TitleBox";



const ViewRecipientGrid = ({ recipientsResponse }: any) => {
    const { t } = useTranslation();

    return (
        <>
            {recipientsResponse?.length > 0 &&
                <TitleBox header={<>{t('Actual Recipients')}</>}
                    content={<div className="additional-role-sec rect-table">
                        <ReceipentTable receipentTableInfo={recipientsResponse} />
                    </div>}
                />
            }
        </>
    )
}

export default ViewRecipientGrid;
