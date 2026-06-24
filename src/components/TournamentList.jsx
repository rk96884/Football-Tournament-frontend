import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { API_BASE } from "../api";

export default function TournamentList() {
  const [tournaments, setTournaments] = useState([]);

  const loadTournaments = async () => {
    try {
      const res = await fetch(`${API_BASE}/api/tournaments`);
      const data = await res.json();
      setTournaments(data);
    } catch (err) {
      console.error("Error loading tournaments:", err);
    }
  };

  useEffect(() => {
    loadTournaments();
  }, []);

  return (
    <div className="p-6 space-y-6 bg-[#F2F2F7] min-h-screen">
      <h2 className="text-3xl font-semibold text-gray-900">Tournaments</h2>

      <div className="bg-white rounded-xl border border-gray-200 divide-y divide-gray-200">
        {tournaments.map((t) => (
          <div key={t.Id} className="p-4 hover:bg-gray-50 transition">

            {/* Main clickable area */}
            <Link
              to={`/tournaments/${t.Id}`}
              className="block"
            >
              <div className="text-lg font-medium text-gray-900">{t.Name}</div>

              {t.Location && (
                <div className="text-sm text-gray-600">
                  📍 {t.Location.Address}
                </div>
              )}

              <div className="text-sm text-gray-500 mt-1">
                {t.Players?.length || 0} players
              </div>
            </Link>

            {/* Edit Seed Team button */}
            <div className="mt-3">
              <Link
                to={`/tournaments/${t.Id}/editseedteam`}
                className="inline-block text-blue-600 hover:underline text-sm font-medium"
              >
                Edit Seed Team
              </Link>
            </div>

          </div>
        ))}
      </div>
    </div>
  );
}