import {Calendar, momentLocalizer, Views} from "react-big-calendar";
import React, {useEffect, useMemo, useState} from "react";
import moment from "moment/moment";
import Modal from "../modal/Modal";

require('moment/locale/pl.js')

type BackgroundStyle = { backgroundColor?: string, background?: string };

function cutTypeFromTitle(title: string) {
    const x: number = title.indexOf(" - ")
    if (x != -1) {
        return title.slice(0, x)
    }
    return title
}


function colorFromHue(title: string, hue: number | undefined): BackgroundStyle {
    const index = title.indexOf(" - ")
    if (index != -1) {
        return {
            backgroundColor: `hsl(${hue}, 100%, 30%)`
        };
    }

    return {
        background: `repeating-linear-gradient(
                      45deg,
                      hsl(${hue}, 100%, 30%),
                      hsl(${hue}, 100%, 30%) 10px,
                      hsl(${hue}, 100%, 35%) 10px,
                      hsl(${hue}, 100%, 35%) 20px
                    )`
    }
}

function getStyle(title: string, hueMap: Map<String, number>): BackgroundStyle {
    const hue = hueMap.get(cutTypeFromTitle(title))
    return colorFromHue(title, hue)
}

function calculateTitleToHue(strings: string[]): Map<String, number> {
    const titlesWithoutType = Array.from(new Set(strings.map(e => cutTypeFromTitle(e))))

    const multiplier = 360 / titlesWithoutType.length
    let current = 0;
    const result = new Map<String, number>()

    for (const value of titlesWithoutType) {
        result.set(value, current * multiplier)
        current++
    }
    return result
}

function useChangeableParams(eventsMapped: {
    start: Date;
    end: Date;
    title: React.ReactNode;
    details: React.ReactNode;
}[]) {
    const [minTime, setMinTime] = useState(Math.min(...eventsMapped.map(e => e.start.getHours()), 10))
    const [maxTime, setMaxTime] = useState(Math.max(...eventsMapped.map(e => e.end.getHours()), 18))

    const [hasWeekendEvent, setHasWeekendEvent] = useState(eventsMapped.some(e => e.start.getDay() === 6 || e.start.getDay() == 7))

    useEffect(() => {
        setMinTime(Math.min(...eventsMapped.map(e => e.start.getHours()), 10))
    }, [eventsMapped]);

    useEffect(() => {
        setMaxTime(Math.max(...eventsMapped.map(e => e.end.getHours()), 18))
    }, [eventsMapped]);

    useEffect(() => {
        setHasWeekendEvent(eventsMapped.some(e => e.start.getDay() === 6 || e.start.getDay() == 7))
    }, [eventsMapped]);
    return {minTime, maxTime, hasWeekendEvent};
}

export interface ScheduleCalendarProps<T> {
    events: T[];
    transformers: {
        start: (event: T) => Date
        end: (event: T) => Date
        title: (event: T) => React.ReactNode
        details: (event: T) => React.ReactNode
        simpleTitle: (event: T) => string,
        wanted?: (event: T) => number,
    }
}

type InternalEvent = {
    start: Date
    end: Date
    title: React.ReactNode
    details: React.ReactNode
    style: BackgroundStyle,
    wanted?: number
};
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

    const hueMap = calculateTitleToHue(events.map(e => transformers.simpleTitle(e)))

    const eventsMapped: InternalEvent[] = events.map(e => {
        return ({
            start: transformers.start(e),
            end: transformers.end(e),
            title: transformers.title(e),
            details: transformers.details(e),
            style: getStyle(transformers.simpleTitle(e), hueMap),
            wanted: transformers.wanted ? transformers.wanted(e) : undefined
        });
    })


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
    const {minTime, maxTime, hasWeekendEvent} = useChangeableParams(eventsMapped);


    let EventComponent = (event: { title: string, event: InternalEvent }) => {
        return <div className="relative h-full">
            {event.event.title}
            {event.event.wanted ?
                <div className="absolute left-2 bottom-2">{event.event.wanted.toFixed(2)}</div> : null}
        </div>;
    };
    return <>
        <Modal isOpen={modalState.open} onClose={closeModal} className="rounded-2xl">
            <div className="p-8 whitespace-pre-wrap rounded-2xl">
                {modalState.content}
            </div>
        </Modal>
        <Calendar
            formats={formats}
            date={new Date(2023, 0, 2, 2, 0, 0)}
            min={new Date(2020, 1, 0, minTime, 0, 0)}
            max={new Date(2020, 1, 0, maxTime, 0, 0)}
            localizer={localizer}
            defaultView={hasWeekendEvent ? Views.WEEK : Views.WORK_WEEK}
            views={['week', 'work_week']}
            view={hasWeekendEvent ? 'week' : 'work_week'}
            onView={() => {}}
            components={{
                event: EventComponent
            }}
            events={eventsMapped}
            startAccessor="start"
            endAccessor="end"
            toolbar={false}
            eventPropGetter={(event) => ({
                style: event.style
            })}
            onSelectEvent={(event) => {
                openModal(event.details)
            }}
            onNavigate={() => {}}
        /></>
}


export default ScheduleCalendar;