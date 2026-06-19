import { useEffect } from "react";

export default function Toast({ message, type = "success", onClose }) {
  useEffect(() => {
    const timer = setTimeout(onClose, 2500);
    return () => clearTimeout(timer);
  }, [onClose]);

  const colors = {
    success: "bg-green-600",
    error: "bg-red-600",
    info: "bg-blue-600"
  };

  return (
    <div className={`text-white px-4 py-2 rounded shadow ${colors[type]} fade-slide-up`}>
      <div className={`text-white px-4 py-2 rounded shadow ${colors[type]}`}>
        {message}
      </div>
    </div>
  );
}