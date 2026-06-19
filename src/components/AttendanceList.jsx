import PlayerResponse from "./PlayerResponse";

export default function AttendanceList({ tournament, onRespond }) {
  return (
    <div>
      <h3>Attendance</h3>
      {tournament.players.map(p => (
        <div key={p.id}>
          <p>
            {p.name} — {p.attending} — {p.paid ? "Paid" : "Not Paid"}
          </p>
          <PlayerResponse
            player={p}
            onRespond={(attending, paid) => onRespond(p.id, attending, paid)}
          />
        </div>
      ))}
    </div>
  );
}