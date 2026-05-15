import { BrowserRouter, Link, Navigate, Route, Routes } from 'react-router-dom';
import AppLayout from './components/layout/AppLayout.jsx';
import ProtectedRoute from './routes/ProtectedRoute.jsx';
import { useAuth } from './contexts/AuthContext.jsx';
import Dashboard from './pages/Dashboard.jsx';
import Login from './pages/Login.jsx';
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
      <main style={{ padding: '1.5rem', fontFamily: 'system-ui, sans-serif' }}>
        <p>Carregando...</p>
      </main>
    );
  }

  return (
    <main style={{ padding: '1.5rem', fontFamily: 'system-ui, sans-serif' }}>
      <h1 style={{ fontSize: '1.25rem', margin: 0 }}>ELLP</h1>
      {isAuthenticated && profile ? (
        <>
          <p style={{ marginTop: '0.75rem', color: '#444' }}>
            Logado como <strong>{profile.name}</strong> ({profile.type}).
          </p>
          <p style={{ marginTop: '1rem' }}>
            <Link to="/dashboard" style={{ color: '#0264be', fontWeight: 700 }}>Área interna</Link>
          </p>
        </>
      ) : (
        <>
          <p style={{ marginTop: '0.5rem', color: '#444' }}>Sistema de controle de oficinas.</p>
          <p style={{ marginTop: '1rem', display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
            <Link to="/workshops" style={{ color: '#0264be', fontWeight: 700 }}>Ver oficinas</Link>
            <Link to="/cadastro" style={{ color: '#0264be', fontWeight: 700 }}>Cadastro</Link>
            <Link to="/login" style={{ color: '#0264be', fontWeight: 700 }}>Entrar</Link>
          </p>
        </>
      )}
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
          </Route>
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
