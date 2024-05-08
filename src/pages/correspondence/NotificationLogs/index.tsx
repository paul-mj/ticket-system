import { useTranslation } from "react-i18next";
import TitleBox from "../../../shared/components/TitleBox";
import { useCallback, useDeferredValue, useEffect, useState } from "react";
import CommonUtils from "../../../common/utils/common.utils";
import useURLParser from "../../../common/hooks/URLParser";
import ApiService from "../../../core/services/axios/api";
import Timeline from '@mui/lab/Timeline';
import TimelineItem from '@mui/lab/TimelineItem';
import TimelineSeparator from '@mui/lab/TimelineSeparator';
import TimelineConnector from '@mui/lab/TimelineConnector';
import TimelineContent from '@mui/lab/TimelineContent';
import TimelineDot from '@mui/lab/TimelineDot';
import TimelineOppositeContent, { timelineOppositeContentClasses } from '@mui/lab/TimelineOppositeContent';
import FormatField from '../../../shared/components/UI/FormatField';
import { Accordion, AccordionDetails, AccordionSummary, Card, CardContent, IconButton } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { Col, Row } from 'react-bootstrap';
import { MasterId } from "../../../common/database/enums";
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import { styled } from '@mui/material/styles';
import SearchOutlinedIcon from '@mui/icons-material/SearchOutlined';
import { ViewMailBody } from "../viewMailBody";
import ViewTransactionViewLog from "../view/view-transaction-view-log";

const StyledTableCell = styled(TableCell)(({ theme }) => ({
    [`&.${tableCellClasses.head}`]: {
        backgroundColor: 'var(--main-blue)',
        color: theme.palette.common.white,
        padding: '.5rem'
    },
    [`&.${tableCellClasses.body}`]: {
        padding: '.5rem',
    },
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
    '&:nth-of-type(odd)': {
        backgroundColor: theme.palette.action.hover,
    },
    // hide last border
    '&:last-child td, &:last-child th': {
        border: 0,
    },
}));

