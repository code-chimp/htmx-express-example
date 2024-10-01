import { NextFunction, Request, Response } from 'express';
import createError from 'http-errors';
import HttpStatusCodes from './@enumerations/HttpStatusCodes';

export function notFound(req: Request, res: Response, next: NextFunction) {
  next(createError(HttpStatusCodes.NotFound));
}

export function errorHandler(err: Error, req: Request, res: Response, _: NextFunction) {
  const statusCode =
    res.statusCode !== HttpStatusCodes.Ok
      ? res.statusCode
      : HttpStatusCodes.InternalServerError;

  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(statusCode);
  res.render('error');
}
