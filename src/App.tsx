import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Toaster } from "react-hot-toast";

import { Provider } from "react-redux";
import { store } from "./redux/store";
import Headers from "./components/Headers";

// Auth Pages
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import ForgotPassword from "./pages/auth/ForgotPassword";

// User Pages
import UserProfile from "./pages/user/UserProfile";
import UserSettings from "./pages/user/UserSettings";

// Team Pages
import Teams from "./pages/team/Teams";
import CreateTeam from "./pages/team/CreateTeam";
import TeamDetails from "./pages/team/TeamDetails";

// Match Pages
import Matches from "./pages/match/Matches";
import CreateMatch from "./pages/match/CreateMatch";
import MatchDetails from "./pages/match/matchDetails";

// Tournament Pages
import Tournaments from "./pages/tournament/Tournaments";
import CreateTournament from "./pages/tournament/CreateTournament";
import TournamentDetails from "./pages/tournament/TournamentDetails";

// Challenge Pages
import Challenges from "./pages/challenge/Challenges";
import CreateChallenge from "./pages/challenge/CreateChallenge";

// Venue Pages
import Venues from "./pages/venue/Venues";
import CreateVenue from "./pages/venue/CreateVenue";
import VenueDetails from "./pages/venue/VenueDetails";
import EditVenue from "./pages/venue/edit-venue";
import ManageSchedules from "./pages/venue/manage-schedules";
import ManageTimeSlots from "./pages/venue/manage-time-slots";

// Game Pages
import Games from "./pages/game/Games";

// Player Profile Pages
import PlayerProfiles from "./pages/player/PlayerProfiles";
import CreatePlayerProfile from "./pages/player/CreatePlayerProfile";

// Notification Pages
import Notifications from "./pages/notification/Notifications";

// Landing Page
import LandingPage from "./pages/LandingPage";

// Protected Route Component
import ProtectedRoute from "./components/ProtectedRoute";
import Dashboard from "./pages/dashboard/Dashboard";
import Invitations from "./pages/dashboard/invitations";
import Profile from "./pages/dashboard/profile";
import EditTeam from "./pages/team/EditTeam";
import GameDetailsPage from "./pages/game/game-details";
import CreateGamePage from "./pages/game/create-game";
import EditGamePage from "./pages/game/edit-game";
import ChallengeDetail from "./pages/challenge/challengeDetails";
import Prac from "./pages/practice/Prac";
import ScoreCard from "./pages/scorecard/ScoreCard";

function App() {
  return (
    <Provider store={store}>
      <Toaster />

      <Router>
        <Headers />
        <Routes>
          {/* Public Routes */}
          <Route path="/prac" element={<Prac />} />
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />

          {/* Protected Routes */}
          <Route element={<ProtectedRoute />}>
            {/* Dashboard Routes */}
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/dashboard/invitations" element={<Invitations />} />
            <Route
              path="/dashboard/notifications"
              element={<Notifications />}
            />
            <Route path="/dashboard/profile" element={<Profile />} />

            {/* User Routes */}
            <Route path="/profile/:id" element={<UserProfile />} />
            <Route path="/settings" element={<UserSettings />} />

            {/* Team Routes */}
            <Route path="/teams" element={<Teams />} />
            <Route path="/teams/create" element={<CreateTeam />} />
            <Route path="/teams/:teamId" element={<TeamDetails />} />
            <Route path="/teams/:id/edit" element={<EditTeam />} />

            {/* Match Routes */}
            <Route path="/matches" element={<Matches />} />
            <Route path="/matches/create" element={<CreateMatch />} />
            <Route path="/matches/:matchId/scorecard" element={<ScoreCard />} />
            <Route path="/matches/:matchId" element={<MatchDetails />} />

            {/* Tournament Routes */}
            <Route path="/tournaments" element={<Tournaments />} />
            <Route path="/tournaments/create" element={<CreateTournament />} />
            <Route path="/tournaments/:id" element={<TournamentDetails />} />

            {/* Challenge Routes */}
            <Route path="/challenges" element={<Challenges />} />
            <Route path="/challenges/:challengeId" element={<ChallengeDetail />} />
            <Route path="/challenges/create" element={<CreateChallenge />} />

            {/* Venue Routes */}
            <Route path="/venues" element={<Venues />} />
            <Route path="/venues/create" element={<CreateVenue />} />
            <Route path="/venues/:venueId" element={<VenueDetails />} />
            <Route path="/venues/:venueId/edit" element={<EditVenue />} />
            <Route
              path="/venues/:venueId/time-slots"
              element={<ManageTimeSlots />}
            />
            <Route
              path="/venues/:venueId/schedules"
              element={<ManageSchedules />}
            />

            {/* Game Routes */}
            <Route path="/games" element={<Games />} />
            <Route path="/games/:id" element={<GameDetailsPage />} />
            <Route path="/games/create" element={<CreateGamePage />} />
            <Route path="/games/:id/edit" element={<EditGamePage />} />

            {/* Player Profile Routes */}
            <Route path="/player-profiles" element={<PlayerProfiles />} />
            <Route
              path="/player-profiles/create"
              element={<CreatePlayerProfile />}
            />

            {/* Notification Routes */}
            <Route path="/notifications" element={<Notifications />} />
          </Route>
        </Routes>
      </Router>
    </Provider>
  );
}

export default App;
