// On importe les composants nécessaires depuis react-router-dom
import { Routes, Route, Link } from 'react-router-dom';

// On importe les pages de l'application
import Home from './pages/Home';
import About from './pages/About';

// Composant principal de l'application
function App() {
  return (
    <div>
      {/* Barre de navigation simple */}
      <nav style={{ marginBottom: '1rem' }}>
        <Link to="/" style={{ marginRight: '1rem', textDecoration: 'none' }}>Accueil</Link>
        <Link to="/about" style={{ textDecoration: 'none' }}>À propos</Link>
      </nav>

      {/* Routes principales */}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
      </Routes>
    </div>
  );
}

export default App;