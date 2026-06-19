import { Edit, Eye, Plus, Trash2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import Loading from '../components/ui/Loading.jsx';
import Table from '../components/ui/Table.jsx';
import { useAuth } from '../contexts/AuthContext.jsx';
import { useAsync } from '../hooks/useAsync';
import { errorMessage } from '../services/api';
import { usersService } from '../services/users';

export default function Users() {
  const { profile } = useAuth();
  const { data, loading, reload } = useAsync(() => usersService.list(), []);

  async function remove(id) {
    if (!confirm('Deseja excluir este usuário?')) return;
    try {
      await usersService.remove(id);
      toast.success('Usuário removido');
      reload();
    } catch (error) {
      toast.error(errorMessage(error));
    }
  }

  if (loading) return <Loading />;

  return (
    <section className="stack">
      <div className="pageHeader">
        <h1>Usuários</h1>
        {profile?.type === 'professor' && <Link className="button" to="/usuarios/novo"><Plus size={16} /> Novo</Link>}
      </div>
      <Table
        rows={data || []}
        columns={[
          { key: 'name', label: 'Nome' },
          { key: 'email', label: 'E-mail' },
          { key: 'type', label: 'Tipo' },
          { key: 'actions', label: 'Ações', render: (row) => (
            <div className="rowActions">
              <Link style={{alignItems: 'center', justifyContent: 'center', display: 'flex'}} className="iconButton" to={`/usuarios/${row._id}`} title="Detalhes"><Eye size={16} /></Link>
              {profile?.type === 'professor' && <Link style={{alignItems: 'center', justifyContent: 'center', display: 'flex'}} className="iconButton" to={`/usuarios/${row._id}/editar`} title="Editar"><Edit size={16} /></Link>}
              {profile?.type === 'professor' && <button className="iconButton danger" onClick={() => remove(row._id)} title="Excluir"><Trash2 size={16} /></button>}
            </div>
          ) }
        ]}
      />
    </section>
  );
}
