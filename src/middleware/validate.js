// validate register route

import { check, body, oneOf } from 'express-validator/check'

export default method => {
  switch (method) {
    case 'register': {
      return [
        body('email')
          .exists()
          .withMessage('cannot be blank')
          .isEmail()
          .normalizeEmail()
          .withMessage('invalid email address.'),
        body('password')
          .exists({ checkFalsy: true })
          .withMessage("You didn't enter anything.")
          .exists({ checkFalsy: false, checkNull: true })
          .withMessage('must have a [password] field')
          .isLength({ min: 10, max: 100 })
          .withMessage('Must contain at least 10 characters.')
      ]
    }
    case 'login': {
      return [
        body('email')
          .exists()
          .withMessage('please enter your email address to login.')
          .isEmail()
          .normalizeEmail()
          .withMessage('invalid email address.'),

        body('password')
          .exists({ checkFalsy: true })
          .withMessage("You didn't enter anything.")
          .exists({ checkFalsy: false, checkNull: true })
          .withMessage('must have a [password] field')
          .isLength({ min: 10, max: 100 })
          .withMessage('Must contain at least 10 characters.')
      ]
    }
    case 'edit': {
      return [
        body('brand').exists({ checkFalsy: true, checkNull: true }),
        body('modelNumber').exists({ checkFalsy: true, checkNull: true }),
        body('year').exists({ checkFalsy: true, checkNull: true }),
        body('description').exists({ checkFalsy: true, checkNull: true }),
        body('image').exists({ checkFalsy: true, checkNull: true })
      ]
    }
  }
}
