import React, { useState } from "react";
import Select from "../globalReuseComponents/Select";
import { Search, Settings, Plus } from "lucide-react";
import Pagination from "./Pagination";

export default function Table() {
  const [property, setProperty] = useState("");
  const [status, setStatus] = useState("");
  const [reminder, setReminder] = useState("");
  const [page, setPage] = useState(1);
  const [rows, setRows] = useState(10);
  return (
    <div>
      <div className="relative overflow-x-auto bg-neutral-primary-soft shadow rounded-md border border-default">
        <div className="p-4 flex items-center justify-between gap-4">
          {/* LEFT SIDE */}
          <div className="flex items-center gap-3">
            <Select
              placeholder="All Properties"
              value={property}
              onChange={(e) => setProperty(e.target.value)}
              options={[
                { label: "Property 1", value: "p1" },
                { label: "Property 2", value: "p2" },
              ]}
            />

            <Select
              placeholder="Status"
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              options={[
                { label: "Active", value: "active" },
                { label: "Expired", value: "expired" },
              ]}
            />

            <Select
              placeholder="Reminder"
              value={reminder}
              onChange={(e) => setReminder(e.target.value)}
              options={[
                { label: "Sent", value: "sent" },
                { label: "Pending", value: "pending" },
              ]}
            />
          </div>

          {/* RIGHT SIDE */}
          <div className="flex items-center gap-3">
            {/* Search Bar */}
            <div className="relative">
              <Search
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                size={18}
              />
              <input
                type="text"
                placeholder="Search by tenants, properties or units..."
                className="pl-10 pr-4 py-2 border rounded-xl focus:outline-none  "
              />
            </div>

            {/* Settings Button */}
            <button className="p-2 border rounded-xl hover:bg-gray-100 transition">
              <Settings size={18} />
            </button>

            {/* Add New Button */}
            <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition">
              <Plus size={18} />
              ADD COI
            </button>
          </div>
        </div>

        <table className="w-full text-sm text-left rtl:text-right text-body">
          <thead className="text-sm text-body bg-[#DCDEDE] border-b border-t border-default-medium">
            <tr>
              <th scope="col" className="p-4">
                <div className="flex items-center">
                  <input
                    id="table-checkbox-20"
                    type="checkbox"
                    value=""
                    className="w-4 h-4 border border-default-medium rounded-xs bg-neutral-secondary-medium focus:ring-2 focus:ring-brand-soft"
                  />
                  <label for="table-checkbox-20" className="sr-only">
                    Table checkbox
                  </label>
                </div>
              </th>
              <th scope="col"   className="px-6 py-3  font-medium text-sm leading-6 text-[#666E6D] font-['Inter']">
                Property
              </th>
              <th scope="col"   className="px-6 py-3 font-medium text-sm leading-6 text-[#666E6D] font-['Inter']">
                Tenant Name
              </th>
              <th scope="col"   className="px-6 py-3 font-medium text-sm leading-6 text-[#666E6D] font-['Inter']">
                Unit
              </th>
              <th scope="col"   className="px-6 py-3 font-medium text-sm leading-6 text-[#666E6D] font-['Inter']">
                COI Name
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-sm font-medium "
              >
                <div className="flex items-center justify-between">
                  <span className=" font-medium text-base leading-6 text-[#666E6D] font-['Inter']">Expiry Date</span>

                  {/* Sort Icons */}
                  <div className="flex flex-col ml-2">
                    <svg
                      className="w-4 h-4 text-gray-400"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path d="M5 12l5-5 5 5H5z" />
                    </svg>
                    <svg
                      className="w-4 h-4 text-gray-400 -mt-1"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path d="M5 8l5 5 5-5H5z" />
                    </svg>
                  </div>
                </div>
              </th>

              <th scope="col"  className="px-6 py-3 font-medium text-sm leading-6 text-[#666E6D] font-['Inter']">
                Status
              </th>
              <th scope="col"  className="px-6 py-3 font-medium text-sm leading-6 text-[#666E6D] font-['Inter']">
                Reminder status
              </th>
              <th scope="col"  className="px-6 py-3 font-medium text-sm leading-6 text-[#666E6D] font-['Inter']">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            <tr className="bg-neutral-primary-soft border-b border-default hover:bg-neutral-secondary-medium">
              <td className="w-4 p-4">
                <div className="flex items-center">
                  <input
                    id="table-checkbox-21"
                    type="checkbox"
                    value=""
                    className="w-4 h-4 border border-default-medium rounded-xs bg-neutral-secondary-medium focus:ring-2 focus:ring-brand-soft"
                  />
                  <label for="table-checkbox-21" className="sr-only">
                    Table checkbox
                  </label>
                </div>
              </td>
              <th
                scope="row"
                className="px-6 py-4 font-medium text-heading whitespace-nowrap"
              >
                Apple MacBook Pro 17"
              </th>
              <td className="px-6 py-4">Silver</td>
              <td className="px-6 py-4">Laptop</td>
              <td className="px-6 py-4">$2999</td>
              <td className="px-6 py-4">Silver</td>
              <td className="px-6 py-4">Laptop</td>
              <td className="px-6 py-4">$2999</td>
              <td className="px-6 py-4">
                <a
                  href="#"
                  className="font-medium text-fg-brand hover:underline"
                >
                  Edit
                </a>
              </td>
            </tr>
          </tbody>
        </table>

        <div className="py-2">
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
