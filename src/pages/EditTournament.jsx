import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

export default function EditTournament() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [form, setForm] = useState(null);

  useEffect(() => {
    const load = async () => {
      const res = await fetch(`http://localhost:5201/api/tournaments/${id}`);
      const data = await res.json();

      setForm({
        name: data.Name,
        date: data.Date,
        address: data.Location?.Address || "",
        parking: data.Location?.Parking || "",
        costPerPlayer: data.CostPerPlayer,
        notes: data.Notes ?? ""
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
      id: parseInt(id),
      name: form.name,
      date: form.date,
      costPerPlayer: parseFloat(form.costPerPlayer),
      notes: form.notes,   // ⭐ FIXED (was Notes)
      location: {          // ⭐ FIXED (was Location)
        address: form.address,   // ⭐ FIXED (was Address)
        parking: form.parking    // ⭐ FIXED (was Parking)
      }

    };
    console.log("Submitting Notes:", form.notes);
    await fetch(`http://localhost:5201/api/tournaments/${id}`, {
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