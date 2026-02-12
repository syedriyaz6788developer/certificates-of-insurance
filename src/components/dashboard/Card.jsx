import React from "react";

export default function Card({ title, value, color, icon }) {
  return (
    <div
      className="rounded-2xl p-4 shadow w-full"
      style={{ backgroundColor: color }}
    >
      <h4 className="font-inter-display font-medium text-[16px] leading-[24px] tracking-normal text-[#2C3635] align-middle mb-3">
        {title}
      </h4>

      <div className="flex items-center gap-2 bg-[#FFFFFF] rounded-xl p-3">
        <div className="w-10 h-10 rounded-lg flex items-center justify-center">
          {icon && <img src={icon} alt="icon" className="w-5 h-5" />}
        </div>

        <span className="font-[family-name:var(--font-family-default)] font-medium text-[24px] leading-[20px] tracking-[-0.32px] text-center align-middle text-[#383838]">
          {value}
        </span>
      </div>
    </div>
  );
}
