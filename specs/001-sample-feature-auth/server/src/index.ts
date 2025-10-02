import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { database } from './database/connection';
import { sessionMiddleware } from './middleware/session';
import authRoutes from './routes/auth';
import { logInfo, logError } from './utils/logger';

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:3000',
  credentials: true // Allow cookies
}));
app.use(express.json());
app.use(sessionMiddleware);

// Routes
app.use('/api/auth', authRoutes);

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Initialize database and start server
async function start() {
  try {
    await database.connect();
    await database.runMigrations();

    app.listen(PORT, () => {
      logInfo(`Server started on port ${PORT}`);
    });
  } catch (error) {
    logError('Failed to start server', error);
    process.exit(1);
  }
}

// Handle graceful shutdown
process.on('SIGINT', async () => {
  logInfo('Shutting down server...');
  await database.close();
  process.exit(0);
});

start();
