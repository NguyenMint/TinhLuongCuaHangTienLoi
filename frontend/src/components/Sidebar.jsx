import React from "react";
import { useNavigate } from "react-router-dom";
import { LogOutIcon } from "lucide-react";
import NavLinks from "./nav-links";

export const Sidebar = () => {
  const navigate = useNavigate();

  return (
    <div className="w-16 md:w-64 bg-white shadow-lg flex flex-col h-screen fixed">
      {/* Logo section */}
      <div className="bg-blue-500 text-white p-4 flex items-center justify-center md:justify-start">
        <span className="ml-2 font-bold text-lg hidden md:block">QUẢN LÝ</span>
      </div>

      {/* <div className="flex grow flex-row justify-between space-x-2 md:flex-col md:space-x-0 md:space-y-2"> */}

      <NavLinks />
      <div className="hidden h-auto w-full grow rounded-md bg-gray-50 md:block"></div>

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
      {/* </div> */}
    </div>
  );
};
