import { Row } from "react-bootstrap";
import ImageShowCard from "../../../shared/components/UI/ImageCard/ImageCard";
import { useTranslation } from "react-i18next";
 
interface AttachmentInterface {
    editAttachments: any;
    handleImageView: (image: any) => any;
    colsize?: number;
}

const ViewAttachments = ({ editAttachments, handleImageView, colsize }: AttachmentInterface) => {
    // console.log(editAttachments)
    const { t } = useTranslation();

    return (
        <div className="image-list-sec border-box">
            <div className="task-heading py-3">
                {t("Attachments")}
            </div>
            {editAttachments?.length > 0 ?
                <div className="image-list-wrap">
                    <Row className=" h-100 align-items-center selected_doc_corrs row">
                        {editAttachments?.length && editAttachments.map((item: any, index: any) => (
                            <ImageShowCard
                                key={index}
                                image={item}
                                index={index}
                                handleImageView={handleImageView}
                                colsize={colsize}
                            />
                        ))}
                    </Row>
                </div>
                :
                <div className="nodata pt-2 pb-4">{t("No Data")}</div>
            }
        </div>
    )
}

export default ViewAttachments;
