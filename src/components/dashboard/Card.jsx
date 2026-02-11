import React from "react";

export default function Card({
  title,
  value,
  color,
  icon,
}) {
  return (
    <div
      className="rounded-2xl p-4 shadow-sm w-full"
      style={{ backgroundColor: color }}
    >
      <h4 className="text-gray-600 text-sm font-medium mb-3">
        {title}
      </h4>

      <div className="flex items-center gap-2 bg-[#FFFFFF] rounded-xl p-3">
        <div className="w-10 h-10 rounded-lg flex items-center justify-center">
          {icon && (
            <img src={icon} alt="icon" className="w-5 h-5" />
          )}
        </div>

        <span className="text-2xl font-semibold text-gray-900">
          {value}
        </span>
      </div>
    </div>
  );
}
