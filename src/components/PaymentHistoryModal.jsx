import React from "react";
import Button from "./ui/Button";

export default function PaymentHistoryModal({ open, onClose, history, onEdit }) {
  if (!open) return null;

  const formatDate = (iso) => {
    const d = new Date(iso);
    return d.toLocaleString("en-UK", {
      weekday: "short",
      hour: "2-digit",
      minute: "2-digit",
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };


  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-96 max-h-[80vh] overflow-y-auto">
        <h2 className="text-lg font-semibold mb-4">Payment History</h2>

       {history.map((h) => (
  <div
    key={h.id}
    className="border rounded-lg p-3 flex justify-between items-center"
  >
    <div>
      <div className="font-medium">£{h.amount.toFixed(2)}</div>
      <div className="text-xs text-gray-500">
        {formatDate(h.timestamp)}
      </div>
    </div>

    <Button
      variant="secondary"
      className="text-xs px-2 py-1"
      onClick={() => onEdit(h)}
    >
      Edit
    </Button>
  </div>
))}


       


        <div className="flex justify-end mt-6">
          <Button variant="secondary" onClick={onClose}>
            Close
          </Button>
        </div>
      </div>
    </div>
  );
}