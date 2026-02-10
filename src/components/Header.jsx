// Header.jsx
import { Menu } from "lucide-react";

export default function Header({ setIsOpen }) {
  return (
    <header className="bg-white shadow-sm p-4 flex items-center justify-between">
      <button
        onClick={() => setIsOpen((prev) => !prev)}
        className="md:hidden p-2 rounded hover:bg-gray-100"
      >
        <Menu size={20} />
      </button>

      <h2 className="text-lg font-semibold">COI Review Dashboard</h2>

      <div className="flex items-center gap-3">
        <div className="w-8 h-8 bg-blue-500 rounded-full text-white flex items-center justify-center">
          S
        </div>
      </div>
    </header>
  );
}
