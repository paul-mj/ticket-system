import { useTranslation } from "react-i18next";
import { Person } from "../../../assets/images/svgicons/svgicons";


const ViewCommentRecipients = ({ commentItem }: any) => {
    const { t } = useTranslation();

    return (
        <div className="cmt-recipients">
            <div className="cmt-recipients-sec">
                <div className="cmt-heading">{t("Recipients")}</div>
            </div>
            <div className="cmt-recipients-body">
                {commentItem?.recipients && commentItem?.recipients.map((rec: any, index: any) => (
                    <div className="each-item" key={index}>
                        <img src={Person} alt="" />
                        <div className="recipient-name">{rec.CONTACT_DET}({rec.EMAIL_ID})</div>
                    </div>))}
            </div>
        </div>
    )
}

export default ViewCommentRecipients;
