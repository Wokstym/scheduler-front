import moment from "moment";
import {Dataset, DayName} from "../types/SimulationTypes";

export function algorithmToNiceName(alg: string) {
    switch (alg) {
        case "CP_SAT":
            return "Algorytm CP-SAT"
        case "GENETIC":
            return "Algorytm genetyczny"
        case "ILP":
            return "Algorytm ILP"
        case "SA":
            return "Algorytm Simulated Annealing"
    }
    return alg
}


export const groupBySingle = function <T, K extends keyof any>(list: T[], getKey: (item: T) => K) {
    let t: Record<K, T> = list.reduce((previous, currentItem) => {
        const group = getKey(currentItem);
        if (!previous[group]) previous[group] = currentItem;
        else console.error(`duplicate data in groupBySingle - key ${JSON.stringify(group)} maps for ${previous[group]} and ${currentItem}`)
        return previous;
    }, {} as Record<K, T>);
    return t;
};

function isNumberRecord(obj: unknown): obj is Record<string, number> {
    if (typeof obj !== "object")
        return false

    if (Array.isArray(obj))
        return false

    if (Object.getOwnPropertySymbols(obj).length > 0)
        return false

    return Object.getOwnPropertyNames(obj)
        // @ts-ignore
        .every(prop => typeof obj[prop] === "number")
}

function isCorrectTime(time: any): boolean {
    return typeof (time) == 'string' && moment(time, 'HH:mm', true).isValid()
}

export function isDataset(arg: any): arg is Dataset {
    return arg &&
        // arg.slots &&
        // arg.students &&
        Array.isArray(arg.slots) &&
        Array.isArray(arg.students) &&
        arg.slots.every((s: any) => {
            return s.name && typeof (s.name) == 'string' &&
                s.startTime && isCorrectTime(s.startTime) &&
                s.id && typeof (s.id) == 'number' &&
                s.endTime && isCorrectTime(s.endTime) &&
                s.day && Object.values(DayName).includes(s.day) &&
                s.seats && typeof (s.seats) == 'number';
        }) &&

        arg.students.every((s: any) => {
            return s.name && typeof (s.name) == 'string' &&
                s.id && typeof (s.id) == 'number' &&
                s.prefersSlots && isNumberRecord(s.prefersSlots) &&
                s.slotsToFulfill && isNumberRecord(s.slotsToFulfill) &&
                s.blockedSlotsId && Array.isArray(s.blockedSlotsId) && s.blockedSlotsId.every((b: any) => b && typeof (b) === 'number')

        })
}