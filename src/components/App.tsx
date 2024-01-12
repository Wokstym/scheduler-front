import React, {useRef, useState} from 'react';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import {generate, GenerateResults} from "../types/BackendTypes";
import {GenerationResult, LabeledDataset, Slot, Student} from "../types/SimulationTypes";
import {groupBySingle} from "../utils/utils";
import {toast} from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import ResultComponent from "./results/ResultComponent";
import InputSection from "./input/InputSection";
import GenerateButton from "./utils/GenerateButton";
import Toast from "./utils/Toast";


function transformResponseResult(generateResults: GenerateResults, slotsById: Record<number, Slot>, studentsById: Record<number, Student>) {
    return generateResults.results.map(result => {
            return {
                ...result,
                assigned: result.assigned.map(e => {
                    return {
                        slot: slotsById[e.classId],
                        students: e.studentsIds.map(studentId => studentsById[studentId])
                    }
                })
            }
        }
    );
}

function App() {
    const sectionRef = useRef<HTMLDivElement>(null)


    const [currentData, setCurrentData] = useState<LabeledDataset>({label: "", dataset: {slots: [], students: []}})


    const studentsById: Record<number, Student> = groupBySingle(currentData.dataset.students, (e) => e.id)
    const slotsById: Record<number, Slot> = groupBySingle(currentData.dataset.slots, (e) => e.id)

    const [generationResults, setGenerationResults] = useState<GenerationResult[]>([])

    const [loading, setLoading] = useState(false)


    const sendRequest = () => {
        setLoading(true)
        generate(currentData.dataset)
            .then((r: GenerateResults) => {
                if (r.results.length > 0) {
                    setGenerationResults(transformResponseResult(r, slotsById, studentsById));
                    toast.success('Wykonano generacje');
                    setTimeout(() => {
                        sectionRef.current?.scrollIntoView({behavior: "smooth"})
                    }, 50)

                } else {
                    toast.error(`Error, pusta odpowiedz`)
                }
                setLoading(false)
            })
            .catch(error => {
                setLoading(false)
                return toast.error(`Problem w wysłaniem zapytania: ${error}`);
            })
    };

    return (
        <div className="p-8 bg-gray-200">
            <InputSection currentData={currentData} setCurrentData={setCurrentData}/>
            <GenerateButton onClick={sendRequest} loading={loading}/>
            <div ref={sectionRef}>
                {generationResults.length !== 0 ? <ResultComponent generationResults={generationResults}
                                                                   students={currentData.dataset.students}/> : null
                }
            </div>
            <Toast/>
        </div>
    );
}

export default App;
