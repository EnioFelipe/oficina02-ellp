import { Edit, Eye, Plus, Trash2 } from 'lucide-react';
import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { toast } from 'react-toastify';
import Loading from '../components/ui/Loading.jsx';
import Table from '../components/ui/Table.jsx';
import { useAuth } from '../contexts/AuthContext.jsx';
import { useAsync } from '../hooks/useAsync';
import { errorMessage } from '../services/api';
import { workshopsService } from '../services/workshops';

export default function Workshops() {
  const { profile } = useAuth();
  const location = useLocation();
  const isPublicPage = location.pathname === '/workshops';
  const [filters, setFilters] = useState({
    search: '',
    status: isPublicPage ? 'ativa' : '',
    sort: 'dateDesc'
  });
  const { data, loading, reload } = useAsync(() => workshopsService.list(filters), [filters]);
  const canManage = ['professor', 'tutor'].includes(profile?.type);

  async function remove(id) {
    if (!confirm('Deseja excluir esta oficina?')) return;
    try {
      await workshopsService.remove(id);
      toast.success('Oficina removida');
      reload();
    } catch (error) {
      toast.error(errorMessage(error));
    }
  }

  if (loading) return <Loading />;

  const detailPath = (id) => (isPublicPage ? `/workshops/${id}` : `/oficinas/${id}`);

  return (
    <section className={`stack ${isPublicPage ? 'publicPage publicContent' : ''}`}>
      <div className="pageHeader">
        <h1>Oficinas</h1>
        {canManage && !isPublicPage && (
          <Link className="button" to="/oficinas/nova"><Plus size={16} /> Nova oficina</Link>
        )}
      </div>
      <div className="filters">
        <input
          placeholder="Buscar oficinas"
          value={filters.search}
          onChange={(e) => setFilters({ ...filters, search: e.target.value })}
        />
        <select value={filters.status} onChange={(e) => setFilters({ ...filters, status: e.target.value })}>
          <option value="">Todos os status</option>
          <option value="ativa">Ativas</option>
          <option value="finalizada">Finalizadas</option>
        </select>
        <select value={filters.sort} onChange={(e) => setFilters({ ...filters, sort: e.target.value })}>
          <option value="dateDesc">Mais recentes</option>
          <option value="dateAsc">Mais antigas</option>
          <option value="name">Nome</option>
        </select>
      </div>
      <Table
        rows={data || []}
        columns={[
          { key: 'name', label: 'Nome' },
          { key: 'date', label: 'Data', render: (row) => new Date(row.date).toLocaleDateString('pt-BR') },
          { key: 'workload', label: 'Horas', render: (row) => `${row.workload}h` },
          { key: 'professor', label: 'Responsável', render: (row) => row.professor?.name },
          { key: 'status', label: 'Status' },
          {
            key: 'actions',
            label: 'Ações',
            render: (row) => (
              <div className="rowActions">
                <Link className="iconButton" to={detailPath(row._id)} title="Detalhes"><Eye size={16} /></Link>
                {canManage && !isPublicPage && (
                  <Link className="iconButton" to={`/oficinas/${row._id}/editar`} title="Editar"><Edit size={16} /></Link>
                )}
                {canManage && !isPublicPage && (
                  <button type="button" className="iconButton danger" onClick={() => remove(row._id)} title="Excluir">
                    <Trash2 size={16} />
                  </button>
                )}
              </div>
            )
          }
        ]}
      />
    </section>
  );
}
