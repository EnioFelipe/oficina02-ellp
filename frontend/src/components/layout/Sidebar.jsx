import { Award, BarChart3, Gauge, Search, Users, Wrench } from 'lucide-react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext.jsx';
import styles from './Layout.module.css';

export default function Sidebar() {
  const { profile } = useAuth();
  const canManage = ['professor', 'tutor'].includes(profile?.type);

  return (
    <aside className={styles.sidebar}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', paddingBottom: '30px' }}>
        <img style={{ width: '60px', borderRadius: '50%' }} src="/ELLP_logo.jpg" alt="ELLP" />
        <h1 style={{ alignSelf: 'center', margin: 0 }}>ELLP</h1>
      </div>
      <nav>
        <NavLink to="/dashboard"><Gauge size={18} /> Dashboard</NavLink>
        <NavLink to="/oficinas"><Wrench size={18} /> Oficinas</NavLink>
        {canManage && <NavLink to="/usuarios"><Users size={18} /> Usuários</NavLink>}
        {canManage && <NavLink to="/relatorios"><BarChart3 size={18} /> Relatórios</NavLink>}
        <NavLink to="/consultar"><Search size={18} /> Consultar CPF</NavLink>
        <NavLink to="/certificados"><Award size={18} /> Certificados</NavLink>
      </nav>
    </aside>
  );
}
