import { useTranslation } from "react-i18next";
import TitleBox from "../../../shared/components/TitleBox";



interface TagsInterface {
    editFormattedresponse: any
}

const ViewTags = ({ editFormattedresponse }: TagsInterface) => {
    const { t } = useTranslation();

    return (
        <>
            {editFormattedresponse?.Tags?.length > 0 &&
                <TitleBox header={<>{t('Related Tags')}</>}
                    content={
                        <div className="additional-role-sec">
                        {editFormattedresponse?.Tags?.length && editFormattedresponse?.Tags.map((item: any, index: any) => (
                            <div className="additional-role-tag" title={item.TAG_NAME} key={index}>{item.TAG_NAME}</div>
                        ))}
                    </div>
                    }
                />
            }
        </>
    )
}

export default ViewTags;

