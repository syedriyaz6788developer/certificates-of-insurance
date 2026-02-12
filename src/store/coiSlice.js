import { createSlice, createSelector, createAsyncThunk } from '@reduxjs/toolkit';
import COIService from '../services/coiService';
import toast from 'react-hot-toast';

// Async Thunks
export const fetchCOIs = createAsyncThunk(
  'coi/fetchCOIs',
  async (filters = {}, { rejectWithValue }) => {
    try {
      const response = await COIService.getCOIs(filters);
      return response;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const fetchCOIById = createAsyncThunk(
  'coi/fetchCOIById',
  async (id, { rejectWithValue }) => {
    try {
      const response = await COIService.getCOIById(id);
      return response;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const addCOI = createAsyncThunk(
  'coi/addCOI',
  async (coiData, { rejectWithValue }) => {
    try {
      const response = await COIService.createCOI(coiData);
      toast.success('COI added successfully');
      return response;
    } catch (error) {
      toast.error('Failed to add COI');
      return rejectWithValue(error.message);
    }
  }
);

export const updateCOI = createAsyncThunk(
  'coi/updateCOI',
  async ({ id, updatedData }, { rejectWithValue }) => {
    try {
      const response = await COIService.updateCOI(id, updatedData);
      toast.success('COI updated successfully');
      return response;
    } catch (error) {
      toast.error('Failed to update COI');
      return rejectWithValue(error.message);
    }
  }
);

export const deleteCOI = createAsyncThunk(
  'coi/deleteCOI',
  async (id, { rejectWithValue }) => {
    try {
      await COIService.deleteCOI(id);
      toast.success('COI deleted successfully');
      return id;
    } catch (error) {
      toast.error('Failed to delete COI');
      return rejectWithValue(error.message);
    }
  }
);

export const bulkDeleteCOI = createAsyncThunk(
  'coi/bulkDeleteCOI',
  async (ids, { rejectWithValue }) => {
    try {
      await COIService.bulkDeleteCOI(ids);
      toast.success(`${ids.length} COI(s) deleted successfully`);
      return ids;
    } catch (error) {
      toast.error('Failed to delete COIs');
      return rejectWithValue(error.message);
    }
  }
);

export const fetchProperties = createAsyncThunk(
  'coi/fetchProperties',
  async (_, { rejectWithValue }) => {
    try {
      const response = await COIService.getProperties();
      return response;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const addProperty = createAsyncThunk(
  'coi/addProperty',
  async (property, { rejectWithValue }) => {
    try {
      const response = await COIService.addProperty(property);
      toast.success('Property added successfully');
      return response;
    } catch (error) {
      toast.error(error.message || 'Failed to add property');
      return rejectWithValue(error.message);
    }
  }
);

export const deleteProperty = createAsyncThunk(
  'coi/deleteProperty',
  async (propertyValue, { rejectWithValue }) => {
    try {
      await COIService.deleteProperty(propertyValue);
      toast.success('Property deleted successfully');
      return propertyValue;
    } catch (error) {
      toast.error(error.message || 'Failed to delete property');
      return rejectWithValue(error.message);
    }
  }
);

export const sendReminder = createAsyncThunk(
  'coi/sendReminder',
  async ({ coiId, type, message }, { rejectWithValue }) => {
    try {
      const response = await COIService.sendReminder(coiId, { type, message });
      toast.success('Reminder sent successfully');
      return response;
    } catch (error) {
      toast.error('Failed to send reminder');
      return rejectWithValue(error.message);
    }
  }
);

export const sendBulkReminders = createAsyncThunk(
  'coi/sendBulkReminders',
  async ({ ids, reminderType }, { rejectWithValue }) => {
    try {
      const response = await COIService.sendBulkReminders(ids, reminderType);
      console.log(response)
      toast.success(`Reminders sent to ${ids.length} recipient(s)`);
      return { ids, reminderType, sentAt: new Date().toISOString() };
    } catch (error) {
      toast.error('Failed to send reminders');
      return rejectWithValue(error.message);
    }
  }
);

export const fetchSummaryStats = createAsyncThunk(
  'coi/fetchSummaryStats',
  async (_, { rejectWithValue }) => {
    try {
      const response = await COIService.getSummaryStats();
      return response;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const reinitializeData = createAsyncThunk(
  'coi/reinitializeData',
  async (_, { rejectWithValue }) => {
    try {
      const response = await COIService.reinitializeData();
      toast.success('Data reinitialized successfully');
      return response;
    } catch (error) {
      toast.error('Failed to reinitialize data');
      return rejectWithValue(error.message);
    }
  }
);

export const resetToInitial = createAsyncThunk(
  'coi/resetToInitial',
  async (_, { rejectWithValue }) => {
    try {
      const response = await COIService.resetToInitial();
      toast.success('Data reset to initial state');
      return response;
    } catch (error) {
      toast.error('Failed to reset data');
      return rejectWithValue(error.message);
    }
  }
);

const initialState = {
  coiData: [],
  selectedCOI: null,
  properties: [],
  selectedRows: [],
  filters: {
    property: '',
    status: '',
    expiryFilter: '',
    searchTerm: ''
  },
  pagination: {
    page: 1,
    rowsPerPage: 10
  },
  summaryStats: {
    total: 0,
    active: 0,
    expired: 0,
    rejected: 0,
    expiringSoon: 0,
    notProcessed: 0,
    expiringIn30Days: 0
  },
  loading: false,
  propertiesLoading: false,
  error: null,
  lastFetched: null,
  initialized: false
};

const coiSlice = createSlice({
  name: 'coi',
  initialState,
  reducers: {
    // Row selection
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
    
    clearFilters: (state) => {
      state.filters = {
        property: '',
        status: '',
        expiryFilter: '',
        searchTerm: ''
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

    // Selected COI
    setSelectedCOI: (state, action) => {
      state.selectedCOI = action.payload;
    },
    
    clearSelectedCOI: (state) => {
      state.selectedCOI = null;
    },

    // Reminder status update (synchronous)
    updateReminderStatus: (state, action) => {
      const { id, status } = action.payload;
      const index = state.coiData.findIndex(item => item.id === id);
      if (index !== -1) {
        state.coiData[index].reminderStatus = status;
        if (status === 'Sent') {
          state.coiData[index].lastReminderSent = new Date().toISOString();
        }
        localStorage.setItem("coiData", JSON.stringify(state.coiData));
      }
    },
    
    // Set initialized state
    setInitialized: (state, action) => {
      state.initialized = action.payload;
    },
    
    // Clear error
    clearError: (state) => {
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      // Fetch COIs
      .addCase(fetchCOIs.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCOIs.fulfilled, (state, action) => {
        state.loading = false;
        state.coiData = action.payload;
        state.lastFetched = new Date().toISOString();
        state.initialized = true;
      })
      .addCase(fetchCOIs.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.initialized = true;
      })
      
      // Fetch COI by ID
      .addCase(fetchCOIById.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchCOIById.fulfilled, (state, action) => {
        state.loading = false;
        state.selectedCOI = action.payload;
      })
      .addCase(fetchCOIById.rejected, (state) => {
        state.loading = false;
      })
      
      // Add COI
      .addCase(addCOI.pending, (state) => {
        state.loading = true;
      })
      .addCase(addCOI.fulfilled, (state, action) => {
        state.loading = false;
        state.coiData.unshift(action.payload);
      })
      .addCase(addCOI.rejected, (state) => {
        state.loading = false;
      })
      
      // Update COI
      .addCase(updateCOI.pending, (state) => {
        state.loading = true;
      })
      .addCase(updateCOI.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.coiData.findIndex(item => item.id === action.payload.id);
        if (index !== -1) {
          state.coiData[index] = action.payload;
        }
        if (state.selectedCOI?.id === action.payload.id) {
          state.selectedCOI = action.payload;
        }
      })
      .addCase(updateCOI.rejected, (state) => {
        state.loading = false;
      })
      
      // Delete COI
      .addCase(deleteCOI.pending, (state) => {
        state.loading = true;
      })
      .addCase(deleteCOI.fulfilled, (state, action) => {
        state.loading = false;
        state.coiData = state.coiData.filter(item => item.id !== action.payload);
        state.selectedRows = state.selectedRows.filter(id => id !== action.payload);
        if (state.selectedCOI?.id === action.payload) {
          state.selectedCOI = null;
        }
      })
      .addCase(deleteCOI.rejected, (state) => {
        state.loading = false;
      })
      
      // Bulk Delete COIs
      .addCase(bulkDeleteCOI.pending, (state) => {
        state.loading = true;
      })
      .addCase(bulkDeleteCOI.fulfilled, (state, action) => {
        state.loading = false;
        state.coiData = state.coiData.filter(item => !action.payload.includes(item.id));
        state.selectedRows = [];
      })
      .addCase(bulkDeleteCOI.rejected, (state) => {
        state.loading = false;
      })
      
      // Fetch Properties
      .addCase(fetchProperties.pending, (state) => {
        state.propertiesLoading = true;
      })
      .addCase(fetchProperties.fulfilled, (state, action) => {
        state.propertiesLoading = false;
        state.properties = action.payload;
      })
      .addCase(fetchProperties.rejected, (state) => {
        state.propertiesLoading = false;
      })
      
      // Add Property
      .addCase(addProperty.fulfilled, (state, action) => {
        state.properties.push(action.payload);
      })
      
      // Delete Property
      .addCase(deleteProperty.fulfilled, (state, action) => {
        state.properties = state.properties.filter(p => 
          p.value !== action.payload && 
          p.name !== action.payload && 
          p.label !== action.payload
        );
      })
      
      // Send Reminder
      .addCase(sendReminder.fulfilled, (state, action) => {
        const index = state.coiData.findIndex(item => item.id === action.payload.id);
        if (index !== -1) {
          state.coiData[index] = action.payload;
        }
      })
      
      // Send Bulk Reminders
      .addCase(sendBulkReminders.fulfilled, (state, action) => {
        const { ids, reminderType, sentAt } = action.payload;
        state.coiData = state.coiData.map(item => 
          ids.includes(item.id) 
            ? { 
                ...item, 
                reminderStatus: 'Sent', 
                lastReminderSent: sentAt,
                lastReminderType: reminderType
              }
            : item
        );
      })
      
      // Fetch Summary Stats
      .addCase(fetchSummaryStats.fulfilled, (state, action) => {
        state.summaryStats = action.payload;
      })
      
      // Reinitialize Data
      .addCase(reinitializeData.fulfilled, (state) => {
        state.coiData = [];
        state.properties = [];
        state.selectedCOI = null;
        state.selectedRows = [];
        state.summaryStats = initialState.summaryStats;
        state.initialized = false;
      })
      
      // Reset to Initial
      .addCase(resetToInitial.fulfilled, (state) => {
        state.coiData = [];
        state.properties = [];
        state.selectedCOI = null;
        state.selectedRows = [];
        state.summaryStats = initialState.summaryStats;
        state.initialized = false;
      });
  }
});

// Export all actions
export const {
  setSelectedRows,
  toggleSelectRow,
  clearSelectedRows,
  setPropertyFilter,
  setStatusFilter,
  setExpiryFilter,
  setSearchTerm,
  clearFilters,
  setPage,
  setRowsPerPage,
  setSelectedCOI,
  clearSelectedCOI,
  updateReminderStatus,
  setInitialized,
  clearError
} = coiSlice.actions;

// Selectors
export const selectAllCOIs = (state) => state.coi.coiData || [];
export const selectSelectedCOI = (state) => state.coi.selectedCOI;
export const selectSelectedRows = (state) => state.coi.selectedRows || [];
export const selectFilters = (state) => state.coi.filters;
export const selectPagination = (state) => state.coi.pagination;
export const selectProperties = (state) => state.coi.properties || [];
export const selectLoading = (state) => state.coi.loading;
export const selectPropertiesLoading = (state) => state.coi.propertiesLoading;
export const selectError = (state) => state.coi.error;
export const selectSummaryStats = (state) => state.coi.summaryStats;
export const selectLastFetched = (state) => state.coi.lastFetched;
export const selectInitialized = (state) => state.coi.initialized;

// Filtered COIs selector
export const selectFilteredCOIs = createSelector(
  [selectAllCOIs, selectFilters],
  (coiData, filters) => {
    if (!coiData || coiData.length === 0) return [];
    
    return coiData.filter(item => {
      const matchesProperty = !filters.property || 
        item.property === filters.property ||
        item.propertyId === filters.property;
      
      const matchesStatus = !filters.status || item.status === filters.status;
      
      const matchesSearch = !filters.searchTerm || 
        (item.tenantName && item.tenantName.toLowerCase().includes(filters.searchTerm.toLowerCase())) ||
        (item.property && item.property.toLowerCase().includes(filters.searchTerm.toLowerCase())) ||
        (item.unit && item.unit.toLowerCase().includes(filters.searchTerm.toLowerCase())) ||
        (item.coiName && item.coiName.toLowerCase().includes(filters.searchTerm.toLowerCase())) ||
        (item.tenantEmail && item.tenantEmail.toLowerCase().includes(filters.searchTerm.toLowerCase()));
      
      let matchesExpiry = true;
      
      if (item.expiryDate && filters.expiryFilter) {
        const expiryDate = new Date(item.expiryDate);
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        
        if (filters.expiryFilter === 'expired') {
          matchesExpiry = expiryDate < today;
        } else if (filters.expiryFilter === 'expiring30') {
          const thirtyDaysFromNow = new Date(today);
          thirtyDaysFromNow.setDate(today.getDate() + 30);
          matchesExpiry = expiryDate <= thirtyDaysFromNow && expiryDate >= today;
        } else if (filters.expiryFilter === 'expiring90') {
          const ninetyDaysFromNow = new Date(today);
          ninetyDaysFromNow.setDate(today.getDate() + 90);
          matchesExpiry = expiryDate <= ninetyDaysFromNow && expiryDate >= today;
        }
      }

      return matchesProperty && matchesStatus && matchesSearch && matchesExpiry;
    });
  }
);

export const selectPaginatedCOIs = createSelector(
  [selectFilteredCOIs, selectPagination],
  (filteredData, pagination) => {
    if (!filteredData || filteredData.length === 0) return [];
    const { page, rowsPerPage } = pagination;
    const startIndex = (page - 1) * rowsPerPage;
    return filteredData.slice(startIndex, startIndex + rowsPerPage);
  }
);

export const selectTotalPages = createSelector(
  [selectFilteredCOIs, selectPagination],
  (filteredData, pagination) => {
    if (!filteredData || filteredData.length === 0) return 1;
    return Math.ceil(filteredData.length / pagination.rowsPerPage) || 1;
  }
);

export const selectPropertyOptions = createSelector(
  [selectProperties],
  (properties) => {
    if (!properties || properties.length === 0) return [];
    
    return properties.map(p => ({
      id: p.id,
      label: p.label || p.name || p.value,
      value: p.value || p.name || p.label,
      name: p.name || p.label || p.value,
      address: p.address || '',
      city: p.city || '',
      state: p.state || '',
      zipCode: p.zipCode || ''
    }));
  }
);

export const selectTotalCOICount = createSelector(
  [selectAllCOIs],
  (coiData) => coiData?.length || 0
);

export const selectActiveCOICount = createSelector(
  [selectAllCOIs],
  (coiData) => coiData?.filter(c => c.status === 'Active').length || 0
);

export default coiSlice.reducer;