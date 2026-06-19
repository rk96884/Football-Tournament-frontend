import { createContext, useContext, useState, useEffect } from "react";

const TournamentContext = createContext();

export function TournamentProvider({ children }) {
  const [tournaments, setTournaments] = useState([]);

  // ⭐ Extract fetch logic into a function
  const fetchTournaments = async () => {
    try {
      const res = await fetch("http://localhost:5201/api/tournaments");
      const data = await res.json();
      setTournaments(data);
    } catch (err) {
      console.error("Failed to load tournaments:", err);
    }
  };

  // Load tournaments on mount
  useEffect(() => {
    fetchTournaments();
  }, []);

  const getTournament = (id) => {
    return tournaments.find(t => t.id === parseInt(id));
  };

  const updatePlayerResponse = (tournamentId, playerId, attending, paid) => {
    setTournaments(prev =>
      prev.map(t =>
        t.id === tournamentId
          ? {
              ...t,
              players: t.players.map(p =>
                p.id === playerId
                  ? { ...p, attending, paid }
                  : p
              )
            }
          : t
      )
    );
  };

  return (
    <TournamentContext.Provider value={{
      tournaments,
      fetchTournaments,   // ⭐ expose it here
      updatePlayerResponse,
      getTournament
    }}>
      {children}
    </TournamentContext.Provider>
  );
}

export function useTournaments() {
  return useContext(TournamentContext);
}