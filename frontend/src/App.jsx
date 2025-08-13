// On importe les composants nécessaires depuis react-router-dom
import { Routes, Route, Link, Navigate, Outlet } from 'react-router-dom';

// On importe les pages de l'application
import Home from './pages/Home';
import About from './pages/About';
import Recap from './pages/Recap';
import Callback from './pages/Callback'; // vérifie bien la casse du fichier

import { useAuth0 } from "@auth0/auth0-react";
import GuardRole from "./components/GuardRole.jsx";
import SetupOrg from "./pages/SetupOrg.jsx";
import Manager from "./pages/Manager.jsx"; // garde l'extension cohérente
import './index.css';

// Layout public
function PublicLayout() {
  return (
    <div className="app-container">
      <Outlet />
      <footer className="bottom-nav">
        <Link to="/">Accueil</Link>
        <Link to="/about">À propos</Link>
        <Link to="/app/manager">Manager</Link>
      </footer>
    </div>
  );
}

// Layout protégé (manager)
function PrivateLayout() {
  return (
    <div className="app-container">
      <nav style={{ padding: 12, display: "flex", gap: 12, borderBottom: "1px solid #eee" }}>
        <Link to="/app/manager">Manager</Link>
        <Link to="/app/setup">Setup</Link>
        <Link to="/">← Public</Link>
      </nav>
      <Outlet />
    </div>
  );
}

// Composant principal
export default function App() {
  const { isLoading } = useAuth0();
  if (isLoading) return <div style={{ padding: 24 }}>Chargement…</div>;

  return (
      <Routes>
        {/* Layout public */}
        <Route element={<PublicLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/recap" element={<Recap />} />
          <Route path="/callback" element={<Callback />} />
        </Route>

        {/* Layout protégé (manager only) */}
        <Route
          path="/app"
          element={
            <GuardRole needed="manager">
              <PrivateLayout />
            </GuardRole>
          }
        >
          <Route index element={<Navigate to="manager" replace />} />
          <Route path="manager" element={<Manager />} />
          <Route path="setup" element={<SetupOrg />} />
        </Route>

        {/* Not found */}
        <Route path="*" element={<div style={{ padding: 24 }}>Not found</div>} />
      </Routes>
  );
}
