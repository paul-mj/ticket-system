import React from "react";
import { useTranslation } from "react-i18next";
import TitleBox from "../../../shared/components/TitleBox";

interface RelationInterface {
    editFormattedresponse: any
}

const ViewRelations = ({ editFormattedresponse }: RelationInterface) => {
    const { t } = useTranslation();

    return (
        <React.Fragment>
            {editFormattedresponse?.Relations?.length > 0 &&
                <TitleBox header={<>{t('Related Items')}</>}
                    content={
                        <div className="additional-role-sec">
                            {editFormattedresponse?.Relations?.length && editFormattedresponse?.Relations.map((item: any, index: any) => (
                                <div className="additional-role-tag" key={index}>{item.TRANS_NO}</div>
                            ))}
                        </div>
                    }
                />
            }
        </React.Fragment>
    )
}

export default ViewRelations;
