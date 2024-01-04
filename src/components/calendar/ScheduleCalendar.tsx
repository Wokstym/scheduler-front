import {Calendar, momentLocalizer, Views} from "react-big-calendar";
import React, {useMemo, useState} from "react";
import moment from "moment/moment";
import Modal from "../modal/Modal";

require('moment/locale/pl.js')


function hashCode(str: string) {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
        hash = str.charCodeAt(i) + ((hash << 5) - hash);
    }
    return hash;
}

const stringToColour = (str: string) => {
    return `hsl(${(hashCode(str) + 100) % 360}, 100%, 30%)`;
}

export interface ScheduleCalendarProps<T> {
    events: T[];
    transformers: {
        start: (event: T) => Date
        end: (event: T) => Date
        title: (event: T) => React.ReactNode
        details: (event: T) => React.ReactNode
        simpleTitle: (event: T) => string
    }
}

const ScheduleCalendar = <T, >({events, transformers}: ScheduleCalendarProps<T>) => {

    const [modalState, setModalState] = useState<{ open: boolean; content: undefined | React.ReactNode }>({
        open: false,
        content: undefined
    });


    function openModal(content: React.ReactNode) {
        setModalState({
            open: true,
            content: content
        })
    }

    function closeModal() {
        setModalState({
            open: false,
            content: undefined
        })
    }


    const eventsMapped: {
        start: Date
        end: Date
        title: React.ReactNode
        details: React.ReactNode
        simpleTitle: string
    }[] = events.map(e => ({
        start: transformers.start(e),
        end: transformers.end(e),
        title: transformers.title(e),
        details: transformers.details(e),
        simpleTitle: transformers.simpleTitle(e)
    }))


    const formats = useMemo(() => ({
        // the 'date' on each day cell of the 'month' view
        dateFormat: 'D',
        // the day of the week header in the 'month' view
        // @ts-ignore
        weekdayFormat: (date, culture, localizer) =>
            localizer.format(date, 'dddd', culture),
        // the day header in the 'week' and 'day' (Time Grid) views
        // @ts-ignore
        dayFormat: (date, culture, localizer) =>
            localizer.format(date, 'dddd', culture),
        // the time in the gutter in the Time Grid views
        // @ts-ignore
        timeGutterFormat: (date, culture, localizer) =>
            localizer.format(date, 'HH:mm', culture),
    }), [])


    const localizer = momentLocalizer(moment)

    const minTime = Math.min(...eventsMapped.map(e => e.start.getHours()))
    const maxTime = Math.max(...eventsMapped.map(e => e.end.getHours()))


    return <>
        <Modal isOpen={modalState.open} onClose={closeModal}>
            <div className="p-8 whitespace-pre-wrap">
                {modalState.content}
            </div>
        </Modal>
        <Calendar
            formats={formats}
            date={new Date(2023, 0, 2, 2, 0, 0)}
            min={new Date(2020, 1, 0, minTime, 0, 0)}
            max={new Date(2020, 1, 0, maxTime, 0, 0)}
            localizer={localizer}
            defaultView={Views.WEEK}
            views={['week']}
            events={eventsMapped}
            startAccessor="start"
            endAccessor="end"
            toolbar={false}
            eventPropGetter={(event, start, end, isSelected) => ({
                style: {
                    backgroundColor: stringToColour(event.simpleTitle.slice(0, 7)),
                }
            })}
            onSelectEvent={(event) => {
                openModal(event.details)
            }}
            onNavigate={() => {
            }}
        /></>
}


export default ScheduleCalendar;