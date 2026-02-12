import rawData from '../data/coiData.json';

// Simulate API delay
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

class COIService {
  constructor() {
    this.rawData = rawData;
    this.initializeStorage();
  }

  // Initialize localStorage with JSON data if empty
  initializeStorage() {
    try {
      // Check if data already exists in localStorage
      const existingCois = localStorage.getItem('coiData');
      const existingProperties = localStorage.getItem('coiProperties');
      
      if (!existingCois || existingCois === '[]' || existingCois === 'null' || existingCois === 'undefined') {
        console.log('Initializing COI data from JSON...');
        localStorage.setItem('coiData', JSON.stringify(this.rawData.cois));
      }
      
      if (!existingProperties || existingProperties === '[]' || existingProperties === 'null' || existingProperties === 'undefined') {
        console.log('Initializing Properties data from JSON...');
        // Transform properties to include both name and label
        const transformedProperties = this.rawData.properties.map(prop => ({
          id: prop.id,
          name: prop.name,
          value: prop.value || prop.name,
          label: prop.label || prop.name,
          address: prop.address || '',
          city: prop.city || '',
          state: prop.state || '',
          zipCode: prop.zipCode || '',
          createdAt: prop.createdAt || new Date().toISOString()
        }));
        localStorage.setItem('coiProperties', JSON.stringify(transformedProperties));
      }
    } catch (error) {
      console.error('Error initializing storage:', error);
    }
  }

  // Get all properties from JSON/localStorage
  async getProperties() {
    await delay(300);
    try {
      const properties = JSON.parse(localStorage.getItem('coiProperties') || '[]');
      
      // If properties is empty, initialize from raw data
      if (!properties || properties.length === 0) {
        const transformedProperties = this.rawData.properties.map(prop => ({
          id: prop.id,
          name: prop.name,
          value: prop.value || prop.name,
          label: prop.label || prop.name,
          address: prop.address || '',
          city: prop.city || '',
          state: prop.state || '',
          zipCode: prop.zipCode || '',
          createdAt: prop.createdAt || new Date().toISOString()
        }));
        localStorage.setItem('coiProperties', JSON.stringify(transformedProperties));
        return transformedProperties;
      }
      
      // Ensure all properties have required fields
      return properties.map(prop => ({
        id: prop.id,
        name: prop.name || prop.label || prop.value,
        label: prop.label || prop.name || prop.value,
        value: prop.value || prop.name || prop.label,
        address: prop.address || '',
        city: prop.city || '',
        state: prop.state || '',
        zipCode: prop.zipCode || '',
        createdAt: prop.createdAt || new Date().toISOString()
      }));
    } catch (error) {
      console.error('Error getting properties:', error);
      return [];
    }
  }

  // Get property by ID
  async getPropertyById(id) {
    await delay(200);
    try {
      const properties = await this.getProperties();
      return properties.find(prop => prop.id === id) || null;
    } catch (error) {
      console.error('Error getting property by ID:', error);
      return null;
    }
  }

  // Get property by name/value
  async getPropertyByName(name) {
    await delay(200);
    try {
      const properties = await this.getProperties();
      return properties.find(prop => 
        prop.value === name || 
        prop.name === name || 
        prop.label === name
      ) || null;
    } catch (error) {
      console.error('Error getting property by name:', error);
      return null;
    }
  }

  // Add new property
  async addProperty(propertyData) {
    await delay(400);
    try {
      const properties = await this.getProperties();
      
      // Check if property already exists
      const exists = properties.some(p => 
        p.value === propertyData.value || 
        p.name === propertyData.name ||
        p.label === propertyData.label
      );
      
      if (exists) {
        throw new Error('Property already exists');
      }
      
      const newProperty = {
        id: `prop_${Date.now()}`,
        name: propertyData.name || propertyData.label,
        label: propertyData.label || propertyData.name,
        value: propertyData.value || propertyData.label || propertyData.name,
        address: propertyData.address || '',
        city: propertyData.city || '',
        state: propertyData.state || '',
        zipCode: propertyData.zipCode || '',
        createdAt: new Date().toISOString()
      };
      
      properties.push(newProperty);
      localStorage.setItem('coiProperties', JSON.stringify(properties));
      
      return newProperty;
    } catch (error) {
      console.error('Error adding property:', error);
      throw error;
    }
  }

  // Delete property
  async deleteProperty(propertyValue) {
    await delay(300);
    try {
      const properties = await this.getProperties();
      const cois = JSON.parse(localStorage.getItem('coiData') || '[]');
      
      // Check if property is in use
      const isInUse = cois.some(coi => 
        coi.property === propertyValue || 
        coi.propertyId === propertyValue
      );
      
      if (isInUse) {
        throw new Error('Cannot delete property that is in use');
      }
      
      const filtered = properties.filter(p => 
        p.value !== propertyValue && 
        p.name !== propertyValue && 
        p.label !== propertyValue
      );
      
      localStorage.setItem('coiProperties', JSON.stringify(filtered));
      
      return { success: true, propertyValue };
    } catch (error) {
      console.error('Error deleting property:', error);
      throw error;
    }
  }

