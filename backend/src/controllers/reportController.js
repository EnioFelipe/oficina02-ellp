import * as reportService from '../services/reportService.js';

export async function workshopParticipants(req, res, next) {
  try {
    res.json(await reportService.workshopParticipantsReport());
  } catch (error) {
    next(error);
  }
}

export async function workshopHistory(req, res, next) {
  try {
    res.json(await reportService.workshopHistoryReport());
  } catch (error) {
    next(error);
  }
}

export async function dashboard(req, res, next) {
  try {
    res.json(await reportService.dashboardReport());
  } catch (error) {
    next(error);
  }
}
