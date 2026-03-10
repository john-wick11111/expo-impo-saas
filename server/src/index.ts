import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { PrismaClient } from '@prisma/client';

dotenv.config();

import buyersRouter from './routes/buyers';
import crmRouter from './routes/crm';
import emailRouter from './routes/email';
import stripeRouter from './routes/stripe';
import listsRouter from './routes/lists';
import exportRouter from './routes/export';
import emailSequencesRouter from './routes/email-sequences';
import marketInsightsRouter from './routes/market-insights';
import importersRouter from './routes/importers';
import { startEmailCronJob } from './cron';

const app = express();
export const prisma = new PrismaClient();

app.use(cors());
app.use(express.json());

app.use('/api/buyers', buyersRouter);
app.use('/api/crm', crmRouter);
app.use('/api/email', emailRouter);
app.use('/api/stripe', stripeRouter);
app.use('/api/lists', listsRouter);
app.use('/api/export', exportRouter);
app.use('/api/email-sequences', emailSequencesRouter);
app.use('/api/market-insights', marketInsightsRouter);
app.use('/api/importers', importersRouter);

app.get('/health', (req, res) => {
    res.json({ status: 'ok', message: 'Expo & Impo API is running' });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
    startEmailCronJob();
});
