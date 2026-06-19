import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import Loading from '../components/ui/Loading.jsx';
import { useAuth } from '../contexts/AuthContext.jsx';
import { errorMessage } from '../services/api';
import { usersService } from '../services/users';
import { workshopsService } from '../services/workshops';

export default function WorkshopForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { profile } = useAuth();
  const [responsibles, setResponsibles] = useState([]);
  const [loading, setLoading] = useState(Boolean(id));
  const [loadingResponsibles, setLoadingResponsibles] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({
    name: '',
    description: '',
    date: '',
    workload: 1,
    professor: '',
    status: 'ativa'
  });

  useEffect(() => {
    usersService.list()
      .then((users) => {
        const allowedResponsibles = users.filter((user) => ['professor', 'tutor'].includes(user.type));
        setResponsibles(allowedResponsibles);

        if (!id && ['professor', 'tutor'].includes(profile?.type)) {
          const currentUser = allowedResponsibles.find((user) => user._id === profile._id);
          if (currentUser) {
            setForm((currentForm) => ({ ...currentForm, professor: currentUser._id }));
          }
        }
      })
      .catch((error) => toast.error(errorMessage(error)))
      .finally(() => setLoadingResponsibles(false));

    if (!id) return;

    workshopsService.get(id)
      .then((workshop) => {
        setForm({
          name: workshop.name,
          description: workshop.description,
          date: workshop.date.slice(0, 10),
          workload: workshop.workload,
          professor: workshop.professor?._id || '',
          status: workshop.status
        });
      })
      .catch((error) => toast.error(errorMessage(error)))
      .finally(() => setLoading(false));
  }, [id, profile]);

  async function handleSubmit(event) {
    event.preventDefault();
    setSubmitting(true);
    try {
      if (id) await workshopsService.update(id, form);
      else await workshopsService.create(form);
      toast.success('Oficina salva');
      navigate('/oficinas');
    } catch (error) {
      toast.error(errorMessage(error));
    } finally {
      setSubmitting(false);
    }
  }

  if (loading || loadingResponsibles) return <Loading />;

  return (
    <form className="form stack" onSubmit={handleSubmit}>
      <div className="pageHeader"><h1>{id ? 'Editar oficina' : 'Nova oficina'}</h1></div>
      <label>Nome<input required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} /></label>
      <label>Descrição<textarea required rows="4" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} /></label>
      <label>Data<input type="date" required value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} /></label>
      <label>Carga horária<input type="number" min="1" required value={form.workload} onChange={(e) => setForm({ ...form, workload: Number(e.target.value) })} /></label>
      <label>Responsável<select required value={form.professor} onChange={(e) => setForm({ ...form, professor: e.target.value })}><option value="">Selecione</option>{responsibles.map((user) => <option key={user._id} value={user._id}>{user.name} ({user.type})</option>)}</select></label>
      <label>Status<select value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })}><option value="ativa">Ativa</option><option value="finalizada">Finalizada</option></select></label>
      <div className="rowActions">
        <button disabled={submitting}>{submitting ? 'Salvando...' : 'Salvar oficina'}</button>
        <Link className="button secondary" to="/oficinas">Cancelar</Link>
      </div>
    </form>
  );
}
