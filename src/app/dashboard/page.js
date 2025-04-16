'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function Dashboard() {
  const router = useRouter();
  const [file, setFile] = useState(null);
  const [filePreview, setFilePreview] = useState(null); // State for file preview
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [results, setResults] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/login'); // Redirect to login if not authenticated
    }
  }, [router]);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    setFile(selectedFile);
    setError('');
    setResults(null); // Clear previous results

    // Generate a preview URL for the uploaded file
    if (selectedFile) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setFilePreview(event.target.result); // Set the preview URL
      };
      reader.readAsDataURL(selectedFile);
    }
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
      setError(err.message || 'An error occurred while uploading the file.');
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadExcel = () => {
    // Trigger the download of the Excel file from the Flask backend
    window.location.href = 'http://localhost:5000/export_excel';
  };

  const handleLogout = () => {
    localStorage.removeItem('token'); // Clear the token
    router.push('/login'); // Redirect to login
  };

  return (
    <div style={styles.container}>
      {/* Navbar */}
      <nav style={styles.navbar}>
        <h1 style={styles.navTitle}>CO₂ Emissions Dashboard</h1>
        <ul style={styles.navLinks}>
          <li><a href="#upload">Upload</a></li>
          <li><a href="#preview">Preview</a></li>
          <li><a href="#results">Results</a></li>
          <li>
            <button onClick={handleLogout} style={styles.logoutButton}>
              Logout
            </button>
          </li>
        </ul>
      </nav>

      <h1 style={styles.header}>CO₂ Emissions Calculator</h1>
      <p style={styles.subHeader}>Upload your invoice to calculate Scope 2 and Scope 3 emissions.</p>

      <div style={styles.infoCards}>
        {/* Scope 2 Information */}
        <div style={styles.infoCard}>
          <h3>Scope 2 Emissions</h3>
          <p>
            Scope 2 emissions are indirect emissions from the generation of purchased electricity, steam, heating, and cooling consumed by the reporting company.
          </p>
        </div>

        {/* Scope 3 Information */}
        <div style={styles.infoCard}>
          <h3>Scope 3 Emissions</h3>
          <p>
            Scope 3 emissions are all indirect emissions (not included in Scope 2) that occur in the value chain of the reporting company, including both upstream and downstream emissions.
          </p>
        </div>
      </div>

      <div style={styles.content}>
        {/* Left Column: Upload Form and Results */}
        <div style={styles.leftColumn}>
          <div style={styles.card} id="upload">
            <h2>Upload Invoice</h2>
            <input type="file" onChange={handleFileChange} style={styles.input} />
            <button onClick={handleUpload} style={styles.uploadButton} disabled={loading}>
              {loading ? 'Uploading...' : 'Upload'}
            </button>
            {error && <p style={styles.error}>{error}</p>}
          </div>

          {/* Results Section */}
          {results && (
            <div style={styles.results} id="results">
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

              {/* Download Excel Button */}
              <button onClick={handleDownloadExcel} style={styles.downloadButton}>
                Download Excel
              </button>
            </div>
          )}
        </div>

        {/* Right Column: Preview Section */}
        <div style={styles.rightColumn} id="preview">
          <div style={styles.card}>
            <h2>Preview</h2>
            {filePreview ? (
              file.type.startsWith('image/') ? (
                <img src={filePreview} alt="Invoice Preview" style={styles.imagePreview} />
              ) : (
                <iframe
                  src={filePreview}
                  title="Invoice Preview"
                  style={styles.pdfPreview}
                ></iframe>
              )
            ) : (
              <p>No file selected for preview.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

const styles = {
  container: {
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '20px',
    fontFamily: 'Arial, sans-serif',
    backgroundColor: '#f4f9f4',
  },
  navbar: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#2c5f2d',
    padding: '10px 20px',
    color: '#fff',
    borderRadius: '8px',
    marginBottom: '20px',
  },
  navTitle: {
    fontSize: '1.5rem',
  },
  navLinks: {
    listStyle: 'none',
    display: 'flex',
    gap: '15px',
  },
  logoutButton: {
    padding: '10px 15px',
    backgroundColor: '#d9534f',
    color: '#fff',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    fontWeight: 'bold',
  },
  header: {
    textAlign: 'center',
    fontSize: '2rem',
    marginBottom: '10px',
    color: '#2c5f2d',
  },
  subHeader: {
    textAlign: 'center',
    color: '#4a7c59',
    marginBottom: '20px',
  },
  infoCards: {
    display: 'flex',
    gap: '20px',
    marginBottom: '20px',
  },
  infoCard: {
    flex: 1,
    backgroundColor: '#e8f5e9',
    padding: '20px',
    borderRadius: '8px',
    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
  },
  content: {
    display: 'flex',
    gap: '20px',
  },
  leftColumn: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    gap: '20px',
  },
  rightColumn: {
    flex: 1,
  },
  card: {
    backgroundColor: '#ffffff',
    borderRadius: '8px',
    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
    padding: '20px',
  },
  input: {
    width: '100%',
    padding: '10px',
    marginBottom: '10px',
    border: '1px solid #ccc',
    borderRadius: '4px',
  },
  uploadButton: {
    width: '100%',
    padding: '10px',
    backgroundColor: '#2c5f2d',
    color: '#fff',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    fontWeight: 'bold',
  },
  downloadButton: {
    marginTop: '20px',
    padding: '10px 15px',
    backgroundColor: '#0070f3',
    color: '#fff',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    fontWeight: 'bold',
  },
  error: {
    color: '#d9534f',
    marginTop: '10px',
  },
  imagePreview: {
    maxWidth: '100%',
    height: 'auto',
    border: '1px solid #ccc',
    borderRadius: '4px',
  },
  pdfPreview: {
    width: '100%',
    height: '400px',
    border: '1px solid #ccc',
    borderRadius: '4px',
  },
  results: {
    padding: '20px',
    border: '1px solid #ccc',
    borderRadius: '4px',
    backgroundColor: '#e8f5e9',
    color: '#2c5f2d',
  },
};