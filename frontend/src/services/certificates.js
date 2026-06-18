import { api } from './api';

export async function downloadCertificate(workshopId, cpf) {
  const response = await api.get(`/certificates/${workshopId}/${cpf}`, { responseType: 'blob' });
  const url = URL.createObjectURL(response.data);
  const link = document.createElement('a');
  link.href = url;
  link.download = 'certificado.pdf';
  link.click();
  URL.revokeObjectURL(url);
}
