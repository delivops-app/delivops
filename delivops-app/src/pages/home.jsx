import { useLocation } from 'react-router-dom';
import DeliveryFormGroup from '../components/DeliveryFormGroup';
import { useAuth0 } from '@auth0/auth0-react';


export default function Home() {
  const location = useLocation();
  const importedTours = location.state?.tours;

  const { loginWithRedirect, logout, isAuthenticated, user } = useAuth0();

  return (
    <div>
      <h1>Accueil</h1>
      
      {/* Zone d'authentification */}
      <div>
        {!isAuthenticated && (
          <button onClick={() => loginWithRedirect()}>Se connecter</button>
        )}

        {isAuthenticated && (
          <div>
            <p>Connecté en tant que : {user.name}</p>
            <button onClick={() => logout({ returnTo: window.location.origin })}>
              Se déconnecter
            </button>
          </div>
        )}
      </div>

      <DeliveryFormGroup initialData={importedTours} />
    </div>
  );
}