import PDFDocument from 'pdfkit';
import { getEnrollmentForCertificate } from './enrollmentService.js';

export async function findCertificateData(workshopId, cpf) {
  const enrollment = await getEnrollmentForCertificate(workshopId, cpf);
  return { workshop: enrollment.workshop, participant: enrollment };
}

export function streamCertificatePdf(res, { workshop, participant }) {
  const doc = new PDFDocument({ size: 'A4', layout: 'landscape', margin: 50 });
  const fileName = `certificado-${participant.name.replace(/\s+/g, '-').toLowerCase()}.pdf`;

  res.setHeader('Content-Type', 'application/pdf');
  res.setHeader('Content-Disposition', `attachment; filename="${fileName}"`);

  doc.pipe(res);
  doc.rect(28, 28, 785, 535).lineWidth(2).stroke('#1f7a6f');
  doc.fontSize(30).fillColor('#1f2937').text('Certificado de Participacao', { align: 'center' });
  doc.moveDown(2);
  doc.fontSize(16).fillColor('#374151').text('Certificamos que', { align: 'center' });
  doc.moveDown(0.6);
  doc.fontSize(28).fillColor('#0f766e').text(participant.name, { align: 'center' });
  doc.moveDown(0.8);
  doc.fontSize(16).fillColor('#374151').text(
    `participou da oficina "${workshop.name}", com carga horaria de ${workshop.workload} horas.`,
    { align: 'center' }
  );
  doc.moveDown(0.8);
  doc.text(`Data da oficina: ${new Intl.DateTimeFormat('pt-BR').format(workshop.date)}`, { align: 'center' });
  doc.moveDown(2.5);
  doc.text('Professor responsavel', { align: 'center' });
  doc.moveDown(0.4);
  doc.fontSize(18).text(workshop.professor.name, { align: 'center' });
  doc.end();
}
