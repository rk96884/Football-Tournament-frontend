import { useState } from "react";

export default function CollapsibleSection({ title, children }) {
  const [open, setOpen] = useState(true);

  return (
    <div className="mb-4">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex justify-between items-center bg-gray-100 dark:bg-gray-700 px-4 py-2 rounded active:scale-95 transition"
      >
        <span className="font-semibold">{title}</span>
        <span>{open ? "▲" : "▼"}</span>
      </button>

      {open && (
        <div className="mt-2 fade-slide-down">
          {children}
        </div>
      )}
    </div>
  );
}