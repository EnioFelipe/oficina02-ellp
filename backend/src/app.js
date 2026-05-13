import cors from 'cors';
import express from 'express';
import { errorHandler, notFoundHandler } from './middlewares/errorHandler.js';

const app = express();

app.use(cors({ origin: process.env.FRONTEND_URL || '*', credentials: true }));
app.use(express.json());

app.get('/health', (_req, res) => res.json({ status: 'ok' }));

app.use(notFoundHandler);
app.use(errorHandler);

export default app;
