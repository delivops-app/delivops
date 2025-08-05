// On importe les composants nécessaires depuis react-router-dom
import { Routes, Route, Link } from 'react-router-dom';

// On importe les pages de l'application
import Home from './pages/Home';
import About from './pages/About';

// On importe le layout global qui gère l'apparence (marges, centrage, etc.)
import AppLayout from './components/AppLayout';

// Composant principal de l'application
function App() {
  return (
    <AppLayout>
      {/* Barre de navigation en haut de la page */}
      <nav className="mb-6 flex gap-6 text-blue-600 font-semibold text-lg">
        <Link to="/" className="hover:underline">Accueil</Link>
        <Link to="/about" className="hover:underline">À propos</Link>
      </nav>

      {/* Définition des routes visibles selon l’URL */}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
      </Routes>
    </AppLayout>
  );
}

// On exporte le composant pour l’utiliser dans main.jsx
export default App;