import { useParams } from 'react-router-dom';
import Loading from '../components/ui/Loading.jsx';
import { useAsync } from '../hooks/useAsync';
import { usersService } from '../services/users';

export default function UserDetails() {
  const { id } = useParams();
  const { data, loading } = useAsync(() => usersService.get(id), [id]);

  if (loading) return <Loading />;

  return (
    <section className="panel stack">
      <h1>{data.name}</h1>
      <p><strong>E-mail:</strong> {data.email}</p>
      <p><strong>Tipo:</strong> {data.type}</p>
      <p><strong>UID Firebase:</strong> {data.firebaseUid}</p>
      <p><strong>Criado em:</strong> {new Date(data.createdAt).toLocaleString('pt-BR')}</p>
    </section>
  );
}
