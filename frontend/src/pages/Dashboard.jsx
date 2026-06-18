import { Award, CheckCircle2, Users, Wrench } from 'lucide-react';
import Loading from '../components/ui/Loading.jsx';
import Table from '../components/ui/Table.jsx';
import { useAsync } from '../hooks/useAsync';
import { reportsService } from '../services/reports';

export default function Dashboard() {
  const dashboard = useAsync(() => reportsService.dashboard(), []);
  const history = useAsync(() => reportsService.history(), []);

  if (dashboard.loading || history.loading) return <Loading />;

  const stats = dashboard.data || {};

  return (
    <section className="stack">
      <div className="pageHeader"><h1>Dashboard</h1></div>
      <div className="statsGrid">
        <article><Wrench /><strong>{stats.totalWorkshops || 0}</strong><span>Oficinas</span></article>
        <article><CheckCircle2 /><strong>{stats.activeWorkshops || 0}</strong><span>Ativas</span></article>
        <article><Award /><strong>{stats.finishedWorkshops || 0}</strong><span>Finalizadas</span></article>
        <article><Users /><strong>{stats.participants || 0}</strong><span>Participantes</span></article>
      </div>
      <Table
        columns={[
          { key: 'name', label: 'Oficina' },
          { key: 'date', label: 'Data', render: (row) => new Date(row.date).toLocaleDateString('pt-BR') },
          { key: 'status', label: 'Status' },
          { key: 'professor', label: 'Responsável', render: (row) => row.professor?.name }
        ]}
        rows={history.data || []}
      />
    </section>
  );
}
