
import { useNavigate } from "react-router-dom";
import { MenuId } from "../../../../common/database/enums";
import CommonUtils from "../../../../common/utils/common.utils";
import { Col, Row } from "react-bootstrap";
import Status from "../../UI/Status";
import { IconButton } from "@mui/material";
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import { glassConnect } from "../../../../assets/images/svgicons/svgicons";
import './RecentWidget.scss'

const RecentWidgetItem = ({ item }: any) => {
    const { userType } = CommonUtils.userInfo;
    const navigate = useNavigate();

    const onCardClick = (e: any) => {
        e.stopPropagation() 
        console.log(item, 'item');
        console.log(userType, 'userType');
        console.log(e, 'event to view item');
        const query: any = {
            mr: item.MASTER_ID_,
            mn: MenuId.View,
            ut: userType,
            id: item.TRANS_ID
        }
        console.log(query, 'query');
        const url = new URLSearchParams(query).toString()
        navigate(`/view?${url}`);
    }

    return (
        <>
            <div className='req__card__wrap'>
                <div className='initial_show_block' title={`Request One`}>
                    <Row className='no-gutters'>
                        <Col md={2}>
                            <img src={glassConnect} alt="" className="sized-img recent" />
                        </Col>
                        <Col md={4}>
                            <span className='trans_no'>{item.TransNo}</span>
                        </Col>
                        <Col md={5}>
                            <Status label={item.Status} status={item.STATUS_ID} />
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
                    <Row className='no-gutters pt-2'>
                        <Col md={12}>
                            <span className='sub_leng_text'>{item.Title}</span>
                        </Col>
                    </Row>
                </div>
            </div>
        </>
    )
}


const RecentWidget = ({ list }: { list: any[] }) => {
    return (
        <div className="d-flex flex-column gap-3 request-widget mt-2">
            {list && list.map((item) =>
                <RecentWidgetItem key={item.TRANS_ID} item={item} />
            )}
        </div>
    )
}

export default RecentWidget;