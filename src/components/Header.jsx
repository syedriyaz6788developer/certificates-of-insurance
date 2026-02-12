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
      {children && <span>{children}</span>}
    </button>
  );
}

/* --------------------------------- Header --------------------------------- */

export default function Header({ setIsOpen, isMobileView }) {
  const [isBulkReminderOpen, setIsBulkReminderOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const profileButtonRef = useRef(null);
  const profileDropdownRef = useRef(null);
  const bulkReminderRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(e) {
      if (
        profileDropdownRef.current &&
        !profileDropdownRef.current.contains(e.target) &&
        profileButtonRef.current &&
        !profileButtonRef.current.contains(e.target)
      ) {
        setIsProfileOpen(false);
      }

      if (
        bulkReminderRef.current &&
        !bulkReminderRef.current.contains(e.target)
      ) {
        setIsBulkReminderOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    if (
      isProfileOpen &&
      profileButtonRef.current &&
      profileDropdownRef.current
    ) {
      setTimeout(() => {
        const button = profileButtonRef.current;
        const dropdown = profileDropdownRef.current;

        if (button && dropdown) {
          const buttonRect = button.getBoundingClientRect();

          if (window.innerWidth >= 768) {
            const buttonCenter = buttonRect.left + buttonRect.width / 2;
            const dropdownWidth = dropdown.offsetWidth;

            let leftPosition = buttonCenter - dropdownWidth / 2;

            const viewportWidth = window.innerWidth;
            const padding = 16;

            if (leftPosition < padding) {
              leftPosition = padding;
            }

            if (leftPosition + dropdownWidth > viewportWidth - padding) {
              leftPosition = viewportWidth - dropdownWidth - padding;
            }

            dropdown.style.position = "fixed";
            dropdown.style.left = `${leftPosition}px`;
            dropdown.style.top = `${buttonRect.bottom + 8}px`;
            dropdown.style.bottom = "auto";
            dropdown.style.right = "auto";
          }
        }
      }, 10);
    }
  }, [isProfileOpen]);

  return (
    <header className="bg-white border-b-2  px-4 md:px-6 py-3 sticky top-0 z-20">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        {/* --------------------LEFT SECTION -------------------- */}
        <div className="flex items-start md:items-center gap-4">
          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsOpen(true)}
            className={`
              p-2 -ml-2 rounded-lg hover:bg-gray-100 transition
              ${isMobileView ? "block" : "hidden"}
            `}
            aria-label="Open menu"
          >
            <Menu size={24} className="text-gray-700" />
          </button>

          <div className="min-w-0 flex-1">
            <h2 className="font-inter-display font-bold text-[24px] leading-[32px] tracking-normal text-[#4F5857] truncate">
              COI Review Dashboard
            </h2>
            <p className="hidden sm:block font-inter-display font-medium text-[14px] leading-[20px] tracking-normal text-[#525866] truncate">
              Overview of all Certificate of Insurance
            </p>
          </div>
        </div>

        {/* RIGHT SECTION - All actions aligned to the right */}
        <div className="flex items-center justify-end gap-2 md:gap-4 flex-1 min-w-0">
          {/* Bulk Reminder Dropdown */}
          <div
            ref={bulkReminderRef}
            className="relative w-full sm:w-48 "
          >
            <button
              onClick={() => setIsBulkReminderOpen(!isBulkReminderOpen)}
              className="appearance-none w-full px-1 py-2 pr-2 border border-[#4A88EE] text-[#4A88EE] rounded-[10px] bg-white focus:outline-none focus:border-[#4A88EE] transition flex items-center justify-between font-inter font-medium text-[14px] leading-[20px] tracking-[-0.6%] text-center"
            >
              <span className="mx-2">Send Bulk Reminder</span>
              <ChevronDown
                size={18}
                className={`text-[#4A88EE] transition-transform mx-1 flex-shrink-0 ${
                  isBulkReminderOpen ? "rotate-180" : ""
                }`}
              />
            </button>

            {isBulkReminderOpen && (
              <>
                <div
                  className="fixed inset-0 z-[998]"
                  onClick={() => setIsBulkReminderOpen(false)}
                />
                <div className="absolute right-0 mt-2 w-full bg-white border rounded-lg shadow-lg py-2 z-[999]">
                  {["United States", "Canada", "France", "Germany"].map(
                    (country) => (
                      <button
                        key={country}
                        className="w-full text-left px-4 py-2 text-sm hover:bg-gray-100 transition"
                        onClick={() => setIsBulkReminderOpen(false)}
                      >
                        {country}
                      </button>
                    ),
                  )}
                </div>
              </>
            )}
          </div>

          <IconButton
            icon={<img src="/icons/Shape.svg" alt="" className="w-5 h-5" />}
            className="hidden lg:flex bg-[#F3F4F4] border-gray-200 text-[#2C3635] hover:text-gray-900 font-inter font-medium text-[14px] leading-[20px] tracking-[-0.6%] text-center"
          >
            Ask LegalGraph AI
          </IconButton>

          <IconButton
            icon={<img src="/icons/help.svg" alt="" className="w-5 h-5" />}
            className="border-[#4A88EE] text-[#4A88EE] hover:text-gray-900 font-inter font-medium text-[14px] leading-[20px] tracking-[-0.6%] text-center"
          >
            <span className="hidden sm:inline">Help</span>
          </IconButton>

          <div className="relative">
            <button
              ref={profileButtonRef}
              type="button"
              onClick={() => setIsProfileOpen((prev) => !prev)}
              className="flex items-center gap-2 md:gap-3 cursor-pointer hover:bg-gray-50 px-2 py-1 rounded-lg transition"
              aria-expanded={isProfileOpen}
              aria-haspopup="menu"
            >
              <div className="w-8 h-8 bg-blue-500 rounded-full text-white flex items-center justify-center flex-shrink-0">
                S
              </div>

              <div className="hidden md:block text-left min-w-0">
                <h6 className="font-roboto font-normal text-[14px] leading-[140%] tracking-[0.15px] text-[#26282B] truncate max-w-[120px]">
                  Shubham
                </h6>
                <p className="font-roboto font-normal text-[13px] leading-[100%] tracking-[0.15px] text-[#73787E] ">
                  shubham@gmail.com
                </p>
              </div>

              <ChevronDown
                size={18}
                className={`hidden md:block transition-transform flex-shrink-0 ${isProfileOpen ? "rotate-180" : ""}`}
              />
            </button>

            {/* Profile Dropdown Menu */}
            {isProfileOpen && (
              <>
                {/* Backdrop - mobile only */}
                <div
                  className="fixed inset-0 z-[999] md:hidden"
                  onClick={() => setIsProfileOpen(false)}
                />

                {/* Dropdown - centered on desktop, bottom sheet on mobile */}
                <div
                  ref={profileDropdownRef}
                  className={`
                    ${
                      window.innerWidth < 768
                        ? "fixed left-4 right-2  w-auto rounded-xl"
                        : "fixed w-64 rounded-lg"
                    }
                    bg-white border shadow-lg py-2 z-[1000]
                  `}
                  style={{
                    // Desktop: position will be set by useEffect
                    ...(window.innerWidth >= 768 && {
                      position: "fixed",
                    }),
                  }}
                  role="menu"
                >
                  {/* User info - Mobile only */}
                  <div className="md:hidden px-4 py-3 border-b">
                    <p className="font-medium text-sm">Shubham</p>
                    <p className="text-xs text-gray-500">shubham@gmail.com</p>
                  </div>

                  {/* Menu items */}
                  <div className="py-1">
                    {["Settings", "Notifications", "Logout"].map((item) => (
                      <button
                        key={item}
                        type="button"
                        className="w-full text-left px-4 py-2.5 md:py-2 text-sm hover:bg-gray-100 transition flex items-center gap-3"
                        role="menuitem"
                        onClick={() => {
                          console.log(`${item} clicked`);
                          setIsProfileOpen(false);
                        }}
                      >
                        {item === "Logout" ? (
                          <span className="text-red-600">{item}</span>
                        ) : (
                          <span>{item}</span>
                        )}
                      </button>
                    ))}
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Quick Actions Bar */}
      {isMobileView && (
        <div className="flex items-center gap-2 mt-3 pt-3 border-t border-gray-100">
          <IconButton
            icon={<img src="/icons/Shape.svg" alt="" className="w-5 h-5" />}
            className="flex-1 bg-[#F3F4F4] border-gray-200 text-gray-600 hover:text-gray-900 justify-center"
          >
            Ask AI
          </IconButton>

          <button className="flex-1 px-3 py-2 text-sm border border-[#4A88EE] text-[#4A88EE] rounded-[10px] bg-white hover:bg-blue-50 transition">
            Send Reminder
          </button>
        </div>
      )}
    </header>
  );
}
