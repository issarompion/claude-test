import express from 'express';
import type { Request, Response, NextFunction } from 'express';
import helmet from 'helmet';
import usersRouter from './routes/users';

const app = express();

app.use(helmet());
app.disable('x-powered-by');
app.use(express.json({ limit: '16kb' }));

app.get('/health', (_req: Request, res: Response) => {
  res.json({ status: 'ok' });
});

app.use('/users', usersRouter);

app.use((err: Error & { status?: number }, _req: Request, res: Response, _next: NextFunction) => {
  const status = err.status ?? 500;
  if (status >= 500) {
    console.error(err.stack);
    res.status(status).json({ error: 'Internal server error' });
  } else {
    res.status(status).json({ error: err.message });
  }
});

export default app;
