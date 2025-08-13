import { useAuth0 } from "@auth0/auth0-react";

/**
 * Protège une page par rôle.
 * On lit le token décodé (user?.[namespace]/roles) via user?.[namespaced claim],
 * mais @auth0/auth0-react ne donne pas directement l'access token décodé.
 * Ici, on part du principe que tu attribues le rôle "manager" à ton user,
 * et que le backend vérifie de toute façon côté API (require_role(["manager"])).
 * Ce guard se contente de bloquer l'UI si non authentifié.
 */
export default function GuardRole({ needed = "manager", children }) {
  const { isAuthenticated, loginWithRedirect } = useAuth0();

  if (!isAuthenticated) {
    return (
      <div style={{ padding: 24 }}>
        <h2>Connexion requise</h2>
        <button onClick={() => loginWithRedirect()}>Se connecter</button>
      </div>
    );
  }

  // Option : contrôler le rôle via un endpoint /me (à faire plus tard).
  // Pour le MVP, on s'appuie sur le backend qui sécurise les routes.

  return children;
}
