import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTournaments } from "../context/TournamentContext";
import { API_BASE } from "../api";

export default function NewTournamentPage() {
  const navigate = useNavigate();
  const { fetchTournaments } = useTournaments();

  const [form, setForm] = useState({
    name: "",
    date: "",
    address: "",
    parking: "",
    costPerPlayer: 0,
    notes: "",
    meetTime: "",
    kickOffTime: ""
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const isoDate = new Date(`${form.date}:00`).toISOString();

    const body = {
      name: form.name,
      date: isoDate,
      meetTime: form.meetTime,
      kickOffTime: form.kickOffTime,
      costPerPlayer: parseFloat(form.costPerPlayer),
      notes: form.notes,
      location: {
        address: form.address,
        parking: form.parking,
        mapUrl: ""
      }
    };


    await fetch(`${API_BASE}/api/tournaments`, {
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
        <div className="relative">
          <input
            type="time"
            name="meetTime"
            value={form.meetTime}
            onChange={handleChange}
            className="w-full p-2 border rounded"
            required
          />

          {!form.meetTime && (
            <span className="absolute left-3 top-2 text-gray-400 pointer-events-none">
              Meet Time
            </span>
          )}
        </div>

        <div className="relative">
          <input
            type="time"
            name="kickOffTime"
            value={form.kickOffTime}
            onChange={handleChange}
            className="w-full p-2 border rounded"
            required
          />

          {!form.kickOffTime && (
            <span className="absolute left-3 top-2 text-gray-400 pointer-events-none">
              Kick-Off Time
            </span>
          )}
        </div>

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