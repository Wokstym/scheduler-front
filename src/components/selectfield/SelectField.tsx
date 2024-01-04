
interface CustomSelectFieldProps {
    fieldValue: string;
    setValue: (value: string) => void;
    id: string;
    label: string;
    possibleValues: string[];
}

export default function CustomSelectField({
                                              fieldValue,
                                              setValue,
                                              id,
                                              label,
                                              possibleValues,

                                          }: CustomSelectFieldProps) {
    return (
        <label
            className="mb-2 block text-xs text-[#181945] text-opacity-60"
            htmlFor={id}
        >
            <div className="pb-3 font-bold uppercase">{label}</div>
            <select
                className={`h-16 w-full appearance-none rounded-2xl border border-[#181945] border-opacity-10 bg-white bg-arrow-pattern bg-right-5 bg-no-repeat p-5 text-sm `}
                name={id}
                id={id}
                value={fieldValue}
                onChange={(e) => setValue(e.target.value)}
            >
                <option className="hidden" disabled value="">
                    {' '}
                </option>
                {possibleValues.map((possibleValue) => (
                    <option value={possibleValue} key={possibleValue}>
                        {possibleValue}
                    </option>
                ))}
            </select>
        </label>
    );
}