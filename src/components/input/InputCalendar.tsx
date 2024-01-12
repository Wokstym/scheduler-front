import ScheduleCalendar from "../calendar/ScheduleCalendar";
import React from "react";
import {slotToMoment} from "../calendar/common";
import {Dataset, Slot, Student} from "../../types/SimulationTypes";


function EventContent({slot, slotToStudents}: { slot: Slot, slotToStudents: Map<number, Student[]> }) {
    const students = slotToStudents.get(slot.id) || []

    return <div>
        <div className="font-bold text-2xl">{slot.name}</div>
        <div className="text-xl"><span className="font-medium">Slot id:</span> {slot.id}</div>
        <div className="text-xl"><span className="font-medium ">Seats:</span> {slot.seats}</div>
        <div className="font-medium text-xl">Have preference: ({students?.length})</div>
        <ul className="max-w-md  list-disc list-outside pl-4">
            {students.map(student => {
                const weight = student.prefersSlots[slot.id] | 0;

                return <li
                    key={`slot${slot.id}student${student.id}`}>
                    <div>
                        <div><span className="font-medium ">Name:</span> {student.name}</div>
                        <div className="text-sm"><span className="font-medium">Student id:</span> {student.id}</div>
                        <div className="text-sm"><span className="font-medium">Points put:</span> {weight}</div>
                    </div>
                </li>;
            })}
        </ul>
    </div>
}


function calculateSlotPreferencesToStudents(data: Dataset) {
    let slotToStudents = new Map<number, Student[]>();
    data.students.forEach((person) => {

        for (const slot in person.prefersSlots) {
            const studentsForSlot: Student[] = slotToStudents.get(Number(slot)) || [];
            studentsForSlot.push(person);
            slotToStudents.set(Number(slot), studentsForSlot)

        }
    })
    return slotToStudents;
}

export default function InputCalendar({data}: { data: Dataset }) {
    const slotToStudents: Map<number, Student[]> = calculateSlotPreferencesToStudents(data);

    return <ScheduleCalendar events={data.slots} transformers={{
        start: (event) => slotToMoment(event.startTime, event.day),
        end: (event) => slotToMoment(event.endTime, event.day),
        title: (event) => event.name,
        wanted: (event: Slot) => {
            const slotToStudent = slotToStudents.get(event.id) || [];
            return slotToStudent.map(s => s.prefersSlots[event.id])
                .reduce((a, b) => a + b, 0) / event.seats / 8;
        },
        details: (event) => {
            return <EventContent slot={event} slotToStudents={slotToStudents}/>
        },
        simpleTitle: (event) => event.name
    }}/>
}