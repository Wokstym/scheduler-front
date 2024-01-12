import {Label} from "@/components/ui/label";
import {Input} from "@/components/ui/input";
import {toast} from "react-toastify";
import {Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select";
import InputCalendar from "./InputCalendar";
import React, {ChangeEventHandler, useEffect, useState} from "react";
import {defaultInputs} from "../../utils/inputs";
import {isDataset} from "../../utils/utils";
import {Accordion, AccordionContent, AccordionItem, AccordionTrigger} from "@/components/ui/accordion";
import {LabeledDataset} from "../../types/SimulationTypes";


export interface Props {
    currentData: LabeledDataset,
    setCurrentData: (dataset: LabeledDataset) => void
}


export default function InputSection({currentData, setCurrentData}: Props) {
    const [allDatasets, setAllDataSets] = useState<LabeledDataset[]>(defaultInputs)

    useEffect(() => {
        setCurrentData(allDatasets[0])
    }, [])


    const onFileChange: ChangeEventHandler<HTMLInputElement> = (event) => {
        let file = event.target.files?.item(0);
        if (file) {
            file.text()
                .then(text => {
                    try {
                        const result = JSON.parse(text)
                        if (!isDataset(result)) {
                            toast.error("Zły format pliku - nieprawidłowe pola lub wartości.")
                            return
                        }
                        const newDataset = {
                            dataset: result,
                            label: file!!.name
                        };

                        let indexOfExisting: number = allDatasets.findIndex(e => e.label == newDataset.label);
                        if (indexOfExisting !== -1) {
                            const copyOfAllSets = [...allDatasets]
                            copyOfAllSets[indexOfExisting] = newDataset
                            setAllDataSets(copyOfAllSets)
                        } else {
                            setAllDataSets([...allDatasets, newDataset])
                        }
                        setCurrentData(newDataset)
                    } catch (e) {
                        toast.error("Zły format pliku - nieprawidłowy json")
                    }
                })
        }
        // @ts-ignore
        event.target.value = null;
    };
    return <div className="bg-white p-8 rounded-2xl">
        <span className="font-bold text-3xl ">Dane wejściowe</span>
        <div className="flex py-6">
            <div className="grid w-full max-w-sm items-center gap-3 ">
                <Label>Wybierz zestaw danych wejściowych</Label>
                <Select
                    onValueChange={(value) => {
                        const dataset = allDatasets.find(e => e.label === value)
                        if (dataset)
                            setCurrentData(dataset)
                    }}
                    value={currentData.label}
                >
                    <SelectTrigger className="w-[260px] border-gray-300">
                        <SelectValue placeholder="Wybierz dane początkowe"/>
                    </SelectTrigger>
                    <SelectContent className="border-gray-300">
                        <SelectGroup>
                            {
                                allDatasets.map(dataset => {
                                    return <SelectItem key={dataset.label}
                                                       value={dataset.label}>{dataset.label}</SelectItem>
                                })
                            }
                        </SelectGroup>
                    </SelectContent>
                </Select>
            </div>
            <div className="grid w-full max-w-sm items-center gap-3 ">
                <Label>Załaduj dane studentów i zajęć z pliku</Label>
                <Input id="picture" type="file" accept="application/JSON" onChange={onFileChange}
                       className="border-gray-300"/>
            </div>
        </div>
        <div className="h-[1500px]">
            <InputCalendar data={currentData.dataset}/>
        </div>
        <Accordion type="single" collapsible>
            <AccordionItem value="item-1">
                <AccordionTrigger>Detale studentów</AccordionTrigger>
                <AccordionContent>
                    <div className="max-w-md  divide-red-950 flex flex-col">
                        {currentData.dataset.students.map(student => {

                            return <div
                                key={`student${student.id}`}>
                                <div>
                                    <hr
                                        className=" h-0.5 border-t-0 bg-gray-300 opacity-100 my-4 w-10"/>
                                    <div className="text-xl"><span className="font-medium ">Name:</span> {student.name}
                                    </div>
                                    <div className=""><span className="font-medium">Student id:</span> {student.id}
                                    </div>

                                    {student.blockedSlotsId.length > 0 ? <div className=""><span
                                        className="font-medium">Blocked slot ids:</span> {JSON.stringify(student.blockedSlotsId)}
                                    </div> : null}
                                    <span className="font-medium">Slots to fulfill:</span>
                                    <ul className="list-disc list-inside">
                                        {Object.entries(student.slotsToFulfill).map(([slotId, count]) => (
                                            <li key={slotId} className=" ">
                                                <span className=" font-semibold mb-2">{slotId}:</span>
                                                <span className="text-gray-600"> {count}</span>
                                            </li>
                                        ))}

                                    </ul>

                                </div>
                            </div>;
                        })}
                    </div>
                </AccordionContent>
            </AccordionItem>
        </Accordion>
    </div>
}