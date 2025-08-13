import { useState } from "react";
import { useApi } from "../lib/api";
import { useAuth0 } from "@auth0/auth0-react";

export default function SetupOrg() {
  const { isAuthenticated, loginWithRedirect, logout, user } = useAuth0();
  const { call } = useApi();
  const [orgId, setOrgId] = useState("ORG_DEMO");
  const [name, setName] = useState("Ma flotte");
  const [seats, setSeats] = useState(2);
  const [msg, setMsg] = useState("");

  const createOrg = async (e) => {
    e.preventDefault();
    setMsg("");
    try {
      await call("/orgs", {
        method: "POST",
        body: { id: orgId, name, seats_purchased: Number(seats) },
      });
      setMsg("Organisation créée ✅");
    } catch (e) {
      setMsg(e.message);
    }
  };

  if (!isAuthenticated) {
    return (
      <div style={{ padding: 24 }}>
        <h1>Créer mon organisation</h1>
        <button onClick={() => loginWithRedirect()}>Se connecter (manager)</button>
      </div>
    );
  }

  return (
    <div style={{ padding: 24, maxWidth: 640 }}>
      <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
        <div>Connecté : {user?.email}</div>
        <button onClick={() => logout({ logoutParams: { returnTo: window.location.origin } })}>
          Se déconnecter
        </button>
      </div>

      <h2 style={{ marginTop: 24 }}>Créer une organisation</h2>
      <form onSubmit={createOrg} style={{ display: "grid", gap: 8 }}>
        <label>
          ID (technique) :
          <input value={orgId} onChange={(e) => setOrgId(e.target.value)} required />
        </label>
        <label>
          Nom :
          <input value={name} onChange={(e) => setName(e.target.value)} required />
        </label>
        <label>
          Sièges achetés :
          <input type="number" min="0" value={seats} onChange={(e) => setSeats(e.target.value)} required />
        </label>
        <button type="submit">Créer</button>
      </form>
      {msg && <div style={{ marginTop: 8, color: "#0a0" }}>{msg}</div>}

      <p style={{ marginTop: 16 }}>
        Une fois l’org créée, va sur la page <b>Manager</b> pour inviter des chauffeurs.
      </p>
    </div>
  );
}
