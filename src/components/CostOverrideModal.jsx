import { useState } from "react";
import Button from "./ui/Button";

export default function CostOverrideModal({
  open,
  onClose,
  playerId,
  tournamentId,
  onSubmit,
}) {
  const [amount, setAmount] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  if (!open) return null;

  const handleSubmit = async () => {
    const value = parseFloat(amount);

    if (isNaN(value) || value < 0) {
      setError("Please enter a valid amount");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const res = await fetch(
        `/api/tournaments/${tournamentId}/players/${playerId}/cost`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(value),
        }
      );

      if (!res.ok) {
        throw new Error("Override failed");
      }

      setAmount("");
      onSubmit(); // refresh tournament data
      onClose();  // 🔥 close modal after success
    } catch (err) {
      setError("Something went wrong. Try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") handleSubmit();
    if (e.key === "Escape") onClose();
  };

  return (
    <div
      className="fixed inset-0 bg-black/40 flex items-center justify-center z-50"
      onKeyDown={handleKeyDown}
    >
      <div className="bg-white p-6 rounded-lg shadow-lg w-80">
        <h2 className="text-lg font-semibold mb-4">Override Cost</h2>

        <input
          type="number"
          step="0.01"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          className="w-full border rounded px-3 py-2 mb-2"
          placeholder="Enter new cost"
          autoFocus
        />

        {error && (
          <div className="text-red-600 text-sm mb-2">{error}</div>
        )}

        <div className="flex justify-end gap-2 mt-4">
          <Button variant="secondary" onClick={onClose} disabled={loading}>
            Cancel
          </Button>

          <Button variant="primary" onClick={handleSubmit} disabled={loading}>
            {loading ? "Saving..." : "Save"}
          </Button>
        </div>
      </div>
    </div>
  );
}