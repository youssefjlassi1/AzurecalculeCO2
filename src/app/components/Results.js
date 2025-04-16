export default function Results({ data }) {
    if (!data) {
      return null;
    }
  
    return (
      <div style={styles.container}>
        <h3>Invoice Processed Successfully</h3>
        <p><strong>Date:</strong> {data.date || 'N/A'}</p>
        <p><strong>Total Amount:</strong> €{data.montant_total.toFixed(2)}</p>
        <p><strong>Electricity Consumption:</strong> {data.scope2_consumption || '0'} kWh</p>
        <p><strong>Scope 2 Emission:</strong> {data.scope2_emission.toFixed(2)} kg CO₂</p>
        {data.scope3_type && (
          <>
            <p><strong>Scope 3 Type:</strong> {data.scope3_type}</p>
            <p><strong>Scope 3 Emission:</strong> {data.scope3_emission.toFixed(2)} kg CO₂</p>
          </>
        )}
        <p><strong>Total Emission:</strong> {data.total_emission.toFixed(2)} kg CO₂</p>
      </div>
    );
  }
  
  const styles = {
    container: {
      marginTop: '20px',
      padding: '20px',
      border: '1px solid #ccc',
      borderRadius: '4px',
      backgroundColor: '#f9f9f9',
    },
  };