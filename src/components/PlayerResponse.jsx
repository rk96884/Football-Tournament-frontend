export default function PlayerResponse({ player, onRespond }) {
  return (
    <div>
      <button onClick={() => onRespond("yes", player.paid)}>Yes</button>
      <button onClick={() => onRespond("no", player.paid)}>No</button>
      <button onClick={() => onRespond("maybe", player.paid)}>Maybe</button>
      <button onClick={() => onRespond(player.attending, !player.paid)}>
        Mark as {player.paid ? "Unpaid" : "Paid"}
      </button>
    </div>
  );
}