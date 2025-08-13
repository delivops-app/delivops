// On importe les composants nécessaires depuis react-router-dom
import { Routes, Route, Link } from 'react-router-dom';

// On importe les pages de l'application
import Home from './pages/Home';
import About from './pages/About';
import Recap from './pages/Recap';
import Callback from './pages/callback';

import { useAuth0 } from "@auth0/auth0-react";
import Manager from "./pages/Manager";
import './index.css';


// Composant principal
export default function App() {
  const { isLoading } = useAuth0();
  if (isLoading) return <div>Chargement…</div>;

  return (
    <div className="app-container">
      {/* Routes principales */}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/recap" element={<Recap />} />
        <Route path="/callback" element={<Callback />} />
        <Route path="/manager" element={<Manager />} />
      </Routes>

      <footer className="bottom-nav">
        <Link to="/">Accueil</Link>
        <Link to="/about">À propos</Link>
      </footer>
    </div>
  );
}