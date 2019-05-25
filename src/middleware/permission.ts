import { Express, NextFunction, Request, Response } from "express";

import Synth from "../../src/db/models/synth";
import { IGetUserAuthInfoRequest, IToken } from "../ts-definitions/index";

const checkPermission = (
  req: IGetUserAuthInfoRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    if ((req.user as IToken).data.role === "Admin") {
      return next();
    }
  } catch (err) {
    return res.status(401).json({
      error: {
        message:
          err.message ||
          "you do not have permission be here without admin rights."
      }
    });
  }

  return next();
};

export default checkPermission;
