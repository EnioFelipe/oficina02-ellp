import { createUserWithEmailAndPassword, deleteUser } from 'firebase/auth';
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { auth } from '../config/firebase.js';
import { api, errorMessage } from '../services/api.js';

export default function Register() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', email: '', password: '', type: 'tutor' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  async function handleSubmit(event) {
    event.preventDefault();
    setLoading(true);
    setError('');
    let credential;
    try {
      credential = await createUserWithEmailAndPassword(auth, form.email, form.password);
      await api.post('/users', {
        name: form.name,
        email: form.email,
        type: form.type,
        firebaseUid: credential.user.uid
      });
      navigate('/login');
    } catch (err) {
      if (credential?.user) await deleteUser(credential.user).catch(() => {});
      setError(errorMessage(err));
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="authPage">
      <form className="authCard" onSubmit={handleSubmit}>
        <h1>Cadastro</h1>
        {error ? <p className="formError">{error}</p> : null}
        <label>Nome<input required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} /></label>
        <label>E-mail<input type="email" required value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} /></label>
        <label>Senha<input type="password" minLength={6} required value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} /></label>
        <label>Perfil<select value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value })}><option value="tutor">Tutor</option><option value="professor">Professor</option></select></label>
        <button type="submit" disabled={loading}>{loading ? 'Criando...' : 'Criar conta'}</button>
        <Link to="/login">Ja tenho conta</Link>
      </form>
    </main>
  );
}
