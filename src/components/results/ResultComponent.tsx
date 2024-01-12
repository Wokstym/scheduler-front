import {algorithmToNiceName} from "../../utils/utils";
import React, {useEffect, useState} from "react";
import {GenerationResult, Student} from "../../types/SimulationTypes";
import OutputCalendar from "./OutputCalendar";
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import {Label} from "@/components/ui/label";


function StatDetails({label, value}: { label: string, value: string }) {

    if (label === "Violations") {
        const violations = value.slice(1, value.length - 1).split(", ").filter(e => e)
        if (violations.length !== 0) {
            return <div>
                <span className="font-medium">{label}:</span>
                <ul className="list-disc list-inside pl-4">
                    {violations.map(v => <li><span className="relative left-[-6px] text-red-800">{v}</span></li>)}
                </ul>
            </div>
        } else {
            return <div><span className="font-medium">{label}:</span> brak</div>
        }
    }

    return <div>
        <span className="font-medium">{label}:</span> {value}
    </div>;
}

export default function ResultComponent({generationResults, students}: {
    generationResults: GenerationResult[],
    students: Student[]
}) {


    const [student, setStudent] = useState<number | undefined>()


    const [filteredGenerationResults, setFilteredGenerationResults] = useState<GenerationResult[]>(generationResults)

    useEffect(() => {
        if (student) {
            const newStudents = generationResults.map(r => {
                return {
                    ...r,
                    assigned: r.assigned.map(a => {
                        return {...a, students: a.students.filter(s => s.id == student)}
                    }).filter(a => a.students.length !== 0)
                }
            })
            setFilteredGenerationResults(newStudents)
        } else {
            setFilteredGenerationResults(generationResults)
        }
    }, [student])

    useEffect(() => {
        setFilteredGenerationResults(generationResults)
        setStudent(undefined)
    }, [generationResults])


    return <div className="bg-white p-8 rounded-2xl">
        <span className="font-bold text-3xl">Wyniki</span>

        <div className="grid w-full max-w-sm items-center gap-3 pt-6">
            <Label>Pokaż plan danego studenta</Label>
            <Select
                onValueChange={(value) => {
                    if (value === "-")
                        setStudent(undefined)
                    else
                        setStudent(+value)
                }}
                value={!student ? "-" : String(student)}
            >
                <SelectTrigger className="w-[260px] border-gray-300">
                    <SelectValue/>
                </SelectTrigger>
                <SelectContent className="border-gray-300">
                    <SelectGroup>
                        <SelectItem className="font-medium" value={"-"}>Brak filtra</SelectItem>
                        {
                            students.map(s => {
                                return <SelectItem value={String(s.id)}>{s.name}</SelectItem>
                            })
                        }
                    </SelectGroup>
                </SelectContent>
            </Select>
        </div>
        <div>
            {
                filteredGenerationResults.map(result => <div
                    key={result.algorithm}
                >
                    <div>
                        <hr
                            className=" h-0.5 border-t-0 bg-gray-300 opacity-100 my-4"/>
                    </div>
                    <div className="text-2xl font-medium">{algorithmToNiceName(result.algorithm)}</div>
                    {result.stats && <div className="pt-4">
                        <div className="text-xl font-medium">
                            Stats:
                        </div>
                        <div className="pl-2">
                            <div>
                                <span
                                    className="font-medium">Wall time:</span> {result.stats.timeInSeconds < 60 ? `${result.stats.timeInSeconds} seconds` : `${Math.floor((result.stats.timeInSeconds / 60))} minutes ${(result.stats.timeInSeconds % 60).toFixed(0) } seconds`}
                            </div>
                            {Object.entries(result.stats.variousStats).map((value) => {
                                return <StatDetails label={value[0]} value={value[1]}/>
                            })}
                        </div>

                    </div>}
                    {result.params && <div className="pb-4 pt-2">
                        <div className="text-xl font-medium">
                            Parameters:
                        </div>
                        <div className="pl-2">
                            {Object.entries(result.params).map((value) => {
                                return <div>
                                    <span className="font-medium">{value[0]}:</span> {value[1]}
                                </div>;
                            })}
                        </div>
                    </div>}
                    {!result.error ? <OutputCalendar data={result.assigned}/> : null}
                    {result.error && (<div className="pt-4 text-red-800">Error: {result.error.message}</div>)}
                </div>)
            }
        </div>
    </div>
}