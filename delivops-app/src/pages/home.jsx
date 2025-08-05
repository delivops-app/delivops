import { useLocation } from 'react-router-dom';
import DeliveryFormGroup from '../components/DeliveryFormGroup';

export default function Home() {
  const location = useLocation();
  const importedTours = location.state?.tours;

  return (
    <div>
      <h1>Accueil</h1>
      <DeliveryFormGroup initialData={importedTours} />
    </div>
  );
}