import ScheduleCalendar from "../calendar/ScheduleCalendar";
import React from "react";
import {slotToMoment} from "../calendar/common";
import {Slot, Student} from "../../types/SimulationTypes";


function EventContent({slot, students}: { slot: Slot; students: Student[] }) {

    return <div>
        <div className="font-bold text-2xl">{slot.name}</div>
        <div className="text-xl"><span className="font-medium">Slot id:</span> {slot.id}</div>
        <div className="text-xl"><span className="font-medium ">Seats:</span> {slot.seats}</div>
        <div className="font-medium text-xl">Assigned students: ({students?.length})</div>
        <ul className="max-w-md  list-disc list-outside pl-4">
            {students.map(student => {
                const weight = student.prefersSlots[slot.id] | 0;

                return <li
                    key={`slot${slot.id}student${student.id}`}>
                    <div>
                        <div><span className="font-medium ">Name:</span> {student.name}</div>
                        <div className="text-sm"><span className="font-medium">Student id:</span> {student.id}</div>
                        <div className="text-sm"><span className="font-medium">Happiness achieved:</span> {weight}</div>


                    </div>
                </li>;
            })}
        </ul>
    </div>
}


export default function OutputCalendar({data}: { data: { slot: Slot; students: Student[] }[] }) {


    return <div className="h-[1500px]">
        <ScheduleCalendar events={data} transformers={{
            start: (event) => slotToMoment(event.slot.startTime, event.slot.day),
            end: (event) => slotToMoment(event.slot.endTime, event.slot.day),
            title: (event) => event.slot.name,
            details: (event) => {
                return <EventContent slot={event.slot} students={event.students}/>
            },
            simpleTitle: (event) => event.slot.name
        }}/>
    </div>
}