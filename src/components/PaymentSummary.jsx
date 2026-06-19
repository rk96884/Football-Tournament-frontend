export default function PaymentSummary({ totalExpected, totalPaid }) {
  const remaining = totalExpected - totalPaid;

  const statBox = (label, value, color) => (
    <div className="bg-white p-4 rounded shadow text-center">
      <p className="text-gray-500 text-sm">{label}</p>
      <p className={`text-2xl font-bold ${color}`}>£{value}</p>
    </div>
  );

  return (
    <div className="grid grid-cols-3 gap-4 mb-6">
      {statBox("Expected", totalExpected, "text-gray-800")}
      {statBox("Collected", totalPaid, "text-green-600")}
      {statBox("Remaining", remaining, remaining > 0 ? "text-red-600" : "text-green-600")}
    </div>
  );
}