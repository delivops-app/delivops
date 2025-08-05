export default function ClientSelect({ name }) {
    const clients = ['Pharmacie Dupont', 'Amazon Hub', 'Colis Privé', 'DPD Ivry'];
  
    return (
      <div style={{ marginBottom: '1rem' }}>
        <label htmlFor={name}>Client :</label><br />
        <select id={name} name={name} required>
          <option value="">-- Choisir un client --</option>
          {clients.map((client, index) => (
            <option key={index} value={client}>{client}</option>
          ))}
        </select>
      </div>
    );
  }  