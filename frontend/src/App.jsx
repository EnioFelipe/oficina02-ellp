import { BrowserRouter, Link, Navigate, Route, Routes } from 'react-router-dom';
import AppLayout from './components/layout/AppLayout.jsx';
import ProtectedRoute from './routes/ProtectedRoute.jsx';
import { useAuth } from './contexts/AuthContext.jsx';
import ConsultCpf from './pages/ConsultCpf.jsx';
import Dashboard from './pages/Dashboard.jsx';
import Login from './pages/Login.jsx';
import ParticipantsReport from './pages/ParticipantsReport.jsx';
import Register from './pages/Register.jsx';
import UserDetails from './pages/UserDetails.jsx';
import UserForm from './pages/UserForm.jsx';
import Users from './pages/Users.jsx';
import WorkshopDetails from './pages/WorkshopDetails.jsx';
import WorkshopForm from './pages/WorkshopForm.jsx';
import WorkshopPublicDetail from './pages/WorkshopPublicDetail.jsx';
import Workshops from './pages/Workshops.jsx';

function Home() {
  const { loading, profile, isAuthenticated } = useAuth();

  if (loading) {
    return (
      <main className="publicPage">
        <section className="publicContent"><p>Carregando...</p></section>
      </main>
    );
  }

  return (
    <main className="publicPage">
      <section className="stack publicContent">
        <div className="pageHeader">
          <h1>ELLP</h1>
        </div>
        <div className="panel">
          {isAuthenticated && profile ? (
            <>
              <p style={{ margin: 0, color: '#444' }}>
                Logado como <strong>{profile.name}</strong> ({profile.type}).
              </p>
              <p style={{ marginTop: '1rem' }}>
                <Link to="/dashboard" className="button">Área interna</Link>
              </p>
            </>
          ) : (
            <>
              <p style={{ margin: 0, color: '#444' }}>Sistema de controle de oficinas.</p>
              <p style={{ marginTop: '1rem', display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
                <Link to="/workshops" className="button">Ver oficinas</Link>
                <Link to="/consultar" className="button secondary">Consultar inscrição</Link>
                <Link to="/cadastro" className="button secondary">Cadastro</Link>
                <Link to="/login" className="button secondary">Entrar</Link>
              </p>
            </>
          )}
        </div>
      </section>
    </main>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/cadastro" element={<Register />} />
        <Route path="/workshops" element={<Workshops />} />
        <Route path="/workshops/:id" element={<WorkshopPublicDetail />} />
        <Route path="/consultar" element={<ConsultCpf />} />
        <Route path="/interno" element={<Navigate to="/dashboard" replace />} />

        <Route element={<ProtectedRoute />}>
          <Route element={<AppLayout />}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/oficinas" element={<Workshops />} />
            <Route path="/oficinas/nova" element={<ProtectedRoute roles={['professor', 'tutor']}><WorkshopForm /></ProtectedRoute>} />
            <Route path="/oficinas/:id" element={<WorkshopDetails />} />
            <Route path="/oficinas/:id/editar" element={<ProtectedRoute roles={['professor', 'tutor']}><WorkshopForm /></ProtectedRoute>} />
            <Route path="/usuarios" element={<ProtectedRoute roles={['professor', 'tutor']}><Users /></ProtectedRoute>} />
            <Route path="/usuarios/novo" element={<ProtectedRoute roles={['professor']}><UserForm /></ProtectedRoute>} />
            <Route path="/usuarios/:id" element={<UserDetails />} />
            <Route path="/usuarios/:id/editar" element={<ProtectedRoute roles={['professor']}><UserForm /></ProtectedRoute>} />
            <Route path="/relatorios" element={<ProtectedRoute roles={['professor', 'tutor']}><ParticipantsReport /></ProtectedRoute>} />
            <Route path="/certificados" element={<ConsultCpf />} />
          </Route>
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
