import React from "react";
import { FiSearch } from "react-icons/fi";

const SearchBoxPortfolio = ({ placeholder, onChange,value }) => {
  return (
    <div className="relative text-black focus-within:text-gray-400">
      <input
        type="search"
        name="search"
        id="search"
        placeholder={placeholder || "Search"}
        onChange={onChange}
        value={value}
        className="py-2 text-black w-100 bg-white rounded border border-gray-500 rounded-md pl-10 pr-2 focus:outline-none focus:bg-white focus:text-black"
      />
      <span className="absolute inset-y-0 left-0 flex items-center px-2">
        <button
          type="button"
          className="p-1 focus:outline-none focus:shadow-outline"
        >
          <FiSearch className="w-4 h-4 text-gray-400" />
          {/* <svg
            fill="none"
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            viewBox="0 0 35 24"
            className="w-6 h-6 text-gray-500"
          >
            <path d="M21 21l-6-6m-3 0a8 8 0 110-16 8 8 0 010 16z"></path>
          </svg> */}
        </button>
      </span>
    </div>
  );
};

export default SearchBoxPortfolio;
