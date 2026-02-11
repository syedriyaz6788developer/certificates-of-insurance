import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { X, Send, Calendar, User, Building, Mail } from "lucide-react";
import { sendReminder } from "../../store/coiSlice";

export default function ReminderActionModal({ isOpen, onClose, coi }) {
  const dispatch = useDispatch();
  const [reminderType, setReminderType] = useState("email");
  const [message, setMessage] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [sendSuccess, setSendSuccess] = useState(false);

  if (!isOpen || !coi) return null;

  const handleSendReminder = async () => {
    setIsSending(true);
    try {
      await dispatch(sendReminder({
        coiId: coi.id,
        type: reminderType,
        message: message.trim() || undefined
      }));
      setSendSuccess(true);
      setTimeout(() => {
        onClose();
        setSendSuccess(false);
        setMessage("");
        setReminderType("email");
      }, 2000);
    } catch (error) {
      console.error("Failed to send reminder:", error);
    } finally {
      setIsSending(false);
    }
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

  return (
    <div className="fixed inset-0 bg-black overflow-auto bg-opacity-50 flex items-center justify-center z-50 p-4">
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
          >
            <X size={20} className="text-gray-500" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* COI Summary */}
          <div className="bg-gray-50 rounded-lg p-4 space-y-3">
            <div className="flex items-start gap-3">
              <User size={16} className="text-gray-500 mt-1" />
              <div>
                <p className="text-sm text-gray-500">Tenant</p>
                <p className="font-medium text-gray-900">{coi.tenantName}</p>
              </div>
            </div>
            
            <div className="flex items-start gap-3">
              <Building size={16} className="text-gray-500 mt-1" />
              <div>
                <p className="text-sm text-gray-500">Property / Unit</p>
                <p className="font-medium text-gray-900">{coi.property} - {coi.unit}</p>
              </div>
            </div>
            
            <div className="flex items-start gap-3">
              <Calendar size={16} className="text-gray-500 mt-1" />
              <div>
                <p className="text-sm text-gray-500">COI Expiry Date</p>
                <p className="font-medium text-gray-900">{formatDate(coi.expiryDate)}</p>
                {daysUntilExpiry !== null && daysUntilExpiry > 0 && (
                  <p className="text-xs mt-1">
                    <span className={daysUntilExpiry <= 30 ? "text-orange-600 font-medium" : "text-gray-600"}>
                      Expires in {daysUntilExpiry} days
                    </span>
                  </p>
                )}
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Mail size={16} className="text-gray-500 mt-1" />
              <div>
                <p className="text-sm text-gray-500">Contact Email</p>
                <p className="font-medium text-gray-900">{coi.email || "No email provided"}</p>
              </div>
            </div>
          </div>

          {/* Reminder Type Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Reminder Type
            </label>
            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => setReminderType("email")}
                className={`flex-1 py-2 px-3 rounded-lg border text-sm font-medium transition-colors ${
                  reminderType === "email"
                    ? "bg-blue-50 border-blue-500 text-blue-700"
                    : "bg-white border-gray-300 text-gray-700 hover:bg-gray-50"
                }`}
              >
                Email
              </button>
              <button
                type="button"
                onClick={() => setReminderType("sms")}
                className={`flex-1 py-2 px-3 rounded-lg border text-sm font-medium transition-colors ${
                  reminderType === "sms"
                    ? "bg-blue-50 border-blue-500 text-blue-700"
                    : "bg-white border-gray-300 text-gray-700 hover:bg-gray-50"
                }`}
              >
                SMS
              </button>
              <button
                type="button"
                onClick={() => setReminderType("both")}
                className={`flex-1 py-2 px-3 rounded-lg border text-sm font-medium transition-colors ${
                  reminderType === "both"
                    ? "bg-blue-50 border-blue-500 text-blue-700"
                    : "bg-white border-gray-300 text-gray-700 hover:bg-gray-50"
                }`}
              >
                Both
              </button>
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
              placeholder="Add a custom message to your reminder..."
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
            />
          </div>

          {/* Preset Messages */}
          <div>
            <p className="text-sm font-medium text-gray-700 mb-2">Quick Templates</p>
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setMessage("This is a reminder that your Certificate of Insurance is expiring soon. Please provide an updated copy.")}
                className="px-3 py-1 bg-gray-100 hover:bg-gray-200 rounded-full text-xs text-gray-700 transition-colors"
              >
                Standard Reminder
              </button>
              <button
                onClick={() => setMessage("Your COI has expired. Please submit a current certificate immediately to remain in compliance.")}
                className="px-3 py-1 bg-red-100 hover:bg-red-200 rounded-full text-xs text-red-700 transition-colors"
              >
                Expired - Urgent
              </button>
              <button
                onClick={() => setMessage("Thank you for your business. We noticed your COI is expiring soon - please send us your updated certificate at your earliest convenience.")}
                className="px-3 py-1 bg-green-100 hover:bg-green-200 rounded-full text-xs text-green-700 transition-colors"
              >
                Friendly Reminder
              </button>
            </div>
          </div>

          {/* Success Message */}
          {sendSuccess && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-3 flex items-center gap-2">
              <div className="w-5 h-5 rounded-full bg-green-500 flex items-center justify-center">
                <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <p className="text-sm text-green-800">Reminder sent successfully!</p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 p-6 border-t bg-gray-50 rounded-b-xl">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSendReminder}
            disabled={isSending || sendSuccess}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
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