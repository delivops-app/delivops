// src/pages/Dashboard.jsx
import { useAuth0 } from "@auth0/auth0-react";                // Hook Auth0 : infos utilisateur et actions.

export default function Dashboard() {                         // Déclaration du composant de page Dashboard.
  const { user, logout, isAuthenticated, isLoading } = useAuth0(); // Récupère l’utilisateur, logout et états.

  if (isLoading) return <p style={{ textAlign: "center", marginTop: 40 }}>Chargement…</p>; // Attente si Auth0 charge.
  if (!isAuthenticated) return null;                          // Sécurité : rien n’affiche ici si non connecté.

  return (                                                    // Rendu de la page protégée.
    <div style={{ maxWidth: 800, margin: "24px auto", fontFamily: "system-ui" }}>
      <header style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <h2>Tableau de bord — {user?.email || user?.name || "Utilisateur"}</h2> // Affiche email ou nom si dispo.
        <button
          onClick={() =>                                        // Déclenche la déconnexion Auth0.
            logout({ logoutParams: { returnTo: window.location.origin } }) // Retour au site après logout.
          }
        >
          Se déconnecter
        </button>
      </header>

      <p style={{ marginTop: 12 }}>
        Connecté via Auth0. Les appels API peuvent maintenant inclure un access token.
      </p>
      {/* Exemple : ici, un bouton pourrait appeler getAccessTokenSilently() pour parler à l’API. */}
    </div>
  );
}