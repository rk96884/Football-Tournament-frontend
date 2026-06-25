import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { API_BASE } from "../api";

export default function EditTournament() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [form, setForm] = useState(null);

  useEffect(() => {
    const load = async () => {
      const res = await fetch(`${API_BASE}/api/tournaments/${id}`);
      const data = await res.json();

      function toLocalInputValue(dateString) {
        const d = new Date(dateString);
        const pad = (n) => n.toString().padStart(2, "0");
        return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
      }
      setForm({
        name: data.Name,
        date: toLocalInputValue(data.Date),
        address: data.Location?.Address || "",
        parking: data.Location?.Parking || "",
        mapUrl: data.Location?.MapUrl || "",
        costPerPlayer: data.CostPerPlayer,
        notes: data.Notes ?? "",
        meetTime: data.MeetTime ?? "",
        kickOffTime: data.KickOffTime ?? ""
      });

    };

    load();
  }, [id]);


  if (!form) return <div className="p-6">Loading...</div>;

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const body = {
      name: form.name,
      date: new Date(`${form.date}:00`).toISOString(),
      meetTime: form.meetTime,
      kickOffTime: form.kickOffTime,
      costPerPlayer: parseFloat(form.costPerPlayer),
      notes: form.notes,
      location: {
        address: form.address,
        parking: form.parking,
        mapUrl: form.mapUrl || ""
      }
    };

    await fetch(`${API_BASE}/api/tournaments/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body)
    });

    navigate(`/tournaments/${id}`);
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Edit Tournament</h2>

      <form onSubmit={handleSubmit} className="space-y-4">

        <input
          name="name"
          className="w-full p-2 border rounded"
          value={form.name}
          onChange={handleChange}
        />

        <input
          name="date"
          type="datetime-local"
          className="w-full p-2 border rounded"
          value={form.date}
          onChange={handleChange}
        />

        <input
          name="address"
          className="w-full p-2 border rounded"
          value={form.address}
          onChange={handleChange}
        />
        <div className="relative">
          <input
            type="time"
            name="meetTime"
            value={form.meetTime}
            placeholder=" "
            onChange={handleChange}
            className="w-full p-2 border rounded"
            required
          />

          {(form.meetTime === "" || form.meetTime === null) && (
            <span className="absolute left-3 top-2 text-gray-400 pointer-events-none">
              Meet Time
            </span>
          )}
        </div>
        <div className="relative">
          <input
            type="time"
            name="kickOffTime"
            placeholder=" "
            value={form.kickOffTime}
            onChange={handleChange}
            className="w-full p-2 border rounded"
            required
          />

          {(form.kickOffTime === "" || form.kickOffTime === null) && (
            <span className="absolute left-3 top-2 text-gray-400 pointer-events-none">
              Kick-Off Time
            </span>
          )}
        </div>

        <input
          name="parking"
          className="w-full p-2 border rounded"
          value={form.parking}
          onChange={handleChange}
        />

        <input
          name="costPerPlayer"
          type="number"
          step="0.01"
          className="w-full p-2 border rounded"
          value={form.costPerPlayer}
          onChange={handleChange}
        />

        <textarea
          name="notes"
          className="w-full p-2 border rounded"
          rows={3}
          value={form.notes}
          onChange={handleChange}
        />

        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Save Changes
        </button>
      </form>
    </div>
  );
}