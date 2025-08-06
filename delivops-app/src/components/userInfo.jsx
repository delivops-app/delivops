// src/components/UserInfo.jsx
import { useAuth0 } from '@auth0/auth0-react';

export default function UserInfo() {
  const { user } = useAuth0();

  return (
    <p>Connecté en tant que : {user?.name || user?.email}</p>
  );
}
