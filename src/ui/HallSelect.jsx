"use client";

import { Listbox } from "@headlessui/react";
import { ChevronUpDownIcon } from "@heroicons/react/20/solid";

export default function HallSelect({ selected, setSelected, halls }) {
    return (
        <Listbox value={selected} onChange={setSelected}>
            <div className="relative w-full">
                <Listbox.Button className="w-full p-4 text-right bg-white border border-gray-300 rounded-2xl shadow-sm focus:outline-none focus:ring-2 focus:ring-green-400 flex justify-between items-center">
                    {selected
                        ? halls.find((hall) => hall._id === selected)?.name
                        : "انتخاب سالن"}
                    <ChevronUpDownIcon className="w-5 h-5 text-gray-400" />
                </Listbox.Button>

                <Listbox.Options className="absolute mt-1 w-full bg-white shadow-lg max-h-60 rounded-2xl py-1 text-right overflow-auto z-50">
                    {halls.map((hall) => (
                        <Listbox.Option
                            key={hall._id}
                            value={hall._id}
                            className={({ active, selected }) =>
                                `cursor-pointer select-none relative py-2 px-4 ${active ? "bg-green-100 text-green-800" : "text-gray-800"
                                } ${selected ? "font-bold" : "font-normal"}`
                            }
                        >
                            {hall.name}
                        </Listbox.Option>
                    ))}
                </Listbox.Options>
            </div>
        </Listbox>
    );
}
