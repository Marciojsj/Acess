import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import 'express-async-errors';
import dotenv from 'dotenv';

import authRoutes from './routes/auth';
import userRoutes from './routes/users';
import entityRoutes from './routes/entities';
import accessRoutes from './routes/access';

import { errorHandler } from './middlewares/errorHandler';

// Carregar variáveis de ambiente
dotenv.config();

const app = express();

// Middlewares globais
app.use(helmet()); // Segurança HTTP headers
app.use(cors()); // CORS
app.use(express.json()); // Parse JSON
app.use(express.urlencoded({ extended: true })); // Parse URL-encoded

// Health check
app.get('/health', (_req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Rotas
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/entities', entityRoutes);
app.use('/api/access', accessRoutes);

// Rota não encontrada
app.use('*', (_req, res) => {
  res.status(404).json({ message: 'Rota não encontrada' });
});

// Error handler (deve ser o último middleware)
app.use(errorHandler);

export default app;
