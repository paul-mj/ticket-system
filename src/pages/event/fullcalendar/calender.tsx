import React, { useEffect, useRef, useState } from "react";
import FullCalendar from "@fullcalendar/react"; // must go before plugins
import dayGridPlugin from "@fullcalendar/daygrid"; // a plugin!
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import { INITIAL_EVENTS } from "./event-utils";
import {
    DateSelectArg,
    EventApi,
    EventClickArg,
    EventContentArg,
    EventInput,
} from "@fullcalendar/core";
import "../event.scss";
import FullCalenderToolbar from "./calender-toolbar";
import { Select, MenuItem, FormControl } from "@material-ui/core";
import { Row, Col } from "react-bootstrap";
import { useTranslation } from "react-i18next";
import { Button } from "@mui/material";
import { DayView, Filter, MonthView, WeekView } from "../../../assets/images/svgicons/svgicons";
import arLocale from '@fullcalendar/core/locales/ar'; // import the Arabic locale module  
import enGbLocale from '@fullcalendar/core/locales/en-gb';
import { addDays, addMonths } from 'date-fns';
import ApiService from "../../../core/services/axios/api";
import { CultureId } from "../../../common/application/i18n";
import localStore from "../../../common/browserstore/localstore";
import { fullViewRowDataContext } from "../../../common/providers/viewProvider";
import PageViewer from "../../../shared/components/pageviewer/pageviewer";
import { actionQueuePopup } from "../../../shared/components/pageviewer/popup-component";
import { isObjectEmpty } from "../../../core/services/utility/utils";
import { t } from "i18next";
import { MenuId } from "../../../common/database/enums";

