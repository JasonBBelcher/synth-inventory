import { Express, NextFunction, Request, Response, Router } from "express";
const router = Router();
import formidable from "express-formidable";
import path from "path";
const uploadsBase = path.join(__dirname, "../../uploads/images");
import Synth from "../db/models/synth";
import User from "../db/models/user";
import authenticate from "../middleware/auth";
import {
  IGetUserAuthInfoRequest,
  ISynth,
  ITokenId,
  IUser,
  IUserRole
} from "../ts-definitions/index";

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
      const userId = (req.user as ITokenId).data.id;
      Synth.findById(req.params.id)
        .populate("user", "username email -_id")
        .exec()
        .then((result: ISynth) => {
          if (
            (req.user as IUserRole).data.role === "Admin" ||
            result.user.equals(userId)
          ) {
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
          console.log(err);
          return res.status(400).json({ error: { message: err.message } });
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
          if (
            (req.user as IUserRole).data.role === "Admin" ||
            result.user.equals((req.user as ITokenId).data.id)
          ) {
            result.remove();
            result.save();
            return res.status(201).json(result);
          } else {
            return Promise.reject(
              new Error("you do not have permission to edit this.")
            ) as Promise<object>;
          }
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
    (req: IGetUserAuthInfoRequest, res: Response) => {
      console.log(req.files.image);

      const imageURL = path.join(
        "/uploads",
        path.basename(req.files.image.path)
      );
      console.log("imageURL: ", imageURL);
      const synthBody = Object.assign(
        {},
        req.fields,
        { image: imageURL },
        {
          user: (req.user as ITokenId).data.id
        }
      );
      console.log(synthBody);
      Synth.create(synthBody)
        .then(results => {
          return res.status(201).json(results);
        })
        .catch(err => {
          return res.status(400).json({ error: { message: err.message } });
        });
    }
  )
  .post(`/user/register`, (req: Request, res: Response) => {
    User.create(req.body)
      .then((user: IUser) => {
        const { id, username } = user;
        const token = user.generateAuthToken();
        return res.status(201).json({ id, username, token });
      })
      .catch(err => {
        return res.status(400).json({ error: { message: err.message } });
      });
  })
  .post(`/user/login`, (req: Request, res: Response) => {
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
            .json({ error: { message: "User does not exist!" } });
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
              .json({ error: { message: "invalid email or password" } });
          }
        });
      })
      .catch(err => res.status(400).json({ error: { message: err.message } }));
  });

export default router;