  // Get all COIs
  async getCOIs(filters = {}) {
    await delay(500);
    try {
      let cois = JSON.parse(localStorage.getItem('coiData') || '[]');
      
      // If cois is empty, initialize from raw data
      if (!cois || cois.length === 0) {
        cois = this.rawData.cois;
        localStorage.setItem('coiData', JSON.stringify(cois));
      }
      
      // Get properties for enrichment
      const properties = await this.getProperties();
      
      // Enrich COIs with property details
      const enrichedCois = cois.map(coi => {
        const property = properties.find(p => 
          p.value === coi.property || 
          p.id === coi.propertyId || 
          p.name === coi.property ||
          p.label === coi.property
        );
        return {
          ...coi,
          propertyDetails: property || null,
          property: coi.property || property?.value || property?.name || property?.label || '',
          propertyId: coi.propertyId || property?.id || ''
        };
      });
      
      return this.applyFilters(enrichedCois, filters);
    } catch (error) {
      console.error('Error getting COIs:', error);
      return [];
    }
  }

  // Get COI by ID
  async getCOIById(id) {
    await delay(300);
    try {
      const cois = await this.getCOIs();
      return cois.find(coi => coi.id === id) || null;
    } catch (error) {
      console.error('Error getting COI by ID:', error);
      return null;
    }
  }

  // Create new COI
  async createCOI(coiData) {
    await delay(500);
    try {
      const cois = JSON.parse(localStorage.getItem('coiData') || '[]');
      
      // Get property details
      const property = await this.getPropertyByName(coiData.property);
      
      const newCOI = {
        id: `coi_${Date.now()}`,
        property: coiData.property,
        propertyId: property?.id || coiData.propertyId || `prop_${Date.now()}`,
        tenantName: coiData.tenantName,
        tenantEmail: coiData.tenantEmail,
        unit: coiData.unit,
        coiName: coiData.coiName,
        expiryDate: coiData.expiryDate,
        status: coiData.status || 'Not Processed',
        reminderStatus: 'Not Sent',
        lastReminderSent: null,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        documentUrl: coiData.documentUrl || null,
        notes: coiData.notes || ''
      };
      
      cois.unshift(newCOI);
      localStorage.setItem('coiData', JSON.stringify(cois));
      
      return {
        ...newCOI,
        propertyDetails: property
      };
    } catch (error) {
      console.error('Error creating COI:', error);
      throw error;
    }
  }

  // Update COI
  async updateCOI(id, updatedData) {
    await delay(400);
    try {
      const cois = JSON.parse(localStorage.getItem('coiData') || '[]');
      const index = cois.findIndex(coi => coi.id === id);
      
      if (index !== -1) {
        // If property is updated, get new property details
        let property = null;
        if (updatedData.property && updatedData.property !== cois[index].property) {
          property = await this.getPropertyByName(updatedData.property);
        }
        
        cois[index] = {
          ...cois[index],
          ...updatedData,
          propertyId: property?.id || cois[index].propertyId,
          updatedAt: new Date().toISOString()
        };
        
        localStorage.setItem('coiData', JSON.stringify(cois));
        
        // Get updated property details
        const properties = await this.getProperties();
        const updatedProperty = properties.find(p => 
          p.value === cois[index].property || 
          p.id === cois[index].propertyId ||
          p.name === cois[index].property ||
          p.label === cois[index].property
        );
        
        return {
          ...cois[index],
          propertyDetails: updatedProperty
        };
      }
      
      throw new Error('COI not found');
    } catch (error) {
      console.error('Error updating COI:', error);
      throw error;
    }
  }

  // Delete COI
  async deleteCOI(id) {
    await delay(300);
    try {
      const cois = JSON.parse(localStorage.getItem('coiData') || '[]');
      const filtered = cois.filter(coi => coi.id !== id);
      localStorage.setItem('coiData', JSON.stringify(filtered));
      return { success: true, id };
    } catch (error) {
      console.error('Error deleting COI:', error);
      throw error;
    }
  }

  // Bulk delete COIs
  async bulkDeleteCOI(ids) {
    await delay(500);
    try {
      const cois = JSON.parse(localStorage.getItem('coiData') || '[]');
      const filtered = cois.filter(coi => !ids.includes(coi.id));
      localStorage.setItem('coiData', JSON.stringify(filtered));
      return { success: true, ids };
    } catch (error) {
      console.error('Error bulk deleting COIs:', error);
      throw error;
    }
  }

