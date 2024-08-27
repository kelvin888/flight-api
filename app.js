import express from 'express';
import path from 'path';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import { scopePerRequest } from 'awilix-express';

import { graphql } from './graphql/middleware.js';
import indexRouter from './routes/readme/index.js';
import authRouter from './routes/auth/routes.js';
import usersRouter from './routes/flights/routes.js';

import { globalErrorHandler, globalNotFoundHandler, logger, swagger } from './middleware/index.js';
import { api } from './middleware/api.js';
import { homePath } from './home-path.js';

export function createApp(container, { useGraphql = true, useDocs = true } = {}) {
  const app = express();
  app.use(scopePerRequest(container));

  app.use(logger);
  app.use(cors({
    origin: 'https://flight-management-app-xj74.vercel.app',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
  }));
  app.use(express.json());
  app.use(express.urlencoded({ extended: false }));
  app.use(cookieParser());
  app.use(express.static(path.join(homePath, 'public')));

  app.use(api);
  app.use('/', indexRouter);
  app.use('/auth', authRouter);
  app.use('/flights', usersRouter);

  if (useGraphql) {
    app.use('/graphql', graphql);
  }
  if (useDocs) {
    app.use('/api-docs', swagger());
  }

  app.use(globalNotFoundHandler);
  app.use(globalErrorHandler);

  return app;
}
