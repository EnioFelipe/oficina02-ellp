import Workshop from '../models/Workshop.js';
import Enrollment from '../models/Enrollment.js';

const populateFields = [
  { path: 'professor', select: 'name email' },
  { path: 'tutors', select: 'name email type' }
];

export async function workshopParticipantsReport() {
  const workshops = await Workshop.find().populate(populateFields).sort({ date: -1 });
  const enrollments = await Enrollment.find().select('name age cpf workshop');

  return workshops.map((workshop) => ({
    id: workshop._id,
    name: workshop.name,
    status: workshop.status,
    enrollments: enrollments.filter((enrollment) => enrollment.workshop.toString() === workshop._id.toString()),
    tutors: workshop.tutors,
    totalParticipants: enrollments.filter((enrollment) => enrollment.workshop.toString() === workshop._id.toString()).length + workshop.tutors.length
  }));
}

export async function workshopHistoryReport() {
  return Workshop.find()
    .populate({ path: 'professor', select: 'name email' })
    .sort({ date: -1 });
}

export async function dashboardReport() {
  const [total, active, finished, workshops] = await Promise.all([
    Workshop.countDocuments(),
    Workshop.countDocuments({ status: 'ativa' }),
    Workshop.countDocuments({ status: 'finalizada' }),
    Workshop.find().select('tutors')
  ]);

  const enrollments = await Enrollment.countDocuments();
  const tutors = workshops.reduce((sum, item) => sum + item.tutors.length, 0);

  return { totalWorkshops: total, activeWorkshops: active, finishedWorkshops: finished, participants: enrollments + tutors };
}
