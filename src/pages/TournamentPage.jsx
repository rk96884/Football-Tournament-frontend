import { useEffect, useState, useCallback } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { API_BASE } from "../api";
import {
  ArrowLeftIcon,
  MapPinIcon,
  MapIcon,
  PencilSquareIcon,
  ClockIcon,
  FlagIcon
} from "@heroicons/react/24/solid";

export default function TournamentPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [tournament, setTournament] = useState(null);
  const setSavingPlayerId = useState(null)[1];

  const loadTournament = useCallback(async () => {
    try {
      const res = await fetch(`${API_BASE}/api/tournaments/${id}`);
      const data = await res.json();
      setTournament(data);
    } catch (err) {
      console.error("Error loading tournament:", err);
    }
  }, [id]);

  useEffect(() => {
    loadTournament();
  }, [loadTournament]);

  if (!tournament) {
    return <div className="p-4">Loading tournament...</div>;
  }

  const savePlayer = async (player) => {
    setSavingPlayerId(player.Id);

    const payload = {
      Id: player.Id,
      Name: player.Name,
      TournamentId: player.TournamentId,
      Attending: player.Attending,
      Paid: player.Paid,
      AmountPaid: player.AmountPaid,
      AmountOwed: player.AmountOwed,
      Notes: player.Notes
    };

    try {
      await fetch(`${API_BASE}/api/players/${player.Id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      await loadTournament();
    } catch (err) {
      console.error("Error updating player:", err);
    } finally {
      setSavingPlayerId(null);
    }
  };

  const handleAttendanceChange = async (player, status) => {
    await savePlayer({
      ...player,
      Attending: status,
      AmountPaid: player.AmountPaid,
      AmountOwed: player.AmountOwed
    });
  };


  const handlePaidToggle = async (player) => {
    const newPaid = !player.Paid;

    await savePlayer({
      ...player,
      Paid: newPaid,
      AmountPaid: newPaid ? player.AmountOwed : 0,
      AmountOwed: player.AmountOwed
    });
  };



  const handleNotesChange = (playerId, value) => {
    setTournament((prev) => ({
      ...prev,
      Players: prev.Players.map((p) =>
        p.Id === playerId ? { ...p, Notes: value } : p
      ),
    }));
  };

  const handleNotesBlur = (player) => {
    savePlayer(player);
  };
  const handleEdit = () => {
    navigate(`/tournaments/${tournament.Id}/edit`);
  };

  const handleDelete = async () => {
    if (!window.confirm("Delete this tournament?")) return;

    await fetch(`${API_BASE}/api/tournaments/${id}`, {
      method: "DELETE",
    });

    navigate("/tournaments");
  };

  if (!tournament) return <p className="p-6">Loading...</p>;

  // Attendance summary
  const players = tournament?.Players || [];
  const attending = players.filter(p => p.Attending === "attending").length;
  const declined = tournament.Players.filter((p) => p.Attending === "declined").length;
  const unanswered = tournament.Players.filter((p) => p.Attending === "unanswered").length;

  // Sort players
  const sortedPlayers = [...tournament.Players].sort((a, b) =>
    a.Name.localeCompare(b.Name)
  );

  // Tailwind-safe attendance styles
  const attendanceStyles = {
    attending: "bg-green-100 border-green-400 text-green-800",
    declined: "bg-red-100 border-red-400 text-red-800",
    unanswered: "bg-amber-100 border-amber-400 text-amber-800",
  };

  const formatTime = (timeString) => {
    if (!timeString) return "—";

    const [hour, minute] = timeString.split(":").map(Number);

    const date = new Date();
    date.setHours(hour, minute);

    return date.toLocaleTimeString([], {
      hour: "numeric",
      minute: "2-digit"
    });
  };


  return (
    <div className="p-6 space-y-6 bg-[#F2F2F7] min-h-screen">

      <div className="flex items-center justify-between mb-4">
        {/* Title on the left */}
        <h2 className="text-3xl font-semibold text-gray-900">
          {tournament.Name}
        </h2>

        {/* Back button on the right */}
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-1 text-gray-600 hover:text-gray-800 text-sm"
        >
          <ArrowLeftIcon className="h-4 w-4" />
          Back
        </button>
      </div>

      {/* Tournament Details Block */}
      {tournament.Location && (
        <div className="bg-white p-4 rounded-xl border border-gray-200 space-y-4">

          {/* Address */}
          <div className="flex items-start gap-3">
            <MapPinIcon className="h-6 w-6 text-blue-600 flex-shrink-0" />
            <div>
              <p className="text-gray-800 font-medium">
                {tournament.Location.Address}
              </p>

              <a
                href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
                  tournament.Location.Address
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 text-sm hover:underline flex items-center gap-1 mt-1"
              >
                <MapIcon className="h-4 w-4" />
                Open in Maps
              </a>
            </div>
          </div>

          {/* ⭐ Meet Time */}
          <div className="flex items-start gap-3 mt-4">
            <ClockIcon className="h-6 w-6 text-blue-600 flex-shrink-0" />
            <div>
              <p className="text-gray-800 font-medium">Meet Time</p>
              <p className="text-gray-700">{formatTime(tournament.meetTime)}</p>
            </div>
          </div>

          {/* ⭐ Kick-Off Time */}
          <div className="flex items-start gap-3 mt-3">
            <FlagIcon className="h-6 w-6 text-blue-600 flex-shrink-0" />
            <div>
              <p className="text-gray-800 font-medium">Kick-Off Time</p>
              <p className="text-gray-700">{formatTime(tournament.kickOffTime)}</p>
            </div>
          </div>

          {/* Parking */}
          {tournament.Location.Parking && (
            <div className="flex items-start gap-3">
              <span className="text-blue-600 text-lg leading-none">🚗</span>
              <p className="text-gray-700 text-sm">
                Parking: {tournament.Location.Parking}
              </p>
            </div>
          )}


          {/* Notes */}
          {tournament.Notes && (
            <div className="flex items-start gap-3">
              <PencilSquareIcon className="h-6 w-6 text-blue-600 flex-shrink-0" />
              <p className="text-gray-800 whitespace-pre-line">
                {tournament.Notes}
              </p>
            </div>
          )}
        </div>
      )}

      {/* Attendance Summary */}
      <div className="bg-white p-4 rounded-xl border border-gray-200 flex items-center gap-6 text-sm font-medium">

        <div className="flex items-center gap-2 text-green-700">
          <span className="inline-block w-2 h-2 rounded-full bg-green-500"></span>
          {attending} attending
        </div>

        <div className="flex items-center gap-2 text-amber-700">
          <span className="inline-block w-2 h-2 rounded-full bg-amber-500"></span>
          {unanswered} unanswered
        </div>

        <div className="flex items-center gap-2 text-red-700">
          <span className="inline-block w-2 h-2 rounded-full bg-red-500"></span>
          {declined} declined
        </div>

      </div>


      {/* Actions */}
      <div className="flex gap-3">
        <button
          onClick={handleEdit}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-blue-700"
        >
          Edit Tournament
        </button>

        <button
          onClick={handleDelete}
          className="bg-red-600 text-white px-4 py-2 rounded-lg text-sm"
        >
          Delete Tournament
        </button>
        <button
          onClick={() => navigate(`/tournaments/${tournament.Id}/add-player`)}
          className="bg-gray-900 text-white px-4 py-2 rounded-lg text-sm"
        >
          Add Player
        </button>
      </div>

      {/* Payment Summary */}
      <div className="bg-white p-4 rounded-xl border border-gray-200 flex justify-between items-center text-sm">
        <div className="flex flex-col">
          <span className="text-gray-500">Total Expected</span>
          <span className="text-lg font-semibold text-gray-900">
            £{players.reduce((sum, p) => sum + (p.AmountOwed || 0), 0).toFixed(2)}
          </span>
        </div>

        <div className="flex flex-col">
          <span className="text-gray-500">Total Collected</span>
          <span className="text-lg font-semibold text-green-700">
            £{players.reduce((sum, p) => sum + (p.AmountPaid || 0), 0).toFixed(2)}
          </span>
        </div>

        <div className="flex flex-col">
          <span className="text-gray-500">Remaining</span>
          <span className="text-lg font-semibold text-red-600">
            £{(
              players.reduce((sum, p) => sum + (p.AmountOwed || 0), 0) -
              players.reduce((sum, p) => sum + (p.AmountPaid || 0), 0)
            ).toFixed(2)}
          </span>
        </div>
      </div>


      {/* Players */}
      <h3 className="text-xl font-semibold text-gray-900">Players</h3>

      <div className="bg-white rounded-xl border border-gray-200 divide-y divide-gray-200">
        {sortedPlayers.map((player) => (
          <div key={player.Id} className="p-4 space-y-4">

            {/* Name + Payment Toggle */}
            <div className="flex justify-between items-center">
              <div>
                <div className="text-lg font-medium text-gray-900">{player.Name}</div>
                <div className="text-sm text-gray-500">
                  Owed £{player.AmountOwed?.toFixed(2)} • Paid £{player.AmountPaid?.toFixed(2)}
                </div>
              </div>

              <div className="flex items-center gap-3">
                {/* Label */}
                <span
                  className={`text-sm font-medium ${player.Paid ? "text-green-700" : "text-gray-500"
                    }`}
                >
                  {player.Paid ? "Paid" : "Unpaid"}
                </span>

                {/* Toggle */}
                <button
                  onClick={() => handlePaidToggle(player)}
                  className={`relative w-12 h-6 rounded-full transition-colors flex-shrink-0 ${player.Paid ? "bg-green-500" : "bg-gray-300"
                    }`}
                >
                  <span
                    className={`absolute top-0.5 h-5 w-5 bg-white rounded-full shadow transition-all duration-300 ease-out ${player.Paid
                      ? "right-0.5 scale-100"
                      : "left-0.5 scale-95"
                      }`}
                  ></span>
                </button>
              </div>

            </div>

            {/* Attendance Pills */}
            <div className="flex gap-2">
              {[
                { key: "attending", label: "Attending" },
                { key: "declined", label: "Declined" },
                { key: "unanswered", label: "Unanswered" },
              ].map((opt) => (
                <button
                  key={opt.key}
                  onClick={() => handleAttendanceChange(player, opt.key)}
                  className={`flex-1 px-3 py-2 rounded-full text-sm border transition ${player.Attending === opt.key
                    ? attendanceStyles[opt.key]
                    : "bg-gray-100 border-gray-200 text-gray-600"
                    }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>

            {/* Notes */}
            <textarea
              className="w-full bg-gray-100 rounded-lg p-3 text-sm text-gray-700 focus:bg-white focus:ring-2 focus:ring-gray-300 transition"
              rows={2}
              value={player.Notes || ""}
              onChange={(e) => handleNotesChange(player.Id, e.target.value)}
              onBlur={() => handleNotesBlur(player)}
              placeholder="Notes..."
            />
          </div>
        ))}
      </div>
    </div>
  );
}