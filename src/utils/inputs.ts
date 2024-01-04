import moment from "moment";


export enum DayName {
    SUNDAY = "SUNDAY",
    MONDAY = "MONDAY",
    TUESDAY = "TUESDAY",
    WEDNESDAY = "WEDNESDAY",
    THURSDAY = "THURSDAY",
    FRIDAY = "FRIDAY",
    SATURDAY = "SATURDAY"
}


export type Slot = {
    name: string;
    startTime: string;
    id: number;
    endTime: string;
    day: DayName,
    seats: number
}

export type Student = {
    blockedSlotsId: number[];
    name: string;
    id: number;
    prefersSlots: Record<string, number>
    slotsToFulfill: Record<string, number>
}

const inputs: {
    slots: Slot[];
    students: Student[]
}[] = [{
    slots: [
        {
            id: 1,
            "name": "Wprowadzenie do informatyki",
            day: DayName.MONDAY,
            startTime: "10:00",
            endTime: "11:00",
            "seats": 5
        },
        {
            "id": 2,
            "name": "Analiza matematyczna",
            "day": DayName.MONDAY,
            startTime: "11:00",
            endTime: "12:00",
            "seats": 5
        },
        {
            "id": 3,
            "name": "Algebra",
            "day": DayName.MONDAY,
            startTime: "12:00",
            endTime: "13:00",
            "seats": 5
        },
        {
            "id": 4,
            "name": "Algebra",
            "day": DayName.THURSDAY,
            startTime: "13:00",
            endTime: "14:00",
            "seats": 5
        },
        {
            "id": 5,
            "name": "Analiza matematyczna",
            "day": DayName.THURSDAY,
            startTime: "18:00",
            endTime: "19:00",
            "seats": 5
        },
        {
            "id": 6,
            "name": "Wprowadzenie do informatyki",
            "day": DayName.SATURDAY,
            startTime: "10:00",
            endTime: "11:00",
            "seats": 5
        },
        {
            "id": 7,
            "name": "Algebra",
            "day": DayName.SATURDAY,
            startTime: "11:30",
            endTime: "12:00",
            "seats": 10
        },
        {
            "id": 8,
            "name": "C++",
            "day": DayName.SATURDAY,
            startTime: "10:00",
            endTime: "12:00",
            "seats": 10
        }
    ],
    students: [
        {
            "id": 1,
            "name": "grzesiek",
            "slotsToFulfill": {
                "Analiza matematyczna": 1,
                "Algebra": 1,
                "C++": 1,
                "Wprowadzenie do informatyki": 1
            },
            "prefersSlots": {
                "1": 8,
                "4": 6
            },
            "blockedSlotsId": [
                7
            ]
        },
        {
            "id": 2,
            "name": "karolina",
            "slotsToFulfill": {
                "Analiza matematyczna": 1,
                "Algebra": 1,
                "C++": 1,
                "Wprowadzenie do informatyki": 1
            },
            "prefersSlots": {
                "1": 8,
                "2": 5
            },
            "blockedSlotsId": [
                7
            ]
        },
        {
            "id": 3,
            "name": "mateusz",
            "slotsToFulfill": {
                "Analiza matematyczna": 1,
                "Algebra": 1,
                "C++": 1,
                "Wprowadzenie do informatyki": 1
            },
            "prefersSlots": {
                "3": 8,
                "4": 5
            },
            "blockedSlotsId": [
                5,
                6,
                7
            ]
        },
        {
            "id": 4,
            "name": "tomek",
            "slotsToFulfill": {
                "Analiza matematyczna": 1,
                "Algebra": 1,
                "C++": 1,
                "Wprowadzenie do informatyki": 1
            },
            "prefersSlots": {
                "7": 7,
                "8": 7
            },
            "blockedSlotsId": []
        },
        {
            "id": 5,
            "name": "romek",
            "slotsToFulfill": {
                "Analiza matematyczna": 1,
                "Algebra": 1,
                "Wprowadzenie do informatyki": 1
            },
            "prefersSlots": {
                "7": 70,
                "8": 70,
                "6": 6
            },
            "blockedSlotsId": []
        }
    ]
}]


const mappedInputs = inputs.map(input => {
    return {
        ...input, slots: input.slots.map(slot => {
            return {...slot, startTime: moment(slot.startTime, ["HH:mm"]), endTime: moment(slot.endTime, ["HH:mm:ss"])}
        })
    }
})

export {inputs, mappedInputs}

