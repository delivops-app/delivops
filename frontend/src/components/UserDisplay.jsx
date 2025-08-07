// src/components/UserInfo.jsx
import { useAuth0 } from '@auth0/auth0-react';

export default function UserDisplay() {
  const { user } = useAuth0();

  if (!user) return null;

  return <span>Connecté en tant que : {user.name || user.email}</span>;
}
