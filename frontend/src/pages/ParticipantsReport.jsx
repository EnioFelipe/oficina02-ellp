import Loading from '../components/ui/Loading.jsx';
import Table from '../components/ui/Table.jsx';
import { useAsync } from '../hooks/useAsync';
import { reportsService } from '../services/reports';

export default function ParticipantsReport() {
  const { data, loading } = useAsync(() => reportsService.participants(), []);

  if (loading) return <Loading />;

  const workshops = data || [];

  return (
    <section className="stack">
      <div className="pageHeader">
        <h1>Relatório de participantes</h1>
      </div>
      <p className="muted">Inscritos, tutores e total por oficina.</p>

      {workshops.length === 0 ? (
        <div className="panel"><p>Nenhuma oficina cadastrada.</p></div>
      ) : workshops.map((workshop) => (
        <article key={workshop.id} className="panel stack">
          <div className="pageHeader">
            <h2 style={{ margin: 0, fontSize: '1.1rem' }}>{workshop.name}</h2>
            <span className="badge">{workshop.status}</span>
          </div>
          <p><strong>Total de participantes:</strong> {workshop.totalParticipants}</p>

          <h3 style={{ margin: '0 0 8px', fontSize: '0.95rem' }}>Alunos inscritos</h3>
          <Table
            rows={workshop.enrollments || []}
            empty="Nenhum aluno inscrito"
            columns={[
              { key: 'name', label: 'Nome' },
              { key: 'age', label: 'Idade' },
              { key: 'cpf', label: 'CPF' }
            ]}
          />

          <h3 style={{ margin: '16px 0 8px', fontSize: '0.95rem' }}>Tutores</h3>
          <Table
            rows={workshop.tutors || []}
            empty="Nenhum tutor vinculado"
            columns={[
              { key: 'name', label: 'Nome' },
              { key: 'email', label: 'E-mail' }
            ]}
          />
        </article>
      ))}
    </section>
  );
}
