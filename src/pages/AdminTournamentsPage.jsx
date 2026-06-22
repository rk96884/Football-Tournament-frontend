import TournamentList from "../components/TournamentList";
import { useTournaments } from "../context/TournamentContext";
import { Link } from "react-router-dom";

export default function TournamentsPage() {
  const { tournaments } = useTournaments();
  const location = useLocation();

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold">Upcoming Tournaments</h2>

        <div className="flex gap-2">
          <Link
            to="/editseedteam" state={{ from: location.pathname }}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg shadow hover:bg-blue-700 transition"
          >
            Edit Team
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