import clsx from "clsx";

export default function PaymentStatusToggle({ paid, onToggle }) {
  return (
    <button
      onClick={onToggle}
      className={clsx(
        "px-3 py-1 rounded text-xs font-medium border transition min-w-[70px]",
        paid
          ? "bg-green-600 text-white"
          : "bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300"
      )}
    >
      {paid ? "Paid" : "Unpaid"}
    </button>
  );
}