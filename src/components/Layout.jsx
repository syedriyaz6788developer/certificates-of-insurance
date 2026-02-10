// Layout.jsx
import { useState } from "react";
import Header from "./Header";
import Sidebar from "./Sidebar";

export default function Layout() {
  const [isOpen, setIsOpen] = useState(true);

  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar isOpen={isOpen} setIsOpen={setIsOpen} />

      <div className="flex flex-col flex-1">
        <Header isOpen={isOpen} setIsOpen={setIsOpen} />

        <main className="flex-1 p-6 overflow-y-auto">
          <div className="bg-white rounded-xl shadow p-6">
            Dashboard Content
          </div>
        </main>
      </div>
    </div>
  );
}
