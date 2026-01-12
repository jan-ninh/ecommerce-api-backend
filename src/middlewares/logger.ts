import type { Request, Response, NextFunction } from 'express';

export function logger(req: Request, res: Response, next: NextFunction) {
  console.log('Time', Date.now());
  console.log(req.url);
  console.log(req.method);
  next();
}
