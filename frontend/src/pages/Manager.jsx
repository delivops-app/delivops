import { useEffect, useState } from "react";
import { useAuth0 } from "@auth0/auth0-react";
import { useApi } from "../lib/api";



const ORG_ID = "ORG_DEMO"; // adapte selon ton org

export default function Manager() {
  const { isAuthenticated, loginWithRedirect, logout, user} = useAuth0();
  const { call } = useApi();
  const [email, setEmail] = useState("");
  const [drivers, setDrivers] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState("");
  const [newSeats, setNewSeats] = useState("");

  const load = async () => {
    setLoading(true);
    try {
      const [d, s] = await Promise.all([
        call(`/drivers?org_id=${ORG_ID}`),
        call(`/drivers/stats/${ORG_ID}`),
      ]);
      setDrivers(d);
      setStats(s);
      setNewSeats(String(s.seats_purchased));
    } catch (e) {
      setMsg(e.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isAuthenticated) load();
  }, [isAuthenticated]);

  const invite = async (e) => {
    e.preventDefault();
    setMsg("");
    try {
      await call("/drivers/invite", { method: "POST", body: { org_id: ORG_ID, email } });
      setEmail("");
      setMsg("Invitation envoyée (email Auth0).");
      await load();
    } catch (e) {
      setMsg(e.message);
    }
  };

  const activate = async (driver_id) => {
    setMsg("");
    try {
      await call(`/drivers/${driver_id}/activate`, { method: "POST" });
      await load();
    } catch (e) {
      setMsg(e.message);
    }
  };

  const disable = async (driver_id) => {
    setMsg("");
    try {
      await call(`/drivers/${driver_id}/disable`, { method: "POST" });
      await load();
    } catch (e) {
      setMsg(e.message);
    }
  };

  const sendReset = async (driver_id) => {
    setMsg("");
    try {
      await call(`/drivers/${driver_id}/send-reset`, { method: "POST" });
      setMsg("Email de réinitialisation envoyé.");
    } catch (e) {
      setMsg(e.message);
    }
  };

  const applySeats = async (e) => {
    e.preventDefault();
    setMsg("");
    try {
      const seatsNum = Number(newSeats);
      if (!Number.isFinite(seatsNum) || seatsNum < 0) {
        throw new Error("Nombre de sièges invalide");
      }
      await call(`/orgs/${ORG_ID}/seats`, {
        method: "PATCH",
        body: { seats_purchased: seatsNum },
      });
      await load();
      setMsg("Mise à jour des sièges réalisée.");
    } catch (e) {
      setMsg(e.message);
    }
  };

  if (!isAuthenticated) {
    return (
      <div style={{ padding: 24 }}>
        <h1>Manager</h1>
        <p>Connecte-toi pour gérer tes chauffeurs.</p>
        <button onClick={() => loginWithRedirect()}>Se connecter (manager)</button>
      </div>
    );
  }

  return (
    <div style={{ padding: 24, maxWidth: 900 }}>
      <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
        <div>Connecté : {user?.email}</div>
        <button onClick={() => logout({ logoutParams: { returnTo: window.location.origin } })}>
          Se déconnecter
        </button>
      </div>

      <h2 style={{ marginTop: 24 }}>Statuts</h2>
      {stats ? (
        <div>
          <div>Sièges achetés : <b>{stats.seats_purchased}</b></div>
          <div>Actifs : <b>{stats.active}</b></div>
          <div>Restants : <b>{stats.seats_remaining}</b></div>
          <div>Total enregistrés : <b>{stats.total}</b></div>
        </div>
      ) : <div>—</div>}

      <h3 style={{ marginTop: 12 }}>Gérer les sièges</h3>
      <form onSubmit={applySeats} style={{ display: "flex", gap: 8, alignItems: "center" }}>
        <input
          type="number"
          min="0"
          value={newSeats}
          onChange={(e) => setNewSeats(e.target.value)}
          style={{ width: 120 }}
        />
        <button type="submit">Appliquer</button>
      </form>
      
      <h2 style={{ marginTop: 24 }}>Inviter un chauffeur</h2>
      <form onSubmit={invite} style={{ display: "flex", gap: 8 }}>
        <input
          type="email"
          required
          placeholder="email du chauffeur"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <button type="submit" disabled={loading}>Inviter</button>
      </form>
      {msg && <div style={{ marginTop: 8, color: "green" }}>{msg}</div>}

      <h2 style={{ marginTop: 24 }}>Chauffeurs</h2>
      {loading ? <div>Chargement…</div> : (
        <table border="1" cellPadding="6" style={{ borderCollapse: "collapse", width: "100%" }}>
          <thead>
            <tr>
              <th>Email</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {drivers.map(d => (
              <tr key={d.driver_id}>
                <td>{d.email}</td>
                <td>{d.status}</td>
                <td style={{ display: "flex", gap: 6 }}>
                  <button onClick={() => sendReset(d.driver_id)}>Renvoyer lien MDP</button>
                  <button onClick={() => activate(d.driver_id)}>Activer</button>
                  <button onClick={() => disable(d.driver_id)}>Désactiver</button>
                </td>
              </tr>
            ))}
            {!drivers.length && (
              <tr><td colSpan="3">Aucun chauffeur pour l’instant</td></tr>
            )}
          </tbody>
        </table>
      )}
    </div>
  );
}
