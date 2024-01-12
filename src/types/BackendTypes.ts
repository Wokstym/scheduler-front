import {Dataset} from "./SimulationTypes";

export interface ClassWithStudents {
    classId: number
    studentsIds: number[]
}

export type SingleResult = {
    algorithm: string
    assigned: ClassWithStudents[]

} & ({ error: ErrorResponse } | { stats: Statistics })


export interface Statistics {
    timeInSeconds: number,
    variousStats: Record<string, string>
}


export interface ErrorResponse {
    message: string
}


export interface GenerateResults {
    results: SingleResult[]
}

export function generate(currentData: Dataset): Promise<GenerateResults> {
    return fetch(`http://localhost:8080/generate`, {
        method: "POST",
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(currentData),
    }).then(response => response.json())
}
