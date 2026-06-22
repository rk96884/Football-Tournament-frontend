import { useTournaments } from "../context/TournamentContext";
import TournamentList from "../components/TournamentList";

export default function Dashboard() {
  const { tournaments } = useTournaments();

  return (
    <div>
      <TournamentList tournaments={tournaments} />
    </div>
  );
}