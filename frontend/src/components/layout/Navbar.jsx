import { LogOut } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext.jsx';
import styles from './Layout.module.css';

export default function Navbar() {
  const { logout, profile } = useAuth();
  const navigate = useNavigate();

  async function handleLogout() {
    await logout();
    navigate('/login');
  }

  return (
    <header className={styles.navbar}>
      <div>
        <strong>{profile?.name || 'Oficinas Acadêmicas'}</strong>
        <span>{profile?.type || 'usuario'}</span>
      </div>
      <button type="button" className="iconButton" onClick={handleLogout} title="Sair">
        <LogOut size={18} />
      </button>
    </header>
  );
}
