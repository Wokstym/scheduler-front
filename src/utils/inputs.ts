import {DayName, LabeledDataset} from "../types/SimulationTypes";

const defaultInputs: LabeledDataset[] = [
    {
        label: "Domyślny przykład",
        dataset: {
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
                    "day": DayName.FRIDAY,
                    startTime: "10:00",
                    endTime: "11:00",
                    "seats": 5
                },
                {
                    "id": 7,
                    "name": "Algebra",
                    "day": DayName.FRIDAY,
                    startTime: "11:30",
                    endTime: "12:00",
                    "seats": 10
                },
                {
                    "id": 8,
                    "name": "C++",
                    "day": DayName.FRIDAY,
                    startTime: "10:00",
                    endTime: "12:00",
                    "seats": 10
                },
                {
                    "id": 9,
                    "name": "Algebra",
                    "day": DayName.FRIDAY,
                    startTime: "12:00",
                    endTime: "12:30",
                    "seats": 10
                }
            ],
            students: [
                {
                    "id": 1,
                    "name": "grzesiek",
                    "slotsToFulfill": {
                        "Analiza matematyczna": 1,
                        "Algebra": 2,
                        "Wprowadzenie do informatyki": 1
                    },
                    "prefersSlots": {
                        "1": 8,
                        "7": 8,
                        "9": 8
                    },
                    "blockedSlotsId": []
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
                        "7": 8,
                        "8": 8,
                        "6": 6
                    },
                    "blockedSlotsId": []
                }
            ]
        }
    }]


export {defaultInputs}

