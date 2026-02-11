// store/coiSlice.js
import { createSlice, createSelector } from '@reduxjs/toolkit';
import toast from 'react-hot-toast';

const initialData = [
  {
    id: "1",
    property: "Maplewood Shopping Center",
    tenantName: "Johnson & Sons",
    tenantEmail: "johnson@example.com",
    unit: "101",
    coiName: "Tenant_CedarHeights_COI_2026",
    expiryDate: "2026-11-17",
    status: "Active",
    reminderStatus: "Not Sent",
    createdAt: "2025-01-15T10:00:00Z"
  },
  {
    id: "2",
    property: "Oak Tree Tower",
    tenantName: "Smith Enterprises",
    tenantEmail: "smith@example.com",
    unit: "Suite 300",
    coiName: "GlobalMart_Insurance_COI_2025",
    expiryDate: "2025-11-20",
    status: "Expired",
    reminderStatus: "Sent (30d)",
    createdAt: "2024-12-10T10:00:00Z"
  },
  {
    id: "3",
    property: "Meadowbrook Plaza",
    tenantName: "Global Solutions",
    tenantEmail: "global@example.com",
    unit: "B-12",
    coiName: "UrbanOutfitters_COI_2027",
    expiryDate: "2027-11-19",
    status: "Rejected",
    reminderStatus: "N/A",
    createdAt: "2025-01-20T10:00:00Z"
  },
  {
    id: "4",
    property: "Pine Hill Shopping Center",
    tenantName: "Patel Industries",
    tenantEmail: "patel@example.com",
    unit: "402",
    coiName: "TechInnovators_COI_2028",
    expiryDate: "2028-11-23",
    status: "Expiring Soon",
    reminderStatus: "Not Sent",
    createdAt: "2025-02-01T10:00:00Z"
  },
  {
    id: "5",
    property: "Prestige",
    tenantName: "John Doe",
    tenantEmail: "john@example.com",
    unit: "A-101",
    coiName: "General Liability",
    expiryDate: "2026-02-04",
    status: "Active",
    reminderStatus: "Sent",
    createdAt: "2025-01-10T10:00:00Z"
  },
  {
    id: "6",
    property: "Sky properties",
    tenantName: "Jane Smith",
    tenantEmail: "jane@example.com",
    unit: "B-202",
    coiName: "Fire Insurance",
    expiryDate: "2025-12-15",
    status: "Expired",
    reminderStatus: "Pending",
    createdAt: "2025-01-05T10:00:00Z"
  }
];

// Load from localStorage
const loadInitialState = () => {
  try {
    const savedData = localStorage.getItem("coiData");
    return {
      coiData: savedData ? JSON.parse(savedData) : initialData,
      selectedRows: [],
      filters: {
        property: "",
        status: "",
        expiryFilter: "",
        searchTerm: ""
      },
      pagination: {
        page: 1,
        rowsPerPage: 10
      },
      loading: false,
      error: null
    };
  } catch (error) {
    console.log(error)
    return {
      coiData: initialData,
      selectedRows: [],
      filters: {
        property: "",
        status: "",
        expiryFilter: "",
        searchTerm: ""
      },
      pagination: {
        page: 1,
        rowsPerPage: 10
      },
      loading: false,
      error: null
    };
  }
};

const coiSlice = createSlice({
  name: 'coi',
  initialState: loadInitialState(),
  reducers: {
    // COI CRUD operations
    addCOI: (state, action) => {
      const newCOI = {
        ...action.payload,
        id: Date.now().toString(),
        createdAt: new Date().toISOString(),
        reminderStatus: "Not Sent"
      };
      state.coiData.unshift(newCOI);
      localStorage.setItem("coiData", JSON.stringify(state.coiData));
      toast.success("COI added successfully");
    },
    
    updateCOI: (state, action) => {
      const { id, updatedData } = action.payload;
      const index = state.coiData.findIndex(item => item.id === id);
      if (index !== -1) {
        state.coiData[index] = { ...state.coiData[index], ...updatedData };
        localStorage.setItem("coiData", JSON.stringify(state.coiData));
        toast.success("COI updated successfully");
      }
    },
    
    deleteCOI: (state, action) => {
      state.coiData = state.coiData.filter(item => item.id !== action.payload);
      state.selectedRows = state.selectedRows.filter(id => id !== action.payload);
      localStorage.setItem("coiData", JSON.stringify(state.coiData));
      toast.success("COI deleted successfully");
    },
    
    bulkDeleteCOI: (state, action) => {
      state.coiData = state.coiData.filter(item => !action.payload.includes(item.id));
      state.selectedRows = [];
      localStorage.setItem("coiData", JSON.stringify(state.coiData));
      toast.success(`${action.payload.length} COI(s) deleted successfully`);
    },

    // Selection management
    setSelectedRows: (state, action) => {
      state.selectedRows = action.payload;
    },
    
    toggleSelectRow: (state, action) => {
      const id = action.payload;
      if (state.selectedRows.includes(id)) {
        state.selectedRows = state.selectedRows.filter(rowId => rowId !== id);
      } else {
        state.selectedRows.push(id);
      }
    },
    
    clearSelectedRows: (state) => {
      state.selectedRows = [];
    },

    // Filters
    setPropertyFilter: (state, action) => {
      state.filters.property = action.payload;
      state.pagination.page = 1;
    },
    
    setStatusFilter: (state, action) => {
      state.filters.status = action.payload;
      state.pagination.page = 1;
    },
    
    setExpiryFilter: (state, action) => {
      state.filters.expiryFilter = action.payload;
      state.pagination.page = 1;
    },
    
    setSearchTerm: (state, action) => {
      state.filters.searchTerm = action.payload;
      state.pagination.page = 1;
    },
    // Add to your coiSlice.js
sendReminder: (state, action) => {
  const { coiId, type, message } = action.payload;
  // This would typically be an API call
  // For now, we can update the reminder status in the state
  const coi = state.cois.find(c => c.id === coiId);
  if (coi) {
    coi.reminderStatus = `Sent (${new Date().toLocaleDateString()})`;
    coi.lastReminderSent = new Date().toISOString();
    coi.lastReminderType = type;
    coi.lastReminderMessage = message;
  }
},
    
    clearFilters: (state) => {
      state.filters = {
        property: "",
        status: "",
        expiryFilter: "",
        searchTerm: ""
      };
      state.pagination.page = 1;
    },

    // Pagination
    setPage: (state, action) => {
      state.pagination.page = action.payload;
    },
    
    setRowsPerPage: (state, action) => {
      state.pagination.rowsPerPage = action.payload;
      state.pagination.page = 1;
    },

    // Bulk reminder
    sendBulkReminders: (state, action) => {
      const { ids, reminderType } = action.payload;
      reminderType
      state.coiData = state.coiData.map(item => 
        ids.includes(item.id) 
          ? { ...item, reminderStatus: "Sent", lastReminderSent: new Date().toISOString() }
          : item
      );
      localStorage.setItem("coiData", JSON.stringify(state.coiData));
      toast.success(`Reminders sent to ${ids.length} recipient(s)`);
    },

    // Update reminder status
    updateReminderStatus: (state, action) => {
      const { id, status } = action.payload;
      const index = state.coiData.findIndex(item => item.id === id);
      if (index !== -1) {
        state.coiData[index].reminderStatus = status;
        localStorage.setItem("coiData", JSON.stringify(state.coiData));
      }
    }
  }
});

