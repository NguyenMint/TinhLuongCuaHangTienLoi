import React, { useEffect, useState } from "react";
import { SearchIcon, FileIcon } from "lucide-react";
import { ChevronDownIcon, PlusIcon } from "./icons";
export function Header({ onSearch, onExport }) {
  const [searchTerm, setSearchTerm] = useState("");
  // Debounce search
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      onSearch(searchTerm);
    }, 300);
    return () => clearTimeout(timeoutId);
  }, [searchTerm, onSearch]);
  return (
    <div className="bg-white shadow-sm p-4">
      <div className="flex items-center justify-between">
        <div className="relative w-96">
          <input
            type="text"
            placeholder="Theo mã, tên bảng lương"
            className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <SearchIcon
            size={18}
            className="absolute left-3 top-2.5 text-gray-400"
          />
          <div className="absolute right-3 top-2.5 text-gray-400">
            <ChevronDownIcon size={18} />
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <button className="bg-green-500 text-white px-4 py-2 rounded flex items-center">
            <PlusIcon size={18} className="mr-1" />
            <span>Bảng tính lương</span>
          </button>
          <button
            className="bg-green-500 text-white px-4 py-2 rounded flex items-center"
            onClick={onExport}
          >
            <FileIcon size={18} className="mr-1" />
            <span>Xuất file</span>
          </button>
        </div>
      </div>
    </div>
  );
}
