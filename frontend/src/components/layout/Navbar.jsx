import { LogOut } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext.jsx';
import styles from './Layout.module.css';

export default function Navbar() {
  const { logout, profile } = useAuth();

  return (
    <header className={styles.navbar}>
      <div>
        <strong>{profile?.name || 'Oficinas Acadêmicas'}</strong>
        <span>{profile?.type || 'usuario'}</span>
      </div>
      <button className="iconButton" onClick={logout} title="Sair">
        <LogOut size={18} />
      </button>
    </header>
  );
}
