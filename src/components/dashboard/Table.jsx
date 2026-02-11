import React, { useState, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import Select from "../globalReuseComponents/Select";
import { Search, Settings, Pencil, EllipsisVertical, Plus, Send, ChevronDown, Trash2, Edit } from "lucide-react";
import Pagination from "./Pagination";
import COIModal from "./COIModal";
import COIDetailModal from "./COIDetailModal";
import BulkReminderModal from "./BulkReminderModal";
import ReminderActionModal from "../dashboard/ReminderActionModal"; 
import {
  selectPaginatedCOIs,
  selectSelectedRows,
  selectFilters,
  selectPagination,
  selectTotalPages,
  selectPropertyOptions,
  setPropertyFilter,
  setStatusFilter,
  setExpiryFilter,
  setSearchTerm,
  setPage,
  setRowsPerPage,
  toggleSelectRow,
  setSelectedRows,
  updateCOI,
} from "../../store/coiSlice";

export default function Table() {
  const dispatch = useDispatch();
  
  const paginatedData = useSelector(selectPaginatedCOIs);
  const selectedRows = useSelector(selectSelectedRows);
  const filters = useSelector(selectFilters);
  const pagination = useSelector(selectPagination);
  const totalPages = useSelector(selectTotalPages);
  const propertyOptions = useSelector(selectPropertyOptions);

  const [selectAll, setSelectAll] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [isBulkReminderOpen, setIsBulkReminderOpen] = useState(false);
  const [isReminderActionOpen, setIsReminderActionOpen] = useState(false);
  const [selectedCOI, setSelectedCOI] = useState(null);
  const [selectedActionCOI, setSelectedActionCOI] = useState(null);
  const [actionMenuOpenId, setActionMenuOpenId] = useState(null);
  
  // State for inline status edit
  const [statusEditId, setStatusEditId] = useState(null);
  const statusSelectRef = useRef(null);
  const actionMenuRef = useRef(null);

  // Status options
  const statusOptions = [
    { label: "Active", value: "Active" },
    { label: "Expired", value: "Expired" },
    { label: "Rejected", value: "Rejected" },
    { label: "Expiring Soon", value: "Expiring Soon" },
    { label: "Not Processed", value: "Not Processed" }
  ];

  const expiryFilterOptions = [
    { label: "All", value: "all" },
    { label: "Expired", value: "expired" },
    { label: "Expiring in 30 days", value: "expiring30" },
    { label: "Expiring in 90 days", value: "expiring90" }
  ];

  // Status color helper functions
  const getStatusBgColor = (status) => {
    const colors = {
      "Active": "#DBEAFE", // blue-100
      "Expired": "#FEE2E2", // red-100
      "Rejected": "#FEE2E2", // red-100
      "Expiring Soon": "#FFEDD5", // orange-100
      "Not Processed": "#EFF6FF" // blue-50
    };
    return colors[status] || "#F3F4F6";
  };

  const getStatusTextColor = (status) => {
    const colors = {
      "Active": "#1E40AF", // blue-800
      "Expired": "#991B1B", // red-800
      "Rejected": "#991B1B", // red-800
      "Expiring Soon": "#9A3412", // orange-800
      "Not Processed": "#2563EB" // blue-600
    };
    return colors[status] || "#1F2937";
  };

  const getStatusBorderColor = (status) => {
    const colors = {
      "Active": "#BFDBFE", // blue-200
      "Expired": "#FECACA", // red-200
      "Rejected": "#FECACA", // red-200
      "Expiring Soon": "#FED7AA", // orange-200
      "Not Processed": "#BFDBFE" // blue-200
    };
    return colors[status] || "#E5E7EB";
  };

  const getStatusSelectColor = (status) => {
    const colors = {
      "Active": "bg-blue-100 text-blue-800 border-blue-200",
      "Expired": "bg-red-100 text-red-800 border-red-200",
      "Rejected": "bg-red-100 text-red-800 border-red-200",
      "Expiring Soon": "bg-orange-100 text-orange-800 border-orange-200",
      "Not Processed": "bg-blue-50 text-blue-600 border-blue-200"
    };
    return colors[status] || "bg-gray-100 text-gray-800 border-gray-200";
  };

  // Close status select and action menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (statusSelectRef.current && !statusSelectRef.current.contains(event.target)) {
        setStatusEditId(null);
      }
      if (actionMenuRef.current && !actionMenuRef.current.contains(event.target)) {
        setActionMenuOpenId(null);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Handle select all
  useEffect(() => {
    if (selectAll) {
      dispatch(setSelectedRows(paginatedData.map(item => item.id)));
    } else {
      dispatch(setSelectedRows([]));
    }
  }, [selectAll, paginatedData, dispatch]);

  const handleSelectRow = (id) => {
    dispatch(toggleSelectRow(id));
  };

  const handleRowClick = (item) => {
    // Don't open detail modal if clicking on status cell, checkbox, or action menu
    if (statusEditId === item.id || actionMenuOpenId === item.id) return;
    setSelectedCOI(item);
    setIsDetailModalOpen(true);
  };

  const handleEditExpiry = (e, id) => {
    e.stopPropagation();
    const newDate = prompt("Enter new expiry date (YYYY-MM-DD):");
    if (newDate) {
      dispatch(updateCOI({ id, updatedData: { expiryDate: newDate } }));
    }
  };

  const handleStatusChange = (e, id) => {
    const newStatus = e.target.value;
    dispatch(updateCOI({ id, updatedData: { status: newStatus } }));
    setStatusEditId(null);
  };

  // Handle reminder action menu
  const handleActionClick = (e, item) => {
    e.stopPropagation();
    setActionMenuOpenId(actionMenuOpenId === item.id ? null : item.id);
    setSelectedActionCOI(item);
  };

  // Handle edit from action menu
  const handleEditFromAction = (e, item) => {
    e.stopPropagation();
    setActionMenuOpenId(null);
    setSelectedCOI(item);
    setIsDetailModalOpen(true);
  };

  

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
      <div className="relative  shadow rounded-md border border-default overflow-hidden">
        
        {/* ================= HEADER ================= */}
        <div className="p-4 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          
          {/* Filters */}
          <div className="flex flex-col sm:flex-row flex-wrap gap-3 w-full lg:w-auto">
            <Select
              placeholder="All Properties"
              value={filters.property}
              onChange={(e) => dispatch(setPropertyFilter(e.target.value))}
              options={propertyOptions}
            />

            <Select
              placeholder="Status"
              value={filters.status}
              onChange={(e) => dispatch(setStatusFilter(e.target.value))}
              options={statusOptions}
            />

            <Select
              placeholder="Filter by Expiry"
              value={filters.expiryFilter}
              onChange={(e) => dispatch(setExpiryFilter(e.target.value))}
              options={expiryFilterOptions}
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
                placeholder="Search by tenant, property or unit..."
                value={filters.searchTerm}
                onChange={(e) => dispatch(setSearchTerm(e.target.value))}
                className="w-full pl-10 pr-4 py-2 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="flex gap-3">
              <button className="p-2 border rounded-xl hover:bg-gray-100 transition">
                <Settings size={18} />
              </button>

              <button
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition whitespace-nowrap"
                onClick={() => setIsAddModalOpen(true)}
              >
                <Plus size={18} />
                ADD COI
              </button>
            </div>
          </div>
        </div>

        {/* ================= BULK ACTIONS ================= */}
        {selectedRows.length > 0 && (
          <div className="bg-blue-50 px-4 py-2 flex items-center justify-between border-y">
            <span className="text-sm text-blue-700">
              {selectedRows.length} item(s) selected
            </span>
            <div className="flex gap-2">
              <button
                onClick={() => setIsBulkReminderOpen(true)}
                className="flex items-center gap-1 px-3 py-1 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700"
              >
                <Send size={16} />
                Send Bulk Reminder
              </button>
            </div>
          </div>
        )}

        {/* ================= TABLE ================= */}
        <div className="overflow-x-auto">
          <table className="min-full w-full text-sm text-left">
            <thead className="text-[12px] bg-[#DCDEDE] border-y">
              <tr>
                <th className="p-4">
                  <input 
                    type="checkbox" 
                    checked={selectAll}
                    onChange={(e) => setSelectAll(e.target.checked)}
                  />
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
              {paginatedData.map((item) => (
                <tr
                  key={item.id}
                  className={`border-b hover:bg-gray-50 transition cursor-pointer ${
                    selectedRows.includes(item.id) ? "bg-blue-50" : ""
                  }`}
                  onClick={() => handleRowClick(item)}
                >
                  <td className="p-4" onClick={(e) => e.stopPropagation()}>
                    <input 
                      type="checkbox" 
                      checked={selectedRows.includes(item.id)}
                      onChange={() => handleSelectRow(item.id)}
                    />
                  </td>

                  <td className="px-6 py-4">{item.property.slice(0,15)}...</td>
                  <td className="px-6 py-4">{item.tenantName.slice(0,15)}...</td>
                  <td className="px-6 py-4">{item.unit.slice(0,15)}...</td>
                  <td className="px-6 py-4">{item.coiName.slice(0,15)}...</td>

                  {/* Expiry Date */}
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      {new Date(item.expiryDate).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric'
                      })}
                      <Pencil 
                        size={14} 
                        className="cursor-pointer hover:text-blue-600"
                        onClick={(e) => handleEditExpiry(e, item.id)}
                      />
                    </div>
                  </td>

                  {/* Status - Clickable Dropdown with Colored Options */}
                  <td className="px-6 py-4 relative" onClick={(e) => e.stopPropagation()}>
                    {statusEditId === item.id ? (
                      <div ref={statusSelectRef} className="relative z-20 min-w-[140px]">
                        <Select
                          value={item.status}
                          onChange={(e) => handleStatusChange(e, item.id)}
                          options={statusOptions}
                          placeholder="Select status"
                          className="w-full text-sm border-2 border-blue-500 shadow-lg focus:ring-blue-300"
                          autoFocus
                        />
                      </div>
                    ) : (
                      <div className="relative min-w-[140px]">
                        <select
                          value={item.status}
                          onChange={(e) => handleStatusChange(e, item.id)}
                          className={`w-full px-3 py-2 pr-10 text-sm rounded-lg border appearance-none cursor-pointer ${getStatusSelectColor(item.status)}`}
                          style={{
                            backgroundColor: getStatusBgColor(item.status),
                            color: getStatusTextColor(item.status),
                            borderColor: getStatusBorderColor(item.status)
                          }}
                        >
                          {statusOptions.map((option) => (
                            <option 
                              key={option.value} 
                              value={option.value}
                              style={{
                                backgroundColor: getStatusBgColor(option.value),
                                color: getStatusTextColor(option.value)
                              }}
                            >
                              {option.label}
                            </option>
                          ))}
                        </select>
                        <ChevronDown 
                          size={16} 
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none"
                        />
                      </div>
                    )}
                  </td>

                  {/* Reminder Status - Now just displays text, no click action */}
                  <td className="px-6 py-4" onClick={(e) => e.stopPropagation()}>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      item.reminderStatus === "Sent" || item.reminderStatus?.includes("Sent") 
                        ? "bg-green-100 text-green-800" 
                        : item.reminderStatus === "Pending"
                        ? "bg-yellow-100 text-yellow-800"
                        : "bg-gray-100 text-gray-600"
                    }`}>
                      {getReminderStatusLabel(item)}
                    </span>
                  </td>

                  {/* Actions - Now contains the reminder action menu */}
                  <td className="px-6 py-4 relative" onClick={(e) => e.stopPropagation()}>
                    <div className="relative" ref={actionMenuOpenId === item.id ? actionMenuRef : null}>
                      <button 
                        className="p-1 hover:bg-gray-100 rounded-lg transition-colors"
                        onClick={(e) => handleActionClick(e, item)}
                      >
                        <EllipsisVertical size={18} className="text-gray-600" />
                      </button>
                      
                      {/* Action Dropdown Menu */}
                      {actionMenuOpenId === item.id && (
                        <div className="absolute right-0 mt-1 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-50">
                          <button
                            className="w-full px-4 py-2 text-left text-sm hover:bg-gray-50 flex items-center gap-2"
                            onClick={(e) => handleEditFromAction(e, item)}
                          >
                            <Edit size={16} className="text-gray-600" />
                            Edit COI
                          </button>
                    
                        </div>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* ================= PAGINATION ================= */}
        <div className="py-3 px-4 flex justify-center sm:justify-between">
          <Pagination
            page={pagination.page}
            totalPages={totalPages || 1}
            rowsPerPage={pagination.rowsPerPage}
            onPageChange={(page) => dispatch(setPage(page))}
            onRowsChange={(rows) => dispatch(setRowsPerPage(rows))}
          />
        </div>
      </div>

      {/* Modals */}
      <COIModal 
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
      />

      <COIDetailModal
        isOpen={isDetailModalOpen}
        onClose={() => {
          setIsDetailModalOpen(false);
          setSelectedCOI(null);
        }}
        coi={selectedCOI}
      />

      <BulkReminderModal
        isOpen={isBulkReminderOpen}
        onClose={() => setIsBulkReminderOpen(false)}
        selectedIds={selectedRows}
      />

      <ReminderActionModal
        isOpen={isReminderActionOpen}
        onClose={() => {
          setIsReminderActionOpen(false);
          setSelectedActionCOI(null);
        }}
        coi={selectedActionCOI}
      />
    </div>
  );
}