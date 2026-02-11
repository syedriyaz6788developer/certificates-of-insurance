import { useState } from "react";
import { Outlet } from "react-router-dom";
import Header from "./Header";
import Sidebar from "./Sidebar";

export default function Layout() {
  const [isOpen, setIsOpen] = useState(true);

  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar isOpen={isOpen} setIsOpen={setIsOpen} />

      <div className="flex flex-col flex-1">
        <Header setIsOpen={setIsOpen} />

        <main className="flex-1 p-2 bg-white overflow-y-auto">
          <div className="bg-white rounded-xl  p-2">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}
