// validate register route

import { body } from "express-validator/check";

export default (method: string) => {
  switch (method) {
    case "register": {
      return [
        body("email")
          .exists()
          .withMessage("cannot be blank")
          .isEmail()
          .withMessage("invalid email address."),
        body("username")
          .exists({ checkFalsy: true })
          .withMessage("You didn't enter anything.")
          .exists({ checkFalsy: false, checkNull: true })
          .withMessage("must have a [username] field")
          .isLength({ min: 4, max: 100 })
          .withMessage(
            "must be more 4 characters and no more than 100 characters"
          ),
        body("password")
          .exists({ checkFalsy: true })
          .withMessage("You didn't enter anything.")
          .exists({ checkFalsy: false, checkNull: true })
          .withMessage("must have a [password] field")
      ];
    }
  }
};
