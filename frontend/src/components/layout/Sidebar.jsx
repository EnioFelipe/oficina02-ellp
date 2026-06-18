import { Award, Gauge, Users, Wrench } from 'lucide-react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext.jsx';
import styles from './Layout.module.css';

export default function Sidebar() {
  const { profile } = useAuth();
  const canSeeUsers = ['professor', 'tutor'].includes(profile?.type);

  return (
    <aside className={styles.sidebar}>
      <div style={{display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', paddingBottom: '30px'}}>
        <img style={{width:'60px', borderRadius: '50%'}}src="./ELLP_logo.jpg"></img>
        <h1 style={{alignSelf: 'center', margin: 0}}>ELLP</h1>
      </div>
      <nav>
        <NavLink to="/dashboard"><Gauge size={18} /> Dashboard</NavLink>
        <NavLink to="/oficinas"><Wrench size={18} /> Oficinas</NavLink>
        {canSeeUsers && <NavLink to="/usuarios"><Users size={18} /> Usuários</NavLink>}
        <NavLink to="/certificados"><Award size={18} /> Certificados</NavLink>
      </nav>
    </aside>
  );
}
