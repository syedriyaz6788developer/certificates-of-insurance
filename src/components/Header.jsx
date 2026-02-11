import { useState, useRef, useEffect } from "react";
import { Menu, ChevronDown } from "lucide-react";

/* ----------------------------- Reusable Button ----------------------------- */

function IconButton({ icon, children, className = "", ...props }) {
  return (
    <button
      type="button"
      className={`flex items-center gap-2 px-3 py-2 text-sm rounded-[10px] border transition whitespace-nowrap ${className}`}
      {...props}
    >
      {icon}
      {children && <span className="hidden sm:inline">{children}</span>}
    </button>
  );
}

/* ----------------------------- Profile Dropdown ---------------------------- */

function ProfileDropdown({ name, email }) {
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Close on outside click
  useEffect(() => {
    function handleClickOutside(e) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div ref={dropdownRef} className="relative">
      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        className="flex items-center gap-3 cursor-pointer"
        aria-expanded={open}
        aria-haspopup="menu"
      >
        <div className="w-8 h-8 bg-blue-500 rounded-full text-white flex items-center justify-center">
          {name.charAt(0).toUpperCase()}
        </div>

        <div className="hidden md:block text-left">
          <h6 className="text-sm font-medium">{name}</h6>
          <p className="text-xs text-gray-500">{email}</p>
        </div>

        <ChevronDown
          size={18}
          className={`transition-transform ${open ? "rotate-180" : ""}`}
        />
      </button>

      {open && (
        <div
          className="absolute right-0 mt-3 w-48 bg-white border rounded-lg shadow-lg py-2 z-50"
          role="menu"
        >
          {["Settings", "Notifications", "Logout"].map((item) => (
            <button
              key={item}
              type="button"
              className="w-full text-left px-4 py-2 text-sm hover:bg-gray-100"
              role="menuitem"
            >
              {item}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

/* --------------------------------- Header --------------------------------- */

export default function Header() {
  return (
    <header className="bg-white shadow-sm border-b-2 px-4 md:px-6 py-3 flex flex-col md:flex-row md:items-center md:justify-between gap-4">

      {/* LEFT SECTION */}
      <div className="flex items-start md:items-center gap-4">
        {/* <button
          type="button"
          onClick={() => setIsOpen((prev) => !prev)}
          className="md:hidden p-2 rounded hover:bg-gray-100"
          aria-label="Toggle sidebar"
        >
          <Menu size={20} />
        </button> */}

        <div>
          <h2 className="font-bold text-lg md:text-[24px] leading-8 md:leading-[32px] text-[#4F5857]">
  COI Review Dashboard
</h2>

         <p className="hidden sm:block text-[14px] leading-[20px] font-medium text-[#525866]">
  Overview of all Certificate of Insurance
</p>

        </div>
      </div>

      {/* RIGHT SECTION */}
      <div className="flex flex-wrap items-center gap-3 md:gap-6">

    
        <div className="relative w-full sm:w-48">
          <select
            className="appearance-none w-full px-4 py-2 pr-10 border border-[#4A88EE] text-[#4A88EE]  rounded-[10px] text-sm bg-white focus:outline-none  focus:border-[#4A88EE] transition"
          >
            <option>Send Bulk Reminder</option>
            <option value="US">United States</option>
            <option value="CA">Canada</option>
            <option value="FR">France</option>
            <option value="DE">Germany</option>
          </select>

          <ChevronDown
            size={18}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none"
          />
        </div>

       
        <IconButton
          icon={<img src="/icons/Shape.svg" alt="" className="w-5 h-5" />}
          className="bg-[#F3F4F4] border-gray-200 text-gray-600 hover:text-gray-900"
        >
          Ask LegalGraph AI
        </IconButton>

       
        <IconButton
          icon={<img src="/icons/help.svg" alt="" className="w-5 h-5" />}
          className="border-[#4A88EE] text-gray-600 hover:text-gray-900"
        >
          Help
        </IconButton>

       
        <ProfileDropdown
          name="Shubham"
          email="shubham@gmail.com"
        />

      </div>
    </header>
  );
}
