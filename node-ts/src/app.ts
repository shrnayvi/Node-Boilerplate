//import 'reflect-metadata';
import express, { Application } from 'express';

import loaders from './loaders';

const app: Application = express();

app.use('/v1', express.static(`${__dirname}/../static`));
loaders({ app });

export default app;
