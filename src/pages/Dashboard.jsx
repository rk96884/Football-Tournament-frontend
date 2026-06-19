import { useTournaments } from "../context/TournamentContext";
import TournamentList from "../components/TournamentList";

export default function Dashboard() {
  const { tournaments } = useTournaments();

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6 text-gray-800">
        Upcoming Tournaments
      </h2>

      <TournamentList tournaments={tournaments} />
    </div>
  );
}