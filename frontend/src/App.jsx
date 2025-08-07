// On importe les composants nécessaires depuis react-router-dom
import { Routes, Route, Link } from 'react-router-dom';

// On importe les pages de l'application
import Home from './pages/Home';
import About from './pages/About';
import Recap from './pages/Recap';
import Callback from './pages/callback';


import './index.css';

// Composant principal de l'application
function App() {
  return (
    <div className="app-container">
      {/* Routes principales */}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/recap" element={<Recap />} />
        <Route path="/callback" element={<Callback />} /> 
      </Routes>

      <footer className="bottom-nav">
      <Link to="/">Accueil</Link>
      <Link to="/about">À propos</Link>
      <Link to="/about">À propos</Link>
      </footer>
      </div>
  );
}

export default App;