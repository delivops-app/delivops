import { useState } from "react";

function StartTourForm() {
  const [date, setDate] = useState("");
  const [orders, setOrders] = useState([
    { customer: "", standardParcels: "", cartons: "" },
  ]);
  const [errors, setErrors] = useState({});

  const handleOrderChange = (index, field, value) => {
    const next = orders.map((o, i) =>
      i === index ? { ...o, [field]: value } : o
    );
    setOrders(next);
  };

  const addOrder = () => {
    setOrders([...orders, { customer: "", standardParcels: "", cartons: "" }]);
  };

  const removeOrder = (index) => {
    setOrders(orders.filter((_, i) => i !== index));
  };

  const validate = () => {
    const newErrors = {};
    if (!date) newErrors.date = "Date requise";
    orders.forEach((o, i) => {
      if (!o.customer) newErrors[`customer-${i}`] = "Requis";
      if (o.standardParcels === "" || isNaN(Number(o.standardParcels))) {
        newErrors[`standardParcels-${i}`] = "Nombre requis";
      }
      if (o.cartons === "" || isNaN(Number(o.cartons))) {
        newErrors[`cartons-${i}`] = "Nombre requis";
      }
    });
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    try {
      const res = await fetch("/tours", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ date, orders }),
      });
      if (!res.ok) throw new Error("Network response was not ok");
      alert("Tournée créée");
      setDate("");
      setOrders([{ customer: "", standardParcels: "", cartons: "" }]);
    } catch (err) {
      console.error(err);
      alert("Erreur lors de la création de la tournée");
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label>
          Date:
          <input type="date" value={date} onChange={(e) => setDate(e.target.value)} />
        </label>
        {errors.date && <span>{errors.date}</span>}
      </div>
      {orders.map((o, i) => (
        <div key={i}>
          <input
            type="text"
            placeholder="Donneur d'ordre"
            value={o.customer}
            onChange={(e) => handleOrderChange(i, "customer", e.target.value)}
          />
          {errors[`customer-${i}`] && <span>{errors[`customer-${i}`]}</span>}
          <input
            type="number"
            min="0"
            placeholder="Colis standards"
            value={o.standardParcels}
            onChange={(e) => handleOrderChange(i, "standardParcels", e.target.value)}
          />
          {errors[`standardParcels-${i}`] && <span>{errors[`standardParcels-${i}`]}</span>}
          <input
            type="number"
            min="0"
            placeholder="Cartons"
            value={o.cartons}
            onChange={(e) => handleOrderChange(i, "cartons", e.target.value)}
          />
          {errors[`cartons-${i}`] && <span>{errors[`cartons-${i}`]}</span>}
          <button type="button" onClick={() => removeOrder(i)}>
            Supprimer
          </button>
        </div>
      ))}
      <button type="button" onClick={addOrder}>
        Ajouter un donneur d'ordre
      </button>
      <button type="submit">Démarrer la tournée</button>
    </form>
  );
}

export default StartTourForm;

