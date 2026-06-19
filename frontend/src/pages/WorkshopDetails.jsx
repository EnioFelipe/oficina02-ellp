import { Trash2 } from 'lucide-react';
import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import Loading from '../components/ui/Loading.jsx';
import Table from '../components/ui/Table.jsx';
import { useAuth } from '../contexts/AuthContext.jsx';
import { useAsync } from '../hooks/useAsync';
import { errorMessage } from '../services/api';
import { enrollmentsService } from '../services/enrollments';
import { usersService } from '../services/users';
import { workshopsService } from '../services/workshops';

export default function WorkshopDetails() {
  const { id } = useParams();
  const { profile } = useAuth();
  const [selectedTutor, setSelectedTutor] = useState('');
  const workshop = useAsync(() => workshopsService.get(id), [id]);
  const canManage = ['professor', 'tutor'].includes(profile?.type);
  const tutors = useAsync(() => canManage ? usersService.list({ type: 'tutor' }) : Promise.resolve([]), [canManage]);
  const enrollments = useAsync(() => canManage ? enrollmentsService.listByWorkshop(id) : Promise.resolve([]), [canManage, id]);

  async function bind(type) {
    try {
      await workshopsService.addTutor(id, selectedTutor);
      setSelectedTutor('');
      toast.success('Participante vinculado');
      workshop.reload();
    } catch (error) {
      toast.error(errorMessage(error));
    }
  }

  async function unbind(type, participantId) {
    try {
      await workshopsService.removeTutor(id, participantId);
      toast.success('Participante removido');
      workshop.reload();
    } catch (error) {
      toast.error(errorMessage(error));
    }
  }

  if (workshop.loading || tutors.loading || enrollments.loading) return <Loading />;
  const data = workshop.data;

  return (
    <section className="stack">
      <div className="panel stack">
        <div className="pageHeader">
          <h1>{data.name}</h1>
          <span className="badge">{data.status}</span>
        </div>
        <p>{data.description}</p>
        <div className="detailsGrid">
          <span><strong>Data:</strong> {new Date(data.date).toLocaleDateString('pt-BR')}</span>
          <span><strong>Carga:</strong> {data.workload}h</span>
          <span><strong>Responsável:</strong> {data.professor?.name}</span>
        </div>
      </div>

      {canManage && (
        <div className="participantControls">
          <label>Tutor<select value={selectedTutor} onChange={(e) => setSelectedTutor(e.target.value)}><option value="">Selecione</option>{tutors.data.map((user) => <option key={user._id} value={user._id}>{user.name}</option>)}</select></label>
          <button disabled={!selectedTutor} onClick={() => bind('tutor')}>Adicionar tutor</button>
        </div>
      )}

      {canManage && (
        <Table
          rows={enrollments.data || []}
          empty="Nenhum aluno matriculado nesta oficina"
          columns={[
            { key: 'name', label: 'Alunos matriculados' },
            { key: 'age', label: 'Idade' },
            { key: 'cpf', label: 'CPF' },
            { key: 'createdAt', label: 'Inscrição', render: (row) => new Date(row.createdAt).toLocaleDateString('pt-BR') }
          ]}
        />
      )}

      <Table
        rows={data.tutors}
        columns={[
          { key: 'name', label: 'Tutores' },
          { key: 'email', label: 'E-mail' },
          { key: 'actions', label: 'Ações', render: (row) => canManage ? <button className="iconButton danger" onClick={() => unbind('tutor', row._id)} title="Remover"><Trash2 size={16} /></button> : null }
        ]}
      />
    </section>
  );
}
