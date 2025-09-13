import React from "react";
import flag from "../../../../assets/DownArrow.svg";

export default function DropDown() {
  return (
    <div className="relative w-full lg:w-48 ml-auto">
      <select className=" p-2.5 text-gray-500 bg-white border rounded-md shadow-sm outline-none appearance-none cursor-pointer">
        <option>TV Guru LTD</option>
        <option>Shine Cleaning Services</option>
        <option>All Businesses</option>
      </select>
      <div className="absolute inset-y-0 right-2 flex items-center pointer-events-none">
        <img src={flag} className="text-gray-500" />
      </div>
    </div>
  );
}
