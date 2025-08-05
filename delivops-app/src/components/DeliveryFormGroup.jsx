import { useState, useEffect } from 'react';
import DeliveryForm from './DeliveryForm';

export default function DeliveryFormGroup({ initialData = null }) {

  // Si des tournées sont fournies depuis le résumé, on les utilise
  const [forms, setForms] = useState([0]);
  const [data, setData] = useState({});
  const [showRecap, setShowRecap] = useState(false);

  useEffect(() => {
    if (initialData && initialData.length > 0) {
      const ids = initialData.map((_, index) => index);
      const initialState = {};
      ids.forEach((id, index) => {
        initialState[id] = initialData[index];
      });
      setForms(ids);
      setData(initialState);
    }
  }, [initialData]);

  const handleAddForm = () => {
    setForms([...forms, forms.length]);
  };

  const handleRemoveForm = (id) => {
    const updatedForms = forms.filter((formId) => formId !== id);
    setForms(updatedForms.length > 0 ? updatedForms : [0]);

    setData((prev) => {
      const copy = { ...prev };
      delete copy[id];
      return copy;
    });
  };

  const handleFormChange = (formId, formData) => {
    setData((prev) => ({
      ...prev,
      [formId]: {
        ...prev[formId],
        ...formData,
      },
    }));
  };

  const handleSubmit = () => {
    setShowRecap(true);
  };

  const handleConfirm = () => {
    const result = Object.values(data);
    console.log('✅ Tournées confirmées et prêtes à envoyer au backend :', result);
    // Ici, on pourrait appeler une API POST si besoin.
    // navigate('/merci'); // exemple
  };

  const handleModify = () => {
    setShowRecap(false);
  };

  if (showRecap) {
    const recap = Object.values(data);
    return (
      <div>
        <h2>Récapitulatif de la tournée</h2>
        {recap.map((tour, index) => (
          <div key={index} style={{ marginBottom: '1rem', border: '1px solid #ccc', padding: '1rem', borderRadius: '8px' }}>
            <p><strong>Date :</strong> {tour.date}</p>
            <p><strong>Client :</strong> {tour.client}</p>
            <p><strong>Colis :</strong></p>
            <ul>
              {Object.entries(tour.packages || {}).map(([type, count]) => (
                <li key={type}>{type} : {count}</li>
              ))}
            </ul>
          </div>
        ))}

        <button onClick={handleModify} style={{ marginRight: '1rem' }}>
          Modifier
        </button>
        <button onClick={handleConfirm} id="btn-validation">
          Confirmer
        </button>
      </div>
    );
  }

  return (
    <div>
      <h2>Début de tournée</h2>

      {forms.map((id) => (
        <div
          key={id}
          style={{
            border: '1px solid #ccc',
            padding: '1rem',
            marginBottom: '1rem',
            position: 'relative',
            borderRadius: '8px',
          }}
        >
          <button
            type="button"
            onClick={() => handleRemoveForm(id)}
            style={{
              position: 'absolute',
              top: '0.5rem',
              right: '0.5rem',
              background: 'transparent',
              border: 'none',
              fontSize: '1.2rem',
              cursor: 'pointer',
              color: '#888',
            }}
            title="Supprimer la tournée"
          >
            ✖
          </button>

          <DeliveryForm
            formId={id}
            onChange={handleFormChange}
            initialData={data[id] || null}
          />
        </div>
      ))}

      <button type="button" onClick={handleAddForm} style={{ marginRight: '1rem' }}>
        Ajouter une tournée
      </button>

      <button type="button" onClick={handleSubmit} id="btn-validation">
        Valider
      </button>
    </div>
  );
}
