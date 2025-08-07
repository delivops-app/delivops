import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth0 } from '@auth0/auth0-react';

export default function Callback() {
  const { isLoading, error } = useAuth0();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isLoading) {
      navigate('/');
    }
  }, [isLoading, navigate]);

  if (error) return <div>Erreur lors de la connexion : {error.message}</div>;

  return <div>Connexion en cours…</div>;
}
