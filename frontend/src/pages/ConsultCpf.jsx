import { Award, Search } from 'lucide-react';
import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { toast } from 'react-toastify';
import Loading from '../components/ui/Loading.jsx';
import Table from '../components/ui/Table.jsx';
import { errorMessage } from '../services/api';
import { downloadCertificate } from '../services/certificates';
import { enrollmentsService } from '../services/enrollments';

export default function ConsultCpf() {
  const location = useLocation();
  const isPublicRoute = location.pathname === '/consultar';
  const [cpf, setCpf] = useState('');
  const [rows, setRows] = useState([]);
  const [searched, setSearched] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleSearch(event) {
    event.preventDefault();
    setLoading(true);
    try {
      const result = await enrollmentsService.findByCpf(cpf);
      setRows(result);
      setSearched(true);
    } catch (error) {
      toast.error(errorMessage(error));
    } finally {
      setLoading(false);
    }
  }

  const content = (
    <section className={`stack ${isPublicRoute ? 'publicContent' : ''}`}>
      <div className="pageHeader">
        <h1>{isPublicRoute ? 'Consultar inscrições' : 'Certificados'}</h1>
      </div>
      {!isPublicRoute && <p className="muted">Consulte inscrições por CPF e baixe certificados de oficinas finalizadas.</p>}
      <form className="filters" onSubmit={handleSearch}>
        <label>CPF<input required placeholder="000.000.000-00" value={cpf} onChange={(event) => setCpf(event.target.value)} /></label>
        <button disabled={loading}><Search size={16} /> Buscar</button>
      </form>
      {loading && <Loading />}
      {!loading && searched && (
        <Table
          rows={rows}
          empty="Nenhuma inscrição encontrada"
          columns={[
            { key: 'workshop', label: 'Oficina', render: (row) => row.workshop?.name },
            { key: 'status', label: 'Status', render: (row) => row.workshop?.status },
            { key: 'date', label: 'Data', render: (row) => row.workshop?.date ? new Date(row.workshop.date).toLocaleDateString('pt-BR') : '-' },
            { key: 'certificate', label: 'Certificado', render: (row) => row.certificateAvailable ? (
              <button className="button secondary" onClick={() => downloadCertificate(row.workshop._id, cpf)}><Award size={16} /> Baixar certificado</button>
            ) : 'Indisponível' }
          ]}
        />
      )}
      {isPublicRoute && (
        <Link className="button secondary" to="/">Voltar ao início</Link>
      )}
    </section>
  );

  if (isPublicRoute) {
    return <main className="publicPage">{content}</main>;
  }

  return content;
}