const RecipientsTable = ({ list = [] }: { list: any[] }) => {
    const [recipients, setRecipients] = useState<any[]>([])
    const { t } = useTranslation();
    const [search, setSearch] = useState('');
    const deferredSearch = useDeferredValue(search);
    const onSearchHandler = useCallback((e: any) => {
        const { target: { value } } = e;
        setSearch(value);
    }, [])
    const filterList = useCallback(() => {
        const changeToUpper = (array: string[]) => {
            return array.map((keyword: string) => keyword ? keyword.toUpperCase() : keyword)
        }
        const filtered = list.filter((item: any) => {
            return changeToUpper([item['Mail ID'], item['User Name'], item.Franchise ?? ''])
                .join('')
                .includes(deferredSearch.toUpperCase())
        });
        setRecipients(filtered);
    }, [deferredSearch, list])
    useEffect(() => {
        filterList();
    }, [deferredSearch, filterList])
    useEffect(() => {
        setRecipients(list)
    }, [list])
    return (
        <div>
            <div>
                <div className="search-wrapper">
                    <div className="search-ip-wrap position-relative my-3">
                        <input type="text" placeholder={t("Search") ?? 'Search'} className="w-100" onInput={onSearchHandler} />
                        <div className="search-icon">
                            <SearchOutlinedIcon fontSize="inherit" />
                        </div>
                    </div>
                </div>
            </div>
            <div>
                <TableContainer component={Paper}>
                    <Table aria-label="customized table">
                        <TableHead>
                            <TableRow>
                                <StyledTableCell>{t('User Name')}</StyledTableCell>
                                <StyledTableCell>{t('Email')}</StyledTableCell>
                                <StyledTableCell>{t('Franchise')}</StyledTableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {recipients.map((item: any, index: number) => (
                                <StyledTableRow key={index}>
                                    <StyledTableCell component="th" scope="row">
                                        {item['User Name']}
                                    </StyledTableCell>
                                    <StyledTableCell>{item['Mail ID']}</StyledTableCell>
                                    <StyledTableCell>{item.Franchise}</StyledTableCell>
                                </StyledTableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            </div>
        </div>
    )
}

const LogsContent = ({ list }: { list: any[] }) => {
    const { t } = useTranslation();
    const [contentBody, setContentBody] = useState(null);
    const onPreviewClickHandler = (item: any) => {
        setContentBody(item);
    }
    return (<>
        <div>
            {list.length ?
                <Timeline sx={{
                    [`& .${timelineOppositeContentClasses.root}`]: {
                        flex: 0,
                        flexBasis: '13rem'
                    },
                }}>
                    {list.map(({ Data, Recipients }: any, index: number) =>
                        <TimelineItem key={index}>
                            <TimelineOppositeContent color="text.secondary">
                                <div><FormatField type='dateTime' format="dd-mmm-yyyy" delimiter="-" value={Data.CREATED_DATE} /></div>
                            </TimelineOppositeContent>
                            <TimelineSeparator>
                                <TimelineDot variant="outlined" />
                                <TimelineConnector />
                            </TimelineSeparator>
                            <TimelineContent>
                                <Card className='timeline-notification-card' variant="outlined">
                                    <CardContent>
                                        <div className='timeline-log'>
                                            <Row className='align-items-center'>
                                                <Col md={3}>
                                                    <div className='timeline-log-group'>
                                                        <p className='timeline-log-title'>
                                                            {t("Name")}:
                                                        </p>
                                                        <p className='timeline-log-content'>
                                                            {Data.CREATED_USER}
                                                        </p>
                                                    </div>
                                                </Col>
                                                <Col md={8}>
                                                    <div className='timeline-log-group'>
                                                        <p className='timeline-log-title'>
                                                            {t("Type")}:
                                                        </p>
                                                        <p className='timeline-log-content'>
                                                            {Data.NOTIFICATION_TYPE}
                                                        </p>
                                                    </div>
                                                </Col>
                                                <Col md={1} className="text-right">
                                                    <IconButton
                                                        aria-label="calendar"
                                                        size="small"
                                                        className="primary-icon-btn"
                                                        onClick={() => onPreviewClickHandler(Data.CONTENT)}
                                                    >
                                                        <OpenInNewIcon />
                                                    </IconButton>
                                                </Col>
                                            </Row>
                                            <Row className='align-items-center pt-3'>
                                                <Col>
                                                    <Accordion style={{ border: '1px solid #ccc', boxShadow: 'none' }}>
                                                        <AccordionSummary
                                                            expandIcon={<ExpandMoreIcon />}
                                                            aria-controls="panel1a-content"
                                                            id="panel1a-header"
                                                        >
                                                            {t("Recipients")}
                                                        </AccordionSummary>
                                                        <AccordionDetails>
                                                            <RecipientsTable list={Recipients ?? []} />
                                                        </AccordionDetails>
                                                    </Accordion>
                                                </Col>
                                            </Row>
                                        </div>
                                    </CardContent>
                                </Card>
                            </TimelineContent>
                        </TimelineItem>
                    )}
                </Timeline> :
                <p className="mt-4 text-center">{t("No logs available")}</p>}
        </div>
        <ViewMailBody mailcontent={contentBody} open={!!contentBody} onClose={() => { setContentBody(null) }} />
    </>
    )
}



const NotificationLogs = ({ rowID, isTask }: { rowID: number, isTask?: boolean }) => {
    const [logs, setLogs] = useState<any[]>([]);
    const [useViews, setUseViews] = useState<any[]>([]);

    const { t } = useTranslation();
    const { UserId, FranchiseId, CultureId } = CommonUtils.userInfo;

    const getLogs = useCallback(async () => {
        const payload = {
            UserId,
            CultureId,
            TransId: !isTask ? rowID : null,
            TaskId: isTask ? rowID : null,
            FranchiseId
        }
        const { Logs } = await ApiService.httpPost('trans/getMailLogs', payload);
        setLogs(Logs ?? []);
    }, [CultureId, FranchiseId, UserId, isTask, rowID]);

    const getUserView = useCallback(async () => {
        const param = {
            Procedure: "FRM_TRANS.TASK_USER_VIEWED_SPR",
            UserId,
            CultureId,
            Criteria: [
                {
                    Name: "@TASK_ID",
                    Value: rowID,  
                    IsArray: false
                }
            ]
        }

        const {Data} = await ApiService.httpPost('data/getTable', param);
        console.log(Data, 'data');
        setUseViews(Data ?? []);
    }, [CultureId, UserId, rowID])

    useEffect(() => {
        getLogs();
        isTask && getUserView();
    }, [getLogs, getUserView, isTask])

    return (
        <>
            {isTask ?
                <div className="mb-3">
                     <ViewTransactionViewLog editFormattedresponse={{TransactionViewLogs: useViews}} />
                </div>
            : null}
            <TitleBox header={<>{t('Notification Logs')}</>}
                content={<LogsContent list={logs} />}
            />
        </>
    )
}
export default NotificationLogs;