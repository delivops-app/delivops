import { useState, useEffect } from 'react';

export default function DeliveryForm({ formId, onChange }) {
  const [date, setDate] = useState('');
  const [client, setClient] = useState('');
  const [packages, setPackages] = useState({
    'Colis standards': 0,
    'Cartons': 0,
    'Pli urgent': 0,
    'Palette': 0,
  });

  // Envoie les données au parent dès qu’un champ change
  useEffect(() => {
    onChange(formId, { date, client, packages });
  }, [date, client, packages]);

  const handlePackageChange = (type, value) => {
    setPackages((prev) => ({
      ...prev,
      [type]: value, // on garde la chaîne de caractères
    }));    
  };

  const packageTypes = Object.keys(packages);

  return (
    <form>
      {/* Date */}
      <div style={{ marginBottom: '1rem' }}>
        <label>Date :</label><br />
        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          required
        />
      </div>

      {/* Client */}
      <div style={{ marginBottom: '1rem' }}>
        <label>Client :</label><br />
        <select value={client} onChange={(e) => setClient(e.target.value)} required>
          <option value="">-- Choisir un client --</option>
          <option value="Pharmacie Dupont">Pharmacie Dupont</option>
          <option value="Amazon Hub">Amazon Hub</option>
          <option value="Colis Privé">Colis Privé</option>
          <option value="DPD Ivry">DPD Ivry</option>
        </select>
      </div>

      {/* Colis */}
      <h4>Colis</h4>
      {packageTypes.map((type, index) => (
        <div key={index} style={{
          display: 'flex',
          justifyContent: 'space-between',
          marginBottom: '0.5rem'
        }}>
          <label>{type}</label>
          <input
            type="number"
            min="0"
            max="500"
            value={packages[type] === 0 ? '' : packages[type]}
            onChange={(e) => handlePackageChange(type, e.target.value)}
            placeholder="0"
          />
        </div>
      ))}
    </form>
  );
}
