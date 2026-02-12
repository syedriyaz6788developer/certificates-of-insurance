import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { X, Send, Trash2, Edit2, Save, ChevronLeft } from "lucide-react";
import Select from "../globalReuseComponents/Select";
import { updateCOI, deleteCOI, updateReminderStatus } from "../../store/coiSlice";
import toast from "react-hot-toast";

const STATUS_OPTIONS = [
  { label: "Active", value: "Active" },
  { label: "Expired", value: "Expired" },
  { label: "Rejected", value: "Rejected" },
  { label: "Expiring Soon", value: "Expiring Soon" },
  { label: "Not Processed", value: "Not Processed" }
];

const REMINDER_OPTIONS = [
  { label: "Not Sent", value: "Not Sent" },
  { label: "Sent", value: "Sent" },
  { label: "Pending", value: "Pending" }
];

export default function COIDetailModal({ isOpen, onClose, coi }) {
  const dispatch = useDispatch();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isMobileView, setIsMobileView] = useState(false);

  useEffect(() => {
    const checkMobileView = () => {
      setIsMobileView(window.innerWidth < 640);
    };
    
    checkMobileView();
    window.addEventListener('resize', checkMobileView);
    return () => window.removeEventListener('resize', checkMobileView);
  }, []);

  useEffect(() => {
    if (coi) {
      setFormData({ ...coi });
    }
  }, [coi]);

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSave = () => {
    if (!formData) return;
    
    dispatch(updateCOI({ id: coi.id, updatedData: formData }));
    setIsEditing(false);
    toast.success("COI updated successfully");
  };

  const handleDelete = async () => {
    if (window.confirm("Are you sure you want to delete this COI? This action cannot be undone.")) {
      setIsDeleting(true);
      try {
        dispatch(deleteCOI(coi.id));
        onClose();
        toast.success("COI deleted successfully");
      } catch (error) {
        console.log(error);
        toast.error("Failed to delete COI");
      } finally {
        setIsDeleting(false);
      }
    }
  };

  const handleSendReminder = () => {
    toast.success(`Reminder sent to ${formData.tenantName}`);
    dispatch(updateReminderStatus({ id: coi.id, status: "Sent" }));
    handleChange('reminderStatus', 'Sent');
  };

  const handleCancel = () => {
    setFormData({ ...coi });
    setIsEditing(false);
  };

  if (!isOpen || !coi || !formData) return null;

  const getStatusBadgeClass = (status) => {
    const classes = {
      "Active": "bg-blue-100 text-blue-800",
      "Expired": "bg-red-100 text-red-800",
      "Rejected": "bg-red-100 text-red-800",
      "Expiring Soon": "bg-orange-100 text-orange-800",
      "Not Processed": "bg-blue-50 text-blue-600"
    };
    return classes[status] || "bg-gray-100 text-gray-800";
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const MobileHeader = () => (
    <div className="flex items-center gap-3 p-4 border-b sticky top-0 bg-white">
      <button 
        onClick={onClose}
        className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
      >
        <ChevronLeft size={20} />
      </button>
      <div className="flex-1 flex items-center justify-between">
        <h2 className="text-lg font-semibold">COI Details</h2>
        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusBadgeClass(formData.status)}`}>
          {formData.status}
        </span>
      </div>
    </div>
  );

  const DesktopHeader = () => (
    <div className="flex items-center justify-between p-6 border-b sticky top-0 bg-white">
      <div className="flex items-center gap-3">
        <h2 className="text-xl font-semibold">COI Details</h2>
        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusBadgeClass(formData.status)}`}>
          {formData.status}
        </span>
      </div>
      <button 
        onClick={onClose}
        className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
      >
        <X size={20} />
      </button>
    </div>
  );

  const Field = ({ label,  isEditing: fieldEditing, value, onChange, type = 'text', options, isSelect = false }) => (
    <div className="space-y-1">
      <label className="text-xs font-medium text-gray-500 uppercase tracking-wider block">
        {label}
      </label>
      {fieldEditing ? (
        isSelect ? (
          <Select
            value={value}
            onChange={(e) => onChange(e.target.value)}
            options={options}
            className="w-full text-sm"
          />
        ) : (
          <input
            type={type}
            value={value || ''}
            onChange={(e) => onChange(e.target.value)}
            min={type === 'date' ? new Date().toISOString().split('T')[0] : undefined}
            className="w-full px-3 py-2 text-sm border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        )
      ) : (
        <p className="text-gray-900 text-sm sm:text-base break-words">
          {type === 'date' ? formatDate(value) : value || '—'}
        </p>
      )}
    </div>
  );

  return (
    <div className="fixed inset-0  bg-black bg-opacity-50 flex items-end sm:items-center justify-center z-50">
      <div className={`
        bg-white rounded-t-xl m-4 sm:rounded-xl 
        w-full sm:w-[90%] md:w-[80%] lg:w-[70%] xl:w-[60%] max-w-2xl
        max-h-[90vh] sm:max-h-[85vh]
        overflow-y-auto
        transform transition-all duration-300 ease-out
        ${isMobileView ? 'animate-slide-up' : 'animate-fade-in'}
      `}>
        
        {isMobileView ? <MobileHeader /> : <DesktopHeader />}

        <div className="p-4 sm:p-6 space-y-6">
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
            <Field
              label="Property"
              isEditing={isEditing}
              value={formData.property}
              onChange={(value) => handleChange('property', value)}
            />

            <Field
              label="Tenant Name"
              isEditing={isEditing}
              value={formData.tenantName}
              onChange={(value) => handleChange('tenantName', value)}
            />

            <Field
              label="Tenant Email"
              isEditing={isEditing}
              value={formData.tenantEmail}
              onChange={(value) => handleChange('tenantEmail', value)}
              type="email"
            />

            <Field
              label="Unit"
              isEditing={isEditing}
              value={formData.unit}
              onChange={(value) => handleChange('unit', value)}
            />

            <Field
              label="COI Name"
              isEditing={isEditing}
              value={formData.coiName}
              onChange={(value) => handleChange('coiName', value)}
            />

            <Field
              label="Expiry Date"
              isEditing={isEditing}
              value={formData.expiryDate}
              onChange={(value) => handleChange('expiryDate', value)}
              type="date"
            />

            <Field
              label="Status"
              isEditing={isEditing}
              value={formData.status}
              onChange={(value) => handleChange('status', value)}
              isSelect={true}
              options={STATUS_OPTIONS}
            />

            <Field
              label="Reminder Status"
              isEditing={isEditing}
              value={formData.reminderStatus || 'Not Sent'}
              onChange={(value) => handleChange('reminderStatus', value)}
              isSelect={true}
              options={REMINDER_OPTIONS}
            />
          </div>

          <div className="flex flex-col-reverse  sm:flex-row sm:items-center sm:justify-between pt-4 sm:pt-6 border-t gap-3 sm:gap-0">
            
            <div className="flex flex-col sm:flex-row  gap-2 sm:gap-3">
              <button
                onClick={handleSendReminder}
                disabled={isEditing}
                className={`
                  flex items-center justify-center gap-2 px-4 py-2.5 sm:py-2 rounded-lg transition
                  text-sm sm:text-base
                  ${isEditing 
                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed' 
                    : 'bg-blue-600 text-white hover:bg-blue-700 active:bg-blue-800'
                  }
                `}
              >
                <Send size={16} className="flex-shrink-0" />
                <span>Send Reminder</span>
              </button>
              
              <button
                onClick={handleDelete}
                disabled={isDeleting || isEditing}
                className={`
                  flex items-center justify-center gap-2 px-4 py-2.5 sm:py-2 rounded-lg transition
                  text-sm sm:text-base
                  ${isDeleting || isEditing
                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                    : 'bg-red-600 text-white hover:bg-red-700 active:bg-red-800'
                  }
                `}
              >
                <Trash2 size={16} className="flex-shrink-0" />
                <span>{isDeleting ? 'Deleting...' : 'Delete COI'}</span>
              </button>
            </div>

            <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
              {isEditing ? (
                <>
                  <button
                    onClick={handleCancel}
                    className="w-full sm:w-auto px-4 py-2.5 sm:py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition text-sm sm:text-base"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSave}
                    className="w-full sm:w-auto flex items-center justify-center gap-2 px-4 py-2.5 sm:py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 active:bg-green-800 transition text-sm sm:text-base"
                  >
                    <Save size={16} className="flex-shrink-0" />
                    <span>Save Changes</span>
                  </button>
                </>
              ) : (
                <button
                  onClick={() => setIsEditing(true)}
                  className="w-full sm:w-auto flex items-center justify-center gap-2 px-4 py-2.5 sm:py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 active:bg-gray-700 transition text-sm sm:text-base"
                >
                  <Edit2 size={16} className="flex-shrink-0" />
                  <span>Edit COI</span>
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes slide-up {
          from {
            transform: translateY(100%);
          }
          to {
            transform: translateY(0);
          }
        }
        
        @keyframes fade-in {
          from {
            opacity: 0;
            transform: scale(0.95);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }
        
        .animate-slide-up {
          animation: slide-up 0.3s ease-out;
        }
        
        .animate-fade-in {
          animation: fade-in 0.2s ease-out;
        }
      `}</style>
    </div>
  );
}