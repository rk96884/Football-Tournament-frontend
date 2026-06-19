import { BrowserRouter, Routes, Route } from "react-router-dom";
import { TournamentProvider } from "./context/TournamentContext";
import Dashboard from "./pages/Dashboard";
import EditSeedTeam from "./pages/EditSeedTeam";
import AdminTournamentsPage from "./pages/AdminTournamentsPage";
import AddTournament from "./pages/AddTournament";
import EditTournament from "./pages/EditTournament";
import TournamentPage from "./pages/TournamentPage";
import AddPlayerPage from "./pages/AddPlayerPage";

function App() {
  return (
    <TournamentProvider>
      <BrowserRouter>
        <div className="min-h-screen bg-gray-100">
          <header className="bg-blue-600 text-white p-4 shadow">
            <h1 className="text-xl font-semibold">Cademy Tournament Manager</h1>
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
      </BrowserRouter>
    </TournamentProvider>
  );
}

export default App;