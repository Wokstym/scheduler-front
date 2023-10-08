import React, {useMemo, useState} from 'react';
import './App.css';
import {Calendar, momentLocalizer, Views} from 'react-big-calendar'
import moment from 'moment'
import 'react-big-calendar/lib/css/react-big-calendar.css';
import {results, classes} from "./events";
import Modal from "./Modal";


function hashCode(str: string) {
    let hash = 0;
    for (var i = 0; i < str.length; i++) {
        hash = str.charCodeAt(i) + ((hash << 5) - hash);
    }
    return hash;
}

const stringToColour = (str: string) => {
    return `hsl(${(hashCode(str) + 100) % 360}, 100%, 30%)`;
}

function App() {
    const localizer = momentLocalizer(moment)

    const [modalState, setModalState] = useState({
        open: false,
        content: ""
    });

    function closeModal() {
        setModalState({
            open: false,
            content: ""
        })
    }

    function openModal(content: string) {
        setModalState({
            open: true,
            content: content
        })
    }

    const classesCut = classes.map(e => ({
        ...e,
        title: e.title.slice(0, e.title.indexOf(")") + 1),
        all: e.title
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


    return (
        <div>
            <Modal isOpen={modalState.open} onClose={closeModal}>
                <div className="p-8 whitespace-pre-wrap">
                {modalState.content}
                </div>
            </Modal>

            <div>
                <span className="bold text-3xl"> Klasy</span>
                <div className="h-[1500px]">
                    <Calendar
                        formats={formats}
                        min={new Date(2020, 1, 0, 8, 0, 0)}
                        max={new Date(2020, 1, 0, 20, 0, 0)}
                        localizer={localizer}
                        defaultView={Views.WEEK}
                        events={classesCut}
                        startAccessor="start"
                        endAccessor="end"
                        eventPropGetter={(event, start, end, isSelected)=> ({
                            style: {
                                backgroundColor: stringToColour(event.title.slice(0, 7)),
                            }
                        })}
                        // onSelectEvent={(event) => window.alert(event.title)}
                        onSelectEvent={(event) => {
                            openModal(event.all)
                        }}
                    />
                </div>
            </div>
            <div>
                <span className="bold text-3xl"> Wyniki</span>
                <div className="h-[1500px]">
                    <Calendar
                        formats={formats}
                        min={new Date(2020, 1, 0, 8, 0, 0)}
                        max={new Date(2020, 1, 0, 20, 0, 0)}
                        localizer={localizer}
                        defaultView={Views.WEEK}
                        onSelectEvent={(event) => {
                            openModal(event.title)
                        }}
                        events={results}
                        startAccessor="start"
                        endAccessor="end"
                        eventPropGetter={(event, start, end, isSelected)=> ({
                            style: {
                                backgroundColor: stringToColour(event.title.slice(0, 7)),
                            }
                        })}
                    />
                </div>
            </div>
        </div>
    );
}

export default App;
