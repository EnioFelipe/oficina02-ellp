import { Link } from 'react-router-dom';
import { Users, Wrench } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext.jsx';

export default function Dashboard() {
  const { profile } = useAuth();
  const canSeeUsers = profile?.type === 'professor' || profile?.type === 'tutor';

  return (
    <section className="stack">
      <div className="pageHeader">
        <h1>Olá, {profile?.name}</h1>
        <span className="badge">{profile?.type}</span>
      </div>
      <div className="panel stack">
        <p style={{ margin: 0, color: '#64748b' }}>
          Use o menu ao lado ou os atalhos abaixo para gerenciar oficinas e usuários internos.
        </p>
        <motionlessLinks canSeeUsers={canSeeUsers} />
      </div>
    </section>
  );
}

function motionlessLinks({ canSeeUsers }) {
  return (
    <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
      <Link className="button" to="/oficinas"><Wrench size={16} /> Oficinas</Link>
      {canSeeUsers && <Link className="button secondary" to="/usuarios"><Users size={16} /> Usuários</Link>}
      <Link className="button secondary" to="/workshops">Ver oficinas públicas</Link>
    </div>
  );
}
