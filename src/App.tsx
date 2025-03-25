
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import  { Toaster } from 'react-hot-toast';

import { Provider } from 'react-redux';
import { store } from './redux/store';

// Auth Pages
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import ForgotPassword from './pages/auth/ForgotPassword';

// User Pages
import UserProfile from './pages/user/UserProfile';
import UserSettings from './pages/user/UserSettings';

// Team Pages
import Teams from './pages/team/Teams';
import CreateTeam from './pages/team/CreateTeam';
import TeamDetails from './pages/team/TeamDetails';

// Match Pages
import Matches from './pages/match/Matches';
import CreateMatch from './pages/match/CreateMatch';
import MatchDetails from './pages/match/MatchDetails';

// Tournament Pages
import Tournaments from './pages/tournament/Tournaments';
import CreateTournament from './pages/tournament/CreateTournament';
import TournamentDetails from './pages/tournament/TournamentDetails';

// Challenge Pages
import Challenges from './pages/challenge/Challenges';
import CreateChallenge from './pages/challenge/CreateChallenge';

// Venue Pages
import Venues from './pages/venue/Venues';
import CreateVenue from './pages/venue/CreateVenue';
import VenueDetails from './pages/venue/VenueDetails';

// Game Pages
import Games from './pages/game/Games';

// Player Profile Pages
import PlayerProfiles from './pages/player/PlayerProfiles';
import CreatePlayerProfile from './pages/player/CreatePlayerProfile';

// Notification Pages
import Notifications from './pages/notification/Notifications';

// Landing Page
import LandingPage from './pages/LandingPage';

// Protected Route Component
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  return (
    <Provider store={store}>
      <Toaster/>
      <Router>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />

          {/* Protected Routes */}
          <Route element={<ProtectedRoute />}>
            {/* User Routes */}
            <Route path="/profile/:id" element={<UserProfile />} />
            <Route path="/settings" element={<UserSettings />} />

            {/* Team Routes */}
            <Route path="/teams" element={<Teams />} />
            <Route path="/teams/create" element={<CreateTeam />} />
            <Route path="/teams/:id" element={<TeamDetails />} />

            {/* Match Routes */}
            <Route path="/matches" element={<Matches />} />
            <Route path="/matches/create" element={<CreateMatch />} />
            <Route path="/matches/:id" element={<MatchDetails />} />

            {/* Tournament Routes */}
            <Route path="/tournaments" element={<Tournaments />} />
            <Route path="/tournaments/create" element={<CreateTournament />} />
            <Route path="/tournaments/:id" element={<TournamentDetails />} />

            {/* Challenge Routes */}
            <Route path="/challenges" element={<Challenges />} />
            <Route path="/challenges/create" element={<CreateChallenge />} />

            {/* Venue Routes */}
            <Route path="/venues" element={<Venues />} />
            <Route path="/venues/create" element={<CreateVenue />} />
            <Route path="/venues/:id" element={<VenueDetails />} />

            {/* Game Routes */}
            <Route path="/games" element={<Games />} />

            {/* Player Profile Routes */}
            <Route path="/player-profiles" element={<PlayerProfiles />} />
            <Route path="/player-profiles/create" element={<CreatePlayerProfile />} />

            {/* Notification Routes */}
            <Route path="/notifications" element={<Notifications />} />
          </Route>
        </Routes>
      </Router>
    </Provider>
  );
}

export default App;