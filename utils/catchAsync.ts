import { Request, Response, NextFunction } from 'express';

// Type for an asynchronous function
type AsyncHandler = (req: Request, res: Response, next: NextFunction) => Promise<void>;

// Higher-order function to catch async errors
const catchAsync = (fn: AsyncHandler) => {
  return (req: Request, res: Response, next: NextFunction) => {
    fn(req, res, next).catch(next);
  };
};

export default catchAsync;
