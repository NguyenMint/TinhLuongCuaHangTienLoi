import { ClockIcon, CalendarIcon, UserIcon, LayersIcon, LogOutIcon } from "lucide-react";
import { Link, useLocation, useNavigate } from "react-router-dom";

const links = [
  { name: "Chấm công", href: "/employee-home", icon: CalendarIcon },
  { name: "Thông tin cá nhân", href: "/employee-profile", icon: UserIcon },
  { name: "Tiện ích", href: "/employee-utility", icon: LayersIcon },
];

export  function SidebarEmployee() {
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  return (
    <div className="bg-white shadow h-screen w-60 flex flex-col">
      <div className="p-6 bg-blue-500 text-center font-bold text-lg border-b">Nhân viên</div>
      <nav className="flex-1 p-2">
        {links.map((link) => {
          const LinkIcon = link.icon;
          return (
            <Link
              to={link.href}
              key={link.name}
              className={`flex h-[48px] grow items-center justify-center gap-2 rounded-md bg-gray-50 p-3 text-sm font-medium hover:bg-sky-100 hover:text-blue-600 md:flex-none md:justify-start md:p-2 md:px-3
                ${
                  location.pathname === link.href
                    ? "bg-sky-100 text-blue-600"
                    : "bg-gray-50 hover:bg-sky-100 hover:text-blue-600"
                }`}
            >
              <LinkIcon className="w-6" />
              <p className="hidden md:block">{link.name}</p>
            </Link>
          );
        })}
      </nav>
      <button
        onClick={handleLogout}
        className="flex items-center text-gray-700 hover:text-red-500 w-full px-4 py-3 mt-auto"
      >
        <LogOutIcon className="w-6 mr-2" />
        <span className="hidden md:block">Đăng xuất</span>
      </button>
    </div>
  );
}