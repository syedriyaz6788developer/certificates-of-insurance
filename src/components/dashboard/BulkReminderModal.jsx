import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { X, Send } from "lucide-react";
import Select from "../globalReuseComponents/Select";
import { sendBulkReminders } from "../../store/coiSlice";

export default function BulkReminderModal({ isOpen, onClose, selectedIds }) {
  const dispatch = useDispatch();
  const [reminderType, setReminderType] = useState("standard");

  const reminderOptions = [
    { label: "Standard Reminder", value: "standard" },
    { label: "Urgent Reminder", value: "urgent" },
    { label: "Expiring Soon", value: "expiring" },
    { label: "Custom Message", value: "custom" }
  ];

  const handleSendReminders = () => {
    dispatch(sendBulkReminders({ ids: selectedIds, reminderType }));
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl w-full max-w-md">
        
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-xl font-semibold">Send Bulk Reminders</h2>
          <button 
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition"
          >
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4">
          <p className="text-sm text-gray-600">
            You are about to send reminders to {selectedIds.length} recipient(s).
          </p>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Reminder Type
            </label>
            <Select
              value={reminderType}
              onChange={(e) => setReminderType(e.target.value)}
              options={reminderOptions}
            />
          </div>

          {reminderType === "custom" && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Custom Message
              </label>
              <textarea
                rows={4}
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Enter your message here..."
              />
            </div>
          )}

          {/* Actions */}
          <div className="flex justify-end gap-3 pt-4">
            <button
              onClick={onClose}
              className="px-4 py-2 border rounded-lg hover:bg-gray-50 transition"
            >
              Cancel
            </button>
            <button
              onClick={handleSendReminders}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
            >
              <Send size={16} />
              Send Reminders
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}