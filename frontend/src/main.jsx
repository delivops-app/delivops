// src/main.jsx
// Point d’entrée de l’application : montage React, routeur, et configuration Auth0.

import React from "react";                                     // Importe React.
import ReactDOM from "react-dom/client";                       // Importe l’API de montage (client).
import { BrowserRouter } from "react-router-dom";              // Importe le routeur côté navigateur.
import App from "./App";                                       // Importe le composant racine.
import "./index.css";                                          // Importe les styles globaux (optionnel).

import { Auth0Provider } from "@auth0/auth0-react";            // Importe le Provider Auth0.
import { AUTH0 } from "./auth0";                               // Importe la config lue depuis .env.

const { domain, clientId, audience } = AUTH0;                  // Extrait domaine, clientId, audience.

if (!domain || !clientId) {                                    // Vérifie que la config Auth0 est présente.
  throw new Error(                                             // En cas d’absence, lève une erreur explicite.
    "Auth0 non configuré : VITE_AUTH0_DOMAIN et VITE_AUTH0_CLIENT_ID requis dans .env"
  );
}

const onRedirectCallback = (appState) => {                     // Définit le callback après redirection Auth0.
  const target = appState?.returnTo || window.location.pathname; // Cible de retour (ou chemin courant).
  window.history.replaceState({}, document.title, target);     // Remplace l’URL sans recharger la page.
};

ReactDOM.createRoot(document.getElementById("root")).render(   // Monte l’application dans le div#root.
  <React.StrictMode>                                           // Active le mode strict (aide au dev).
    <Auth0Provider                                              // Enveloppe l’app avec Auth0.
      domain={domain}                                          // Domaine Auth0 (ex. dev-xxx.eu.auth0.com).
      clientId={clientId}                                      // Identifiant client de l’application SPA.
      authorizationParams={{                                   // Paramètres d’autorisation OIDC/OAuth2.
        redirect_uri: window.location.origin,                  // Origine pour le retour après login/logout.
        audience: audience || undefined                        // Audience d’API (si définie pour les tokens d’API).
      }}
      onRedirectCallback={onRedirectCallback}                  // Gère proprement l’URL au retour Auth0.
    >
      <BrowserRouter>                                          // Active la gestion des routes côté client.
        <App />                                                // Rendu du composant racine.
      </BrowserRouter>
    </Auth0Provider>
  </React.StrictMode>
);