import express, { NextFunction, Request, Response } from 'express';

const router = express.Router();

/* Redirect to contacts as in the book Hypermedia Systems. */
router.get('/', function (req: Request, res: Response, _: NextFunction) {
  res.redirect('/contacts');
});

export default router;
