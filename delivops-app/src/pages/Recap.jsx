import { useLocation, useNavigate } from 'react-router-dom';
import { useEffect } from 'react';

export default function Recap() {
  const location = useLocation();
  const navigate = useNavigate();

  const tours = location.state?.tours || [];

  useEffect(() => {
    if (tours.length === 0) {
      // Si aucune donnée, on redirige à l'accueil
      navigate('/');
    }
  }, [tours, navigate]);

  const handleConfirm = () => {
    console.log('Tournées confirmées et prêtes à être envoyées :', tours);
    alert("Données envoyées (simulation)");
    // Ici, appel API vers le backend si nécessaire
  };

  const handleModify = () => {
    // Retourne à la page précédente avec les données conservées
    navigate('/', { state: { tours } });
  };

  return (
    <div>
      <h2>Récapitulatif de vos tournées</h2>

      {tours.map((tour, index) => (
        <div
          key={index}
          style={{
            border: '1px solid #ccc',
            padding: '1rem',
            marginBottom: '1rem',
            borderRadius: '8px',
          }}
        >
          <p><strong>Date :</strong> {tour.date}</p>
          <p><strong>Client :</strong> {tour.client}</p>
          <h4>Colis :</h4>
          <ul>
            {Object.entries(tour)
              .filter(([key]) => key.startsWith('colis_'))
              .map(([key, value]) => (
                <li key={key}>
                  {key.replace('colis_', '').replace(/_\d+$/, '')} : {value}
                </li>
              ))}
          </ul>
        </div>
      ))}

      <div style={{ display: 'flex', gap: '1rem' }}>
        <button onClick={handleModify}>
          Modifier
        </button>

        <button onClick={handleConfirm} id="btn-validation">
          Envoyer
        </button>
      </div>
    </div>
  );
}