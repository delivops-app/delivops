import { useEffect, useState } from 'react';
import DateField from './DateField';
import ClientSelect from './ClientSelect';
import PackageLine from './PackageLine';

const packageTypes = ['Colis standard', 'Cartons', 'Palettes'];

export default function DeliveryForm({ formId, onChange, initialData = null }) {
  const [date, setDate] = useState('');
  const [client, setClient] = useState('');
  const [packages, setPackages] = useState({});

  // Préremplir les champs si des données initiales sont passées
  useEffect(() => {
    if (initialData) {
      setDate(initialData.date || '');
      setClient(initialData.client || '');
      setPackages(initialData.packages || {});
    }
  }, [initialData]);

  // Appeler onChange dès qu'une valeur change
  useEffect(() => {
    onChange(formId, {
      date,
      client,
      packages,
    });
  }, [date, client, packages]);

  const handlePackageChange = (type, value) => {
    setPackages((prev) => ({
      ...prev,
      [type]: value,
    }));
  };

  return (
    <form>
      <DateField name={`date_${formId}`} value={date} onChange={setDate} />
      <ClientSelect name={`client_${formId}`} value={client} onChange={setClient} />

      <h4>Colis</h4>
      {packageTypes.map((type, index) => (
        <PackageLine
          key={index}
          label={type}
          name={`colis_${formId}_${index}`}
          value={packages[type] || ''}
          onChange={(val) => handlePackageChange(type, val)}
        />
      ))}
    </form>
  );
}
