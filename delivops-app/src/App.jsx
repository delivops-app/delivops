// On importe les composants nécessaires depuis la librairie react-router-dom
// - Routes : pour regrouper toutes les routes de l’application
// - Route : pour définir une correspondance entre une URL et un composant
// - Link : pour créer des liens de navigation sans recharger la page
import { Routes, Route, Link } from 'react-router-dom';

// On importe les composants des pages que l’on souhaite afficher selon l’URL
import Home from './pages/Home';
import About from './pages/About';

// Composant principal de l’application
function App() {
  return (
    <div>
      {/* Barre de navigation simple avec deux liens.
          <Link> est une alternative à <a>, mais sans recharger la page */}
      <nav style={{ marginBottom: '1rem' }}>
        <Link to="/">Accueil</Link> | <Link to="/about">À propos</Link>
      </nav>

      {/* Définition des routes de l’application.
          Chaque <Route> associe un chemin (path) à un composant à afficher (element) */}
      <Routes>
        {/* Si l’URL est exactement '/', on affiche le composant Home */}
        <Route path="/" element={<Home />} />

        {/* Si l’URL est '/about', on affiche le composant About */}
        <Route path="/about" element={<About />} />
      </Routes>
    </div>
  );
}

// On exporte le composant App pour qu’il soit utilisé ailleurs (notamment dans main.jsx)
export default App;