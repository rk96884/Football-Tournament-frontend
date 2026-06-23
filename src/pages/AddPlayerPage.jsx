import { useEffect, useState, useCallback } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { API_BASE } from "../api";


export default function AddPlayer() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [tournament, setTournament] = useState(null);
  const [name, setName] = useState("");

  const loadTournament = useCallback(async () => {
    try {
      const res = await fetch(`${API_BASE}/api/tournaments/${id}`);
      const data = await res.json();
      setTournament(data);
    } catch (err) {
      console.error("Error loading tournament:", err);
    }
  }, [id, baseUrl]);


  useEffect(() => {
    loadTournament();
  }, [loadTournament]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const newPlayer = {
      Name: name,
      TournamentId: Number(id),
      Attending: "unanswered",
      Paid: false,
      AmountPaid: 0,
      AmountOwed: tournament?.CostPerPlayer || 0,
      Notes: ""
    };

    await fetch(`${API_BASE}/api/players/${id}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newPlayer),
    });


    navigate(`/tournaments/${id}`);
  };

  if (!tournament) return <p className="p-6">Loading...</p>;

  return (
    <div className="p-6 space-y-6 bg-[#F2F2F7] min-h-screen">
      <button
        onClick={() => navigate(-1)}
        className="text-gray-600 hover:text-gray-800 text-sm"
      >
        ← Back
      </button>

      <h2 className="text-3xl font-semibold text-gray-900">
        Add Player to {tournament.Name}
      </h2>

      <form onSubmit={handleSubmit} className="space-y-4 bg-white p-4 rounded-xl border border-gray-200">
        <input
          type="text"
          placeholder="Player name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full p-3 border rounded-lg"
          required
        />

        <button
          type="submit"
          className="bg-gray-900 text-white px-4 py-2 rounded-lg text-sm"
        >
          Add Player
        </button>
      </form>
    </div>
  );
}