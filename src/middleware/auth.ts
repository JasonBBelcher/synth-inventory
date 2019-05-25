import { Express, NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import User from "../db/models/user";

import {
  IGetUserAuthInfoRequest,
  IToken,
  IUser
} from "../ts-definitions/index";

const authenticate = (
  req: IGetUserAuthInfoRequest,
  res: Response,
  next: NextFunction
) => {
  let token = req.header("Authorization");
  if (!token) {
    return next({ status: 401, message: "Access denied. No token provided." });
  }
  const splitToken = token.split(" ");

  if (splitToken[0] === "Bearer") {
    token = splitToken[1];
  } else {
    return next({ status: 400, message: "Token format: 'Bearer [JWTTOKEN]' " });
  }

  try {
    const decoded = jwt.verify(token, process.env.SECRET_KEY);
    req.user = decoded;
    User.findById((req.user as IToken).data.id)
      .then((user: IUser) => {
        if (user.role) {
          (req.user as IToken).data.role = user.role;
        }
        return next();
      })
      .catch(err => next({ status: err.status || 401, message: err.message }));
  } catch (err) {
    next({ status: err.status || 401, message: err.message });
  }
};

export default authenticate;
