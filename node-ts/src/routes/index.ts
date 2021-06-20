import express from 'express';

import appRouter from './app';
import userTokenRouter from './token';
import authRouter from './auth';
import userRouter from './user';

const app: express.Application = express();

app.use('/', appRouter);
app.use('/token', userTokenRouter);
app.use('/auth', authRouter);
app.use('/users', userRouter);

export default app;
