import { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import EnrollmentModal from '../components/EnrollmentModal.jsx';
import Loading from '../components/ui/Loading.jsx';
import { useAsync } from '../hooks/useAsync';
import { workshopsService } from '../services/workshops';

export default function WorkshopPublicDetail() {
  const { id } = useParams();
  const [enrollOpen, setEnrollOpen] = useState(false);
  const { data, loading } = useAsync(() => workshopsService.get(id), [id]);

  if (loading) return <Loading />;

  const canEnroll = data.status === 'ativa';

  return (
    <main className="publicPage">
      <section className="publicContent stack">
        <div className="pageHeader">
          <h1>{data.name}</h1>
          <span className="badge">{data.status}</span>
        </div>
        <div className="panel stack">
          <p>{data.description}</p>
          <div className="detailsGrid">
            <span><strong>Data:</strong> {new Date(data.date).toLocaleDateString('pt-BR')}</span>
            <span><strong>Carga:</strong> {data.workload}h</span>
            <span><strong>Responsável:</strong> {data.professor?.name}</span>
          </div>
        </div>
        <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
          {canEnroll && <button className="button" onClick={() => setEnrollOpen(true)}>Inscrever-se</button>}
          <Link className="button secondary" to="/workshops">Voltar para oficinas</Link>
          <Link className="button secondary" to="/consultar">Consultar inscrição</Link>
        </div>
        <EnrollmentModal open={enrollOpen} workshop={data} onClose={() => setEnrollOpen(false)} />
      </section>
    </main>
  );
}
