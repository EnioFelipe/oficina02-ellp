import cors from 'cors';
import express from 'express';
import { errorHandler, notFoundHandler } from './middlewares/errorHandler.js';
import userRoutes from './routes/userRoutes.js';
import workshopRoutes from './routes/workshopRoutes.js';

const app = express();

app.use(cors({ origin: process.env.FRONTEND_URL || '*', credentials: true }));
app.use(express.json());

app.get('/health', (_req, res) => res.json({ status: 'ok' }));
app.use('/users', userRoutes);
app.use('/workshops', workshopRoutes);

app.use(notFoundHandler);
app.use(errorHandler);

export default app;
