import { IUser } from "../../src/ts-definitions";
import User from "../db/models/user";

export default function findUserByEmail(email: string) {
  return User.findOne({ email })
    .exec()
    .then((foundUser: IUser) => {
      if (foundUser) {
        return Promise.reject();
      }
    });
}
