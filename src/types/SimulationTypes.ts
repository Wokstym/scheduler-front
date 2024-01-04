import {Slot, Student} from "../utils/inputs";
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
}