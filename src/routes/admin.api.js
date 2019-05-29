import express from "express";
const router = express.Router();
import Synth from "../db/models/synth";
import User from "../db/models/user";

router
  .get(`/users`, (req, res, next) => {
    User.find({})
      .exec()
      .then(users => {
        return res.status(200).json(users);
      })
      .catch(err => next({ status: err.status, message: err.message }));
  })
  .patch(`/user/:id`, (req, res, next) => {
    console.log("id: ", req.params.id);
    User.findByIdAndUpdate(req.params.id, req.body, { new: true })
      .exec()
      .then(editedUser => {
        return res.status(200).json(editedUser);
      })
      .catch(err => next({ status: err.status, message: err.message }));
  })
  .delete(`/user/:id`, (req, res, next) => {
    User.findByIdAndDelete(req.params.id)
      .then(deletedUser => {
        Synth.deleteMany({ user: req.params.id }).then(result => {
          const report = {};
          report.deletedRecords = result;
          report.deletedUser = deletedUser;
          return res.status(200).json(report);
        });
      })
      .catch(err => next({ status: err.status || 400, message: err.message }));
  });
export default router;
