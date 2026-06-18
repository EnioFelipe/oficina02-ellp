import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import AppLayout from './components/layout/AppLayout.jsx';
import ProtectedRoute from './routes/ProtectedRoute.jsx';
import Certificates from './pages/Certificates.jsx';
import Dashboard from './pages/Dashboard.jsx';
import Login from './pages/Login.jsx';
import Register from './pages/Register.jsx';
import ConsultCpf from './pages/ConsultCpf.jsx';
import UserDetails from './pages/UserDetails.jsx';
import UserForm from './pages/UserForm.jsx';
import Users from './pages/Users.jsx';
import WorkshopDetails from './pages/WorkshopDetails.jsx';
import WorkshopForm from './pages/WorkshopForm.jsx';
import Workshops from './pages/Workshops.jsx';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/cadastro" element={<Register />} />
        <Route path="/workshops" element={<Workshops />} />
        <Route path="/consultar" element={<ConsultCpf />} />
        <Route path="/workshops/create" element={<Navigate to="/oficinas/nova" replace />} />
        <Route element={<ProtectedRoute />}>
          <Route element={<AppLayout />}>
            <Route index element={<Navigate to="/dashboard" replace />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/oficinas" element={<Workshops />} />
            <Route path="/oficinas/nova" element={<WorkshopForm />} />
            <Route path="/oficinas/create" element={<WorkshopForm />} />
            <Route path="/oficinas/:id" element={<WorkshopDetails />} />
            <Route path="/oficinas/:id/editar" element={<WorkshopForm />} />
            <Route path="/usuarios" element={<ProtectedRoute roles={['professor', 'tutor']}><Users /></ProtectedRoute>} />
            <Route path="/usuarios/novo" element={<ProtectedRoute roles={['professor']}><UserForm /></ProtectedRoute>} />
            <Route path="/usuarios/:id" element={<UserDetails />} />
            <Route path="/usuarios/:id/editar" element={<ProtectedRoute roles={['professor']}><UserForm /></ProtectedRoute>} />
            <Route path="/certificados" element={<Certificates />} />
          </Route>
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
