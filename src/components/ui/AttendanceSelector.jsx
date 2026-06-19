import clsx from "clsx";

export default function AttendanceSelector({ value, onChange }) {
  const options = [
    { key: "attending", label: "Attending", color: "bg-green-600" },
    { key: "declined", label: "Declined", color: "bg-red-600" },
    { key: "unanswered", label: "Unanswered", color: "bg-gray-500" },
  ];

  return (
    <div className="flex gap-1">
      {options.map((opt) => (
        <button
          key={opt.key}
          onClick={() => onChange(opt.key)}
          className={clsx(
            "px-2 py-1 rounded text-xs font-medium border transition min-w-[80px] text-center",
            value === opt.key
              ? `${opt.color} text-white`
              : "bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300"
          )}
        >
          {opt.label}
        </button>
      ))}
    </div>
  );
}