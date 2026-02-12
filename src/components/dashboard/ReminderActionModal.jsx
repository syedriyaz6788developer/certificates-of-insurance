// components/dashboard/ReminderActionModal.jsx
import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { X, Send, Calendar, User, Building, Mail, Clock } from "lucide-react";
import { updateCOI } from "../../store/coiSlice";
import toast from "react-hot-toast";

export default function ReminderActionModal({ isOpen, onClose, coi }) {
  const dispatch = useDispatch();
  const [reminderType, setReminderType] = useState("email");
  const [message, setMessage] = useState("");
  const [isSending, setIsSending] = useState(false);

  if (!isOpen || !coi) return null;

  const handleSendReminder = async () => {
    setIsSending(true);
    
    try {
      const now = new Date();
      
      // Update the COI reminder status in Redux store
      dispatch(updateCOI({ 
        id: coi.id, 
        updatedData: { 
          reminderStatus: "Sent",
          lastReminderSent: now.toISOString(),
          reminderType: reminderType,
          lastReminderMessage: message || null,
          reminderHistory: [
            ...(coi.reminderHistory || []),
            {
              sentAt: now.toISOString(),
              type: reminderType,
              message: message || null
            }
          ]
        } 
      }));
      
      // Show success message with time
      toast.success(
        <div>
          <div className="font-medium">Reminder sent to {coi.tenantName}</div>
          <div className="text-xs opacity-90">{getTimeAgo(now)}</div>
        </div>
      );
      
      // Close modal immediately
      onClose();
      
      // Reset form
      setMessage("");
      setReminderType("email");
      setIsSending(false);
      
    } catch (error) {
      console.error("Failed to send reminder:", error);
      toast.error("Failed to send reminder. Please try again.");
      setIsSending(false);
    }
  };

  const getTimeAgo = (date) => {
    const now = new Date();
    const seconds = Math.floor((now - date) / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    if (seconds < 60) return 'just now';
    if (minutes < 60) return `${minutes} ${minutes === 1 ? 'minute' : 'minutes'} ago`;
    if (hours < 24) return `${hours} ${hours === 1 ? 'hour' : 'hours'} ago`;
    if (days === 1) return 'yesterday';
    if (days < 7) return `${days} days ago`;
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    try {
      return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    } catch {
      return dateString;
    }
  };

  const getDaysUntilExpiry = () => {
    if (!coi.expiryDate) return null;
    const today = new Date();
    const expiry = new Date(coi.expiryDate);
    const diffTime = expiry - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const daysUntilExpiry = getDaysUntilExpiry();
  
  // Get last reminder info if exists
  const lastReminder = coi.reminderHistory?.[coi.reminderHistory.length - 1] || 
                      (coi.lastReminderSent ? { sentAt: coi.lastReminderSent, type: coi.reminderType } : null);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-lg relative animate-in fade-in zoom-in duration-200">
        
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Send size={20} className="text-blue-600" />
            </div>
            <h2 className="text-xl font-semibold text-gray-900">Send Reminder</h2>
          </div>
          <button
            onClick={onClose}
            className="p-1 hover:bg-gray-100 rounded-lg transition-colors"
            disabled={isSending}
          >
            <X size={20} className="text-gray-500" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          
          {/* Last Reminder Info - Show if reminder was sent before */}
          {lastReminder && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 flex items-start gap-3">
              <Clock size={16} className="text-blue-600 mt-0.5 flex-shrink-0" />
              <div className="flex-1">
                <p className="text-xs font-medium text-blue-700 uppercase tracking-wider">Last Reminder</p>
                <p className="text-sm font-medium text-blue-900">
                  Sent {getTimeAgo(new Date(lastReminder.sentAt))}
                </p>
                <p className="text-xs text-blue-700 mt-0.5">
                  via {lastReminder.type} • {new Date(lastReminder.sentAt).toLocaleString()}
                </p>
              </div>
            </div>
          )}

          {/* COI Summary */}
          <div className="bg-gray-50 rounded-lg p-4 space-y-3">
            <div className="flex items-start gap-3">
              <User size={16} className="text-gray-500 mt-1 flex-shrink-0" />
              <div className="min-w-0 flex-1">
                <p className="text-sm text-gray-500">Tenant</p>
                <p className="font-medium text-gray-900 truncate">{coi.tenantName}</p>
              </div>
            </div>
            
            <div className="flex items-start gap-3">
              <Building size={16} className="text-gray-500 mt-1 flex-shrink-0" />
              <div className="min-w-0 flex-1">
                <p className="text-sm text-gray-500">Property / Unit</p>
                <p className="font-medium text-gray-900 truncate">{coi.property} - {coi.unit}</p>
              </div>
            </div>
            
            <div className="flex items-start gap-3">
              <Calendar size={16} className="text-gray-500 mt-1 flex-shrink-0" />
              <div className="min-w-0 flex-1">
                <p className="text-sm text-gray-500">COI Expiry Date</p>
                <p className="font-medium text-gray-900">{formatDate(coi.expiryDate)}</p>
                {daysUntilExpiry !== null && (
                  <p className="text-xs mt-1">
                    <span className={
                      daysUntilExpiry <= 0 ? "text-red-600 font-medium" :
                      daysUntilExpiry <= 30 ? "text-orange-600 font-medium" : 
                      "text-gray-600"
                    }>
                      {daysUntilExpiry <= 0 
                        ? "Expired" 
                        : `Expires in ${daysUntilExpiry} days`}
                    </span>
                  </p>
                )}
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Mail size={16} className="text-gray-500 mt-1 flex-shrink-0" />
              <div className="min-w-0 flex-1">
                <p className="text-sm text-gray-500">Contact Email</p>
                <p className="font-medium text-gray-900 truncate">
                  {coi.tenantEmail || "No email provided"}
                </p>
              </div>
            </div>
          </div>

          {/* Reminder Type Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Reminder Type
            </label>
            <div className="flex gap-3">
              {["email", "sms", "both"].map((type) => (
                <button
                  key={type}
                  type="button"
                  onClick={() => setReminderType(type)}
                  disabled={isSending}
                  className={`flex-1 py-2 px-3 rounded-lg border text-sm font-medium transition-colors capitalize ${
                    reminderType === type
                      ? "bg-blue-50 border-blue-500 text-blue-700"
                      : "bg-white border-gray-300 text-gray-700 hover:bg-gray-50"
                  } ${isSending ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                  {type}
                </button>
              ))}
            </div>
          </div>

          {/* Custom Message */}
          <div>
            <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">
              Custom Message (Optional)
            </label>
            <textarea
              id="message"
              rows={3}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              disabled={isSending}
              placeholder="Add a custom message to your reminder..."
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none disabled:bg-gray-50 disabled:text-gray-500"
            />
          </div>

          {/* Preset Messages */}
          <div>
            <p className="text-sm font-medium text-gray-700 mb-2">Quick Templates</p>
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setMessage("This is a reminder that your Certificate of Insurance is expiring soon. Please provide an updated copy.")}
                disabled={isSending}
                className="px-3 py-1 bg-gray-100 hover:bg-gray-200 rounded-full text-xs text-gray-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Standard Reminder
              </button>
              <button
                onClick={() => setMessage("Your COI has expired. Please submit a current certificate immediately to remain in compliance.")}
                disabled={isSending}
                className="px-3 py-1 bg-red-100 hover:bg-red-200 rounded-full text-xs text-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Expired - Urgent
              </button>
              <button
                onClick={() => setMessage("Thank you for your business. We noticed your COI is expiring soon - please send us your updated certificate at your earliest convenience.")}
                disabled={isSending}
                className="px-3 py-1 bg-green-100 hover:bg-green-200 rounded-full text-xs text-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Friendly Reminder
              </button>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 p-6 border-t bg-gray-50 rounded-b-xl">
          <button
            type="button"
            onClick={onClose}
            disabled={isSending}
            className="px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSendReminder}
            disabled={isSending}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed min-w-[140px] justify-center"
          >
            {isSending ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Sending...
              </>
            ) : (
              <>
                <Send size={16} />
                Send Reminder
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}