// src/pages/Login.jsx
import { useEffect } from "react";
import { useAuth0 } from "@auth0/auth0-react";
import { useNavigate } from "react-router-dom";

// Flag au niveau module pour éviter la double Ouverture en Mode Strict
let hasTriggeredLogin = false;

export default function Login() {
  const navigate = useNavigate();
  const { isAuthenticated, isLoading, loginWithRedirect } = useAuth0();

  useEffect(() => {
    if (isLoading) return;

    if (isAuthenticated) {
      navigate("/dashboard", { replace: true });
      return;
    }

    const params = new URLSearchParams(window.location.search);
    const isCallback = params.has("code") || params.has("error");
    if (isCallback) return;

    if (hasTriggeredLogin) return;
    hasTriggeredLogin = true;

    loginWithRedirect({ appState: { returnTo: "/dashboard" } });
  }, [isLoading, isAuthenticated, loginWithRedirect, navigate]);

  return <p style={{ textAlign: "center", marginTop: 40 }}>Redirection vers Auth0…</p>;
}