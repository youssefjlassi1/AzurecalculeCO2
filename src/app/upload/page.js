'use client';

import { useState } from 'react';

export default function UploadPage() {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [results, setResults] = useState(null);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
    setError('');
    setResults(null); // Clear previous results
  };

  const handleUpload = async () => {
    if (!file) {
      setError('Please select a file to upload.');
      return;
    }

    const formData = new FormData();
    formData.append('file', file);

    try {
      setLoading(true);
      const response = await fetch('http://localhost:5000/analyze', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Failed to process the file.');
      }

      const data = await response.json();
      setResults(data.data); // Save results to display
    } catch (err) {
      setError(err.message || 'An error occurred.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <h1>Upload Invoice</h1>
      <input type="file" onChange={handleFileChange} style={styles.input} />
      <button onClick={handleUpload} style={styles.button} disabled={loading}>
        {loading ? 'Uploading...' : 'Upload'}
      </button>
      {error && <p style={styles.error}>{error}</p>}
      {results && (
        <div style={styles.results}>
          <h3>Invoice Processed Successfully</h3>
          <p><strong>Date:</strong> {results.date || 'N/A'}</p>
          <p><strong>Total Amount:</strong> €{results.montant_total.toFixed(2)}</p>
          <p><strong>Electricity Consumption:</strong> {results.scope2_consumption || '0'} kWh</p>
          <p><strong>Scope 2 Emission:</strong> {results.scope2_emission.toFixed(2)} kg CO₂</p>
          {results.scope3_type && (
            <>
              <p><strong>Scope 3 Type:</strong> {results.scope3_type}</p>
              <p><strong>Scope 3 Emission:</strong> {results.scope3_emission.toFixed(2)} kg CO₂</p>
            </>
          )}
          <p><strong>Total Emission:</strong> {results.total_emission.toFixed(2)} kg CO₂</p>
        </div>
      )}
    </div>
  );
}

const styles = {
  container: {
    maxWidth: '600px',
    margin: '0 auto',
    textAlign: 'center',
    padding: '20px',
  },
  input: {
    padding: '10px',
    marginBottom: '20px',
    border: '1px solid #ccc',
    borderRadius: '4px',
    width: '100%',
  },
  button: {
    padding: '10px 20px',
    backgroundColor: '#0070f3',
    color: '#fff',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
  },
  error: {
    color: 'red',
    marginTop: '10px',
  },
  results: {
    marginTop: '20px',
    padding: '20px',
    border: '1px solid #ccc',
    borderRadius: '4px',
    backgroundColor: '#f9f9f9',
  },
};