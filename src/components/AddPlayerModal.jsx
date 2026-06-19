import React, { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import FocusTrap from "focus-trap-react";

export default function AddPlayerModal({ open, onClose, onCreate }) {
  const modalRef = useRef(null);
  const lastActive = useRef(null);
  const [name, setName] = useState("");
  const [cost, setCost] = useState("");
  const [error, setError] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!open) return;
    lastActive.current = document.activeElement;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    setTimeout(() => modalRef.current?.focus(), 0);
    return () => {
      document.body.style.overflow = prev;
      try { lastActive.current?.focus?.(); } catch {}
    };
  }, [open]);

  useEffect(() => {
    if (!open) {
      setName("");
      setCost("");
      setError(null);
      setSubmitting(false);
    }
  }, [open]);

  if (!open) return null;

  const validate = () => {
    if (!name.trim()) return "Name is required";
    const parsed = parseFloat(cost);
    if (Number.isNaN(parsed) || parsed < 0) return "Cost must be a non-negative number";
    return null;
  };

  const handleSubmit = async (e) => {
    e?.preventDefault();
    const v = validate();
    if (v) { setError(v); return; }
    setError(null);
    setSubmitting(true);

    // Build payload
    const payload = { name: name.trim(), cost: parseFloat(cost) };

    try {
      // Call parent-provided create handler (optimistic UI handled by parent)
      await onCreate(payload);
      onClose?.();
    } catch (err) {
      setError(err?.message || "Failed to add player");
      setSubmitting(false);
    }
  };

  const overlay = (
    <div
      data-debug="add-player-overlay"
      role="presentation"
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60"
      onMouseDown={(e) => { if (e.target === e.currentTarget) onClose?.(); }}
    >
      <FocusTrap active={open}>
        <form
          ref={modalRef}
          tabIndex={-1}
          role="dialog"
          aria-modal="true"
          aria-labelledby="add-player-title"
          onSubmit={handleSubmit}
          className="bg-white rounded-lg shadow-lg w-[min(96%,520px)] p-6 max-h-[80vh] overflow-y-auto"
          style={{ outline: "none" }}
        >
          <header className="flex items-center justify-between mb-4">
            <h2 id="add-player-title" className="text-lg font-semibold">Add Player</h2>
            <button type="button" onClick={() => onClose?.()} className="text-gray-600 hover:text-gray-900">Close</button>
          </header>

          <div className="space-y-4">
            <label className="block">
              <div className="text-sm font-medium">Player name</div>
              <input
                autoFocus
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="mt-1 w-full border rounded px-3 py-2"
                placeholder="e.g., Reuben"
                required
              />
            </label>

            <label className="block">
              <div className="text-sm font-medium">Cost (GBP)</div>
              <input
                value={cost}
                onChange={(e) => setCost(e.target.value)}
                className="mt-1 w-full border rounded px-3 py-2"
                placeholder="e.g., 10.00"
                inputMode="decimal"
                pattern="^\d+(\.\d{1,2})?$"
                required
              />
            </label>

            {error && <div className="text-sm text-red-600">{error}</div>}

            <div className="flex gap-2 justify-end">
              <button type="button" onClick={() => onClose?.()} className="px-4 py-2 rounded border">Cancel</button>
              <button
                type="submit"
                disabled={submitting}
                className="px-4 py-2 rounded bg-blue-600 text-white disabled:opacity-60"
              >
                {submitting ? "Adding…" : "Add Player"}
              </button>
            </div>
          </div>
        </form>
      </FocusTrap>
    </div>
  );

  return createPortal(overlay, document.body);
}