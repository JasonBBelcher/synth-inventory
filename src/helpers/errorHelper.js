import { NextFunction, Request, Response } from "express";

function errorHandler(err, req, res, next) {
  return res.status(err.status || 500).json({
    err: {
      message: err.message || "Something went wrong."
    }
  });
}

export default errorHandler;
