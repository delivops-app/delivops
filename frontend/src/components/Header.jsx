// src/components/Header.jsx
import { useAuth0 } from '@auth0/auth0-react';
import UserDisplay from './UserDisplay';
import LogoutButton from './LogoutButton';
import LoginButton from './LoginButton';
import { Link } from 'react-router-dom';

export default function Header() {
  const { isAuthenticated, isLoading } = useAuth0();

  if (isLoading) return null;

  return (
    <header
      style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '10px 20px',
        backgroundColor: '#f0f0f0',
        borderBottom: '1px solid #ccc',
      }}
    >
      {/* Logo ou nom de l'app */}
      <div>
        <Link to="/" style={{ textDecoration: 'none', fontWeight: 'bold', fontSize: '20px' }}>
          Delivops
        </Link>
      </div>

      {/* Zone utilisateur */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
        {isAuthenticated ? (
          <>
            <UserDisplay />
            <Link to="/profile">Mon profil</Link>
            <LogoutButton />
          </>
        ) : (
          <LoginButton />
        )}
      </div>
    </header>
  );
}
