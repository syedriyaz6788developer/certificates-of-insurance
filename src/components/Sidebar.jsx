// Sidebar.jsx
import {
  Home,
  FileText,
  BarChart3,
  Settings,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

export default function Sidebar({ isOpen, setIsOpen }) {
  return (
    <div
      className={`bg-white shadow-lg h-full transition-all duration-300 
      ${isOpen ? "w-64" : "w-20"}`}
    >
      {/* Logo + Toggle */}
      <div className="flex items-center justify-between p-3 border-b">
        {isOpen && <div className="flex items-center">
         <img className="w-10" src="/Lshape.png"/>
         <img src="/Logo.svg"/>
         
          </div>}

        <button
          onClick={() => setIsOpen(!isOpen)}
          className=" rounded-full text-[#4A88EE] border-lg border border-[#4A88EE] "
        >
          {isOpen ? <ChevronLeft className="" size={20} /> : <ChevronRight size={20} />}
        </button>
      </div>

      {/* Menu */}
      <nav className="mt-6 space-y-2 px-3">
        <SidebarItem icon={<Home size={20} />} label="Review Documents" isOpen={isOpen} />
        <SidebarItem icon={<FileText size={20} />} label="Documents" isOpen={isOpen} />
        <SidebarItem icon={<BarChart3 size={20} />} label="Analytics" isOpen={isOpen} />
        <SidebarItem icon={<Settings size={20} />} label="Settings" isOpen={isOpen} />
      </nav>
    </div>
  );
}

function SidebarItem({ icon, label, isOpen }) {
  return (
    <div className="flex items-center gap-3 p-3 rounded-lg hover:bg-blue-50 cursor-pointer transition">
      {icon}
      {isOpen && <span className="text-gray-700">{label}</span>}
    </div>
  );
}
