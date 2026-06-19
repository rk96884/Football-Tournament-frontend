export default function PaymentBadge({ owed }) {
  if (owed <= 0) {
    return (
      <span className="px-2 py-1 bg-green-100 text-green-700 text-xs font-semibold rounded">
        PAID
      </span>
    );
  }

  if (owed <= 5) {
    return (
      <span className="px-2 py-1 bg-yellow-100 text-yellow-700 text-xs font-semibold rounded">
        OWES £{owed}
      </span>
    );
  }

  return (
    <span className="px-2 py-1 bg-red-100 text-red-700 text-xs font-semibold rounded">
      OWES £{owed}
    </span>
  );
}