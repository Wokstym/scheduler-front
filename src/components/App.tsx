import React, {useState} from 'react';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import {inputs, Slot, Student} from "../utils/inputs";
import InputCalendar from "./calendar/InputCalendar";
import {generate, GenerateResults} from "../types/BackendTypes";
import OutputCalendar from "./calendar/OutputCalendar";
import {GenerationResult} from "../types/SimulationTypes";
import {algorithmToNiceName, groupBySingle} from "../utils/utils";
import {toast, ToastContainer} from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';


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
    const currentData: { slots: Slot[]; students: Student[] } = inputs[0]

    const studentsById: Record<number, Student> = groupBySingle(currentData.students, (e) => e.id)
    const slotsById: Record<number, Slot> = groupBySingle(currentData.slots, (e) => e.id)

    const [generationResults, setGenerationResults] = useState<GenerationResult[]>([])


    const sendRequest = () => {
        generate(currentData)
            .then((r: GenerateResults) => {
                if (r.results.length > 0) {
                    setGenerationResults(transformResponseResult(r, slotsById, studentsById));
                    toast.success('Wykonano generacje');
                } else {
                    toast.error(`Error, pusta odpowiedz`)
                }
            }).catch(error => {
            return toast.error(`Problem w wysłaniem zapytania: ${error.title}`);
        })
    };
    return (
        <div>
            {/*<CustomSelectField fieldValue={"d"} setValue={()=>{}} id={"d"} label={"Data"} possibleValues={["ddd"]} />*/}
            <div>
                <span className="bold text-3xl"> Klasy</span>
                <div className="h-[1500px]">
                    <InputCalendar data={currentData}/>
                </div>
            </div>
            <div className="flex justify-center py-10">
                <button
                    onClick={sendRequest}
                    className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded inline-flex items-center">
                    <svg className="fill-current w-4 h-4 mr-2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
                        <path
                            d="M495.9 166.6c3.2 8.7 .5 18.4-6.4 24.6l-43.3 39.4c1.1 8.3 1.7 16.8 1.7 25.4s-.6 17.1-1.7 25.4l43.3 39.4c6.9 6.2 9.6 15.9 6.4 24.6c-4.4 11.9-9.7 23.3-15.8 34.3l-4.7 8.1c-6.6 11-14 21.4-22.1 31.2c-5.9 7.2-15.7 9.6-24.5 6.8l-55.7-17.7c-13.4 10.3-28.2 18.9-44 25.4l-12.5 57.1c-2 9.1-9 16.3-18.2 17.8c-13.8 2.3-28 3.5-42.5 3.5s-28.7-1.2-42.5-3.5c-9.2-1.5-16.2-8.7-18.2-17.8l-12.5-57.1c-15.8-6.5-30.6-15.1-44-25.4L83.1 425.9c-8.8 2.8-18.6 .3-24.5-6.8c-8.1-9.8-15.5-20.2-22.1-31.2l-4.7-8.1c-6.1-11-11.4-22.4-15.8-34.3c-3.2-8.7-.5-18.4 6.4-24.6l43.3-39.4C64.6 273.1 64 264.6 64 256s.6-17.1 1.7-25.4L22.4 191.2c-6.9-6.2-9.6-15.9-6.4-24.6c4.4-11.9 9.7-23.3 15.8-34.3l4.7-8.1c6.6-11 14-21.4 22.1-31.2c5.9-7.2 15.7-9.6 24.5-6.8l55.7 17.7c13.4-10.3 28.2-18.9 44-25.4l12.5-57.1c2-9.1 9-16.3 18.2-17.8C227.3 1.2 241.5 0 256 0s28.7 1.2 42.5 3.5c9.2 1.5 16.2 8.7 18.2 17.8l12.5 57.1c15.8 6.5 30.6 15.1 44 25.4l55.7-17.7c8.8-2.8 18.6-.3 24.5 6.8c8.1 9.8 15.5 20.2 22.1 31.2l4.7 8.1c6.1 11 11.4 22.4 15.8 34.3zM256 336a80 80 0 1 0 0-160 80 80 0 1 0 0 160z"/>
                    </svg>
                    <span>Generate</span>
                </button>
            </div>
            {generationResults.length !== 0 ?
                <div>
                    <span className="bold text-3xl">Wyniki:</span>
                    {
                        generationResults.map(result => <div key={result.algorithm}>

                            <div>{algorithmToNiceName(result.algorithm)}</div>
                            {result.stats && <div>
                                <div>
                                    Wall time: {result.stats.timeInSeconds} seconds
                                </div>
                                {Object.entries(result.stats.variousStats).map((value) => {
                                    return <div>
                                        {value[0]}: {value[1]}
                                    </div>
                                })}

                            </div>}
                            {!result.error ? <div className="h-[1500px]">
                                <OutputCalendar data={result.assigned}/>
                            </div> : null}
                            {result.error && (<div>Error: {result.error.message}</div>)}
                        </div>)
                    }
                </div> : null
            }
            <ToastContainer
                position="bottom-left"
                autoClose={3000}
                hideProgressBar
                newestOnTop={false}
                closeOnClick
                rtl={false}
                pauseOnFocusLoss={false}
                draggable
                pauseOnHover
                theme="light"
            />
        </div>
    );
}

export default App;
