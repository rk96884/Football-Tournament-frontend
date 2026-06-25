import { useEffect, useState } from "react";
import { API_BASE } from "../api/index";
import { useNavigate, useLocation, useParams } from "react-router-dom";

export default function EditSeedTeam() {
  const [players, setPlayers] = useState([]);

  const navigate = useNavigate();
  const { id } = useParams();

  // ⭐ If no :id → master seed team (TournamentId = 0)
  const isMaster = !id;
  const tournamentId = isMaster ? 0 : Number(id);


  // ⭐ Load players (master OR tournament)
  useEffect(() => {
    const load = async () => {
      if (isMaster) {
        // ⭐ Load master seed team
        const res = await fetch(`${API_BASE}/api/seed/0`);
        const data = await res.json();
        setPlayers(Array.isArray(data) ? data : []);
      } else {
        // ⭐ Load actual tournament players
        const res = await fetch(`${API_BASE}/api/tournaments/${tournamentId}`);
        const data = await res.json();
        setPlayers(data.Players || []);
      }
    };

    load();
  }, [isMaster, tournamentId]);

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

  // ⭐ Save changes (different endpoints for master vs tournament)
  const save = async () => {
    const url = isMaster
      ? `${API_BASE}/api/seed/0`
      : `${API_BASE}/api/players/bulkupdate/${tournamentId}`;

    const res = await fetch(url, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(players)
    });

    if (!res.ok) {
      console.error("Save failed");
      return;
    }

    // Some endpoints return updated list, some return nothing.
    // We don't rely on the response anymore.
    try {
      await res.json();
    } catch {
      // ignore JSON parse errors
    }

    // ⭐ Guaranteed redirect
    if (isMaster) {
      navigate("/tournaments");
    } else {
      navigate(`/tournaments/${tournamentId}`);
    }
  };


  // ⭐ Add new player (TempId ensures stable key)
  const addPlayer = () => {
    setPlayers(prev => [
      {
        Id: 0,
        TempId: crypto.randomUUID(),
        Name: "",
        Notes: "",
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
        {isMaster ? "Edit Master Seed Team" : "Edit Seed Team"}
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

            {/* Name + Delete */}
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

            {/* Notes */}
            <textarea
              className="w-full p-2 border rounded"
              rows={2}
              placeholder="Notes (optional)"
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