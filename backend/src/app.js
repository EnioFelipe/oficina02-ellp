import cors from 'cors';
import express from 'express';
import certificateRoutes from './routes/certificateRoutes.js';
import enrollmentRoutes from './routes/enrollmentRoutes.js';
import reportRoutes from './routes/reportRoutes.js';
import userRoutes from './routes/userRoutes.js';
import workshopRoutes from './routes/workshopRoutes.js';
import { errorHandler, notFoundHandler } from './middlewares/errorHandler.js';

const app = express();

app.use(cors({ origin: process.env.FRONTEND_URL || '*', credentials: true }));
app.use(express.json());

app.get('/health', (_req, res) => res.json({ status: 'ok' }));
app.use('/users', userRoutes);
app.use('/workshops', workshopRoutes);
app.use('/certificates', certificateRoutes);
app.use('/enrollments', enrollmentRoutes);
app.use('/reports', reportRoutes);

app.use(notFoundHandler);
app.use(errorHandler);

export default app;
