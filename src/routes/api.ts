import { NextFunction, Request, Response, Router } from "express";
const router = Router();
import formidable from "express-formidable";
import path from "path";
const uploadsBase = path.join(__dirname, "../../uploads/images");
import { check, validationResult } from "express-validator/check";
import Synth from "../db/models/synth";
import User from "../db/models/user";
import findUserByEmail from "../helpers/findUserEmail";
import authenticate from "../middleware/auth";
import validate from "../middleware/validate";

import {
  IGetUserAuthInfoRequest,
  ISynth,
  IToken,
  IUser
} from "../ts-definitions/index";

function havePermission(DecodedUserToCheck: any, synthCreator: ISynth) {
  if (
    (DecodedUserToCheck as IToken).data.role === "Admin" ||
    synthCreator.user.equals(DecodedUserToCheck.data.id)
  ) {
    return true;
  } else {
    return false;
  }
}

router
  .get(`/synths`, (req: Request, res: Response) => {
    Synth.find({})
      .populate("user", "username email -_id")
      .exec()
      .then((results: ISynth[]) => {
        return res.status(200).json(results);
      })
      .catch(err => {
        return res.status(400).json({ error: { message: err.message } });
      });
  })
  .get(`/synths/:id`, (req: Request, res: Response) => {
    Synth.findById(req.params.id)
      .populate("user", "username email -_id")
      .exec()
      .then((result: ISynth) => {
        return res.status(200).json(result);
      })
      .catch(err => {
        return res.status(400).json({ error: { message: err.message } });
      });
  })
  .patch(
    `/synths/:id`,
    authenticate,
    (req: IGetUserAuthInfoRequest, res: Response, next: NextFunction) => {
      const userId = (req.user as IToken).data.id;
      Synth.findById(req.params.id)
        .populate("user", "username email -_id")
        .exec()
        .then((result: ISynth) => {
          if (havePermission(req.user, result)) {
            result.set(req.body);
            result.save();
            return res.status(201).json(result);
          } else {
            return Promise.reject(
              new Error("you do not have permission to edit this.")
            ) as Promise<object>;
          }
        })
        .catch(err => {
          next({ status: err.status || 401, message: err.message });
        });
    }
  )
  .delete(
    `/synths/:id`,
    authenticate,
    (req: IGetUserAuthInfoRequest, res: Response, next: NextFunction) => {
      Synth.findById(req.params.id)
        .populate("user", "username email -_id")
        .exec()
        .then((result: ISynth) => {
          if (havePermission(req.user, result)) {
            result.remove();
            result.save();
            return res.status(201).json(result);
          } else {
            return Promise.reject(
              new Error("you do not have permission to edit this.")
            ) as Promise<object>;
          }
        })
        .catch(err => {
          next({ status: err.status || 401, message: err.message });
        });
    }
  )
  .post(
    `/synths`,
    authenticate,
    formidable({
      keepExtensions: true,
      uploadDir: uploadsBase
    }),
    (req: IGetUserAuthInfoRequest, res: Response, next: NextFunction) => {
      console.log(req.files.image);

      const imageURL = path.join(
        "/uploads",
        path.basename(req.files.image.path)
      );

      const synthBody = Object.assign(
        {},
        req.fields,
        { image: imageURL },
        {
          user: (req.user as IToken).data.id
        }
      );

      Synth.create(synthBody)

        .then(results => {
          return res.status(201).json(results);
        })
        .catch(err => {
          next({ status: err.status || 401, message: err.message });
        });
    }
  )
  .post(
    `/user/register`,
    validate("register"),
    (req: Request, res: Response, next: NextFunction) => {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return next({
          status: 422,
          message: errors
            .array()
            .map((error: any) => `${error.msg}`)
            .join(" & ")
        });
      }
      findUserByEmail(req.body.email)
        .then(() => {
          User.create(req.body)
            .then((user: IUser) => {
              const { id, username, email } = user;
              const token = user.generateAuthToken();
              return res.status(201).json({ id, username, token, email });
            })
            .catch(err =>
              next({
                status: 400,
                message: err.message || "error registering user."
              })
            );
        })
        .catch(err =>
          next({ status: 400, message: "email already exists.  " })
        );
    }
  )
  .post(`/user/login`, (req: Request, res: Response, next: NextFunction) => {
    User.findOne({
      $or: [
        {
          email: req.body.email
        },
        { username: req.body.username }
      ]
    })
      .exec()
      .then((user: IUser) => {
        if (user === undefined || user === null) {
          return res
            .status(400)
            .json({ err: { message: "User does not exist!" } });
        }
        const { id, username, email } = user;
        user.comparePassword(req.body.password).then(isMatch => {
          if (isMatch) {
            const token = user.generateAuthToken();
            return res.status(200).json({
              id,
              username,
              email,
              token
            });
          } else {
            return res
              .status(400)
              .json({ err: { message: "invalid email or password" } });
          }
        });
      })
      .catch(err => {
        return next({ status: 400, message: err.message || "bad request" });
      });
  })
  .get(
    "/user/me",
    authenticate,
    (req: IGetUserAuthInfoRequest, res: Response, next: NextFunction) => {
      User.findById((req.user as IToken).data.id)
        .exec()
        .then(me => {
          res.status(200).json(me);
        })
        .catch(err => {
          return next({ status: 400, message: err.message || "bad request" });
        });
    }
  );

export default router;
