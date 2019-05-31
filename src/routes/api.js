import { Express, NextFunction, Request, Router } from 'express'
import multer from 'multer'
import path from 'path'
import { validationResult, oneOf } from 'express-validator/check'
import Synth from '../db/models/synth'
import User from '../db/models/user'
import havePermission from '../helpers/checkPermissions'
import findUserByEmail from '../helpers/findUserEmail'

import authenticate from '../middleware/auth'
import uploadMiddleware from '../middleware/uploadMiddleware'
import validate from '../middleware/validate'
const router = Router()
const uploadsBase = path.join(__dirname, '../../uploads/images')

const storage = multer.diskStorage({
  destination: uploadsBase,
  filename: (req, file, cb) => {
    cb(
      null,
      file.fieldname + '-' + Date.now() + path.extname(file.originalname)
    )
  }
})
const upload = multer({ storage })

router
  .get(`/synths`, (req, res) => {
    Synth.find({})
      .populate('user', 'username email -_id')
      .exec()
      .then(results => {
        return res.status(200).json(results)
      })
      .catch(err => {
        return res.status(400).json({ error: { message: err.message } })
      })
  })
  .get(`/synths/:id`, (req, res) => {
    Synth.findById(req.params.id)
      .populate('user', 'username email -_id')
      .exec()
      .then(result => {
        return res.status(200).json(result)
      })
      .catch(err => {
        return res.status(400).json({ error: { message: err.message } })
      })
  })
  .patch(
    `/synths/:id`,
    authenticate,
    uploadMiddleware,
    oneOf(validate('edit')),
    (req, res, next) => {
      const errors = validationResult(req)
      if (!errors.isEmpty()) {
        return next({
          status: 422,
          message: errors
            .array()
            .map(error => `${error.msg}`)
            .join(' & ')
        })
      }
      Synth.findById(req.params.id)
        .populate('user', 'username email id')
        .exec()
        .then(result => {
          if (result.user.id === req.user.data.id) {
            result.set(req.body)
            result.save()
            return res.status(201).json(result)
          }
          if (!havePermission(req.user, result)) {
            return Promise.reject(
              new Error('you do not have permission to edit this.')
            )
          }
        })
        .catch(err => {
          next({ status: err.status || 401, message: err.message })
        })
    }
  )
  .delete(`/synths/:id`, authenticate, (req, res, next) => {
    Synth.findById(req.params.id)
      .populate('user', 'username email id')
      .exec()
      .then(result => {
        if (result.user.id === req.user.data.id) {
          result.remove()
          result.save()
          return res.status(201).json(result)
        } else if (!havePermission(req.user, result)) {
          return Promise.reject(
            new Error('you do not have permission to edit this.')
          )
        }
      })
      .catch(err => {
        next({ status: err.status || 401, message: err.message })
      })
  })
  .post(`/synths`, authenticate, uploadMiddleware, (req, res, next) => {
    if (!req.file) {
      return next({ status: 400, message: 'no image file sent' })
    }

    const { brand, year, description, modelNumber } = req.body
    new Synth({
      brand,
      year,
      image: { data: req.imageData, contentType: req.imageType },
      description,
      modelNumber,
      user: req.user.data.id
    })
      .save()

      .then(results => {
        return res.status(201).json(results)
      })
      .catch(err => {
        next({ status: err.status || 401, message: err.message })
      })
  })
  .post(`/user/register`, validate('register'), (req, res, next) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return next({
        status: 422,
        message: errors
          .array()
          .map(error => `${error.msg}`)
          .join(' & ')
      })
    }
    findUserByEmail(req.body.email)
      .then(() => {
        User.create(req.body)
          .then(user => {
            const { id, username, email } = user
            const token = user.generateAuthToken()
            return res.status(201).json({ id, username, token, email })
          })
          .catch(err =>
            next({
              status: 400,
              message: err.message || 'error registering user.'
            })
          )
      })
      .catch(err => next({ status: 400, message: 'email already exists.  ' }))
  })
  .post(`/user/login`, validate('login'), (req, res, next) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return next({
        status: 422,
        message: errors
          .array()
          .map(error => `${error.msg}`)
          .join(' & ')
      })
    }
    User.findOne({
      email: req.body.email
    })
      .exec()
      .then(user => {
        if (user === undefined || user === null) {
          return res
            .status(400)
            .json({ err: { message: 'User does not exist!' } })
        }
        const { id, username, email } = user
        user.comparePassword(req.body.password).then(isMatch => {
          if (isMatch) {
            const token = user.generateAuthToken()
            return res.status(200).json({
              id,
              username,
              email,
              token
            })
          } else {
            return res
              .status(400)
              .json({ err: { message: 'invalid email or password' } })
          }
        })
      })
      .catch(err => {
        return next({ status: 400, message: err.message || 'bad request' })
      })
  })
  .get('/user/me', authenticate, (req, res, next) => {
    User.findById(req.user.data.id)
      .exec()
      .then(me => {
        res.status(200).json(me)
      })
      .catch(err => {
        return next({ status: 400, message: err.message || 'bad request' })
      })
  })

export default router
