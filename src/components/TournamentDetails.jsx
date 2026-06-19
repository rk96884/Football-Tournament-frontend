export default function TournamentDetails({ tournament }) {
  if (!tournament) {
    return <p className="text-gray-600">Loading tournament...</p>;
  }

  const address = tournament.location?.address || "";
  const parking = tournament.location?.parking || "";

  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 mb-6">
      <h2 className="text-2xl font-bold text-gray-800 mb-4">
        {tournament.name}
      </h2>

      <div className="space-y-3 text-gray-700">

        {/* Date */}
        <div className="flex items-center gap-2">
          <span className="font-semibold w-24">Date:</span>
          <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm">
            {new Date(tournament.date).toLocaleDateString("en-GB", {
              weekday: "short",
              day: "numeric",
              month: "short",
              year: "numeric",
            })}
          </span>
        </div>

        {/* Time */}
        <div className="flex items-center gap-2">
          <span className="font-semibold w-24">Time:</span>
          <span>
            {new Date(tournament.date).toLocaleTimeString("en-GB", {
              hour: "2-digit",
              minute: "2-digit",
            })}
          </span>
        </div>

        {/* Address */}
        <div className="flex items-start gap-2">
          <span className="font-semibold w-24">Address:</span>
          <span>{address}</span>
        </div>

        {/* Parking */}
        <div className="flex items-start gap-2">
          <span className="font-semibold w-24">Parking:</span>
          <span>{parking}</span>
        </div>

        {/* Cost */}
        <div className="flex items-center gap-2">
          <span className="font-semibold w-24">Cost:</span>
          <span className="text-green-700 font-semibold">
            £{tournament.costPerPlayer}
          </span>
        </div>

        {/* Google Maps Button */}
        {address && (
          <a
            href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block mt-4 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
          >
            Open in Google Maps
          </a>
        )}
      </div>
    </div>
  );
}
