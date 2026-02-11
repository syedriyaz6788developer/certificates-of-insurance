// Sidebar.jsx
import { NavLink } from "react-router-dom";
import {
  ChevronLeft,
  ChevronRight,
  Plus,
} from "lucide-react";

export default function Sidebar({ isOpen, setIsOpen }) {
  const menuItems = [
   
    {
      label: "Contract Vault",
      path: "/contracts",
      icon: "/icons/contract.svg",
    },
     {
      label: "COI Dashboard",
      path: "/coi-dashboard",
      icon: "/icons/coi.svg",
    },
    {
      label: "Analysis Result",
      path: "/analysis",
      icon: "/icons/analysis.svg",
    },
    {
      label: "Settings",
      path: "/settings",
      icon: "/icons/settings.svg",
    },
  ];

  return (
    <div
      className={`bg-[#F3F4F4] shadow-lg h-full transition-all duration-300 
      ${isOpen ? "w-56" : "w-20"}`}
    >
      {/* Logo + Toggle */}
      <div className="flex items-center justify-between py-4 p-1 border-b">
        {isOpen && (
          <div className="flex items-center gap-2 ">
            <img className="w-8" src="/Lshape.png" alt="Logo mark" />
            <img src="/Logo.svg" alt="Logo" className="" />
          </div>
        )}

        <button
          onClick={() => setIsOpen(!isOpen)}
          className="rounded-full text-[#4A88EE] border ml-4 border-[#4A88EE] p-1 "
        >
          {isOpen ? (
           <ChevronLeft size={15} className="" />
          ) : (
            <ChevronRight size={15} />
          )}
        </button>
      </div>

      {/* Menu */}
      <nav className="mt-6 space-y-2 px-3">

        {/* Review Button */}
        <button
          className={`flex items-center gap-2 p-3 px-5 rounded-lg bg-[#4A88EE] text-white transition
          ${!isOpen && "justify-center"}`}
        >
          {isOpen && <span>Review Documents</span>}
          <Plus size={18} />
        </button>

        {/* Menu Items */}
        {menuItems.map((item) => (
          <SidebarItem
            key={item.label}
            icon={item.icon}
            label={item.label}
            path={item.path}
            isOpen={isOpen}
          />
        ))}
      </nav>
    </div>
  );
}

function SidebarItem({ icon, label, path, isOpen }) {
  return (
    <NavLink
      to={path}
      className={({ isActive }) =>
        `flex items-center gap-3 p-3 rounded-lg transition-all duration-200
        ${
          isActive
            ? "bg-[#E8F0FE] text-[#4A88EE] font-semibold"
            : "text-gray-700 hover:bg-blue-50"
        }
        ${!isOpen && "justify-center"}`
      }
    >
      <img src={icon} alt={label} className="w-6 h-6" />
      {isOpen && <span>{label}</span>}
    </NavLink>
  );
}
