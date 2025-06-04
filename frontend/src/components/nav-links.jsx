import { HomeIcon, FileTextIcon, UsersIcon,SettingsIcon } from "lucide-react";

import { Link, useLocation } from "react-router-dom";
// Map of links to display in the side navigation.
// Depending on the size of the application, this would be stored in a database.
const links = [
  { name: "Trang chủ", href: "/", icon: HomeIcon },
  {
    name: "Lịch làm việc",
    href: "/lich-lam-viec",
    icon: FileTextIcon,
  },
  { name: "Bảng chấm công", href: "/bang-cham-cong", icon: UsersIcon },
  {
    name: "Thiết lập",
    href:"/settings",
    icon: SettingsIcon
  }
];

export default function NavLinks() {
  const location = useLocation();

  return (
    <>
      {links.map((link) => {
        const LinkIcon = link.icon;
        return (
          <Link
            to={link.href}
            key={link.name}
            // href={link.href}
            className={`flex h-[48px] grow items-center justify-center gap-2 rounded-md bg-gray-50 p-3 text-sm font-medium hover:bg-sky-100 hover:text-blue-600 md:flex-none md:justify-start md:p-2 md:px-3
              ${
                (link.href === "/" ? location.pathname === link.href : location.pathname.startsWith(link.href))
                  ? "bg-sky-100 text-blue-600"
                  : "bg-gray-50 hover:bg-sky-100 hover:text-blue-600"
              }`}
          >
            <LinkIcon className="w-6" />
            <p className="hidden md:block">{link.name}</p>
          </Link>
        );
      })}
    </>
  );
}