  // Send reminder
  async sendReminder(coiId, reminderData) {
    await delay(400);
    try {
      const cois = JSON.parse(localStorage.getItem('coiData') || '[]');
      const index = cois.findIndex(coi => coi.id === coiId);
      
      if (index !== -1) {
        cois[index] = {
          ...cois[index],
          reminderStatus: 'Sent',
          lastReminderSent: new Date().toISOString(),
          lastReminderType: reminderData.type,
          lastReminderMessage: reminderData.message
        };
        localStorage.setItem('coiData', JSON.stringify(cois));
        return cois[index];
      }
      
      throw new Error('COI not found');
    } catch (error) {
      console.error('Error sending reminder:', error);
      throw error;
    }
  }

  // Send bulk reminders
  async sendBulkReminders(ids, reminderType) {
    await delay(600);
    try {
      const cois = JSON.parse(localStorage.getItem('coiData') || '[]');
      const updatedCois = cois.map(coi => 
        ids.includes(coi.id) 
          ? { 
              ...coi, 
              reminderStatus: 'Sent', 
              lastReminderSent: new Date().toISOString(),
              lastReminderType: reminderType
            }
          : coi
      );
      
      localStorage.setItem('coiData', JSON.stringify(updatedCois));
      return { success: true, count: ids.length };
    } catch (error) {
      console.error('Error sending bulk reminders:', error);
      throw error;
    }
  }

  // Apply filters to COI data
  applyFilters(cois, filters) {
    return cois.filter(coi => {
      const matchesProperty = !filters.property || 
        coi.property === filters.property ||
        coi.propertyId === filters.property;
      
      const matchesStatus = !filters.status || coi.status === filters.status;
      
      const matchesSearch = !filters.searchTerm || 
        coi.tenantName?.toLowerCase().includes(filters.searchTerm.toLowerCase()) ||
        coi.property?.toLowerCase().includes(filters.searchTerm.toLowerCase()) ||
        coi.unit?.toLowerCase().includes(filters.searchTerm.toLowerCase()) ||
        coi.coiName?.toLowerCase().includes(filters.searchTerm.toLowerCase()) ||
        coi.tenantEmail?.toLowerCase().includes(filters.searchTerm.toLowerCase());
      
      let matchesExpiry = true;
      const expiryDate = new Date(coi.expiryDate);
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

      return matchesProperty && matchesStatus && matchesSearch && matchesExpiry;
    });
  }

  // Get summary statistics
  async getSummaryStats() {
    await delay(200);
    try {
      const cois = JSON.parse(localStorage.getItem('coiData') || '[]');
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const thirtyDaysFromNow = new Date(today);
      thirtyDaysFromNow.setDate(today.getDate() + 30);

      return {
        total: cois.length,
        active: cois.filter(c => c.status === 'Active').length,
        expired: cois.filter(c => c.status === 'Expired').length,
        rejected: cois.filter(c => c.status === 'Rejected').length,
        expiringSoon: cois.filter(c => c.status === 'Expiring Soon').length,
        notProcessed: cois.filter(c => c.status === 'Not Processed').length,
        expiringIn30Days: cois.filter(c => {
          if (!c.expiryDate) return false;
          const expiry = new Date(c.expiryDate);
          return expiry <= thirtyDaysFromNow && expiry >= today;
        }).length
      };
    } catch (error) {
      console.error('Error getting summary stats:', error);
      return {
        total: 0,
        active: 0,
        expired: 0,
        rejected: 0,
        expiringSoon: 0,
        notProcessed: 0,
        expiringIn30Days: 0
      };
    }
  }

  // Reset to initial data
  async resetToInitial() {
    await delay(300);
    try {
      localStorage.setItem('coiData', JSON.stringify(this.rawData.cois));
      
      const transformedProperties = this.rawData.properties.map(prop => ({
        id: prop.id,
        name: prop.name,
        value: prop.value || prop.name,
        label: prop.label || prop.name,
        address: prop.address || '',
        city: prop.city || '',
        state: prop.state || '',
        zipCode: prop.zipCode || '',
        createdAt: prop.createdAt || new Date().toISOString()
      }));
      
      localStorage.setItem('coiProperties', JSON.stringify(transformedProperties));
      
      return { success: true };
    } catch (error) {
      console.error('Error resetting to initial:', error);
      throw error;
    }
  }

  // Clear all data and reinitialize
  async reinitializeData() {
    await delay(300);
    try {
      localStorage.removeItem('coiData');
      localStorage.removeItem('coiProperties');
      this.initializeStorage();
      return { success: true };
    } catch (error) {
      console.error('Error reinitializing data:', error);
      throw error;
    }
  }

  // Get total count
  async getTotalCount() {
    try {
      const cois = JSON.parse(localStorage.getItem('coiData') || '[]');
      return cois.length;
    } catch (error) {
      console.error('Error getting total count:', error);
      return 0;
    }
  }
}

export default new COIService();