import { useState } from 'react';
import { toast } from 'react-toastify';
import Modal from './ui/Modal.jsx';
import { errorMessage } from '../services/api';
import { enrollmentsService } from '../services/enrollments';

export default function EnrollmentModal({ open, workshop, onClose, onSuccess }) {
  const [enrollment, setEnrollment] = useState({ name: '', age: '', cpf: '' });
  const [submitting, setSubmitting] = useState(false);

  async function submit(event) {
    event.preventDefault();
    setSubmitting(true);
    try {
      await enrollmentsService.create({
        ...enrollment,
        age: Number(enrollment.age),
        workshop: workshop._id
      });
      toast.success('Inscrição realizada com sucesso');
      setEnrollment({ name: '', age: '', cpf: '' });
      onSuccess?.();
      onClose();
    } catch (error) {
      toast.error(errorMessage(error));
    } finally {
      setSubmitting(false);
    }
  }

  function handleClose() {
    setEnrollment({ name: '', age: '', cpf: '' });
    onClose();
  }

  return (
    <Modal open={open} title="Inscrever-se" onClose={handleClose}>
      <form className="stack" onSubmit={submit}>
        <p>{workshop?.name}</p>
        <label>Nome<input required value={enrollment.name} onChange={(e) => setEnrollment({ ...enrollment, name: e.target.value })} /></label>
        <label>Idade<input type="number" min="1" max="120" required value={enrollment.age} onChange={(e) => setEnrollment({ ...enrollment, age: e.target.value })} /></label>
        <label>CPF<input required placeholder="000.000.000-00" value={enrollment.cpf} onChange={(e) => setEnrollment({ ...enrollment, cpf: e.target.value })} /></label>
        <button disabled={submitting}>{submitting ? 'Enviando...' : 'Confirmar inscrição'}</button>
      </form>
    </Modal>
  );
}
