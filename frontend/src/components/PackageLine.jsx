export default function PackageLine({ label, name }) {
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '0.5rem'
      }}>
        <span>{label}</span>
        <input
          type="number"
          name={name}
          min="0"
          max="500"
          defaultValue="0"
          style={{ width: '80px' }}
        />
      </div>
    );
  }  