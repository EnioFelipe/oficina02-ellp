import { createUserWithEmailAndPassword, deleteUser } from 'firebase/auth';
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { auth } from '../config/firebase';
import { api, errorMessage } from '../services/api';

export default function Register() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', email: '', password: '', type: 'tutor' });
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event) {
    event.preventDefault();
    setLoading(true);
    let credential;
    try {
      credential = await createUserWithEmailAndPassword(auth, form.email, form.password);
      await api.post('/users', {
        name: form.name,
        email: form.email,
        type: form.type,
        firebaseUid: credential.user.uid
      });
      toast.success('Conta criada com sucesso');
      navigate('/dashboard');
    } catch (error) {
      if (credential?.user) await deleteUser(credential.user).catch(() => {});
      toast.error(errorMessage(error));
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="authPage">
      <form className="authCard" onSubmit={handleSubmit}>
        <h1>Cadastro</h1>
        <label>Nome<input required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} /></label>
        <label>E-mail<input type="email" required value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} /></label>
        <label>Senha<input type="password" minLength="6" required value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} /></label>
        <label>Perfil<select value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value })}><option value="tutor">Tutor</option><option value="professor">Professor</option></select></label>
        <button disabled={loading}>{loading ? 'Criando...' : 'Criar conta'}</button>
        <Link to="/login">Já tenho conta</Link>
      </form>
    </main>
  );
}
