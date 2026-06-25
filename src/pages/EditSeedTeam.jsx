import { useEffect, useState } from "react";
import { API_BASE } from "../api/index";
import { useNavigate, useLocation, useParams } from "react-router-dom";

export default function EditSeedTeam() {
  const [players, setPlayers] = useState([]);

  const navigate = useNavigate();
  const location = useLocation();
  const { id } = useParams();

  // ⭐ If no :id → master list (TournamentId = 0)
  const tournamentId = id ? Number(id) : 0;

  const from = location.state?.from || "/tournaments";

  // Load seed players (master or tournament)
  useEffect(() => {
    const load = async () => {
      const res = await fetch(`${API_BASE}/api/seed/${tournamentId}`);
      const data = await res.json();
      setPlayers(Array.isArray(data) ? data : []);
    };
    load();
  }, [tournamentId]);

  // ⭐ Update a field (supports Id OR TempId)
  const updateField = (idOrTempId, field, value) => {
    setPlayers(prev =>
      prev.map(p =>
        (p.Id === idOrTempId || p.TempId === idOrTempId)
          ? { ...p, [field]: value }
          : p
      )
    );
  };

  // ⭐ Save changes (receives updated list with REAL DB IDs)
  const save = async () => {
    const res = await fetch(`${API_BASE}/api/seed`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(players)
    });

    if (res.ok) {
      const updatedList = await res.json();   // ⭐ REAL IDs from DB
      setPlayers(updatedList);                // ⭐ Sync state
      navigate(from);
    }
  };

  // ⭐ Add new player (TempId ensures stable key)
  const addPlayer = () => {
    setPlayers(prev => [
      {
        Id: 0, // new player → backend assigns real ID
        TempId: crypto.randomUUID(), // ⭐ stable key
        Name: "",
        Notes: "",
        AmountOwed: 0,
        AmountPaid: 0,
        Paid: false,
        TournamentId: tournamentId
      },
      ...prev
    ]);
  };

  // ⭐ Delete player (supports Id OR TempId)
  const deletePlayer = (idOrTempId) => {
    setPlayers(prev =>
      prev.filter(p => p.Id !== idOrTempId && p.TempId !== idOrTempId)
    );
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">
        {tournamentId === 0 ? "Edit Master Seed Team" : "Edit Seed Team"}
      </h2>

      <button
        type="button"
        onClick={addPlayer}
        className="mb-4 bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
      >
        + Add Seed Player
      </button>

      <div className="space-y-4">
        {players.map(p => (
          <div key={p.Id || p.TempId} className="p-4 border rounded-lg bg-white">

            <div className="flex justify-between items-center mb-2">
              <input
                className="w-full p-2 border rounded"
                placeholder="Player name"
                value={p.Name}
                onChange={e => updateField(p.Id || p.TempId, "Name", e.target.value)}
              />

              <button
                type="button"
                onClick={() => deletePlayer(p.Id || p.TempId)}
                className="ml-4 text-red-600 hover:underline"
              >
                Delete
              </button>
            </div>

            <textarea
              className="w-full p-2 border rounded"
              rows={2}
              value={p.Notes || ""}
              onChange={e => updateField(p.Id || p.TempId, "Notes", e.target.value)}
            />
          </div>
        ))}
      </div>

      <button
        type="button"
        onClick={save}
        className="mt-6 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
      >
        Save Changes
      </button>
    </div>
  );
}