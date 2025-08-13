import { useAuth0 } from "@auth0/auth0-react";

export function useApi(baseUrl = "http://127.0.0.1:8000") {
  const { getAccessTokenSilently } = useAuth0();

  const call = async (path, { method = "GET", body, headers = {} } = {}) => {
    const token = await getAccessTokenSilently();
    const res = await fetch(`${baseUrl}${path}`, {
      method,
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
        ...headers,
      },
      body: body ? JSON.stringify(body) : undefined,
    });
    if (!res.ok) {
      const text = await res.text().catch(() => "");
      throw new Error(`${res.status} ${res.statusText} — ${text}`);
    }
    const ct = res.headers.get("content-type") || "";
    return ct.includes("application/json") ? res.json() : res.text();
  };

  return { call };
}
