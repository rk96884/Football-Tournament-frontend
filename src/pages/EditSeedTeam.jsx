import { useEffect, useState } from "react";
import { API_BASE } from "../TournamentsApi";

export default function EditSeedTeam() {
  const [players, setPlayers] = useState([]);

  // Load seed players on mount
  useEffect(() => {
    const load = async () => {
      const res = await fetch("${API_BASE}/api/seed/seed");
      const data = await res.json();
      setPlayers(data);
    };
    load();
  }, []);

  // Update a single field on a player
  const updateField = (id, field, value) => {
    setPlayers(prev =>
      prev.map(p =>
        p.Id === id ? { ...p, [field]: value } : p
      )
    );
  };

  // Save all changes
  const save = async () => {
    await fetch("${API_BASE}/api/seed/seed", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(players)
    });
    alert("Seed team updated");
  };

  // Add a new blank seed player
 const addPlayer = () => {
  setPlayers(prev => {
    const nextId = prev.length ? Math.max(...prev.map(p => p.Id)) + 1 : 1;

    const newPlayer = {
      Id: nextId,
      Name: "New Player",
      AmountOwed: 0,
      AmountPaid: 0,
      Paid: false,
      Notes: ""
    };

    return [newPlayer, ...prev]; // ⬅️ Put new player at the top
  });
};


  // Delete a player
  const deletePlayer = (id) => {
    setPlayers(prev => prev.filter(p => p.Id !== id));
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Edit Seed Team</h2>

      {/* Add Player Button */}
      <button
        type="button"
        onClick={addPlayer}
        className="mb-4 bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
      >
        + Add Seed Player
      </button>

      {/* Player List */}
      <div className="space-y-4">
        {players.map(p => (
          <div key={p.Id} className="p-4 border rounded-lg bg-white">

            {/* Name + Delete */}
            <div className="flex justify-between items-center mb-2">
              <input
                className="w-full p-2 border rounded"
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

            {/* Amounts + Paid */}
            <div className="flex gap-4">
              <input
                type="number"
                className="p-2 border rounded"
                value={p.AmountOwed}
                onChange={e =>
                  updateField(
                    p.Id,
                    "AmountOwed",
                    e.target.value === "" ? 0 : parseFloat(e.target.value)
                  )
                }
              />

              <input
                type="number"
                className="p-2 border rounded"
                value={p.AmountPaid}
                onChange={e =>
                  updateField(
                    p.Id,
                    "AmountPaid",
                    e.target.value === "" ? 0 : parseFloat(e.target.value)
                  )
                }
              />

              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={p.Paid}
                  onChange={e => updateField(p.Id, "Paid", e.target.checked)}
                />
                Paid
              </label>
            </div>

            {/* Notes */}
            <textarea
              className="w-full p-2 border rounded mt-2"
              rows={2}
              value={p.Notes || ""}
              onChange={e => updateField(p.Id, "Notes", e.target.value)}
            />
          </div>
        ))}
      </div>

      {/* Save Button */}
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