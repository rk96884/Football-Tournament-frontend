import { HashRouter, Routes, Route } from "react-router-dom";
import { Link } from "react-router-dom";
import { TournamentProvider } from "./context/TournamentContext";
import Dashboard from "./pages/Dashboard";
import EditSeedTeam from "./pages/EditSeedTeam";
import AdminTournamentsPage from "./pages/AdminTournamentsPage";
import AddTournament from "./pages/AddTournament";
import EditTournament from "./pages/EditTournament";
import TournamentPage from "./pages/TournamentPage";
import AddPlayerPage from "./pages/AddPlayerPage";
import logo from "../images/logo.png";

function App() {
  return (
    <TournamentProvider>
      <HashRouter >
        <div className="min-h-screen bg-gray-100">
          <header className="flex items-center gap-3 bg-blue-600 text-white p-4">
            <Link to="/">
              <img
                src={logo}
                alt="Tournament Logo"
                className="h-10 w-10 object-contain cursor-pointer"
              />
            </Link>
            <h1 className="text-xl font-bold">Cademy Tournament Manager</h1>
          </header>

          <main className="max-w-3xl mx-auto p-4">
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/tournaments/editseedteam" element={<EditSeedTeam />} />
              <Route path="/tournaments" element={<AdminTournamentsPage />} />
              <Route path="/tournaments/add" element={<AddTournament />} />
              <Route path="/tournaments/:id/edit" element={<EditTournament />} />
              <Route path="/tournaments/:id" element={<TournamentPage />} />
              <Route path="/tournaments/:id/add-player" element={<AddPlayerPage />} />
            </Routes>
          </main>
        </div>
      </HashRouter >
    </TournamentProvider>
  );
}

export default App;