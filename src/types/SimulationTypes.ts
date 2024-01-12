import {ErrorResponse, Statistics} from "./BackendTypes";

export interface ClassWithStudents {
    students: Student[];
    slot: Slot
}

export type GenerationResult = {
    algorithm: string
    assigned: ClassWithStudents[],
    error?: ErrorResponse
    stats?: Statistics
    params?: Record<string, string>
}

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

export type Dataset = { slots: Slot[]; students: Student[] };
export type LabeledDataset = { dataset: Dataset; label: string };
