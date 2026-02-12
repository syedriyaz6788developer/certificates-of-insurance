import { useState, useEffect } from "react";
import { Outlet } from "react-router-dom";
import Header from "./Header";
import Sidebar from "./Sidebar";

export default function Layout() {
  const [isOpen, setIsOpen] = useState(false); 
  const [isMobileView, setIsMobileView] = useState(false);


 useEffect(() => {
  const checkMobileView = () => {
    const mobile = window.innerWidth < 768;
    setIsMobileView(mobile);
    
   
    setIsOpen((prevIsOpen) => {
     
      if (mobile) return false;
      if (!mobile && prevIsOpen === false) {
        return true;
      }
      return prevIsOpen;
    });
  };
  
  checkMobileView();
  window.addEventListener('resize', checkMobileView);
  return () => window.removeEventListener('resize', checkMobileView);
}, []);
  return (
    <div className="flex h-screen bg-gray-100 overflow-hidden">
      <div className={`
        ${isMobileView 
          ? 'fixed inset-y-0 left-0 z-50 transform transition-transform duration-300 ease-in-out'
          : 'relative flex-shrink-0'
        }
        ${isMobileView && !isOpen ? '-translate-x-full' : 'translate-x-0'}
      `}>
        <Sidebar isOpen={isOpen} setIsOpen={setIsOpen} />
      </div>

      {/*------------------ Mobile overlay -------------------------*/}
      {isMobileView && isOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 transition-opacity"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* ------------- Content Area ------------------------*/}
      <div className="flex flex-col flex-1 h-screen overflow-hidden">
        <Header 
          setIsOpen={setIsOpen} 
          isMobileView={isMobileView} 
        />
        
        <main className="flex-1 overflow-y-auto overflow-x-hidden bg-gray-50">
          <div className="container mx-auto p-1 sm:p-4 md:p-2">
            <div className="bg-white rounded-xl shadow-sm">
              <Outlet />
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}