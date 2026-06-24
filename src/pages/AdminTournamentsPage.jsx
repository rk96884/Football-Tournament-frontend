import TournamentList from "../components/TournamentList";
import { useTournaments } from "../context/TournamentContext";
import { Link } from "react-router-dom";

export default function TournamentsPage() {
  const { tournaments } = useTournaments();

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <div className="flex gap-2">
          <Link
            to="/tournaments/seed/edit"
            className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition"
          >
            Edit Master Seed Team
          </Link>
          <Link
            to="/tournaments/add"
            className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition"
          >
            + Add Tournament
          </Link>

        </div>
      </div>

      <TournamentList tournaments={tournaments} />
    </div>
  );
}