// src/App.jsx
import { Routes, Route, Navigate, Link } from "react-router-dom"; // Outils pour définir les routes et naviguer.
import { useAuth0 } from "@auth0/auth0-react";                    // Hook pour connaître l’état d’auth.
import Login from "./pages/Login";                                 // Page /login (déclenche Auth0).
import Dashboard from "./pages/Dashboard";                         // Page /dashboard (protégée).

function RequireAuth({ children }) {                               // Petite garde d’accès pour les routes protégées.
  const { isAuthenticated, isLoading } = useAuth0();               // Récupère état de chargement et d’auth.
  if (isLoading) return <p style={{ textAlign: "center", marginTop: 40 }}>Chargement…</p>; // Affiche un état d’attente.
  return isAuthenticated ? children : <Navigate to="/login" replace />; // Si connecté → affiche; sinon → redirige.
}

export default function App() {                                    // Composant racine de l’interface.
  return (
    <div style={{ maxWidth: 900, margin: "24px auto", fontFamily: "system-ui" }}> // Conteneur principal centré.
      <nav style={{ display: "flex", gap: 12, marginBottom: 16 }}> // Menu simple de navigation.
        <Link to="/login">Login</Link>                             // Lien vers la page Login (ouvre Auth0).
        <Link to="/dashboard">Dashboard</Link>                     // Lien vers la page protégée.
      </nav>

      <Routes>                                                     // Définition des routes (URL → composant).
        <Route path="/login" element={<Login />} />                // Route /login : page qui déclenche Auth0.
        <Route                                                     // Route /dashboard : protégée par RequireAuth.
          path="/dashboard"
          element={
            <RequireAuth>                                          // Vérifie l’auth avant d’afficher le contenu.
              <Dashboard />                                        // Composant du tableau de bord.
            </RequireAuth>
          }
        />
        <Route path="*" element={<Navigate to="/dashboard" replace />} /> // Routes inconnues → redirection.
      </Routes>
    </div>
  );
}