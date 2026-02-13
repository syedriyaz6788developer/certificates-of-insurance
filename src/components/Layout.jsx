import { useState, useEffect } from "react";
import { Outlet } from "react-router-dom";
import Header from "./Header";
import Sidebar from "./Sidebar";

export default function Layout() {
  const [isOpen, setIsOpen] = useState(false);
  const [isMobileView, setIsMobileView] = useState(false);
  const [isTabletView, setIsTabletView] = useState(false);

  useEffect(() => {
    const checkDeviceView = () => {
      const width = window.innerWidth;
      const mobile = width < 768;
      const tablet = width >= 768 && width < 1024;
      
      setIsMobileView(mobile);
      setIsTabletView(tablet);
      
      setIsOpen((prevIsOpen) => {
        // Mobile: closed by default
        if (mobile) return false;
        // Tablet: closed by default (can be toggled)
        if (tablet) return false;
        // Desktop: open by default
        if (!mobile && !tablet && prevIsOpen === false) {
          return true;
        }
        return prevIsOpen;
      });
    };
    
    checkDeviceView();
    window.addEventListener('resize', checkDeviceView);
    return () => window.removeEventListener('resize', checkDeviceView);
  }, []);

  return (
    <div className="flex h-screen bg-gray-100 overflow-hidden">
      {/* Sidebar Container */}
      <div className={`
        ${isMobileView || isTabletView 
          ? 'fixed inset-y-0 left-0 z-50 transform transition-transform duration-300 ease-in-out'
          : 'relative flex-shrink-0'
        }
        ${(isMobileView || isTabletView) && !isOpen ? '-translate-x-full' : 'translate-x-0'}
      `}>
        <Sidebar 
          isOpen={isOpen} 
          setIsOpen={setIsOpen} 
          isMobileView={isMobileView}
          isTabletView={isTabletView}
        />
      </div>

      {/* Overlay - Show on both mobile and tablet */}
      {(isMobileView || isTabletView) && isOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 transition-opacity"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Content Area */}
      <div className="flex flex-col flex-1 h-screen overflow-hidden">
        <Header 
          setIsOpen={setIsOpen} 
          isMobileView={isMobileView}
          isTabletView={isTabletView}
        />
        
        <main className="flex-1 overflow-y-auto overflow-x-hidden bg-white">
          <div className="container mx-auto p-2 sm:p-3 md:p-4 lg:p-2">
            <div className="bg-white rounded-xl shadow-sm">
              <Outlet />
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}