import { useLocation } from 'react-router-dom';
import { useAuth0 } from '@auth0/auth0-react';
import DeliveryFormGroup from '../components/DeliveryFormGroup';
import LoginButton from '../components/LoginButton';
import LogoutButton from '../components/LogoutButton';
import UserInfo from '../components/UserInfo';



export default function Home() {
  const location = useLocation();
  const importedTours = location.state?.tours;

  const { isAuthenticated, isLoading } = useAuth0();

// Si Auth0 charge encore l'utilisateur → on affiche un message de chargement
  if (isLoading) {
    return <div>Chargement en cours...</div>;
  }

  return (
    <div>
      <h1>Accueil</h1>

      {/* Zone d'authentification */}
      {!isAuthenticated ? (
        // Si l’utilisateur n’est pas connecté → bouton de connexion
        <LoginButton />
      ) : (
        // Si l’utilisateur est connecté → infos, bouton logout et formulaire
        <div>
          <UserInfo />
          <LogoutButton />
          <DeliveryFormGroup initialData={importedTours} />
        </div>
      )}
    </div>
  );
}