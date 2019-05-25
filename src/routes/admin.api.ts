import { Express, NextFunction, Request, Response, Router } from "express";
const router = Router();
import Synth from "../db/models/synth";
import User from "../db/models/user";
import { IReport, ISynth, IUser } from "../ts-definitions/index";
const report: IReport = { deletedRecords: null, deletedUser: null };

router
  .get(`/users`, (req: Request, res: Response, next: NextFunction) => {
    User.find({})
      .exec()
      .then((users: IUser[]) => {
        return res.status(200).json(users);
      })
      .catch(err => next({ status: err.status, message: err.message }));
  })
  .patch(`/user/:id`, (req: Request, res: Response, next: NextFunction) => {
    console.log("id: ", req.params.id);
    User.findByIdAndUpdate(req.params.id, req.body, { new: true })
      .exec()
      .then((editedUser: IUser) => {
        return res.status(200).json(editedUser);
      })
      .catch(err => next({ status: err.status, message: err.message }));
  })
  .delete(`/user/:id`, (req: Request, res: Response, next: NextFunction) => {
    User.findByIdAndDelete(req.params.id)
      .then((deletedUser: IUser) => {
        Synth.deleteMany({ user: req.params.id }).then(result => {
          report.deletedRecords = result;
          report.deletedUser = deletedUser;
          return res.status(200).json(report);
        });
      })
      .catch(err => next({ status: err.status || 400, message: err.message }));
  });
export default router;
