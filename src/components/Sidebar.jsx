import { NavLink } from "react-router-dom";
import { ChevronLeft, ChevronRight, Plus, X } from "lucide-react";

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

  // Desktop sidebar
  return (
    <>
      {/* Mobile Sidebar */}
      <div
        className={`
        lg:hidden
        fixed inset-y-0 left-0 w-64 bg-[#F3F4F4] shadow-lg z-50
        flex flex-col h-full
        transition-transform duration-300 ease-in-out
        ${isOpen ? "translate-x-0" : "-translate-x-full"}
      `}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b flex-shrink-0">
          <div className="flex items-center gap-2">
            <img className="w-8" src="/Lshape.png" alt="Logo mark" />
            <img src="/Logo.svg" alt="Logo" className="h-6" />
          </div>
          <button
            onClick={() => setIsOpen(false)}
            className="p-2 rounded-lg hover:bg-gray-200 transition"
            aria-label="Close menu"
          >
            <X size={20} />
          </button>
        </div>

        {/* Navigation - Scrollable */}
        <div className="flex-1 overflow-y-auto py-4">
          <div className="px-3">
            <button
              className={`
    flex items-center gap-2 py-3 px-4 rounded-lg bg-[#4A88EE] text-[#F9FAFA]
    hover:bg-[#3A78DE] transition w-full font-inter font-medium text-[14px] leading-[20px] tracking-[-0.6%] text-center
    ${!isOpen && "justify-center px-2"}
  `}
            >
              {isOpen && (
                <span className="text-[14px] font-medium">
                  Review Documents
                </span>
              )}
              <Plus size={18} />
            </button>

            <nav className="space-y-1">
              {menuItems.map((item) => (
                <NavLink
                  key={item.label}
                  to={item.path}
                  onClick={() => setIsOpen(false)}
                  className={({ isActive }) =>
                    `flex items-center text-[14px] gap-3 p-3 rounded-lg transition-all duration-200
                    ${
                      isActive
                        ? "bg-[#E8F0FE] text-[#4A88EE] font-semibold"
                        : "text-gray-700 hover:bg-blue-50"
                    }`
                  }
                >
                  <img src={item.icon} alt={item.label} className="w-6 h-6" />
                  <span
                    style={{
                      fontFamily: "'Inter Tight', sans-serif",
                      fontSize: "14px",
                      lineHeight: "20px",
                      letterSpacing: "0px",
                    }}
                  >
                    {item.label}
                  </span>
                </NavLink>
              ))}
            </nav>
          </div>
        </div>

        {/* Footer */}
        <div className="flex-shrink-0 p-4 border-t bg-gray-100/50">
          <div className="text-xs text-gray-500 text-center">Version 1.0.0</div>
        </div>
      </div>

      {/* Desktop Sidebar */}
      <div
        className={`
        hidden lg:flex lg:flex-col
        bg-[#F3F4F4] shadow-lg h-full transition-all duration-300
        ${isOpen ? "w-56" : "w-20"}
      `}
      >
        <div className="flex mt-1 items-center justify-between py-5 px-3 border-b flex-shrink-0">
          {isOpen && (
            <div className="flex items-center gap-2">
              <img className="w-8" src="/Lshape.png" alt="Logo mark" />
              <img src="/Logo.svg" alt="Logo" className="h-6" />
            </div>
          )}

          <button
            onClick={() => setIsOpen(!isOpen)}
            className={`
              rounded-full text-[#4A88EE] border border-[#4A88EE] p-1 
              hover:bg-blue-50 transition
              ${isOpen ? "ml-auto" : "mx-auto"}
            `}
            aria-label={isOpen ? "Collapse sidebar" : "Expand sidebar"}
          >
            {isOpen ? <ChevronLeft size={12} /> : <ChevronRight size={12} />}
          </button>
        </div>

        <nav className="flex-1 overflow-y-auto  mt-6 px-2">
          <button
            className={`
    flex items-center gap-2 py-3 px-4 rounded-lg bg-[#4A88EE] text-[#F9FAFA]
    hover:bg-[#3A78DE] justify-between transition w-full font-inter font-medium text-[14px] leading-[20px] tracking-[-0.6%] text-center
    ${!isOpen && "justify-center px-2"}
  `}
          >
            {isOpen && (
              <span className="text-[14px] font-medium">Review Documents</span>
            )}
            <Plus size={18} />
          </button>

          <div className="mt-6  space-y-1">
            {menuItems.map((item) => (
              <SidebarItem
                key={item.label}
                icon={item.icon}
                label={item.label}
                path={item.path}
                isOpen={isOpen}
              />
            ))}
          </div>
        </nav>
      </div>
    </>
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
        ? "bg-[#E8F0FE] text-[#4A88EE] font-[500]"
        : "text-[#666E6D] hover:bg-blue-50"
    }
    ${!isOpen ? "justify-center" : ""}`
      }
      style={{
        fontFamily: "'Inter Tight', sans-serif",
        fontSize: "14px",
        lineHeight: "20px",
        letterSpacing: "0px",
      }}
    >
      <img
        src={icon}
        alt={label}
        className="w-6 h-6 flex-shrink-0 align-middle"
      />
      {isOpen && (
        <span
          className="truncate font-[500] align-middle"
          style={{
            fontFamily: "'Inter Tight', sans-serif",
            fontSize: "14px",
            lineHeight: "20px",
            letterSpacing: "0px",
          }}
        >
          {label}
        </span>
      )}
    </NavLink>
  );
}
