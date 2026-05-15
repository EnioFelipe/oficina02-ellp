import { Link, useParams } from 'react-router-dom';
import Loading from '../components/ui/Loading.jsx';
import { useAsync } from '../hooks/useAsync';
import { workshopsService } from '../services/workshops';

export default function WorkshopPublicDetail() {
  const { id } = useParams();
  const { data, loading } = useAsync(() => workshopsService.get(id), [id]);

  if (loading) return <Loading />;

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
        <Link className="button secondary" to="/workshops">Voltar para oficinas</Link>
      </section>
    </main>
  );
}
