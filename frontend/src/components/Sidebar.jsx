import React from 'react';
import { useNavigate } from 'react-router-dom';
import { HomeIcon, FileTextIcon, UsersIcon, LogOutIcon } from 'lucide-react';

export const Sidebar = () => {
  const navigate = useNavigate();

  return (
    <div className="w-16 md:w-64 bg-white shadow-lg flex flex-col h-screen fixed">
      {/* Logo section */}
      <div className="bg-blue-500 text-white p-4 flex items-center justify-center md:justify-start">
        <span className="ml-2 font-bold text-lg hidden md:block">QUẢN LÝ</span>
      </div>

      {/* Navigation links */}
      <div className="flex-1 py-4">
        <ul>
          <li>
            <button
              onClick={() => navigate("/")}
              className="flex items-center px-4 py-3 text-blue-600 bg-blue-100 font-medium w-full"
            >
              <HomeIcon className="h-5 w-5 mr-3" />
              <span className="hidden md:block">Trang chủ</span>
            </button>
          </li>
          <li>
            <button
              onClick={() => navigate("/lich-lam-viec")}
              className="flex items-center px-4 py-3 text-gray-700 hover:bg-gray-100 w-full"
            >
              <FileTextIcon className="h-5 w-5 mr-3" />
              <span className="hidden md:block">Lịch làm việc</span>
            </button>
          </li>
          <li>
            <button
              onClick={() => navigate("/bang-cham-cong")}
              className="flex items-center px-4 py-3 text-gray-700 hover:bg-gray-100 w-full"
            >
              <UsersIcon className="h-5 w-5 mr-3" />
              <span className="hidden md:block">Bảng chấm công</span>
            </button>
          </li>
        </ul>
      </div>

      {/* Sign out button */}
      <div className="p-4 border-t">
        <button
          onClick={() => {
            // Clear auth data here if needed
            navigate("/login");
          }}
          className="flex items-center text-gray-700 hover:text-red-500 w-full"
        >
          <LogOutIcon className="h-5 w-5 mr-3" />
          <span className="hidden md:block">Đăng xuất</span>
        </button>
      </div>
    </div>
  );
};
