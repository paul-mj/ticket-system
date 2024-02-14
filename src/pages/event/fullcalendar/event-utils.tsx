import { EventInput } from '@fullcalendar/core'

let eventGuid = 0
let todayStr = new Date().toISOString().replace(/T.*$/, '') // YYYY-MM-DD of today

/* export const INITIAL_EVENTS: EventInput[] = [
  {
      "id": '152',
      "title": "دعوة المدراء العامين للشركات المشغلة لحضور حفل تكريم الشركاء للعام 2022",
      "start": "2023-05-11T26:38:59.86",
      "end": "2023-05-26T16:38:59.86",
      "optionalFlag": 31501,
      "statusId": 31701,
      "allDay": false,
      "textColor": "", 
      "backgroundColor": ""
  },
  {
      "id": '153',
      "title": "دعوة المدراء العامين للشركات المشغلة لحضور حفل تكريم الشركاء للعام 2022",
      "start": "2023-05-11T16:38:59.86",
      "end": "2023-05-12T16:38:59.86",
      "optionalFlag": 31501,
      "statusId": 31701,
      "allDay": false,
      "textColor": "",
      "backgroundColor": ""
  }
] */
export const INITIAL_EVENTS: EventInput[] = [
  {
    "id": "0",
    "title": "Google Meet Initiated with User",
    "start": "2023-02-08T12:30:00",
    "allDay": false,
    "textColor": "rgb(13 106 59)",
    "backgroundColor": "rgb(194 235 214)"
  },
  {
    "id": "1",
    "title": "Google Meet Initiated with User",
    "start": "2023-06-13T12:30:00",
    "allDay": false,
    "textColor": "rgb(37 111 181)",
    "backgroundColor": "rgb(200 228 255)"
  },
  {
    "id": "2",
    "title": "All-day event",
    "start": "2023-06-14T12:30:00",
    "textColor": "rgb(163 122 0)",
    "backgroundColor": "rgb(255 217 102)"
  },
  {
    "id": "3",
    "title": "Zoom Meeting Initiated with User",
    "start": "2023-06-14T12:30:00",
    "allDay": false,
    "textColor": "rgb(178 12 0)",
    "backgroundColor": "rgb(255 211 210)"
  },
  {
    "id": "4",
    "title": "All-day event",
    "start": "2023-06-26",
    "textColor": "rgb(163 122 0)",
    "backgroundColor": "rgb(255 217 102)"
  },
  {
    "id": "5",
    "title": "Zoom Meeting Initiated with User, 23 to 25",
    "start": "2023-06-23T11:30:00",
    "end": "2023-02-23T12:30:00",
    "allDay": false,
    "textColor": "rgb(178 12 0)",
    "backgroundColor": "rgb(255 211 210)"
  },
  {
    "id": "6",
    "title": "Zoom Meeting Initiated with User",
    "start": "2023-06-24T12:30:00",
    "allDay": false,
    "textColor": "rgb(13 106 59)",
    "backgroundColor": "rgb(194 235 214)"
  },
  {
    "id": "7",
    "title": "Zoom Meeting Initiated with User, 23 to 25",
    "start": "2023-06-10T11:30:00",
    "end": "2023-06-10T12:30:00",
    "allDay": false,
    "textColor": "rgb(178 12 0)",
    "backgroundColor": "rgb(255 211 210)"
  }
]

export function createEventId() {
  return String(eventGuid++)
}



