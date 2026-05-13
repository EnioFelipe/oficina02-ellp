import { BrowserRouter, Link, Route, Routes } from 'react-router-dom';
import { useAuth } from './contexts/AuthContext.jsx';
import Login from './pages/Login.jsx';
import Register from './pages/Register.jsx';

function Home() {
  const { loading, profile, isAuthenticated } = useAuth();

  if (loading) {
    return (
      <main style={{ padding: '1.5rem', fontFamily: 'system-ui, sans-serif' }}>
        <p>Carregando...</p>
      </main>
    );
  }

  return (
    <main style={{ padding: '1.5rem', fontFamily: 'system-ui, sans-serif' }}>
      <h1 style={{ fontSize: '1.25rem', margin: 0 }}>ELLP</h1>
      {isAuthenticated && profile ? (
        <p style={{ marginTop: '0.75rem', color: '#444' }}>
          Logado como <strong>{profile.name}</strong> ({profile.type}).
        </p>
      ) : (
        <p style={{ marginTop: '0.5rem', color: '#444' }}>Frontend em construcao.</p>
      )}
      <p style={{ marginTop: '1rem', display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
        <Link to="/cadastro" style={{ color: '#0264be', fontWeight: 700 }}>Cadastro</Link>
        <Link to="/login" style={{ color: '#0264be', fontWeight: 700 }}>Entrar</Link>
      </p>
    </main>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/cadastro" element={<Register />} />
      </Routes>
    </BrowserRouter>
  );
}
