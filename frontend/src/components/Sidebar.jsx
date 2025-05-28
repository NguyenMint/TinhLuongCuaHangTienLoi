import React from 'react';
import { HomeIcon, FileTextIcon, UsersIcon, LogOutIcon } from 'lucide-react';
export const Sidebar = () => {
  return <div className="w-16 md:w-64 bg-white shadow-lg flex flex-col h-screen fixed">
      {/* Logo section */}
      <div className="bg-blue-500 text-white p-4 flex items-center justify-center md:justify-start">
        <span className="ml-2 font-bold text-lg hidden md:block">QUẢN LÝ</span>
      </div>
      {/* Navigation links */}
      <div className="flex-1 py-4">
        <ul>
          <li>
            <a href="/" className="flex items-center px-4 py-3 text-blue-600 bg-blue-100 font-medium">
              <HomeIcon className="h-5 w-5 mr-3" />
              <span className="hidden md:block">Trang chủ</span>
            </a>
          </li>
          <li>
            <a href="./" className="flex items-center px-4 py-3 text-gray-700 hover:bg-gray-100">
              <FileTextIcon className="h-5 w-5 mr-3" />
              <span className="hidden md:block">Lịch làm việc</span>
            </a>
          </li>
          <li>
            <a href="./" className="flex items-center px-4 py-3 text-gray-700 hover:bg-gray-100">
              <UsersIcon className="h-5 w-5 mr-3" />
              <span className="hidden md:block">Bảng chấm công</span>
            </a>
          </li>
        </ul>
      </div>
      {/* Sign out button */}
      <div className="p-4 border-t">
        <button className="flex items-center text-gray-700 hover:text-red-500 w-full">
          <LogOutIcon className="h-5 w-5 mr-3" />
          <span className="hidden md:block">Đăng xuất</span>
        </button>
      </div>
    </div>;
};