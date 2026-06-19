import React, { useState } from "react";
import Button from "./ui/Button";

export default function EditPaymentModal({ open, onClose, payment, onSave }) {
  const [amount, setAmount] = useState(payment?.amount ?? "");

  if (!open) return null;

  const handleSubmit = async () => {
    const value = parseFloat(amount);
    if (isNaN(value) || value <= 0) return;

    await onSave(payment.id, value);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-80">
        <h2 className="text-lg font-semibold mb-4">Edit Payment</h2>

        <input
          type="number"
          step="0.01"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          className="w-full border rounded px-3 py-2 mb-4"
        />

        <div className="flex justify-end gap-2">
          <Button variant="secondary" onClick={onClose}>Cancel</Button>
          <Button variant="primary" onClick={handleSubmit}>Save</Button>
        </div>
      </div>
    </div>
  );
}