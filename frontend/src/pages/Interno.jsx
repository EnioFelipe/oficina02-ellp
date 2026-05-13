import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext.jsx';

export default function Interno() {
  const { profile, logout } = useAuth();
  const navigate = useNavigate();

  async function handleLogout() {
    await logout();
    navigate('/login');
  }

  return (
    <main style={{ padding: '1.5rem', fontFamily: 'system-ui, sans-serif', maxWidth: 480 }}>
      <div className="authCard" style={{ boxShadow: '0 8px 24px rgb(15 23 42 / 8%)' }}>
        <h1 style={{ margin: 0, fontSize: '1.25rem' }}>Area interna</h1>
        <p style={{ margin: 0, color: '#444' }}>
          <strong>{profile?.name}</strong> — {profile?.type}
        </p>
        <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', marginTop: 8 }}>
          <button type="button" onClick={handleLogout}>Sair</button>
          <Link to="/" style={{ alignSelf: 'center', color: '#0264be', fontWeight: 700 }}>Inicio</Link>
        </div>
      </div>
    </main>
  );
}
