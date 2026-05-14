import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import Loading from '../components/ui/Loading.jsx';
import { errorMessage } from '../services/api';
import { usersService } from '../services/users';

export default function UserForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', email: '', type: 'tutor', firebaseUid: '' });
  const [loading, setLoading] = useState(Boolean(id));

  useEffect(() => {
    if (!id) return;
    usersService.get(id).then((user) => setForm(user)).finally(() => setLoading(false));
  }, [id]);

  async function handleSubmit(event) {
    event.preventDefault();
    try {
      if (id) await usersService.update(id, form);
      else await usersService.create(form);
      toast.success('Usuário salvo');
      navigate('/usuarios');
    } catch (error) {
      toast.error(errorMessage(error));
    }
  }

  if (loading) return <Loading />;

  return (
    <form className="form stack" onSubmit={handleSubmit}>
      <div className="pageHeader"><h1>{id ? 'Editar usuário' : 'Novo usuário'}</h1></div>
      <label>Nome<input required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} /></label>
      <label>E-mail<input type="email" required value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} /></label>
      {!id && <label>UID Firebase<input required value={form.firebaseUid} onChange={(e) => setForm({ ...form, firebaseUid: e.target.value })} /></label>}
      <label>Tipo<select value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value })}><option value="professor">Professor</option><option value="tutor">Tutor</option></select></label>
      <button>Salvar</button>
    </form>
  );
}
