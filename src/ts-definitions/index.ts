import { Request } from "express";
import { Document } from "mongoose";

export interface IGetUserAuthInfoRequest extends Request {
  user: IToken | string | object;
}

export interface IInput {
  db: string;
}

export interface IToken {
  data: {
    role: string;
    id: string;
  };
}
type AuthFunc = () => string;

type CompareAuth = (password: string) => Promise<boolean>;

export interface IUser extends Document {
  email: string;
  username: string;
  password: string;
  role: string;
  generateAuthToken: AuthFunc;
  comparePassword: CompareAuth;
}

export interface ISynth extends Document {
  brand: string;
  imgUrl?: string;
  modelNumber: string;
  user: IUser["_id"];
  year?: string;
  description?: string;
  image: string;
}