const FullCalender: React.FC<any> = () => {
    const { t, i18n } = useTranslation();
    const currentLang = i18n.dir();
    const calanderRef = useRef<FullCalendar | null>(null);
    const [previewDate, setPreviewDate] = useState(new Date());
    const [eventData, setEventData] = useState([{}]);
    const [currentView, setCurrentView] = useState('dayGridMonth');
    const lang = CultureId();
    const userData = localStore.getLoggedInfo();
    const userID = userData && JSON.parse(userData).USER_ID;
    const franchiseID = userData && JSON.parse(userData).FRANCHISE_ID;

    const [open, setOpen] = useState(false);
    const [fullViewContext, setFullViewContext] = useState<any>();
    const [popupConfiguration, setPopupConfiguration] = useState<any>(null);

    const myLocale = {
        ...arLocale, // start with the base Arabic locale object
        buttonText: {
            today: 'اليوم',
            month: 'شهر',
            week: 'أسبوع',
            day: 'يوم',
            list: 'قائمة'
        },
        weekText: 'أسبوع',
        allDayText: 'اليوم كله',
        moreLinkText: 'أخرى',
        noEventsText: 'لم يتم توفير أي أحداث',
        dayNamesShort: ['أحد', 'إثنين', 'ثلاثاء', 'أربعاء', 'خميس', 'جمعة', 'سبت'], // add the translated day names
    };

    useEffect(() => {
        getGridData();
    }, [])

    const getGridData = async () => {
        const param = {
            CultureId: lang,
            UserId: userID,
            FranchiseId: franchiseID
        }
        const gridData = await ApiService.httpPost('data/getCalendarView', param);
        if (gridData?.Valid > 0) {
            if (gridData.Data?.length) {
                CalenderColor(gridData.Data);
                setEventData([]);
                setTimeout(() => {
                    setEventData(gridData.Data);
                });
            }
        }
    }

    const CalenderColor = (eveData: any) => {
        eveData.forEach((item: any) => {
            if (item.statusId === 31801) {
                item.textColor = "rgb(0 0 0)";
                item.backgroundColor = "rgb(255 234 167)";
            } else if (item.statusId === 31802) {
                item.textColor = "rgb(255 255 255)";
                item.backgroundColor = "rgb(29 209 161)";
            } else if (item.statusId === 31803) {
                item.textColor = "rgb(0 0 0)";
                item.backgroundColor = "rgb(255 121 121)";
            } else if (item.statusId === 31804) {
                item.textColor = "rgb(255 255 255)";
                item.backgroundColor = "rgb(255 165 2))";
            } else {
                item.textColor = "rgb(255 255 255)";
                item.backgroundColor = "rgb(127 140 141)";
            }
        });
    }

    const renderEventContent = (eventContent: EventContentArg) => {
        console.log(eventContent);
        return (
            <>
                <p
                    className="m-0 event-para"
                    style={{
                        backgroundColor: eventContent.backgroundColor,
                        color: eventContent.textColor,
                        border: `1px solid ${eventContent.textColor}`,
                    }}
                >
                    <b>{eventContent.timeText && eventContent.timeText + ','}</b> {eventContent.event.title}
                </p>
            </>
        );
    };

    const handleEventClick = (arg: EventClickArg) => {
        const argEvent = arg.event;

        onClickActionRow(argEvent._def);
    };

    const closeDialog = async (e: any) => {
        setOpen(false);

    };

    const removePopOver = () => {
        const popovers = document.querySelectorAll('.fc-popover');
        popovers.forEach((popover) => {
            popover.remove();
        });
    }



    const onClickActionRow = (item: any) => {
        const popupItem = { MASTER_ID: item.extendedProps.masterId }
        const popupConfig = actionQueuePopup(popupItem);
        if (!isObjectEmpty(popupConfig)) {
            setOpen(true);
            setPopupConfiguration({ ...popupConfig, action: { MenuId: MenuId.View }, isActionQueue: false });
            const fullViewContext = {
                rowData: { ID_: item.publicId },
                activeAction: "",
            }
            setFullViewContext(fullViewContext)
        }
    }
 

    const handleEvents = (events: EventApi[]) => {
        const event = { ...events['_def'] }
        console.log(event, 'event props');
    };

    const handleNavigate = (action: string) => {
        console.log(`Navigate ${action}`);
    };

    const getLocaleObject = (currentDir: any) => {
        switch (currentDir) {
            case 'rtl':
                return myLocale;
            default:
                return enGbLocale; // fallback to English by default
        }
    }

    const handlePrevButtonClick = () => {
        const calendar = calanderRef.current;
        if (calendar) {
            let prevDate;
            const view = calendar.getApi().view;
            switch (view.type) {
                case 'timeGridDay':
                    prevDate = addDays(previewDate, -1);
                    break;
                case 'timeGridWeek':
                    prevDate = addDays(previewDate, -7);
                    break;
                case 'dayGridMonth':
                    prevDate = new Date(previewDate.getFullYear(), previewDate.getMonth() - 1, 1);
                    break;
                default:
                    prevDate = previewDate;
            }
            setPreviewDate(prevDate);
            calendar.getApi().prev();
        }
    };

    const handleNextButtonClick = () => {
        const calendar = calanderRef.current;
        if (calendar) {
            let nextDate;
            const view = calendar.getApi().view;
            switch (view.type) {
                case 'timeGridDay':
                    nextDate = addDays(previewDate, 1);
                    break;
                case 'timeGridWeek':
                    nextDate = addDays(previewDate, 7);
                    break;
                case 'dayGridMonth':
                    nextDate = new Date(previewDate.getFullYear(), previewDate.getMonth() + 1, 1);
                    break;
                default:
                    nextDate = previewDate;
            }
            setPreviewDate(nextDate);
            calendar.getApi().next();
        }
    };

    const handleTodayButtonClick = () => {
        const calendar = calanderRef.current;
        if (calendar) {
            calendar.getApi().today();
            setPreviewDate(new Date());
        }
    };

    const handleDayButtonClick = () => {
        const calendar = calanderRef.current;
        if (calendar) {
            calendar.getApi().changeView('timeGridDay');
            setCurrentView('timeGridDay');
        }
    };

    const handleWeekButtonClick = () => {
        const calendar = calanderRef.current;
        if (calendar) {
            calendar.getApi().changeView('timeGridWeek');
            setCurrentView('timeGridWeek');
        }
    };

    const handleMonthButtonClick = () => {
        const calendar = calanderRef.current;
        if (calendar) {
            calendar.getApi().changeView('dayGridMonth');
            setCurrentView('dayGridMonth');
        }
    };


    return (
        <>
            <div className="cal-heading-sec">
                <div className="cal">{t("Calendar")}</div>
            </div>

            <div className="cal-wrapper">
                {/* Left */}
                <div className="cal-sec">
                    <Button
                        variant="contained"
                        size="small"
                        className={`cal-view ${currentView === 'dayGridMonth' ? 'active' : ''}`}
                        onClick={handleMonthButtonClick}
                    >
                        <img src={MonthView} alt="" className={`px-2 ${currentView === 'dayGridMonth' ? 'add-filter' : ''}`} />
                        {t("Month")}
                    </Button>
                    <Button
                        variant="contained"
                        size="small"
                        className={`cal-view ${currentView === 'timeGridWeek' ? 'active' : ''}`}
                        onClick={handleWeekButtonClick}
                    >
                        <img src={WeekView} alt="" className={`px-2 ${currentView === 'timeGridWeek' ? 'add-filter' : ''}`} />
                        {t("Week")}
                    </Button>
                    <Button
                        variant="contained"
                        size="small"
                        className={`cal-view ${currentView === 'timeGridDay' ? 'active' : ''}`}
                        onClick={handleDayButtonClick}
                    >
                        <img src={DayView} alt="" className={`px-2 ${currentView === 'timeGridDay' ? 'add-filter' : ''}`} />
                        {t("Day")}
                    </Button>
                </div>
                {/* Center */}
                <div className="cal-middle-sec">
                    <Button
                        className="cal-arrow"
                        variant="contained"
                        size="small"
                        onClick={handlePrevButtonClick}
                    >
                        {"<"}
                    </Button>
                    <div>{previewDate.toDateString()}</div>
                    <Button
                        className="cal-arrow"
                        variant="contained"
                        size="small"
                        onClick={handleNextButtonClick}
                    >
                        {">"}
                    </Button>
                </div>
                {/* Right */}
                <div className="cal-sec">
                    <Button
                        variant="contained"
                        size="small"
                        onClick={handleTodayButtonClick}
                        className="today-btn"
                    >
                        {t("Today")}
                    </Button>
                    {/* <Button
                        variant="contained"
                        size="small"
                    >
                        <img src={Filter} alt="" />
                    </Button> */}
                </div>
            </div>

            <div className={`h-100 frm-event-calender pb-2 ${currentLang === 'rtl' ? 'arabic-calendar' : 'english-calendar'}`}>
                {eventData && eventData?.length ?
                    <FullCalendar
                        ref={calanderRef}
                        plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
                        customButtons={{
                            filterButton: {
                                icon: 'filter',
                                click: function () {
                                    alert("clicked the Filter button!");
                                },
                            },
                        }}
                        headerToolbar={false}
                        initialView="dayGridMonth"
                        editable={true}
                        selectable={true}
                        selectMirror={true}
                        dayMaxEvents={true}
                        weekends={true}
                        direction={i18n.dir()}
                        height="100%"
                        initialEvents={eventData}
                        eventContent={renderEventContent}
                        eventClick={handleEventClick}
                        eventsSet={handleEvents}
                        locale={getLocaleObject(currentLang)}
                        dateClick={(info) => setPreviewDate(info.date)}
                    />
                    : <> </>
                }
            </div>

            <fullViewRowDataContext.Provider value={fullViewContext}>
                {popupConfiguration && <PageViewer open={open} onClose={closeDialog} popupConfiguration={popupConfiguration} />}
            </fullViewRowDataContext.Provider>
        </>
    );
};

export default FullCalender;
