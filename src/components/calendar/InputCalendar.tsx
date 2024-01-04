import ScheduleCalendar from "./ScheduleCalendar";
import React from "react";
import {Slot, Student} from "../../utils/inputs";
import {slotToMoment} from "./common";


function EventContent({slot, slotToStudents}: { slot: Slot, slotToStudents: Map<number, Student[]> }) {
    const students = slotToStudents.get(slot.id) || []

    return <div>
        <div className="font-bold">{slot.name} ({students?.length})</div>
        <div>Signed up:</div>
        <ul>
            {students.map(student => <li
                key={`slot${slot.id}student${student.id}`}>{student.name} w=({student.prefersSlots[slot.id]})</li>)}
        </ul>
    </div>
}


export default function InputCalendar({data} : {data: { slots: Slot[]; students: Student[] }}) {


    let slotToStudents = new Map<number, Student[]>();
    data.students.forEach((person) => {

        for (var slot in person.prefersSlots) {

            var studentsForSlot: Student[] | undefined = slotToStudents.get(Number(slot))
            if (!studentsForSlot) {
                studentsForSlot = []
            }
            studentsForSlot.push(person);
            slotToStudents.set(Number(slot), studentsForSlot)

        }
    })

    return <ScheduleCalendar events={data.slots} transformers={{
        start: (event) => slotToMoment(event.startTime, event.day),
        end: (event) => slotToMoment(event.endTime, event.day),
        title: (event) => event.name,
        details: (event) => {
            return <EventContent slot={event} slotToStudents={slotToStudents}/>
        },
        simpleTitle: (event) => event.name
    }}/>
}