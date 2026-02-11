// components/dashboard/COIDetailModal.jsx
import React, { useState, useEffect } from "react";
import { X, Send, Trash2, Save } from "lucide-react";
import Select from "../globalReuseComponents/Select";

export default function COIDetailModal({ isOpen, onClose, coi }) {
  
  const [formData, setFormData] = useState({
    property: "",
    tenantName: "",
    tenantEmail: "",
    unit: "",
    coiName: "",
    expiryDate: "",
    status: "",
    reminderStatus: ""
  });

  const [isEditing, setIsEditing] = useState(false);

useEffect(() => {
  if (coi) {
    setFormData(coi);
    setIsEditing(true);
  }
  // eslint-disable-next-line react-hooks/exhaustive-deps
}, [coi]); 

  const statusOptions = [
    { label: "Active", value: "Active" },
    { label: "Expired", value: "Expired" },
    { label: "Rejected", value: "Rejected" },
    { label: "Expiring Soon", value: "Expiring Soon" },
    { label: "Not Processed", value: "Not Processed" }
  ];

  const reminderOptions = [
    { label: "Not Sent", value: "Not Sent" },
    { label: "Sent", value: "Sent" },
    { label: "Pending", value: "Pending" }
  ];

 

  if (!isOpen || !coi) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-xl font-semibold">COI Details</h2>
          <button 
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition"
          >
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          
          {/* Metadata */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Property
              </label>
              {isEditing ? (
                <input
                  type="text"
                  value={formData.property}
                  onChange={(e) => setFormData({ ...formData, property: e.target.value })}
                  className="w-full px-3 py-2 border rounded-lg"
                />
              ) : (
                <p className="text-gray-900">{formData.property}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Tenant Name
              </label>
              {isEditing ? (
                <input
                  type="text"
                  value={formData.tenantName}
                  onChange={(e) => setFormData({ ...formData, tenantName: e.target.value })}
                  className="w-full px-3 py-2 border rounded-lg"
                />
              ) : (
                <p className="text-gray-900">{formData.tenantName}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Tenant Email
              </label>
              {isEditing ? (
                <input
                  type="email"
                  value={formData.tenantEmail}
                  onChange={(e) => setFormData({ ...formData, tenantEmail: e.target.value })}
                  className="w-full px-3 py-2 border rounded-lg"
                />
              ) : (
                <p className="text-gray-900">{formData.tenantEmail}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Unit
              </label>
              {isEditing ? (
                <input
                  type="text"
                  value={formData.unit}
                  onChange={(e) => setFormData({ ...formData, unit: e.target.value })}
                  className="w-full px-3 py-2 border rounded-lg"
                />
              ) : (
                <p className="text-gray-900">{formData.unit}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                COI Name
              </label>
              {isEditing ? (
                <input
                  type="text"
                  value={formData.coiName}
                  onChange={(e) => setFormData({ ...formData, coiName: e.target.value })}
                  className="w-full px-3 py-2 border rounded-lg"
                />
              ) : (
                <p className="text-gray-900">{formData.coiName}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Expiry Date
              </label>
              {isEditing ? (
                <input
                  type="date"
                  value={formData.expiryDate}
                  onChange={(e) => setFormData({ ...formData, expiryDate: e.target.value })}
                  className="w-full px-3 py-2 border rounded-lg"
                />
              ) : (
                <p className="text-gray-900">
                  {new Date(formData.expiryDate).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric'
                  })}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Status
              </label>
              {isEditing ? (
                <Select
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                  options={statusOptions}
                />
              ) : (
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                  formData.status === "Active" ? "bg-blue-100 text-blue-800" :
                  formData.status === "Expired" ? "bg-red-100 text-red-800" :
                  formData.status === "Rejected" ? "bg-red-100 text-red-800" :
                  formData.status === "Expiring Soon" ? "bg-orange-100 text-orange-800" :
                  "bg-blue-50 text-blue-600"
                }`}>
                  {formData.status}
                </span>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Reminder Status
              </label>
              {isEditing ? (
                <Select
                  value={formData.reminderStatus}
                  onChange={(e) => setFormData({ ...formData, reminderStatus: e.target.value })}
                  options={reminderOptions}
                />
              ) : (
                <p className="text-gray-900">{formData.reminderStatus}</p>
              )}
            </div>
          </div>

          
        
        </div>
      </div>
    </div>
  );
}