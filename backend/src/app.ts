import express, { Application, Request, Response } from 'express';
import cors from 'cors';
import clientRoutes from './modules/clients/client.routes';

const app: Application = express();

app.use(cors());
app.use(express.json());

app.get('/health', (_req: Request, res: Response) => {
  res.status(200).json({ status: 'UP', service: 'crm-backend', timestamp: new Date() });
});

app.use('/api/clients', clientRoutes);

export default app;