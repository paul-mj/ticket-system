import { Card, CardContent } from '@material-ui/core';
import './RequestWidget.scss';
import Status from '../../UI/Status';
import { useState } from 'react';
import DescriptionOutlinedIcon from '@mui/icons-material/DescriptionOutlined';
import FormatField from '../../UI/FormatField';
import ComputerIcon from '@mui/icons-material/Computer';
import { Col, Row } from 'react-bootstrap';
import { t } from 'i18next';
import { useTranslation } from 'react-i18next';
import CommonUtils from '../../../../common/utils/common.utils';
import { useNavigate } from 'react-router-dom';
import { IconButton } from '@mui/material';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import { MenuId } from '../../../../common/database/enums';
import { glassInfo, glassDiscount } from '../../../../assets/images/svgicons/svgicons';

const RequestWidgetItem = ({ item }: any) => {
    const { userType } = CommonUtils.userInfo;
    const navigate = useNavigate();
    const [showPanel, setShowPanel] = useState(false);
    const handlePanelShow = () => {
        setShowPanel(prev => !prev);
    }
    const onCardClick = (e: any) => {
        e.stopPropagation()
        const { MASTER_ID, TRANS_ID } = item

        const query: any = {
            mr: MASTER_ID,
            mn: MenuId.View,
            ut: userType,
            id: TRANS_ID
        }
        const url = new URLSearchParams(query).toString()
        navigate(`/view?${url}`);
    }
    const { t, i18n } = useTranslation();
    return (
        <>

            <div className='req__card__wrap'>
                <div className='initial_show_block' title={`${showPanel ? `${t('Click to Hide Details')}` : `${t('Click to View Details')}`}`} onClick={handlePanelShow}>
                    <Row className='no-gutters'>
                        <Col md={2}>
                            {item.REQ_ID === 33302 ?
                                <img src={glassInfo} className="sized-img" alt='' /> :
                                <img src={glassDiscount} className="sized-img" alt='' />}
                        </Col>
                        <Col md={4}>
                            <span className='trans_no'>{item.TRANS_NO}</span>
                        </Col>
                        <Col md={5}>
                            <Status label={item.STATUS_NAME} status={item.STATUS_ID} />
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
                            <span className='sub_leng_text'>{item.SUBJECT_TEXT}</span>
                        </Col>
                    </Row>
                </div>
                <div className={`details_show_block ${showPanel ? 'showPanel' : ''}`} title={`${showPanel ? `${t('Click to Hide Details')}` : `${t('Click to View Details')}`}`} onClick={handlePanelShow}>
                    {
                        showPanel &&
                        <Row className='no-gutters'>
                            <Col md={12}>
                                <div className='d-flex align-items-center my-2'>
                                    <span className='w-info-label'>{t("Application")}:</span>
                                    <span className='w-info-content'>{item.APPLICATION_NAME}</span>
                                </div>
                            </Col>
                            <div className='d-flex align-items-center justify-content-between'>
                                <div className='d-flex justify-content-start align-items-center'>
                                    <span className='w-info-label'>{t("By")}:</span>
                                    <span className='w-info-content'>{item.CREATED_BY}</span>
                                </div>
                                <div className='d-flex justify-content-end align-items-center'>
                                    <span className='w-info-label'>{t("On")}:</span>
                                    <span className='w-info-content'><FormatField type='date' format="dd-mmm-yyyy" delimiter="-" value={item?.TRANS_DATE} /></span>
                                </div>
                            </div>
                        </Row>

                    }
                </div>
            </div>


        </>
    )
}
const RequestWidget = ({ list }: { list: any[] }) => {
    return (
        <div className="d-flex flex-column gap-3 request-widget mt-2">
            {list && list.map((item) =>
                <RequestWidgetItem key={item.TRANS_ID} item={item} />
            )}
        </div>
    )
}

export default RequestWidget;