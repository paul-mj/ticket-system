import * as React from 'react';
import Timeline from '@mui/lab/Timeline';
import TimelineItem from '@mui/lab/TimelineItem';
import TimelineSeparator from '@mui/lab/TimelineSeparator';
import TimelineConnector from '@mui/lab/TimelineConnector';
import TimelineContent from '@mui/lab/TimelineContent';
import TimelineDot from '@mui/lab/TimelineDot';
import TimelineOppositeContent, { timelineOppositeContentClasses } from '@mui/lab/TimelineOppositeContent';
import FormatField from '../../../shared/components/UI/FormatField';
import { Card, CardContent } from '@mui/material';
import { Col, Row } from 'react-bootstrap';
import './timeLineLogs.scss'
import { useTranslation } from "react-i18next";
import ProgressStatus from '../../../shared/components/UI/ProgressStatus';
import { ReactFileViewer } from '../../../shared/components/dialogs/Preview/react-file-viewer';
import TitleBox from '../../../shared/components/TitleBox';
import ImageShowCard from '../../../shared/components/UI/ImageCard/ImageCard';

export default function TimeLineLogs({ list }: any) {
    const { t } = useTranslation();
    const [previewParam, setPreviewParam] = React.useState({
        popupOpenState: false,
        image: null
    });
    const handleImageView = (image: any) => {
        setPreviewParam({
            popupOpenState: true,
            image: image
        })
    }
    const handleclosePreview = () => {
        setPreviewParam({
            popupOpenState: false,
            image: null
        })
    }
    return (
        <TitleBox header={<>{t('Status Log')}</>}
            content={
                <div>
                    {list.length ?
                        <Timeline sx={{
                            [`& .${timelineOppositeContentClasses.root}`]: {
                                flex: 0,
                                flexBasis: '13rem'
                            },
                        }}>
                            {list.map((item: any) =>
                                <TimelineItem key={item.ID_}>
                                    <TimelineOppositeContent color="text.secondary">
                                        <div><FormatField type='dateTime' format="dd-mmm-yyyy" delimiter="-" value={item.STATUS_TIME} /></div>
                                    </TimelineOppositeContent>
                                    <TimelineSeparator>
                                        <TimelineDot variant="outlined" />
                                        <TimelineConnector />
                                    </TimelineSeparator>
                                    <TimelineContent>
                                        <Card className='timeline-card'>
                                            <CardContent>
                                                <div className='timeline-log'>
                                                    <Row className='align-items-center'>
                                                        <Col>
                                                            <div className='timeline-log-group'>
                                                                <p className='timeline-log-title'>
                                                                    {t("Name")}:
                                                                </p>
                                                                <p className='timeline-log-content'>
                                                                    {item.USER_FULL_NAME}
                                                                </p>
                                                            </div>
                                                        </Col>
                                                        <Col>
                                                            <div className='timeline-log-group justify-content-start'>
                                                                <p className='timeline-log-title'>
                                                                    {t("Status")}:
                                                                </p>
                                                                <p className='timeline-log-content'>
                                                                    {item.STATUS_NAME}  {item?.STATUS_COMPLETION_DATE ?  <>- <FormatField type='date' format="dd-mmm-yyyy" delimiter="-" value={item?.STATUS_COMPLETION_DATE} /></>: ''}
                                                                </p>
                                                            </div>
                                                        </Col>
                                                        <Col>
                                                            <div className='timeline-log-group justify-content-end'>
                                                                <p className='timeline-log-title'>
                                                                    {t("Completion")}:
                                                                </p>
                                                                <p className='timeline-log-content'>
                                                                    <ProgressStatus operatorDetails={{ STS: '', ...item }} />
                                                                </p>
                                                            </div>
                                                        </Col>
                                                    </Row>
                                                    <Row>
                                                        <Col>
                                                            <div className='timeline-log-group flex-column mt-2 align-items-start gap-0'>
                                                                <p className='timeline-log-title m-0'>
                                                                    {t("Remarks")}
                                                                </p>
                                                                <p className='timeline-log-content m-0'>
                                                                    {item.STATUS_REMARKS}
                                                                </p>
                                                            </div>
                                                        </Col>
                                                    </Row>
                                                    {!!item.attachments.length && <div className="image-list-wrap">
                                                        <Row className=" h-100 align-items-center selected_doc_corrs row">
                                                            {item.attachments.map((item: any, index: any) => (
                                                                <ImageShowCard
                                                                    key={index}
                                                                    image={item}
                                                                    index={index}
                                                                    handleImageView={handleImageView}
                                                                    colsize={12}
                                                                />
                                                            ))}
                                                        </Row>
                                                    </div>
                                                    }
                                                </div>
                                            </CardContent>
                                        </Card>
                                    </TimelineContent>
                                </TimelineItem>
                            )}
                        </Timeline> :
                        <p className="mt-4 text-center">{t("No logs available")}</p>}
                    <ReactFileViewer previewParentProps={previewParam} onClose={handleclosePreview} > </ReactFileViewer>
                </div>
            }
        />
    );
}