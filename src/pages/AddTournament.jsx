import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTournaments } from "../context/TournamentContext";
import { API_BASE } from "../TournamentsApi";

export default function NewTournamentPage() {
  const navigate = useNavigate();
  const { fetchTournaments } = useTournaments();

  const [form, setForm] = useState({
    name: "",
    date: "",
    address: "",
    parking: "",
    costPerPlayer: 0,
    notes: ""
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const body = {
      Name: form.name,
      Date: form.date,
      CostPerPlayer: parseFloat(form.costPerPlayer),
      Notes: form.notes,
      Location: {
        Address: form.address,
        Parking: form.parking
      }
    };

    await fetch("${API_BASE}/api/tournaments", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body)
    });

    // ⭐ Refresh tournaments instantly
    await fetchTournaments();

    // Navigate back to list
    navigate("/tournaments");
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Add Tournament</h2>

      <form onSubmit={handleSubmit} className="space-y-4">

        <input
          name="name"
          placeholder="Tournament Name"
          className="w-full p-2 border rounded"
          value={form.name}
          onChange={handleChange}
          required
        />

        <input
          name="date"
          type="datetime-local"
          className="w-full p-2 border rounded"
          value={form.date}
          onChange={handleChange}
          required
        />

        <input
          name="address"
          placeholder="Address"
          className="w-full p-2 border rounded"
          value={form.address}
          onChange={handleChange}
          required
        />

        <input
          name="parking"
          placeholder="Parking Info"
          className="w-full p-2 border rounded"
          value={form.parking}
          onChange={handleChange}
        />

        <input
          name="costPerPlayer"
          type="number"
          step="0.01"
          placeholder="Cost Per Player"
          className="w-full p-2 border rounded"
          value={form.costPerPlayer}
          onChange={handleChange}
        />
        <textarea
          name="notes"
          placeholder="Notes (e.g. pitch type, arrival instructions)"
          className="w-full p-2 border rounded"
          rows={2}
          value={form.notes}
          onChange={handleChange}
        />

        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Save Tournament
        </button>
      </form>
    </div>
  );
}