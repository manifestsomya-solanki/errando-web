import React from "react";
import flag from "../../../../assets/DownArrow.svg";

type DropDownOption = {
  id: number | "all";
  name: string;
};

type DropDownProps = {
  options: DropDownOption[];
  value: number | "all";
  onChange: (value: number | "all") => void;
};

export default function DropDown({ options, value, onChange }: DropDownProps) {
  return (
    <div className="relative w-full lg:w-48 ml-auto">
      <select
        value={String(value)}
        onChange={(e) => {
          const selectedValue = e.target.value;
          onChange(selectedValue === "all" ? "all" : Number(selectedValue));
        }}
        className=" p-2.5 text-gray-500 bg-white border rounded-md shadow-sm outline-none appearance-none cursor-pointer"
      >
        {options.map((option) => (
          <option key={String(option.id)} value={String(option.id)}>
            {option.name}
          </option>
        ))}
      </select>
      <div className="absolute inset-y-0 right-2 flex items-center pointer-events-none">
        <img src={flag} className="text-gray-500" />
      </div>
    </div>
  );
}
