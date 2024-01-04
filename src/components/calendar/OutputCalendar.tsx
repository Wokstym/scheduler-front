import ScheduleCalendar from "./ScheduleCalendar";
import React from "react";
import {Slot, Student} from "../../utils/inputs";
import {slotToMoment} from "./common";


function EventContent({slot, students}: { slot: Slot; students: Student[] }) {

    return <div>
        <div className="font-bold">{slot.name} ({students?.length})</div>
        <div>Assigned: </div>
        <ul>
            {students.map(student => <li
                key={`slot${slot.id}student${student.id}`}>{student.name} w=({student.prefersSlots[slot.id] | 0})</li>)}
        </ul>
    </div>
}


export default function OutputCalendar({data}: { data: { slot: Slot; students: Student[] }[] }) {

    console.log(data)

    return <ScheduleCalendar events={data} transformers={{
        start: (event) => slotToMoment(event.slot.startTime, event.slot.day),
        end: (event) => slotToMoment(event.slot.endTime, event.slot.day),
        title: (event) => event.slot.name,
        details: (event) => {
            return <EventContent slot={event.slot} students={event.students}/>
        },
        simpleTitle: (event) => event.slot.name
    }}/>
}