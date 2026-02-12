import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { X, Plus, Search, Loader2, Building2, MapPin } from "lucide-react";
import Select from "../globalReuseComponents/Select";
import AddPropertyModal from "./AddPropertyModal";
import { 
  addCOI, 
  updateCOI, 
  fetchProperties,
  selectPropertyOptions,
  selectPropertiesLoading 
} from "../../store/coiSlice";
import toast from "react-hot-toast";

const STATUS_OPTIONS = [
  { label: "Not Processed", value: "Not Processed" },
  { label: "Active", value: "Active" },
  { label: "Expired", value: "Expired" },
  { label: "Rejected", value: "Rejected" },
  { label: "Expiring Soon", value: "Expiring Soon" }
];

const INITIAL_FORM_STATE = {
  property: "",
  propertyId: "",
  tenantName: "",
  tenantEmail: "",
  unit: "",
  coiName: "",
  expiryDate: "",
  status: "Not Processed",
  reminderStatus: "Not Sent",
  file: null,
  notes: ""
};

export default function COIModal({ isOpen, onClose, coi, mode = 'add' }) {
  const dispatch = useDispatch();
  const propertyOptions = useSelector(selectPropertyOptions);
  const propertiesLoading = useSelector(selectPropertiesLoading);
  
  const [formData, setFormData] = useState(INITIAL_FORM_STATE);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showAddPropertyModal, setShowAddPropertyModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [fileName, setFileName] = useState("");
  const [selectedPropertyDetails, setSelectedPropertyDetails] = useState(null);

  useEffect(() => {
    if (isOpen) {
      dispatch(fetchProperties());
    }
  }, [isOpen, dispatch]);

  useEffect(() => {
    if (coi && mode === 'edit') {
      setFormData({
        property: coi.property || "",
        propertyId: coi.propertyId || "",
        tenantName: coi.tenantName || "",
        tenantEmail: coi.tenantEmail || "",
        unit: coi.unit || "",
        coiName: coi.coiName || "",
        expiryDate: coi.expiryDate || "",
        status: coi.status || "Not Processed",
        reminderStatus: coi.reminderStatus || "Not Sent",
        file: null,
        notes: coi.notes || ""
      });
      
      if (coi.propertyDetails) {
        setSelectedPropertyDetails(coi.propertyDetails);
      } else if (coi.property) {
        const property = propertyOptions.find(p => p.value === coi.property);
        setSelectedPropertyDetails(property || null);
      }
      
      setFileName(coi.documentUrl ? coi.documentUrl.split('/').pop() : "");
    } else {
      setFormData(INITIAL_FORM_STATE);
      setSelectedPropertyDetails(null);
      setFileName("");
    }
    setErrors({});
    setSearchTerm("");
  }, [coi, mode, isOpen, propertyOptions]);

  useEffect(() => {
    if (formData.property) {
      const property = propertyOptions.find(p => 
        p.value === formData.property || 
        p.name === formData.property || 
        p.label === formData.property
      );
      setSelectedPropertyDetails(property || null);
    } else {
      setSelectedPropertyDetails(null);
    }
  }, [formData.property, propertyOptions]);

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.property) newErrors.property = "Property is required";
    if (!formData.tenantName) newErrors.tenantName = "Tenant name is required";
    if (!formData.tenantEmail) {
      newErrors.tenantEmail = "Tenant email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.tenantEmail)) {
      newErrors.tenantEmail = "Invalid email format";
    }
    if (!formData.unit) newErrors.unit = "Unit is required";
    if (!formData.coiName) newErrors.coiName = "COI name is required";
    if (!formData.expiryDate) newErrors.expiryDate = "Expiry date is required";
    else {
      const selectedDate = new Date(formData.expiryDate);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      if (selectedDate < today) {
        newErrors.expiryDate = "Expiry date cannot be in the past";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      toast.error("Please fix the errors in the form");
      return;
    }

    setIsSubmitting(true);
    
    try {
      const coiData = {
        ...formData,
        updatedAt: new Date().toISOString()
      };

      delete coiData.file;

      if (mode === 'edit' && coi) {
        await dispatch(updateCOI({
          id: coi.id,
          updatedData: coiData
        })).unwrap();
      } else {
        await dispatch(addCOI({
          ...coiData,
          createdAt: new Date().toISOString()
        })).unwrap();
      }
      
      onClose();
      setFormData(INITIAL_FORM_STATE);
      setErrors({});
      setFileName("");
      setSelectedPropertyDetails(null);
    } catch (error) {
      console.error('Form submission error:', error);
      toast.error(mode === 'edit' ? "Failed to update COI" : "Failed to add COI");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: null }));
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 10 * 1024 * 1024) {
        toast.error("File size must be less than 10MB");
        return;
      }
      
      const allowedTypes = ['application/pdf', 'image/jpeg', 'image/png'];
      if (!allowedTypes.includes(file.type)) {
        toast.error("Only PDF, JPG and PNG files are allowed");
        return;
      }

      setFileName(file.name);
      handleChange('file', file);
    }
  };

  const handlePropertyAdded = (newProperty) => {
    handleChange('property', newProperty.value);
    dispatch(fetchProperties());
  };

  const filteredPropertyOptions = propertyOptions.filter(option =>
    option.label?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    option.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    option.value?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    option.address?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    option.city?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (!isOpen) return null;

  return (
    <>
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto animate-in fade-in duration-200">
          
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b sticky top-0 bg-white z-10">
            <h2 className="text-xl font-semibold text-gray-900">
              {mode === 'edit' ? 'Edit Certificate of Insurance' : 'Add New Certificate of Insurance'}
            </h2>
            <button 
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              disabled={isSubmitting}
            >
              <X size={20} className="text-gray-500" />
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              <div className="space-y-1 md:col-span-2">
                <label className="block text-sm font-medium text-gray-700">
                  Property <span className="text-red-500">*</span>
                </label>
                <div className="space-y-3">
                  
             
                  
                  <div className="flex gap-2">
                    <div className="flex-1">
                      <Select
                        placeholder="Select property"
                        value={formData.property}
                        onChange={(e) => handleChange('property', e.target.value)}
                        options={[
                          { label: "Select a property", value: "" },
                          ...filteredPropertyOptions
                        ]}
                        className={`w-full ${errors.property ? 'border-red-500' : ''}`}
                        disabled={propertiesLoading || isSubmitting}
                      />
                    </div>
                    <button
                      type="button"
                      onClick={() => setShowAddPropertyModal(true)}
                      className="px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition flex items-center gap-1 text-sm whitespace-nowrap"
                      title="Add new property"
                      disabled={propertiesLoading || isSubmitting}
                    >
                      <Plus size={16} />
                      <span className="hidden sm:inline">Add New</span>
                    </button>
                  </div>
                </div>
                
                {errors.property && (
                  <p className="text-red-500 text-xs mt-1">{errors.property}</p>
                )}
                
                {selectedPropertyDetails && (
                  <div className="mt-2 p-3 bg-blue-50 rounded-lg border border-blue-100">
                    <div className="flex items-start gap-2">
                      <Building2 size={16} className="text-blue-600 mt-0.5" />
                      <div className="flex-1">
                        <p className="text-sm font-medium text-blue-900">
                          {selectedPropertyDetails.label || selectedPropertyDetails.name || selectedPropertyDetails.value}
                        </p>
                        {selectedPropertyDetails.address && (
                          <p className="text-xs text-blue-700 flex items-center gap-1 mt-1">
                            <MapPin size={12} />
                            {selectedPropertyDetails.address}
                            {selectedPropertyDetails.city && `, ${selectedPropertyDetails.city}`}
                            {selectedPropertyDetails.state && `, ${selectedPropertyDetails.state}`}
                            {selectedPropertyDetails.zipCode && ` ${selectedPropertyDetails.zipCode}`}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                )}
                
                <p className="text-xs text-gray-500 mt-1">
                  {propertyOptions.length} properties available
                  {searchTerm && ` • Filtered from ${propertyOptions.length}`}
                </p>
              </div>

              <div className="space-y-1">
                <label className="block text-sm font-medium text-gray-700">
                  Tenant Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.tenantName}
                  onChange={(e) => handleChange('tenantName', e.target.value)}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                    errors.tenantName ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="Enter tenant name"
                  disabled={isSubmitting}
                />
                {errors.tenantName && (
                  <p className="text-red-500 text-xs mt-1">{errors.tenantName}</p>
                )}
              </div>

              <div className="space-y-1">
                <label className="block text-sm font-medium text-gray-700">
                  Tenant Email <span className="text-red-500">*</span>
                </label>
                <input
                  type="email"
                  value={formData.tenantEmail}
                  onChange={(e) => handleChange('tenantEmail', e.target.value)}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                    errors.tenantEmail ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="tenant@example.com"
                  disabled={isSubmitting}
                />
                {errors.tenantEmail && (
                  <p className="text-red-500 text-xs mt-1">{errors.tenantEmail}</p>
                )}
              </div>

              {/* Unit */}
              <div className="space-y-1">
                <label className="block text-sm font-medium text-gray-700">
                  Unit/Suite <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.unit}
                  onChange={(e) => handleChange('unit', e.target.value)}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                    errors.unit ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="e.g., Suite 100, Unit 4B"
                  disabled={isSubmitting}
                />
                {errors.unit && (
                  <p className="text-red-500 text-xs mt-1">{errors.unit}</p>
                )}
              </div>

              {/* COI Name */}
              <div className="space-y-1">
                <label className="block text-sm font-medium text-gray-700">
                  COI Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.coiName}
                  onChange={(e) => handleChange('coiName', e.target.value)}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                    errors.coiName ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="General Liability Insurance"
                  disabled={isSubmitting}
                />
                {errors.coiName && (
                  <p className="text-red-500 text-xs mt-1">{errors.coiName}</p>
                )}
              </div>

              {/* Expiry Date */}
              <div className="space-y-1">
                <label className="block text-sm font-medium text-gray-700">
                  Expiry Date <span className="text-red-500">*</span>
                </label>
                <input
                  type="date"
                  value={formData.expiryDate}
                  onChange={(e) => handleChange('expiryDate', e.target.value)}
                  min={new Date().toISOString().split('T')[0]}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                    errors.expiryDate ? 'border-red-500' : 'border-gray-300'
                  }`}
                  disabled={isSubmitting}
                />
                {errors.expiryDate && (
                  <p className="text-red-500 text-xs mt-1">{errors.expiryDate}</p>
                )}
              </div>

              {/* Status */}
              <div className="space-y-1">
                <label className="block text-sm font-medium text-gray-700">
                  Status
                </label>
                <Select
                  value={formData.status}
                  onChange={(e) => handleChange('status', e.target.value)}
                  options={STATUS_OPTIONS}
                  disabled={isSubmitting}
                />
              </div>

              <div className="space-y-1 md:col-span-2">
                <label className="block text-sm font-medium text-gray-700">
                  Upload COI {mode === 'add' ? '(Optional)' : '(Leave empty to keep current)'}
                </label>
                <div className="flex items-center gap-2">
                  <div className="flex-1">
                    <input
                      type="file"
                      onChange={handleFileChange}
                      accept=".pdf,.jpg,.jpeg,.png"
                      className="hidden"
                      id="file-upload"
                      disabled={isSubmitting}
                    />
                    <label
                      htmlFor="file-upload"
                      className="flex items-center justify-center gap-2 w-full px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition cursor-pointer"
                    >
                      <Plus size={16} />
                      <span>Choose File</span>
                    </label>
                  </div>
                  {fileName && (
                    <span className="text-sm text-gray-600 truncate flex-1">
                      Selected: {fileName}
                    </span>
                  )}
                  {mode === 'edit' && coi?.documentUrl && !fileName && (
                    <span className="text-sm text-gray-600">
                      Current file: {coi.documentUrl.split('/').pop()}
                    </span>
                  )}
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  Accepted formats: PDF, JPG, PNG (Max 10MB)
                </p>
              </div>

              {/* Notes */}
              <div className="space-y-1 md:col-span-2">
                <label className="block text-sm font-medium text-gray-700">
                  Notes (Optional)
                </label>
                <textarea
                  value={formData.notes}
                  onChange={(e) => handleChange('notes', e.target.value)}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Add any additional notes or comments..."
                  disabled={isSubmitting}
                />
              </div>
            </div>

            {/* Form Actions */}
            <div className="flex justify-end gap-3 pt-6 border-t">
              <button
                type="button"
                onClick={onClose}
                disabled={isSubmitting}
                className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting || propertiesLoading}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 min-w-[100px] justify-center"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 size={16} className="animate-spin" />
                    {mode === 'edit' ? 'Updating...' : 'Adding...'}
                  </>
                ) : (
                  mode === 'edit' ? 'Update COI' : 'Add COI'
                )}
              </button>
            </div>
          </form>
        </div>
      </div>

      <AddPropertyModal
        isOpen={showAddPropertyModal}
        onClose={() => setShowAddPropertyModal(false)}
        onPropertyAdded={handlePropertyAdded}
      />
    </>
  );
}