import express, { Express } from 'express';
import cors from 'cors';
import path from 'path';
import { todosRouter } from './api/todos';

export function createApp(dataFilePath?: string): Express {
  const app = express();

  app.use(cors());
  app.use(express.json());

  // Set data file path (for testing or production)
  const filePath = dataFilePath || path.join(__dirname, '../data/todos.json');
  app.locals.dataFilePath = filePath;

  // Routes
  app.use('/api/todos', todosRouter);

  // Health check
  app.get('/health', (req, res) => {
    res.json({ status: 'ok' });
  });

  return app;
}
