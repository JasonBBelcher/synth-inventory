import express from "express";
const router = express.Router();
import Synth from "../db/models/synth";
import User from "../db/models/user";

router
  .get(`/synths`, (req: express.Request, res: express.Response) => {
    Synth.find({})
      .exec()
      .then(results => {
        return res.status(200).json(results);
      });
  })
  .post(`/synths`, (req: express.Request, res: express.Response) => {
    Synth.create(req.body)
      .then(results => {
        return res.status(201).json(results);
      })
      .catch(err => {
        return res.status(400).json({ error: { message: err.message } });
      });
  })
  .post(`/user/register`, (req: express.Request, res: express.Response) => {
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
  .post(`/user/login`, (req: express.Request, res: express.Response) => {
    User.findOne({
      email: req.body.email || req.body.username
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
