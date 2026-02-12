import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { X } from "lucide-react";
import { addProperty } from "../../store/coiSlice";
import toast from "react-hot-toast";

export default function AddPropertyModal({ isOpen, onClose, onPropertyAdded }) {
  const dispatch = useDispatch();
  const [propertyName, setPropertyName] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!propertyName.trim()) {
      toast.error("Property name is required");
      return;
    }

    setIsSubmitting(true);
    
    try {
      const newProperty = {
        label: propertyName.trim(),
        value: propertyName.trim()
      };
      
      dispatch(addProperty(newProperty));
      
      if (onPropertyAdded) {
        onPropertyAdded(newProperty);
      }
      
      setPropertyName("");
      onClose();
      toast.success("Property added successfully");
    } catch (error) {
        console.log(error)
      toast.error("Failed to add property");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[60]">
      <div className="bg-white rounded-xl w-full max-w-md">
        <div className="flex items-center justify-between p-6 border-b">
          <h3 className="text-lg font-semibold">Add New Property</h3>
          <button 
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X size={20} />
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="p-6">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Property Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={propertyName}
                onChange={(e) => setPropertyName(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="e.g., Riverside Office Park"
                autoFocus
              />
              <p className="text-xs text-gray-500 mt-1">
                Add a custom property not in the default list
              </p>
            </div>
          </div>
          
          <div className="flex justify-end gap-3 mt-6 pt-6 border-t">
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition disabled:opacity-50 flex items-center gap-2"
            >
              {isSubmitting ? 'Adding...' : 'Add Property'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}