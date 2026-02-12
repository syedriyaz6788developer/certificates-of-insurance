import React, { useState, useEffect, useRef, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import Select from "../globalReuseComponents/Select";
import { Search, Settings, Plus, Send, ChevronDown, MoreVertical, Pencil, Trash2, X, Filter } from "lucide-react";
import Pagination from "./Pagination";
import COIModal from "./COIModal";
import COIDetailModal from "./COIDetailModal";
import BulkReminderModal from "./BulkReminderModal";
import ReminderActionModal from "../dashboard/ReminderActionModal";
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';
import {
  fetchCOIs,
  fetchProperties,
  fetchSummaryStats,
  selectPaginatedCOIs,
  selectSelectedRows,
  selectFilters,
  selectPagination,
  selectTotalPages,
  selectPropertyOptions,
  selectLoading,
  setPropertyFilter,
  setStatusFilter,
  setExpiryFilter,
  setSearchTerm,
  setPage,
  setRowsPerPage,
  toggleSelectRow,
  setSelectedRows,
  updateCOI,
  deleteCOI,
  bulkDeleteCOI,
  sendReminder,
  clearFilters
} from "../../store/coiSlice";
import toast from "react-hot-toast";

const STATUS_CONFIG = {
  "Active": { bg: "#DBEAFE", text: "#1E40AF", border: "#BFDBFE" },
  "Expired": { bg: "#FEE2E2", text: "#991B1B", border: "#FECACA" },
  "Rejected": { bg: "#FEE2E2", text: "#991B1B", border: "#FECACA" },
  "Expiring Soon": { bg: "#FFEDD5", text: "#9A3412", border: "#FED7AA" },
  "Not Processed": { bg: "#EFF6FF", text: "#2563EB", border: "#BFDBFE" }
};

const STATUS_OPTIONS = [
  { label: "Active", value: "Active" },
  { label: "Expired", value: "Expired" },
  { label: "Rejected", value: "Rejected" },
  { label: "Expiring Soon", value: "Expiring Soon" },
  { label: "Not Processed", value: "Not Processed" }
];

const EXPIRY_FILTER_OPTIONS = [
  { label: "All", value: "all" },
  { label: "Expired", value: "expired" },
  { label: "Expiring in 30 days", value: "expiring30" },
  { label: "Expiring in 90 days", value: "expiring90" }
];

// Mobile Card View Component
const MobileCOICard = ({ item, selectedRows, handleSelectRow, handleRowClick, handleStatusChange, statusEditId, setStatusEditId, handleExpiryEdit, handleSendReminder, getReminderStatus, getReminderStatusClass, formatDate, truncateText, loading, actionMenuId, setActionMenuId, setSelectedCOI, handleDeleteCOI, selectedCOI }) => {
  const reminderStatus = getReminderStatus(item);
  const [showActions, setShowActions] = useState(false);
  
  return (
    <div className={`bg-white rounded-lg border border-gray-200 p-4 mb-3 shadow-sm ${selectedRows.includes(item.id) ? 'bg-blue-50/50 border-blue-200' : ''}`}>
      {/* Checkbox and Actions Row */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-3">
          <input 
            type="checkbox" 
            checked={selectedRows.includes(item.id)}
            onChange={() => handleSelectRow(item.id)}
            onClick={(e) => e.stopPropagation()}
            className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            disabled={loading}
          />
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getReminderStatusClass(reminderStatus)}`}>
            {reminderStatus}
          </span>
        </div>
        <div className="relative">
          <button 
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            onClick={(e) => {
              e.stopPropagation();
              setShowActions(!showActions);
            }}
            disabled={loading}
          >
            <MoreVertical size={18} className="text-gray-600" />
          </button>
          
          {showActions && (
            <>
              <div 
                className="fixed inset-0 z-[9998]" 
                onClick={() => setShowActions(false)}
              />
              <div className="absolute right-0 top-full mt-1 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-[9999]">
                <button
                  className="w-full px-4 py-3 text-left text-sm hover:bg-gray-50 flex items-center gap-2 text-gray-700"
                  onClick={(e) => {
                    e.stopPropagation();
                    setShowActions(false);
                    handleRowClick(item);
                  }}
                >
                  <Pencil size={16} className="text-gray-600" />
                  View Details
                </button>
                <button
                  className="w-full px-4 py-3 text-left text-sm hover:bg-gray-50 flex items-center gap-2 text-red-600"
                  onClick={(e) => {
                    e.stopPropagation();
                    setShowActions(false);
                    handleDeleteCOI(item.id);
                  }}
                >
                  <Trash2 size={16} />
                  Delete COI
                </button>
                {reminderStatus === "Not Sent" && item.expiryDate && (
                  <button
                    className="w-full px-4 py-3 text-left text-sm hover:bg-gray-50 flex items-center gap-2 text-gray-700"
                    onClick={(e) => {
                      e.stopPropagation();
                      setShowActions(false);
                      handleSendReminder(item);
                    }}
                  >
                    <Send size={16} />
                    Send Reminder
                  </button>
                )}
              </div>
            </>
          )}
        </div>
      </div>

      {/* Main Content */}
      <div className="space-y-3" onClick={() => handleRowClick(item)}>
        <div className="flex flex-wrap items-start justify-between gap-2">
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-gray-900 truncate">{item.tenantName || "N/A"}</p>
            <p className="text-xs text-gray-500 truncate">{item.property || "N/A"} {item.unit ? `- ${item.unit}` : ''}</p>
          </div>
          <div className="flex-shrink-0">
            <span className="text-xs text-gray-500">COI: {truncateText(item.coiName, 15)}</span>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <p className="text-xs text-gray-500 mb-1">Expiry Date</p>
            <div className="flex items-center gap-2">
              <span className="text-sm">{formatDate(item.expiryDate)}</span>
              <Pencil 
                size={14} 
                className="cursor-pointer hover:text-blue-600 flex-shrink-0 text-gray-400"
                onClick={(e) => handleExpiryEdit(e, item.id)}
              />
            </div>
          </div>
          
          <div>
            <p className="text-xs text-gray-500 mb-1">Status</p>
            {statusEditId === item.id ? (
              <div className="relative z-20">
                <Select
                  value={item.status}
                  onChange={(e) => handleStatusChange(e, item.id)}
                  options={STATUS_OPTIONS}
                  className="w-full text-sm border-2 border-blue-500"
                  autoFocus
                  disabled={loading}
                />
              </div>
            ) : (
              <div onClick={() => !loading && setStatusEditId(item.id)}>
                <StatusBadge status={item.status} />
              </div>
            )}
          </div>
        </div>

        {reminderStatus === "Not Sent" && item.expiryDate && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleSendReminder(item);
            }}
            className="w-full mt-2 px-3 py-2 bg-blue-50 text-blue-700 rounded-lg text-sm font-medium flex items-center justify-center gap-2 hover:bg-blue-100 transition"
            disabled={loading}
          >
            <Send size={16} />
            Send Reminder
          </button>
        )}
      </div>
    </div>
  );
};

const StatusBadge = ({ status }) => {
  const config = STATUS_CONFIG[status] || { bg: '#F3F4F6', text: '#374151', border: '#D1D5DB' };
  
  return (
    <span 
      className="inline-block px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap cursor-pointer hover:opacity-80 transition"
      style={{
        backgroundColor: config.bg,
        color: config.text,
        borderColor: config.border,
        borderWidth: '1px'
      }}
    >
      {status}
    </span>
  );
};

const StatusDropdown = ({ value, onChange, onClick }) => {
  return (
    <div className="relative w-[130px]">
      <select
        value={value}
        onChange={onChange}
        onClick={onClick}
        className="w-full px-3 py-1.5 pr-8 text-sm rounded-lg border appearance-none cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500"
        style={{
          backgroundColor: STATUS_CONFIG[value]?.bg || '#F3F4F6',
          color: STATUS_CONFIG[value]?.text || '#374151',
          borderColor: STATUS_CONFIG[value]?.border || '#D1D5DB'
        }}
      >
        {STATUS_OPTIONS.map(option => (
          <option 
            key={option.value} 
            value={option.value}
            style={{
              backgroundColor: STATUS_CONFIG[option.value]?.bg,
              color: STATUS_CONFIG[option.value]?.text
            }}
          >
            {option.label}
          </option>
        ))}
      </select>
      <ChevronDown size={16} className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none" />
    </div>
  );
};

// Skeleton Components
const TableRowSkeleton = () => (
  <tr className="hover:bg-gray-50/50">
    <td className="p-4 w-10">
      <Skeleton width={16} height={16} />
    </td>
    <td className="px-4 py-3 w-[150px]">
      <Skeleton height={20} />
    </td>
    <td className="px-4 py-3 w-[150px]">
      <Skeleton height={20} />
    </td>
    <td className="px-4 py-3 w-[100px]">
      <Skeleton height={20} />
    </td>
    <td className="px-4 py-3 w-[150px]">
      <Skeleton height={20} />
    </td>
    <td className="px-4 py-3 w-[130px]">
      <Skeleton height={20} />
    </td>
    <td className="px-4 py-3 w-[140px]">
      <Skeleton height={20} />
    </td>
    <td className="px-4 py-3 w-[120px]">
      <Skeleton height={20} />
    </td>
    <td className="px-4 py-3 w-10">
      <Skeleton height={20} width={20} />
    </td>
  </tr>
);

const MobileCardSkeleton = () => (
  <div className="bg-white rounded-lg border border-gray-200 p-4 mb-3">
    <div className="flex items-center justify-between mb-3">
      <Skeleton width={20} height={20} />
      <Skeleton width={80} height={24} />
    </div>
    <div className="space-y-3">
      <Skeleton height={20} />
      <Skeleton height={16} width="60%" />
      <div className="grid grid-cols-2 gap-3">
        <Skeleton height={32} />
        <Skeleton height={32} />
      </div>
    </div>
  </div>
);

const FilterSkeleton = () => (
  <div className="flex flex-col sm:flex-row flex-wrap gap-3 w-full lg:w-auto">
    <Skeleton height={38} width={140} />
    <Skeleton height={38} width={140} />
    <Skeleton height={38} width={140} />
  </div>
);

const ActionButtonsSkeleton = () => (
  <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full lg:w-auto lg:flex-shrink-0">
    <Skeleton height={38} width={280} />
    <div className="flex gap-3">
      <Skeleton height={38} width={38} circle />
      <Skeleton height={38} width={100} />
    </div>
  </div>
);

export default function Table() {
  const dispatch = useDispatch();
  
  // Redux selectors
  const paginatedData = useSelector(selectPaginatedCOIs);
  const selectedRows = useSelector(selectSelectedRows);
  const filters = useSelector(selectFilters);
  const pagination = useSelector(selectPagination);
  const totalPages = useSelector(selectTotalPages);
  const propertyOptions = useSelector(selectPropertyOptions);
  const loading = useSelector(selectLoading);

  // Local state
  const [selectAll, setSelectAll] = useState(false);
  const [modalState, setModalState] = useState({
    add: false,
    edit: false,
    detail: false,
    bulkReminder: false,
    reminderAction: false
  });
  const [selectedCOI, setSelectedCOI] = useState(null);
  const [actionMenuId, setActionMenuId] = useState(null);
  const [statusEditId, setStatusEditId] = useState(null);
  const [initialLoad, setInitialLoad] = useState(true);
  const [showMobileFilters, setShowMobileFilters] = useState(false);
  const [isMobileView, setIsMobileView] = useState(false);
  
  // Search state for better UX
  const [localSearchTerm, setLocalSearchTerm] = useState(filters.searchTerm || "");
  const debounceTimeoutRef = useRef(null);
  
  // Refs
  const statusSelectRef = useRef(null);
  const actionMenuRef = useRef(null);
  const tableContainerRef = useRef(null);
  const isFirstRender = useRef(true);

  // Check for mobile view
  useEffect(() => {
    const checkMobileView = () => {
      setIsMobileView(window.innerWidth < 768);
    };
    
    checkMobileView();
    window.addEventListener('resize', checkMobileView);
    return () => window.removeEventListener('resize', checkMobileView);
  }, []);

  // Initial data fetch
  useEffect(() => {
    const loadInitialData = async () => {
      try {
        await Promise.all([
          dispatch(fetchCOIs(filters)).unwrap(),
          dispatch(fetchProperties()).unwrap(),
          dispatch(fetchSummaryStats()).unwrap()
        ]);
      } catch (error) {
        console.error('Failed to load initial data:', error);
        toast.error('Failed to load data');
      } finally {
        setInitialLoad(false);
      }
    };

    loadInitialData();
  }, []);

  // Debounced search dispatch
  const debouncedSearch = useCallback((searchValue) => {
    if (debounceTimeoutRef.current) {
      clearTimeout(debounceTimeoutRef.current);
    }
    
    debounceTimeoutRef.current = setTimeout(() => {
      if (searchValue !== filters.searchTerm) {
        dispatch(setSearchTerm(searchValue));
      }
    }, 500);
  }, [dispatch, filters.searchTerm]);

  // Handle search input change
  const handleSearchChange = (e) => {
    const value = e.target.value;
    setLocalSearchTerm(value);
    debouncedSearch(value);
  };

  // Clear search
  const handleClearSearch = () => {
    setLocalSearchTerm("");
    if (debounceTimeoutRef.current) {
      clearTimeout(debounceTimeoutRef.current);
    }
    dispatch(setSearchTerm(""));
  };

  // Sync local search term with Redux when filters change externally
  useEffect(() => {
    if (!isFirstRender.current) {
      setLocalSearchTerm(filters.searchTerm || "");
    }
    isFirstRender.current = false;
  }, [filters.searchTerm]);

  // Cleanup debounce on unmount
  useEffect(() => {
    return () => {
      if (debounceTimeoutRef.current) {
        clearTimeout(debounceTimeoutRef.current);
      }
    };
  }, []);

  // Refetch when filters or pagination change
  useEffect(() => {
    if (!initialLoad) {
      const debounceTimer = setTimeout(() => {
        dispatch(fetchCOIs(filters));
      }, 300);

      return () => clearTimeout(debounceTimer);
    }
  }, [
    filters.property, 
    filters.status, 
    filters.expiryFilter, 
    filters.searchTerm,
    filters.rowsPerPage, 
    filters.page, 
    dispatch, 
    initialLoad
  ]);

  // Handle click outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (statusSelectRef.current && !statusSelectRef.current.contains(event.target)) {
        setStatusEditId(null);
      }
      if (actionMenuRef.current && !actionMenuRef.current.contains(event.target)) {
        setActionMenuId(null);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Update select all state
  useEffect(() => {
    if (paginatedData.length > 0) {
      const allVisibleSelected = paginatedData.every(item => selectedRows.includes(item.id));
      setSelectAll(allVisibleSelected && selectedRows.length > 0);
    } else {
      setSelectAll(false);
    }
  }, [selectedRows, paginatedData]);

  const handleModalOpen = (modalName, data = null) => {
    setModalState(prev => ({ ...prev, [modalName]: true }));
    if (data) setSelectedCOI(data);
  };

  const handleModalClose = async (modalName) => {
    setModalState(prev => ({ ...prev, [modalName]: false }));
    setSelectedCOI(null);
    setActionMenuId(null);
    setStatusEditId(null);
    
    if (['add', 'edit', 'detail'].includes(modalName)) {
      await dispatch(fetchCOIs(filters));
      await dispatch(fetchSummaryStats());
    }
  };

  const handleRowClick = (item) => {
    if (statusEditId === item.id || actionMenuId === item.id) return;
    handleModalOpen('detail', item);
  };

  const handleSelectRow = (id) => dispatch(toggleSelectRow(id));

  const handleSelectAll = (e) => {
    setSelectAll(e.target.checked);
    if (e.target.checked) {
      dispatch(setSelectedRows(paginatedData.map(item => item.id)));
    } else {
      dispatch(setSelectedRows([]));
    }
  };

  const handleStatusChange = async (e, id) => {
    try {
      await dispatch(updateCOI({ id, updatedData: { status: e.target.value } })).unwrap();
      setStatusEditId(null);
      toast.success('Status updated successfully');
    } catch (error) {
      console.error('Failed to update status:', error);
      toast.error('Failed to update status');
    }
  };

  const handleExpiryEdit = async (e, id) => {
    e.stopPropagation();
    const currentItem = paginatedData.find(item => item.id === id);
    const currentDate = currentItem?.expiryDate || "";
    const newDate = prompt("Enter new expiry date (YYYY-MM-DD):", currentDate);
    
    if (newDate && newDate !== currentDate) {
      const selectedDate = new Date(newDate);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      if (selectedDate < today) {
        toast.error("Expiry date cannot be in the past");
        return;
      }
      
      try {
        await dispatch(updateCOI({ id, updatedData: { expiryDate: newDate } })).unwrap();
        toast.success("Expiry date updated successfully");
      } catch (error) {
        console.log(error);
        toast.error("Failed to update expiry date");
      }
    }
  };

  const handleDeleteCOI = async (id) => {
    if (window.confirm("Are you sure you want to delete this COI?")) {
      try {
        await dispatch(deleteCOI(id)).unwrap();
        setActionMenuId(null);
        toast.success('COI deleted successfully');
      } catch (error) {
        console.error('Failed to delete COI:', error);
        toast.error('Failed to delete COI');
      }
    }
  };

  const handleBulkDelete = async () => {
    if (selectedRows.length === 0) return;
    
    if (window.confirm(`Are you sure you want to delete ${selectedRows.length} selected COI(s)?`)) {
      try {
        await dispatch(bulkDeleteCOI(selectedRows)).unwrap();
        toast.success(`${selectedRows.length} COI(s) deleted successfully`);
      } catch (error) {
        console.error('Failed to bulk delete:', error);
        toast.error('Failed to delete selected COIs');
      }
    }
  };

  const handleClearFilters = () => {
    setLocalSearchTerm("");
    if (debounceTimeoutRef.current) {
      clearTimeout(debounceTimeoutRef.current);
    }
    dispatch(clearFilters());
    setShowMobileFilters(false);
  };

  const handleSendReminder = async (item) => {
    try {
      await dispatch(sendReminder({
        coiId: item.id,
        type: 'expiry_reminder',
        message: `Your COI is expiring on ${formatDate(item.expiryDate)}`
      })).unwrap();
      toast.success('Reminder sent successfully');
    } catch (error) {
      console.log(error);
      toast.error('Failed to send reminder');
    }
  };

  // Helper functions
  const getTimeAgo = (dateString) => {
    if (!dateString) return null;
    
    const date = new Date(dateString);
    const now = new Date();
    const seconds = Math.floor((now - date) / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    if (seconds < 60) return 'just now';
    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    if (days === 1) return 'yesterday';
    if (days < 7) return `${days}d ago`;
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  const getReminderStatus = (item) => {
    if (item.lastReminderSent) {
      const timeAgo = getTimeAgo(item.lastReminderSent);
      return `Sent ${timeAgo}`;
    }
    
    if (item.reminderStatus === "Sent") {
      return "Sent";
    }
    
    if (!item.expiryDate) return "NA";
    
    const today = new Date();
    const expiry = new Date(item.expiryDate);
    if (isNaN(expiry)) return "NA";
    
    const diffDays = Math.ceil((expiry - today) / (1000 * 60 * 60 * 24));
    
    if (diffDays <= 0) return "Expired";
    if (diffDays <= 30) return `Due in ${diffDays}d`;
    return "Not Sent";
  };

  const getReminderStatusClass = (status) => {
    if (status.includes("Sent")) return "bg-green-100 text-green-800";
    if (status.includes("Due")) return "bg-yellow-100 text-yellow-800";
    if (status === "Not Sent") return "bg-gray-100 text-gray-600";
    if (status === "Expired") return "bg-red-100 text-red-800";
    if (status === "NA") return "bg-gray-100 text-gray-400";
    return "bg-gray-100 text-gray-600";
  };

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    try {
      return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric', 
        month: 'short', 
        day: 'numeric'
      });
    } catch {
      return dateString;
    }
  };

  const truncateText = (text, maxLength = 20) => {
    if (!text) return "";
    return text.length > maxLength ? `${text.substring(0, maxLength)}...` : text;
  };

  // Mobile Filters Component
  const MobileFilters = () => (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 md:hidden">
      <div className="absolute bottom-0 left-0 right-0 bg-white rounded-t-xl p-4 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold">Filters</h3>
          <button 
            onClick={() => setShowMobileFilters(false)}
            className="p-2 hover:bg-gray-100 rounded-lg"
          >
            <X size={20} />
          </button>
        </div>
        
        <div className="space-y-4">
        <div>
  <label className="font-inter-display font-normal text-[14px] leading-[20px] tracking-normal text-center text-[#2C3635] mb-1 block">
    Property
  </label>
  <Select
    placeholder="All Properties"
    value={filters.property}
    onChange={(e) => dispatch(setPropertyFilter(e.target.value))}
    options={[{ label: "All Properties", value: "" }, ...propertyOptions]}
    className="w-full font-inter-display font-normal text-[14px] leading-[20px] tracking-normal text-center text-[#2C3635]"
    disabled={loading}
  />
</div>
          
          <div>
            <label className="text-sm font-medium text-gray-700 mb-1 block">Status</label>
            <Select
              placeholder="All Status"
              value={filters.status}
              onChange={(e) => dispatch(setStatusFilter(e.target.value))}
              options={[{ label: "All Status", value: "" }, ...STATUS_OPTIONS]}
              className="w-full font-inter-display font-normal text-[14px] leading-[20px] tracking-normal text-center text-[#4F5857]"
              disabled={loading}
            />
          </div>
          
          <div>
            <label className="text-sm font-medium text-gray-700 mb-1 block">Expiry</label>
            <Select
              placeholder="Filter by Expiry"
              value={filters.expiryFilter}
              onChange={(e) => dispatch(setExpiryFilter(e.target.value))}
              options={EXPIRY_FILTER_OPTIONS}
              className="font-inter-display font-normal text-sm leading-5 tracking-normal text-center text-[#4F5857]"
              disabled={loading}
            />
          </div>
          
          <button
            onClick={handleClearFilters}
            className="w-full px-4 py-2 bg-gray-100 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-200 transition"
          >
            Clear All Filters
          </button>
        </div>
      </div>
    </div>
  );

  // Loading state with skeleton
  if (initialLoad && loading) {
    return (
      <div className="w-full max-w-full overflow-hidden">
        <div className="relative shadow rounded-md border border-gray-200 bg-white">
          {/* Header with Filter Skeletons - Fixed Layout */}
          <div className="p-3 sm:p-4 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 border-b">
            <div className="hidden md:flex flex-row flex-wrap items-center gap-3">
              <Skeleton height={38} width={140} />
              <Skeleton height={38} width={140} />
              <Skeleton height={38} width={140} />
            </div>
            <div className="flex md:hidden w-full">
              <Skeleton height={38} width="100%" />
            </div>
            <div className="flex flex-row items-center gap-3 lg:flex-shrink-0">
              <Skeleton height={38} width={280} />
              <div className="flex gap-3">
                <Skeleton height={38} width={38} circle />
                <Skeleton height={38} width={100} />
              </div>
            </div>
          </div>

          {/* Table/Card Container */}
          <div className="w-full p-4" style={{ minHeight: '400px' }}>
            {isMobileView ? (
              <div className="space-y-3">
                {[...Array(5)].map((_, index) => (
                  <MobileCardSkeleton key={index} />
                ))}
              </div>
            ) : (
              <div className="min-w-[1000px] lg:min-w-full overflow-x-auto">
                <table className="w-full text-sm text-left border-collapse table-fixed">
                  <thead className="text-xs bg-gray-50 border-y">
                    <tr>
                      <th className="w-10 p-4">
                        <Skeleton width={16} height={16} />
                      </th>
                      <th className="px-4 py-3 w-[150px]">
                        <Skeleton width={80} height={16} />
                      </th>
                      <th className="px-4 py-3 w-[150px]">
                        <Skeleton width={90} height={16} />
                      </th>
                      <th className="px-4 py-3 w-[100px]">
                        <Skeleton width={60} height={16} />
                      </th>
                      <th className="px-4 py-3 w-[150px]">
                        <Skeleton width={80} height={16} />
                      </th>
                      <th className="px-4 py-3 w-[130px]">
                        <Skeleton width={90} height={16} />
                      </th>
                      <th className="px-4 py-3 w-[140px]">
                        <Skeleton width={70} height={16} />
                      </th>
                      <th className="px-4 py-3 w-[120px]">
                        <Skeleton width={80} height={16} />
                      </th>
                      <th className="w-10 px-4 py-3">
                        <Skeleton width={16} height={16} />
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {[...Array(5)].map((_, index) => (
                      <TableRowSkeleton key={index} />
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {/* Pagination Skeleton */}
          <div className="px-4 py-3 border-t bg-gray-50/50">
            <div className="flex items-center justify-between">
              <Skeleton width={200} height={36} />
              <div className="flex gap-2">
                <Skeleton width={80} height={36} />
                <Skeleton width={120} height={36} />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-full overflow-hidden">
      <div className="relative shadow rounded-md border border-gray-200 bg-white">
        
   <div className="p-3 flex flex-col lg:flex-row lg:items-center gap-4 border-b">
  {/* Desktop Filters - Left side */}
  <div className="hidden md:flex flex-row items-center gap-3">
    <Select
      placeholder="All Properties"
      value={filters.property}
      onChange={(e) => dispatch(setPropertyFilter(e.target.value))}
      options={[{ label: "All Properties", value: "" }, ...propertyOptions]}
      className="w-[140px] lg:w-[150px] font-inter-display font-normal text-[14px] leading-[20px] tracking-normal text-center text-[#2C3635]"
      disabled={loading}
    />
    <Select
      placeholder="Status"
      value={filters.status}
      onChange={(e) => dispatch(setStatusFilter(e.target.value))}
      options={[{ label: "All Status", value: "" }, ...STATUS_OPTIONS]}
      className="w-[120px] lg:w-[130px] font-inter-display font-normal text-[14px] leading-[20px] tracking-normal text-center text-[#4F5857]"
      disabled={loading}
    />
    <Select
      placeholder="Filter by Expiry"
      value={filters.expiryFilter}
      onChange={(e) => dispatch(setExpiryFilter(e.target.value))}
      options={EXPIRY_FILTER_OPTIONS}
      className="w-[140px] lg:w-[160px] font-inter-display font-normal text-[14px] leading-[20px] tracking-normal text-center text-[#4F5857]"
      disabled={loading}
    />
  </div>

  {/* Mobile Filter Button */}
  <div className="flex md:hidden w-full">
    <button
      onClick={() => setShowMobileFilters(true)}
      className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg text-sm font-medium"
    >
      <Filter size={18} />
      Filters
      {(filters.property || filters.status || filters.expiryFilter !== 'all') && (
        <span className="w-2 h-2 bg-blue-600 rounded-full"></span>
      )}
    </button>
  </div>

  {/* Center spacer */}
  <div className="flex-1"></div>

  {/* Right side actions */}
  <div className="flex flex-row items-center gap-3">
    <div className="relative w-[200px] lg:w-[280px]">
      <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
      <input
        type="text"
        placeholder={isMobileView ? "Search..." : "Search by tenant, property or unit..."}
        value={localSearchTerm}
        onChange={handleSearchChange}
        className="w-full pl-10 pr-8 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 font-inter-display font-normal text-[12px] leading-[16px] tracking-normal text-[#2C3635] placeholder:text-[#2C3635] disabled:opacity-50"
        disabled={loading}
      />
      {localSearchTerm && (
        <button
          onClick={handleClearSearch}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 text-lg leading-none"
        >
          ×
        </button>
      )}
      {loading && filters.searchTerm && (
        <div className="absolute right-3 top-1/2 -translate-y-1/2">
          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
        </div>
      )}
    </div>

    <div className="flex gap-3 flex-shrink-0">
      <button className="p-2 border rounded-lg hover:bg-gray-50 transition">
        <Settings size={18} className="text-gray-600" />
      </button>
    <button
  className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-[#F9FAFA] rounded-lg hover:bg-blue-700 transition font-inter-display font-normal text-[14px] leading-[20px] tracking-normal text-center whitespace-nowrap disabled:opacity-50 disabled:cursor-not-allowed"
  onClick={() => handleModalOpen('add')}
  disabled={loading}
>
  <Plus size={18} />
  {isMobileView ? 'ADD' : 'ADD COI'}
</button>
    </div>
  </div>
</div>

        {/* Bulk Actions - Mobile Optimized */}
        {selectedRows.length > 0 && (
          <div className="bg-blue-50 px-3 sm:px-4 py-2 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 border-b">
            <span className="text-sm text-blue-700 font-medium">
              {selectedRows.length} {selectedRows.length === 1 ? 'item' : 'items'} selected
            </span>
            <div className="flex gap-2 flex-shrink-0">
              <button
                onClick={() => handleModalOpen('bulkReminder')}
                className="flex-1 sm:flex-none flex items-center justify-center gap-1 px-3 py-1.5 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 transition disabled:opacity-50"
                disabled={loading}
              >
                <Send size={16} />
                <span className="sm:inline">Send Reminder</span>
              </button>
              <button
                onClick={handleBulkDelete}
                className="flex-1 sm:flex-none flex items-center justify-center gap-1 px-3 py-1.5 bg-red-600 text-white text-sm rounded-lg hover:bg-red-700 transition disabled:opacity-50"
                disabled={loading}
              >
                <Trash2 size={16} />
                <span className="sm:inline">Delete</span>
              </button>
            </div>
          </div>
        )}

        {/* Table/Card Container */}
        <div 
          ref={tableContainerRef}
          className="w-full"
          style={{ minHeight: '400px' }}
        >
          {/* Mobile Card View */}
          {isMobileView ? (
            <div className="p-3">
              {loading && paginatedData.length === 0 ? (
                [...Array(5)].map((_, index) => (
                  <MobileCardSkeleton key={index} />
                ))
              ) : paginatedData.length > 0 ? (
                paginatedData.map((item) => (
                  <MobileCOICard
                    key={item.id}
                    item={item}
                    selectedRows={selectedRows}
                    handleSelectRow={handleSelectRow}
                    handleRowClick={handleRowClick}
                    handleStatusChange={handleStatusChange}
                    statusEditId={statusEditId}
                    setStatusEditId={setStatusEditId}
                    handleExpiryEdit={handleExpiryEdit}
                    handleSendReminder={handleSendReminder}
                    getReminderStatus={getReminderStatus}
                    getReminderStatusClass={getReminderStatusClass}
                    formatDate={formatDate}
                    truncateText={truncateText}
                    loading={loading}
                    actionMenuId={actionMenuId}
                    setActionMenuId={setActionMenuId}
                    handleDeleteCOI={handleDeleteCOI}
                    selectedCOI={selectedCOI}
                  />
                ))
              ) : (
                <div className="px-4 py-8 text-center text-gray-500">
                  <div className="flex flex-col items-center gap-2">
                    <span>No COI records found</span>
                    {(filters.property || filters.status || filters.expiryFilter !== 'all' || filters.searchTerm) ? (
                      <button
                        onClick={handleClearFilters}
                        className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                      >
                        Clear all filters
                      </button>
                    ) : (
                      <button
                        onClick={() => handleModalOpen('add')}
                        className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition text-sm font-medium"
                      >
                        <Plus size={18} />
                        Add Your First COI
                      </button>
                    )}
                  </div>
                </div>
              )}
            </div>
          ) : (
            /* Desktop Table View */
            <div className="min-w-[1000px] lg:min-w-full overflow-x-auto">
              <table className="w-full text-sm text-left border-collapse table-fixed">
                <thead className="text-xs bg-gray-50 border-y">
                  <tr>
                    <th className="w-10 p-4">
                      <input 
                        type="checkbox" 
                        checked={selectAll}
                        onChange={handleSelectAll}
                        disabled={loading || paginatedData.length === 0}
                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500 disabled:opacity-50"
                      />
                    </th>
                    <th className="px-4 text-center py-3 font-inter-display font-medium text-[12px] leading-[24px] tracking-normal text-[#666E6D] w-[120px]">Property</th>
                    <th className="px-4 text-center py-3 font-inter-display font-medium text-[12px] leading-[24px] tracking-normal text-[#666E6D] w-[120px]">Tenant Name</th>
                    <th className="px-4 text-center py-3 font-inter-display font-medium text-[12px] leading-[24px] tracking-normal text-[#666E6D] w-[120px]">Unit</th>
                    <th className="px-4 text-center py-3 font-inter-display font-medium text-[12px] leading-[24px] tracking-normal text-[#666E6D] w-[120px]">COI Name</th>
                    <th className="px-4 text-center py-3 font-inter-display font-medium text-[12px] leading-[24px] tracking-normal text-[#666E6D] w-[120px]">Expiry Date</th>
                    <th className="px-4 text-center py-3 font-inter-display font-medium text-[12px] leading-[24px] tracking-normal text-[#666E6D] w-[200px]">Status</th>
                    <th className="px-4 text-center py-3 font-inter-display font-medium text-[12px] leading-[24px] tracking-normal text-[#666E6D] w-[100px]">Reminder</th>
                    <th className=" py-3 text-center  font-inter-display font-medium text-[12px] leading-[24px] tracking-normal text-[#666E6D] ">Action</th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-gray-200">
                  {loading && paginatedData.length === 0 ? (
                    [...Array(5)].map((_, index) => (
                      <TableRowSkeleton key={index} />
                    ))
                  ) : paginatedData.length > 0 ? (
                    paginatedData.map((item, index) => {
                      const reminderStatus = getReminderStatus(item);
                      const isLastRow = index === paginatedData.length - 1;
                      
                      return (
                        <tr
                          key={item.id}
                          className={`hover:bg-gray-50 transition cursor-pointer ${
                            selectedRows.includes(item.id) ? "bg-blue-50/50" : ""
                          } ${loading ? 'opacity-50 pointer-events-none' : ''}`}
                          onClick={() => handleRowClick(item)}
                        >
                          <td className="p-4" onClick={(e) => e.stopPropagation()}>
                            <input 
                              type="checkbox" 
                              checked={selectedRows.includes(item.id)}
                              onChange={() => handleSelectRow(item.id)}
                              className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                              disabled={loading}
                            />
                          </td>

                          <td className="px-4 py-3 truncate font-inter-display font-normal text-[14px] leading-[20px] tracking-normal text-[#4F5857]" title={item.property}>
                            {truncateText(item.property, 20)}
                          </td>
                          
                          <td className="px-4 py-3 truncate font-inter-display font-normal text-[14px] leading-[20px] tracking-normal text-[#4F5857]" title={item.tenantName}>
                            {truncateText(item.tenantName, 20)}
                          </td>
                          
                          <td className="px-4 py-3 truncate font-inter-display font-normal text-[14px] leading-[20px] tracking-normal text-[#4F5857]" title={item.unit}>
                            {item.unit || "—"}
                          </td>
                          
                          <td className="px-4 py-3 truncate font-inter-display font-normal text-[14px] leading-[20px] tracking-normal text-[#4F5857]" title={item.coiName}>
                            {truncateText(item.coiName, 20)}
                          </td>

                          <td className="px-4 py-3 whitespace-nowrap">
                            <div className="flex items-center gap-2">
                              <span className="text-gray-700">{formatDate(item.expiryDate)}</span>
                              <Pencil 
                                size={14} 
                                className="cursor-pointer hover:text-blue-600 flex-shrink-0 text-gray-400"
                                onClick={(e) => handleExpiryEdit(e, item.id)}
                              />
                            </div>
                          </td>

                          <td className="px-4 py-3" onClick={(e) => e.stopPropagation()}>
                            {statusEditId === item.id ? (
                              <div ref={statusSelectRef} className="relative z-20 w-[130px]">
                                <Select
                                  value={item.status}
                                  onChange={(e) => handleStatusChange(e, item.id)}
                                  options={STATUS_OPTIONS}
                                  className="w-full text-sm border-2 border-blue-500"
                                  autoFocus
                                  disabled={loading}
                                />
                              </div>
                            ) : (
                              <div onClick={() => !loading && setStatusEditId(item.id)}>
                                <StatusDropdown
                                  value={item.status}
                                  onChange={(e) => handleStatusChange(e, item.id)}
                                  onClick={(e) => e.stopPropagation()}
                                />
                              </div>
                            )}
                          </td>

                          <td className="px-4 py-3" onClick={(e) => e.stopPropagation()}>
                            <div className="flex items-center gap-2">
                              <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium whitespace-nowrap ${getReminderStatusClass(reminderStatus)}`}>
                                {reminderStatus}
                              </span>
                              {reminderStatus === "Not Sent" && item.expiryDate && (
                                <button
                                  onClick={() => handleSendReminder(item)}
                                  className="p-1 hover:bg-gray-100 rounded transition flex-shrink-0"
                                  title="Send reminder"
                                  disabled={loading}
                                >
                                  <Send size={14} className="text-gray-500" />
                                </button>
                              )}
                            </div>
                          </td>

                          <td className="px-4 py-3" onClick={(e) => e.stopPropagation()}>
                            <div className="relative flex justify-center">
                              <button 
                                className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setActionMenuId(actionMenuId === item.id ? null : item.id);
                                  setSelectedCOI(item);
                                }}
                                disabled={loading}
                              >
                                <MoreVertical size={16} className="text-gray-600" />
                              </button>
                              
                              {actionMenuId === item.id && (
                                <>
                                  <div 
                                    className="fixed inset-0 z-[9998]" 
                                    onClick={() => setActionMenuId(null)}
                                  />
                                  <div 
                                    ref={actionMenuRef}
                                    className={`absolute ${isLastRow ? 'bottom-full mb-1' : 'top-full mt-1'} right-0 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-[9999]`}
                                  >
                                    <button
                                      className="w-full px-4 py-2 text-left text-sm hover:bg-gray-50 flex items-center gap-2 text-gray-700"
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        setActionMenuId(null);
                                        handleModalOpen('edit', item);
                                      }}
                                    >
                                      <Pencil size={16} className="text-gray-600" />
                                      Edit COI
                                    </button>
                                    <button
                                      className="w-full px-4 py-2 text-left text-sm hover:bg-gray-50 flex items-center gap-2 text-red-600"
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        handleDeleteCOI(item.id);
                                      }}
                                    >
                                      <Trash2 size={16} />
                                      Delete COI
                                    </button>
                                    <button
                                      className="w-full px-4 py-2 text-left text-sm hover:bg-gray-50 flex items-center gap-2 text-gray-700"
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        setActionMenuId(null);
                                        handleSendReminder(item);
                                      }}
                                      disabled={reminderStatus === "Sent" || reminderStatus.includes("Sent")}
                                    >
                                      <Send size={16} />
                                      Send Reminder
                                    </button>
                                  </div>
                                </>
                              )}
                            </div>
                          </td>
                        </tr>
                      );
                    })
                  ) : (
                    <tr>
                      <td colSpan={9} className="px-4 py-8 text-center text-gray-500">
                        <div className="flex flex-col items-center gap-2">
                          <span>No COI records found</span>
                          {(filters.property || filters.status || filters.expiryFilter !== 'all' || filters.searchTerm) ? (
                            <button
                              onClick={handleClearFilters}
                              className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                            >
                              Clear all filters
                            </button>
                          ) : (
                            <button
                              onClick={() => handleModalOpen('add')}
                              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition text-sm font-medium"
                            >
                              <Plus size={18} />
                              Add Your First COI
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Pagination */}
        {!loading && paginatedData.length > 0 && (
          <div className="px-3 sm:px-4 py-3 border-t bg-gray-50/50">
            <Pagination
              page={pagination.page}
              totalPages={totalPages || 1}
              rowsPerPage={pagination.rowsPerPage}
              onPageChange={(page) => dispatch(setPage(page))}
              onRowsChange={(rows) => dispatch(setRowsPerPage(rows))}
              disabled={loading}
            />
          </div>
        )}
      </div>

      {/* Mobile Filters Modal */}
      {showMobileFilters && <MobileFilters />}

      {/* Modals */}
      <COIModal 
        isOpen={modalState.add}
        onClose={() => handleModalClose('add')}
        mode="add"
      />

      <COIModal 
        isOpen={modalState.edit}
        onClose={() => handleModalClose('edit')}
        coi={selectedCOI}
        mode="edit"
      />

      <COIDetailModal
        isOpen={modalState.detail}
        onClose={() => handleModalClose('detail')}
        coi={selectedCOI}
        onEdit={() => {
          handleModalClose('detail');
          handleModalOpen('edit', selectedCOI);
        }}
      />

      <BulkReminderModal
        isOpen={modalState.bulkReminder}
        onClose={() => handleModalClose('bulkReminder')}
        selectedIds={selectedRows}
      />

      <ReminderActionModal
        isOpen={modalState.reminderAction}
        onClose={() => handleModalClose('reminderAction')}
        coi={selectedCOI}
      />
    </div>
  );
}