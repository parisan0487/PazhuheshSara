"use client";

import { Listbox } from "@headlessui/react";
import { ChevronUpDownIcon } from "@heroicons/react/20/solid";

const genders = [
    { value: "male", label: "پسر" },
    { value: "female", label: "دختر" },
];

export default function GenderSelect({ selected, setSelected }) {
    return (
        <Listbox value={selected} onChange={setSelected}>
            <div className="relative w-full">
                <Listbox.Button className="w-full p-4 text-right bg-white border border-gray-300 rounded-2xl shadow-sm focus:outline-none focus:ring-2 focus:ring-green-400 flex justify-between items-center">
                    {selected ? genders.find((g) => g.value === selected)?.label : "انتخاب جنسیت"}
                    <ChevronUpDownIcon className="w-5 h-5 text-gray-400" />
                </Listbox.Button>

                <Listbox.Options className="absolute mt-1 w-full bg-white shadow-lg max-h-40 rounded-2xl py-1 text-right overflow-auto z-50">
                    {genders.map((g) => (
                        <Listbox.Option
                            key={g.value}
                            value={g.value}
                            className={({ active, selected }) =>
                                `cursor-pointer select-none relative py-2 px-4 ${active ? "bg-green-100 text-green-800" : "text-gray-800"
                                } ${selected ? "font-bold" : "font-normal"}`
                            }
                        >
                            {g.label}
                        </Listbox.Option>
                    ))}
                </Listbox.Options>
            </div>
        </Listbox>
    );
}
