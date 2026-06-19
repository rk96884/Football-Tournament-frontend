const API_BASE = "/api/tournaments";

export async function fetchTournaments() {
  const res = await fetch(API_BASE);
  return await res.json();
}

export async function fetchTournament(id) {
  const res = await fetch(`${API_BASE}/${id}`);
  return await res.json();
}

export async function updateAttendance(tournamentId, playerId, attending, paid) {
  await fetch(`${API_BASE}/${tournamentId}/attendance`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ playerId, attending, paid })
  });
}
