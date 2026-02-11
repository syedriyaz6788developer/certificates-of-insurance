import React, { useState } from "react";
import Select from "../globalReuseComponents/Select";
import { Search, Settings, Pencil, EllipsisVertical, Plus } from "lucide-react";
import Pagination from "./Pagination";
import toast from "react-hot-toast";
import data from "../../data/coiData.json";

export default function Table() {
  const [property, setProperty] = useState("");
  const [status, setStatus] = useState("");
  const [reminder, setReminder] = useState("");
  const [page, setPage] = useState(1);
  const [rows, setRows] = useState(10);

  const [tableData, setTableData] = useState(() => {
    if (!data || data.length === 0) {
      toast.error("No COI data available");
      return [];
    }
    return data;
  });

  // Status Options
  const statusNotify = [
    { label: "Active", value: "Active" },
    { label: "Expired", value: "Expired" },
    { label: "Rejected", value: "Rejected" },
    { label: "Expiring", value: "Expiring" },
    { label: "Not Processed", value: "Not Processed" },
  ];

  // Update Reminder Status
  const handleReminderChange = (id, value) => {
    try {
      setTableData((prev) =>
        prev.map((item) =>
          item.id === id ? { ...item, reminderStatus: value } : item
        )
      );
      toast.success("Reminder status updated");
    } catch (error) {
      toast.error("Failed to update reminder status");
      console.error(error);
    }
  };

  // Auto Reminder Label
  const getReminderStatusLabel = (item) => {
    if (!item.expiryDate) return "NA";

    const today = new Date();
    const expiry = new Date(item.expiryDate);
    if (isNaN(expiry)) return "NA";

    const diffTime = expiry - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays <= 0) return "NA";
    if (diffDays <= 30) return `Sent (${diffDays}d)`;

    return "Not Sent";
  };

  return (
    <div className="w-full">
      <div className="relative bg-neutral-primary-soft shadow rounded-md border border-default overflow-hidden">

        {/* ================= HEADER ================= */}
        <div className="p-4 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">

          {/* Filters */}
          <div className="flex flex-col sm:flex-row flex-wrap gap-3 w-full lg:w-auto">
            <Select
              placeholder="All Properties"
              value={property}
              onChange={(e) => setProperty(e.target.value)}
              options={[
                { label: "Property 1", value: "Property 1" },
                { label: "Property 2", value: "Property 2" },
              ]}
            />

            <Select
              placeholder="Status"
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              options={[
                { label: "Active", value: "Active" },
                { label: "Expired", value: "Expired" },
              ]}
            />

            <Select
              placeholder="Reminder"
              value={reminder}
              onChange={(e) => setReminder(e.target.value)}
              options={[
                { label: "Sent", value: "Sent" },
                { label: "Pending", value: "Pending" },
              ]}
            />
          </div>

          {/* Right Controls */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full lg:w-auto">

            {/* Search */}
            <div className="relative w-full sm:w-64">
              <Search
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                size={18}
              />
              <input
                type="text"
                placeholder="Search..."
                className="w-full pl-10 pr-4 py-2 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="flex gap-3">
              <button className="p-2 border rounded-xl hover:bg-gray-100 transition">
                <Settings size={18} />
              </button>

              <button
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition whitespace-nowrap"
                onClick={() => toast.success("Add COI clicked")}
              >
                <Plus size={18} />
                ADD COI
              </button>
            </div>
          </div>
        </div>

        {/* ================= TABLE ================= */}
        <div className="overflow-x-auto">
          <table className="min-w-[950px] w-full text-sm text-left">
            <thead className="text-xs bg-[#DCDEDE] border-y">
              <tr>
                <th className="p-4">
                  <input type="checkbox" />
                </th>
                <th className="px-6 py-3">Property</th>
                <th className="px-6 py-3">Tenant Name</th>
                <th className="px-6 py-3">Unit</th>
                <th className="px-6 py-3">COI Name</th>
                <th className="px-6 py-3">Expiry Date</th>
                <th className="px-6 py-3">Status</th>
                <th className="px-6 py-3">Reminder Status</th>
                <th className="px-6 py-3">Actions</th>
              </tr>
            </thead>

            <tbody>
              {tableData.map((item) => (
                <tr
                  key={item.id}
                  className="border-b hover:bg-gray-50 transition"
                >
                  <td className="p-4">
                    <input type="checkbox" />
                  </td>

                  <td className="px-6 py-4">{item.property}</td>
                  <td className="px-6 py-4">{item.tenantName}</td>
                  <td className="px-6 py-4">{item.unit}</td>
                  <td className="px-6 py-4">{item.coiName}</td>

                  {/* Expiry Date */}
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      {item.expiryDate}
                      <Pencil size={14} className="cursor-pointer" />
                    </div>
                  </td>

                  {/* Status Select */}
                  <td className="px-6 py-4 w-52">
                    <Select
                      value={item.reminderStatus}
                      onChange={(e) =>
                        handleReminderChange(item.id, e.target.value)
                      }
                      options={statusNotify}
                    />
                  </td>

                  {/* Reminder Label */}
                  <td className="px-6 py-4">
                    {getReminderStatusLabel(item)}
                  </td>

                  {/* Actions */}
                  <td className="px-6 py-4">
                    <EllipsisVertical className="cursor-pointer" />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* ================= PAGINATION ================= */}
        <div className="py-3 px-4 flex justify-center sm:justify-between">
          <Pagination
            page={page}
            totalPages={52}
            rowsPerPage={rows}
            onPageChange={setPage}
            onRowsChange={setRows}
          />
        </div>

      </div>
    </div>
  );
}
