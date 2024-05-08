import { AddComment, ContactCard, DownArrow, OpenInNewTab, Review } from "../../../assets/images/svgicons/svgicons";
import { useTranslation } from "react-i18next";
import ViewAttachments from "./view-attachments";
import ViewCommentRecipients from "./view-comment-recipients";
import FormatField from "../../../shared/components/UI/FormatField";
import { useState } from "react";
import { ViewMailBody } from "../viewMailBody";
import { IconButton } from "@mui/material";

interface CommentInterface {
    commentArray: any,
    addComments: () => void;
    handleImageView: any


}


const ViewCommentList = ({ commentArray, addComments, handleImageView }: CommentInterface) => {
    const { t } = useTranslation();

    const [MailCommentText, setMailCommentText] = useState<any>()
    const [manageMailDialog, setMailManageDialog] = useState<any>({
        open: '',
        onclose: null

    })

    const viewCommentBody = (data: any) => {
        setMailCommentText(data)
        setMailManageDialog({ open: "View" })
    }

    const closeMailDialog = async () => {
        setMailManageDialog({ open: null });
    };

    return (
        <>
            <div className="comment-section">
                <div className="comment-heading">
                    <div className="comment-sec">
                        <img src={Review} alt="" />
                        <div className="comment">{t("Comments")}</div>
                    </div>
                    <IconButton className="add-comment" onClick={addComments}>
                        <img src={AddComment} alt="" />
                        <div className="add-cmt">{t("Add Comments")}</div>
                    </IconButton>
                </div>
                <div>
                    {commentArray?.length ? commentArray.map((item: any, index: any) => (
                        <div className={`each-comment ${item.active ? "add" : "minus"}`} key={index}>
                            <div className="each-header" style={{ borderBottom: !item.active ? "none" : "1px solid #D3D4DB", borderRadius: !item.active ? "10px" : "10px 10px 0px 0px" }}>
                                <div className="each-header-wrap">
                                    <img src={ContactCard} alt="" />
                                    <div className="cmt-name">{item.USER_NAME}</div>
                                    <div className="cmt-date">
                                        <FormatField type='dateTime' format="dd-mmm-yyyy" delimiter="-" value={item.TRANS_DATE} />
                                    </div>
                                </div>
                                <div className="open-comments"><img onClick={() => viewCommentBody(item.TRANS_CONTENT)} src={OpenInNewTab} alt="" />
                                    {/* <img className="arrow-Accordian" src={DownArrow} alt="" onClick={() => showCommentToggle(item)} style={{ transform: !item.active ? "rotate(180deg)" : "rotate(0deg)" }} /> */}
                                </div>
                            </div> 
                            <div className="cmt-body-wrapper" style={{ height: !item.active ? "0px" : "auto" }}>
                                <div className={`cmt-body ${item.CONTENT_EDITOR_CULTURE_ID ? 'isRtl' : 'isLtr'}`} dangerouslySetInnerHTML={{ __html: item.TRANS_CONTENT }}>
                                </div>
                                <div className="cmt-attachments">

                                    {!!item.attachment?.length && <ViewAttachments
                                        editAttachments={item.attachment}
                                        handleImageView={handleImageView}
                                        colsize={4} />}
                                </div>
                                {item.recipients?.length > 0 ? <ViewCommentRecipients commentItem={item} /> : null}
                            </div>
                        </div>)) :
                        <div className="commt-no-data">
                            <div className="nodata pt-4 pb-4">{t("No Data")}</div>
                        </div>
                    }</div>
            </div>

            <ViewMailBody
                open={manageMailDialog.open === "View"}
                onClose={closeMailDialog}
                mailcontent={MailCommentText} />

        </>
    )
}

export default ViewCommentList;
