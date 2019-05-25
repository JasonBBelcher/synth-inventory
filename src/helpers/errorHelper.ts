import { NextFunction, Request, Response } from "express";

function errorHandler(
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) {
  return res.status(err.status || 500).json({
    err: {
      message: err.message || "Something went wrong."
    }
  });
}

export default errorHandler;
