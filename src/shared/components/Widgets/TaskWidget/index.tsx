import { CardContent, Card } from "@material-ui/core";
import './TaskWidget.scss';
import DescriptionOutlinedIcon from '@mui/icons-material/DescriptionOutlined';
import FormatField from "../../UI/FormatField";
import { Col, Row } from "react-bootstrap";
import { AiOutlineEye, AiOutlineSend } from "react-icons/ai";
import { t } from "i18next";
import { useTranslation } from "react-i18next";
import CommonUtils from "../../../../common/utils/common.utils";
import { useNavigate } from "react-router-dom";
import { RedirectUrl } from "../../../../layouts/menu-utils";
import { IconButton } from "@mui/material";
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import PeopleAltIcon from '@mui/icons-material/PeopleAlt';
import { MenuId } from "../../../../common/database/enums";
import { glassTick } from "../../../../assets/images/svgicons/svgicons";

const TaskWidgetItem = ({ item }: any) => {
    const { userType } = CommonUtils.userInfo;
    const navigate = useNavigate();
    const { t, i18n } = useTranslation();
    const onCardClick = () => {
        const { MASTER_ID, TASK_ID } = item
        const query: any = {
            mr: MASTER_ID,
            mn: MenuId.View,
            ut: userType,
            id: TASK_ID
        }
        const url = new URLSearchParams(query).toString()
        navigate(`/view?${url}`);
    }
    return (
        <>
            {/* 
                <Card>
                    <CardContent>
                        <div className="d-flex justify-content-between align-items-end gap-2">
                            <div className="d-flex align-items-end">
                                <span className="text-orange"><DescriptionOutlinedIcon/></span>
                                <span>{item.TASK_TITLE}</span>
                            </div>
                            <div className="d-flex due-date gap-1 ms-auto">
                                <span>Due:</span> 
                                <span><FormatField type='date' format="dd-mmm-yyyy" delimiter="-" value={item?.DUE_DATE} /></span>
                            </div>
                            <div>
                                
                            </div>
                        </div>
                    </CardContent>
                </Card>
            */}
            <div className="task_widget_wrapper">
                <Row className='no-gutters align-items-center'>
                    <Col md={2}>
                        <img src={glassTick} className="sized-img" alt="" />
                    </Col>

                    <Col md={4} className="mt-2">
                        <span className="trans_no">{item.TASK_NO}</span>
                    </Col>
                    <Col md={5} className="mt-2 text-center">
                        <div className='d-flex justify-content-start align-items-center'>
                            <span className='w-info-label'>{t("Due:")}</span>
                            <span className='w-info-content'><FormatField type='date' format="dd-mmm-yyyy" delimiter="-" value={item?.DUE_DATE} /></span>
                        </div>
                    </Col>
                    <Col md={1} className='text-right p-0'>
                        <IconButton
                            aria-label="calendar"
                            size="small"
                            className="primary-icon-btn"
                            onClick={onCardClick}
                        >
                            <OpenInNewIcon />
                        </IconButton>
                    </Col>
                </Row>
                <Row className="align-items-center mt-2">
                    <Col md={8} className="mt-2">
                        <span className='w-info-title'> {item.TASK_TITLE}</span>
                    </Col>
                    <Col md={4} className="p-0">
                        <div className='d-flex justify-content-end align-items-center'>
                            <span className="w-info-content">
                                <span title={`${t("Assigned user count")}`} className="mx-2">
                                    <PeopleAltIcon className="send_outlined" /> {item.TOT_COUNT}
                                </span>
                                <span title={`${t("Viewed Count")}`} className="mx-2">
                                    <AiOutlineEye className="eye_outlined" /> {item.VIEW_OR_COMPLETED_COUNT}
                                </span>
                            </span>
                        </div>
                    </Col>
                </Row>
            </div>

        </>
    )
}
const TaskWidget = ({ list }: { list: any[] }) => {
    return (
        <div className="d-flex flex-column gap-3 task-widget mt-2">
            {list && list.map((item) =>
                <TaskWidgetItem key={item.TASK_ID} item={item} />
            )}
        </div>
    )
}
export default TaskWidget;