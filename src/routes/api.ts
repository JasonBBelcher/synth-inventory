import { Express, Request, Response, Router } from "express";
const router = Router();
import Synth from "../db/models/synth";
import User from "../db/models/user";
import authenticate from "../middleware/auth";
import { IGetUserAuthInfoRequest, ITokenId } from "../ts-definitions/index";

router
  .get(`/synths`, (req: Request, res: Response) => {
    Synth.find({})
      .populate("user", "username email -_id")
      .exec()
      .then(results => {
        return res.status(200).json(results);
      })
      .catch(err => {
        return res.status(400).json({ error: { message: err.message } });
      });
  })
  .post(
    `/synths`,
    authenticate,
    (req: IGetUserAuthInfoRequest, res: Response) => {
      const synthBody = Object.assign({}, req.body, {
        userId: (req.user as ITokenId).data.id
      });
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
      .then(user => {
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
      .then(user => {
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
