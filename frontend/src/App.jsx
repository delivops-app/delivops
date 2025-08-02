import { useState } from "react";

export default function App() {
  // états du formulaire
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  // "session" simulée
  const [token, setToken] = useState(null);
  const [role, setRole] = useState(null);

  function handleLogin(e) {
    e.preventDefault();
    setError("");

    if (!email || !password) {
      setError("Email et mot de passe requis");
      return;
    }
    if (password.length < 4) {
      setError("Mot de passe trop court (≥ 4)");
      return;
    }

    // succès simulé
    setToken("fake-jwt-token");
    setRole("chauffeur");
  }

  function logout() {
    setToken(null);
    setRole(null);
    setEmail("");
    setPassword("");
    setError("");
  }

  // Si pas connecté → formulaire
  if (!token) {
    return (
      <div style={{ maxWidth: 360, margin: "80px auto", fontFamily: "system-ui" }}>
        <h2>Connexion</h2>
        <form onSubmit={handleLogin} style={{ display: "grid", gap: 10 }}>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Mot de passe (≥ 4)"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button type="submit">Se connecter</button>
          {error && <div style={{ color: "crimson" }}>{error}</div>}
          <div style={{ fontSize: 12, color: "#666" }}>
            (Ici on simule la connexion sans serveur)
          </div>
        </form>
      </div>
    );
  }

  // Si connecté → mini dashboard
  return (
    <div style={{ maxWidth: 720, margin: "40px auto", fontFamily: "system-ui" }}>
      <header style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <h2>DelivOps — Espace {role}</h2>
        <button onClick={logout}>Se déconnecter</button>
      </header>
      <p>Connectée avec un token factice : <code>{token}</code></p>
      <p>On ajoutera ici le formulaire de tournée.</p>
    </div>
  );
}