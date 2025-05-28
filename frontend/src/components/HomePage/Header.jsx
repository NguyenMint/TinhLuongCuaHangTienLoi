import React, { useState } from 'react';
import { SearchIcon, PlusIcon, FileIcon, MoreVerticalIcon } from 'lucide-react';
export const Header = ({
  onSearch,
  onAddEmployee,
  onImportFile,
  onExportFile
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const handleSearchSubmit = e => {
    e.preventDefault();
    onSearch(searchQuery);
  };
  return <div>
      <div className="flex flex-col md:flex-row md:justify-between md:items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">
            Danh sách nhân viên
          </h1>
          <p className="text-gray-600 text-sm mt-1">Đã sử dụng 2 nhân viên</p>
        </div>
        <div className="flex flex-col md:flex-row space-y-2 md:space-y-0 md:space-x-2 mt-4 md:mt-0">
          <form onSubmit={handleSearchSubmit} className="relative">
            <input type="text" placeholder="Tìm theo mã, tên nhân viên" className="pl-10 pr-4 py-2 border border-gray-300 rounded-md w-full md:w-80 focus:outline-none focus:ring-1 focus:ring-blue-500" value={searchQuery} onChange={e => setSearchQuery(e.target.value)} />
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <SearchIcon className="h-5 w-5 text-gray-400" />
            </div>
          </form>
          <div className="flex space-x-2">
            <button onClick={onAddEmployee} className="flex items-center px-3 py-2 bg-green-500 hover:bg-green-600 text-white rounded-md">
              <PlusIcon className="h-5 w-5 mr-1" /> 
              <span>Nhân viên</span>
            </button>
            <button onClick={onImportFile} className="flex items-center px-3 py-2 bg-green-500 hover:bg-green-600 text-white rounded-md">
              <FileIcon className="h-5 w-5 mr-1" />
              <span>Nhập file</span>
            </button>
            <button onClick={onExportFile} className="flex items-center px-3 py-2 bg-green-500 hover:bg-green-600 text-white rounded-md">
              <FileIcon className="h-5 w-5 mr-1" />
              <span>Xuất file</span>
            </button>
            <button className="p-2 text-gray-500 hover:text-gray-700 rounded-md">
              <MoreVerticalIcon className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>
    </div>;
};