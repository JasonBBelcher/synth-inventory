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
    const err = new Error("Access denied. No token provided.");
    return res.status(401).json({ error: { message: err } });
  }
  token = token.split(" ")[1];

  try {
    const decoded = jwt.verify(token, process.env.SECRET_KEY);
    req.user = decoded;
    User.findById((req.user as IToken).data.id).then((user: IUser) => {
      if (user.role) {
        (req.user as IToken).data.role = user.role;
      }
    });

    return next();
  } catch (ex) {
    return res.status(401).json({ error: { message: ex.message } });
  }

  return next();
};

export default authenticate;
