import { findCertificateData, streamCertificatePdf } from '../services/certificateService.js';

export async function generateCertificate(req, res, next) {
  try {
    const data = await findCertificateData(req.params.workshopId, req.params.cpf);
    streamCertificatePdf(res, data);
  } catch (error) {
    next(error);
  }
}
