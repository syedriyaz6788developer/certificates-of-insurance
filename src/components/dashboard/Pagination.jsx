import React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

export default function Pagination({
  page = 1,
  totalPages = 52,
  rowsPerPage = 10,
  onPageChange,
  onRowsChange,
}) {
  const handlePrev = () => {
    if (page > 1) onPageChange(page - 1);
  };

  const handleNext = () => {
    if (page < totalPages) onPageChange(page + 1);
  };

  return (
    <div className="w-full  bg-gray-100 rounded-xl px-4 py-2 flex items-center justify-between">
      
      {/* Left Section */}
      <div className="flex items-center gap-2 text-sm text-gray-700">
        <span>Rows per page</span>
        <select
          value={rowsPerPage}
          onChange={(e) => onRowsChange(Number(e.target.value))}
          className="bg-white border border-gray-300 rounded-lg px-3 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-gray-300"
        >
          <option value={10}>10</option>
          <option value={25}>25</option>
          <option value={50}>50</option>
          <option value={100}>100</option>
        </select>
      </div>

      {/* Right Section */}
      <div className="flex items-center gap-6">
        
        {/* Pagination Controls */}
        <div className="flex items-center gap-3 text-sm text-gray-600">
          <button
            onClick={handlePrev}
            disabled={page === 1}
            className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-200 hover:bg-gray-300 transition disabled:opacity-40 disabled:cursor-not-allowed"
          >
            <ChevronLeft size={18} />
          </button>

          <span className="font-medium">
            Page {page} of {totalPages}
          </span>

          <button
            onClick={handleNext}
            disabled={page === totalPages}
            className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-200 hover:bg-gray-300 transition disabled:opacity-40 disabled:cursor-not-allowed"
          >
            <ChevronRight size={18} />
          </button>
        </div>

        {/* Go To Button */}
        <div>
          <button className="bg-white border border-gray-300 rounded-lg px-4 py-1 text-sm hover:bg-gray-50 transition">
            Go to
          </button>
        </div>
      </div>
    </div>
  );
}
