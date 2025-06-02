import { useNavigate } from "react-router-dom";
import {  LogOutIcon } from "lucide-react";
export function EmployeeHomePage() {
    const navigate = useNavigate();
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };
  return (
    <div className="flex justify-self-center min-h-screen">
      <p>Đây là trang nhân viên (Mai rãnh làm) !!!!</p>
       <button
          onClick={handleLogout}
          className="flex items-center text-gray-700 hover:text-red-500 w-full"
        >
          <LogOutIcon className="h-5 w-5 mr-3" />
          <span className="hidden md:block">Đăng xuất</span>
        </button>
    </div>
  );
}
