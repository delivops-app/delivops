export default function DateField({ name }) {
    return (
      <div style={{ marginBottom: '1rem' }}>
        <label htmlFor={name}>Date :</label><br />
        <input type="date" id={name} name={name} required />
      </div>
    );
  }  