// Export actions
export const {
  addCOI,
  updateCOI,
  deleteCOI,
  bulkDeleteCOI,
  setSelectedRows,
  toggleSelectRow,
  clearSelectedRows,
  setPropertyFilter,
  setStatusFilter,
  setExpiryFilter,
  setSearchTerm,
  sendReminder,
  clearFilters,
  setPage,
  setRowsPerPage,
  sendBulkReminders,
  updateReminderStatus
} = coiSlice.actions;

// Selectors
export const selectAllCOIs = (state) => state.coi.coiData;
export const selectSelectedRows = (state) => state.coi.selectedRows;
export const selectFilters = (state) => state.coi.filters;
export const selectPagination = (state) => state.coi.pagination;

// Memoized selectors
export const selectFilteredCOIs = createSelector(
  [selectAllCOIs, selectFilters],
  (coiData, filters) => {
    return coiData.filter(item => {
      const matchesProperty = !filters.property || item.property === filters.property;
      const matchesStatus = !filters.status || item.status === filters.status;
      const matchesSearch = !filters.searchTerm || 
        item.tenantName.toLowerCase().includes(filters.searchTerm.toLowerCase()) ||
        item.property.toLowerCase().includes(filters.searchTerm.toLowerCase()) ||
        item.unit.toLowerCase().includes(filters.searchTerm.toLowerCase());
      
      let matchesExpiry = true;
      if (filters.expiryFilter === "expired") {
        matchesExpiry = new Date(item.expiryDate) < new Date();
      } else if (filters.expiryFilter === "expiring30") {
        const thirtyDaysFromNow = new Date();
        thirtyDaysFromNow.setDate(thirtyDaysFromNow.getDate() + 30);
        matchesExpiry = new Date(item.expiryDate) <= thirtyDaysFromNow && new Date(item.expiryDate) >= new Date();
      } else if (filters.expiryFilter === "expiring90") {
        const ninetyDaysFromNow = new Date();
        ninetyDaysFromNow.setDate(ninetyDaysFromNow.getDate() + 90);
        matchesExpiry = new Date(item.expiryDate) <= ninetyDaysFromNow && new Date(item.expiryDate) >= new Date();
      }

      return matchesProperty && matchesStatus && matchesSearch && matchesExpiry;
    });
  }
);

export const selectPaginatedCOIs = createSelector(
  [selectFilteredCOIs, selectPagination],
  (filteredData, pagination) => {
    const { page, rowsPerPage } = pagination;
    const startIndex = (page - 1) * rowsPerPage;
    return filteredData.slice(startIndex, startIndex + rowsPerPage);
  }
);

export const selectTotalPages = createSelector(
  [selectFilteredCOIs, selectPagination],
  (filteredData, pagination) => {
    return Math.ceil(filteredData.length / pagination.rowsPerPage) || 1;
  }
);

export const selectSummaryStats = createSelector(
  [selectAllCOIs],
  (coiData) => {
    const today = new Date();
    const thirtyDaysFromNow = new Date(today);
    thirtyDaysFromNow.setDate(today.getDate() + 30);

    return {
      total: coiData.length,
      accepted: coiData.filter((item) => item.status === "Active").length,
      rejected: coiData.filter((item) => item.status === "Rejected").length,
      expiringIn30Days: coiData.filter((item) => {
        if (!item.expiryDate) return false;
        const expiry = new Date(item.expiryDate);
        return expiry <= thirtyDaysFromNow && expiry > new Date();
      }).length
    };
  }
);

export const selectPropertyOptions = createSelector(
  [selectAllCOIs],
  (coiData) => {
    return [...new Set(coiData.map(item => item.property))].map(p => ({
      label: p,
      value: p
    }));
  }
);

export default coiSlice.reducer;