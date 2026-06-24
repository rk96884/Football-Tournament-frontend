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

  // Update a field
  const updateField = (id, field, value) => {
    setPlayers(prev =>
      prev.map(p => (p.Id === id ? { ...p, [field]: value } : p))
    );
  };

  // Save changes
  const save = async () => {
    await fetch(`${API_BASE}/api/seed`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(players)
    });

    navigate(from);
  };

  // Add new player
  const addPlayer = () => {
    setPlayers(prev => {
      const nextId = prev.length ? Math.max(...prev.map(p => p.Id)) + 1 : 1;

      return [
        {
          Id: nextId,
          Name: "",
          Notes: "",
          AmountOwed: 0,
          AmountPaid: 0,
          Paid: false,
          TournamentId: tournamentId   // ⭐ Works for master (0) or tournament
        },
        ...prev
      ];
    });
  };

  // Delete player
  const deletePlayer = (id) => {
    setPlayers(prev => prev.filter(p => p.Id !== id));
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
          <div key={p.Id} className="p-4 border rounded-lg bg-white">

            <div className="flex justify-between items-center mb-2">
              <input
                className="w-full p-2 border rounded"
                placeholder="Player name"
                value={p.Name}
                onChange={e => updateField(p.Id, "Name", e.target.value)}
              />

              <button
                type="button"
                onClick={() => deletePlayer(p.Id)}
                className="ml-4 text-red-600 hover:underline"
              >
                Delete
              </button>
            </div>

            <textarea
              className="w-full p-2 border rounded"
              rows={2}
              value={p.Notes || ""}
              onChange={e => updateField(p.Id, "Notes", e.target.value)}
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