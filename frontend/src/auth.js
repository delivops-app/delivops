// src/auth.js
const STORAGE = {
  // Regroupe les clés de stockage local.
  TOKEN: "token", // Clé utilisée pour enregistrer le jeton.
  ROLE: "role", // Clé utilisée pour enregistrer le rôle.
}; // Fin de l’objet des clés.

// -- Fonctions de base sur la "session" locale --

export function saveSession(token, role) {
  // Sauvegarde une session (jeton + rôle).
  localStorage.setItem(STORAGE.TOKEN, token); // Enregistre le jeton dans localStorage.
  localStorage.setItem(STORAGE.ROLE, role); // Enregistre le rôle dans localStorage.
} // Fin de saveSession.

export function clearSession() {
  // Supprime toute trace de session locale.
  localStorage.removeItem(STORAGE.TOKEN); // Efface le jeton.
  localStorage.removeItem(STORAGE.ROLE); // Efface le rôle.
} // Fin de clearSession.

export function getToken() {
  // Retourne le jeton courant (ou null).
  return localStorage.getItem(STORAGE.TOKEN); // Lecture du jeton depuis localStorage.
} // Fin de getToken.

export function getRole() {
  // Retourne le rôle courant (ou null).
  return localStorage.getItem(STORAGE.ROLE); // Lecture du rôle depuis localStorage.
} // Fin de getRole.

export function isAuthenticated() {
  // Indique si une session existe.
  return Boolean(getToken()); // Vrai si un jeton est présent.
} // Fin de isAuthenticated.

// -- Simulation d’un login (remplacée plus tard par Auth0) --

export async function loginFake({ email, password }) {
  // Simule une authentification côté front.
  await new Promise((r) => setTimeout(r, 300)); // Petite latence simulée (300 ms).
  if (!email || !password) {
    // Validation minimale : champs requis.
    throw new Error("Email et mot de passe requis"); // Message d’erreur lisible.
  } // Fin du test de présence.
  if (password.length < 4) {
    // Règle simple : mot de passe minimal.
    throw new Error("Mot de passe trop court (≥ 4)"); // Message d’erreur spécifique.
  } // Fin du test de longueur.

  const token = "fake-jwt-token"; // Jeton factice (provisoire).
  const role = "chauffeur"; // Rôle factice (provisoire).
  saveSession(token, role); // Enregistre la session locale.
  return { token, role }; // Retourne les informations de session.
} // Fin de loginFake.

export function logout() {
  // Effectue une déconnexion locale.
  clearSession(); // Efface toute la session.
} // Fin de logout.
