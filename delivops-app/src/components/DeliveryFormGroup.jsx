import { useState } from 'react';
import DeliveryForm from './DeliveryForm';

export default function DeliveryFormGroup() {
  const [forms, setForms] = useState([0]);
  const [data, setData] = useState({});

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
    const result = Object.values(data);
    console.log('Tournées à envoyer :', result);
  };

  return (
    <div>
      <h2>Déclarations des tournées</h2>

      {forms.map((id) => (
        <div
          key={id}
          style={{
            border: '1px solid #ccc',
            padding: '1rem',
            marginBottom: '1rem',
            position: 'relative',
            borderRadius: '8px'
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

          <DeliveryForm formId={id} onChange={handleFormChange} />
        </div>
      ))}

      <button type="button" onClick={handleAddForm} style={{ marginRight: '1rem' }}>
        Ajouter une tournée
      </button>

      <button type="button" onClick={handleSubmit}>
        Envoyer les tournées
      </button>
    </div>
  );
}
