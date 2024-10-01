import express, { NextFunction, Request, Response } from 'express';
import cookieParser from 'cookie-parser';
import helmet from 'helmet';
import morgan from 'morgan';
import { join } from 'node:path';

import * as middlewares from './middlewares';

import { default as contactsService } from './services/ContactsService';
import { default as indexRouter } from './routes/index-router';
import { default as contactsRouter } from './routes/contacts-router';

const app = express();

// view engine setup
app.set('views', join(__dirname, 'views'));
app.set('view engine', 'twig');

app.use(morgan('dev'));
app.use(helmet());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(join(__dirname, 'public')));

app.use((req: Request, res: Response, next: NextFunction) => {
  req.contactsService = contactsService;
  next();
});

app.use('/', indexRouter);
app.use('/contacts', contactsRouter);

app.use(middlewares.notFound);
app.use(middlewares.errorHandler);

export default app;
