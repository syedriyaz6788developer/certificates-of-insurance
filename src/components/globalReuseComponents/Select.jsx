import React, { useState } from "react";
import { ChevronDown } from "lucide-react";

export default function Select({
  label,
  options = [],
  value,
  onChange,
  placeholder = "Select option",
  disabled = false,
  className = "",
}) {
  const [open, setOpen] = useState(false);

  return (
    <div className="flex flex-col gap-1">
      {label && (
        <label className="text-sm font-medium text-body">
          {label}
        </label>
      )}

      <div className="relative">
        <select
          value={value}
          onChange={onChange}
          disabled={disabled}
          onFocus={() => setOpen(true)}
          onBlur={() => setOpen(false)}
          className={`appearance-none w-full px-3 py-2 pr-10 text-sm bg-neutral-secondary-medium border border-default-medium rounded-lg shadow-xs focus:ring-brand focus:border-brand disabled:opacity-50 disabled:cursor-not-allowed ${className}`}
        >
          <option value="" disabled>
            {placeholder}
          </option>

          {options.map((option, index) => (
            <option key={index} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>

        {/* Chevron */}
        <ChevronDown
          size={16}
          className={`absolute right-3 top-1/2 -translate-y-1/2 transition-transform duration-200 pointer-events-none ${
            open ? "rotate-180" : ""
          }`}
        />
      </div>
    </div>
  );
}
