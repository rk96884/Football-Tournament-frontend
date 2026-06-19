import React from "react";
import clsx from "clsx";

export default function AttendanceBadge({ status, onChange }) {
  const styles = {
    yes: "bg-green-100 text-green-700",
    maybe: "bg-yellow-100 text-yellow-700",
    no: "bg-red-100 text-red-700",
    unknown: "bg-gray-200 text-gray-700",
  };

  const labels = {
    yes: "Yes",
    maybe: "Maybe",
    no: "No",
    unknown: "Unknown",
  };

  // Cycle order
  const next = {
    unknown: "yes",
    yes: "maybe",
    maybe: "no",
    no: "unknown",
  };

  return (
    <span
      onClick={() => onChange(next[status])}
      className={clsx(
        "px-2 py-1 rounded-full text-xs font-medium cursor-pointer select-none transition",
        styles[status] || styles.unknown,
        "hover:opacity-80 active:scale-95"
      )}
    >
      {labels[status] || labels.unknown}
    </span>
  );
}