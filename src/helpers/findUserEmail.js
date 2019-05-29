import User from "../db/models/user";

export default function findUserByEmail(email) {
  return User.findOne({ email })
    .exec()
    .then(foundUser => {
      if (foundUser) {
        return Promise.reject();
      }
    });
}
