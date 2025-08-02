import { useState } from "react";

export default function App() {
  // 🔸 Restaure la session si déjà présente
  const [token, setToken] = useState(() => localStorage.getItem("token"));
  const [role, setRole]   = useState(() => localStorage.getItem("role"));

  // états du formulaire
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

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

    // ✅ succès simulé : on "reçoit" un token + rôle
    const tok = "fake-jwt-token";
    const r = "chauffeur";

    // 🔸 Sauvegarde persistante
    localStorage.setItem("token", tok);
    localStorage.setItem("role", r);

    setToken(tok);
    setRole(r);
  }

  function logout() {
    // 🔸 Efface le stockage + l'état
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    setToken(null);
    setRole(null);
    setEmail("");
    setPassword("");
    setError("");
  }

  // Vue "non connectée"
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
          <div style={{ fontSize: 12, color: "#666" }}>(Simulation sans serveur)</div>
        </form>
      </div>
    );
  }

  // Vue "connectée"
  return (
    <div style={{ maxWidth: 720, margin: "40px auto", fontFamily: "system-ui" }}>
      <header style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <h2>DelivOps — Espace {role}</h2>
        <button onClick={logout}>Se déconnecter</button>
      </header>
      <p>Connectée avec un token factice : <code>{token}</code></p>
      <p>Rafraîchis la page : tu restes connectée (grâce à localStorage).</p>
    </div>
  );
}