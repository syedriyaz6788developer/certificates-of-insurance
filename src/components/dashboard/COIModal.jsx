// components/dashboard/COIModal.jsx
import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { X } from "lucide-react";
import Select from "../globalReuseComponents/Select";
import { addCOI, selectPropertyOptions } from "../../store/coiSlice";

export default function COIModal({ isOpen, onClose }) {
  const dispatch = useDispatch();
  const propertyOptions = useSelector(selectPropertyOptions);
  
  const [formData, setFormData] = useState({
    property: "",
    tenantName: "",
    tenantEmail: "",
    unit: "",
    coiName: "",
    expiryDate: "",
    status: "Not Processed",
    file: null
  });

  const [errors, setErrors] = useState({});

  const statusOptions = [
    { label: "Active", value: "Active" },
    { label: "Not Processed", value: "Not Processed" }
  ];

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.property) newErrors.property = "Property is required";
    if (!formData.tenantName) newErrors.tenantName = "Tenant name is required";
    if (!formData.tenantEmail) {
      newErrors.tenantEmail = "Tenant email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.tenantEmail)) {
      newErrors.tenantEmail = "Email is invalid";
    }
    if (!formData.unit) newErrors.unit = "Unit is required";
    if (!formData.coiName) newErrors.coiName = "COI name is required";
    if (!formData.expiryDate) newErrors.expiryDate = "Expiry date is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (validateForm()) {
      dispatch(addCOI(formData));
      onClose();
      setFormData({
        property: "",
        tenantName: "",
        tenantEmail: "",
        unit: "",
        coiName: "",
        expiryDate: "",
        status: "Not Processed",
        file: null
      });
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-xl font-semibold">Add New COI</h2>
          <button 
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition"
          >
            <X size={20} />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Property *
              </label>
              <Select
                placeholder="Select property"
                value={formData.property}
                onChange={(e) => setFormData({ ...formData, property: e.target.value })}
                options={propertyOptions}
              />
              {errors.property && (
                <p className="text-red-500 text-xs mt-1">{errors.property}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Tenant Name *
              </label>
              <input
                type="text"
                value={formData.tenantName}
                onChange={(e) => setFormData({ ...formData, tenantName: e.target.value })}
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
              {errors.tenantName && (
                <p className="text-red-500 text-xs mt-1">{errors.tenantName}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Tenant Email *
              </label>
              <input
                type="email"
                value={formData.tenantEmail}
                onChange={(e) => setFormData({ ...formData, tenantEmail: e.target.value })}
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
              {errors.tenantEmail && (
                <p className="text-red-500 text-xs mt-1">{errors.tenantEmail}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Unit *
              </label>
              <input
                type="text"
                value={formData.unit}
                onChange={(e) => setFormData({ ...formData, unit: e.target.value })}
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
              {errors.unit && (
                <p className="text-red-500 text-xs mt-1">{errors.unit}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                COI Name *
              </label>
              <input
                type="text"
                value={formData.coiName}
                onChange={(e) => setFormData({ ...formData, coiName: e.target.value })}
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
              {errors.coiName && (
                <p className="text-red-500 text-xs mt-1">{errors.coiName}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Expiry Date *
              </label>
              <input
                type="date"
                value={formData.expiryDate}
                onChange={(e) => setFormData({ ...formData, expiryDate: e.target.value })}
                min={new Date().toISOString().split('T')[0]}
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
              {errors.expiryDate && (
                <p className="text-red-500 text-xs mt-1">{errors.expiryDate}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Status
              </label>
              <Select
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                options={statusOptions}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Upload COI (Optional)
              </label>
              <input
                type="file"
                onChange={(e) => setFormData({ ...formData, file: e.target.files[0] })}
                accept=".pdf,.jpg,.jpeg,.png"
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-3 pt-4 border-t">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border rounded-lg hover:bg-gray-50 transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
            >
              Add COI
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}