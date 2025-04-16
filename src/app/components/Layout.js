export default function Layout({ children }) {
    return (
      <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
        <header style={{ marginBottom: '20px' }}>
          <h1>My App</h1>
        </header>
        <main>{children}</main>
        <footer style={{ marginTop: '20px', textAlign: 'center' }}>
          <p>&copy; 2025 My App. All rights reserved.</p>
        </footer>
      </div>
    );
  }