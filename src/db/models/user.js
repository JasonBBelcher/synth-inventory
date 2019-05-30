import bcrypt from 'bcrypt'

import jwt from 'jsonwebtoken'
import mongoose from 'mongoose'
import uniqueValidator from 'mongoose-unique-validator'

const UserSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    set: v => v.toLowerCase().trim()
  },
  username: {
    type: String,
    required: true,
    trim: true,
    unique: true
  },
  password: {
    type: String,
    trim: true,
    required: true
  },
  role: {
    type: String,
    enum: ['Admin', 'User'],
    default: 'User'
  }
})

UserSchema.pre('save', function(next) {
  if (!this.isModified('password')) {
    next()
  }
  bcrypt
    .hash(this.password, 10)
    .then(hashed => {
      this.password = hashed
      next()
    })
    .catch(err => next(err))
})

UserSchema.methods.comparePassword = function(password, next) {
  const user = this

  return bcrypt
    .compare(password, user.password)
    .then(compared => {
      return compared
    })
    .catch(err => next())
}

UserSchema.methods.generateAuthToken = function() {
  const token = jwt.sign(
    { data: { id: this.id, username: this.username, role: this.role } },
    process.env.SECRET_KEY,
    { expiresIn: '7d' }
  )

  return token
}

// Enable uniqueValidator on this schema
UserSchema.plugin(uniqueValidator, {
  message: 'Error, expected {PATH} to be unique.'
})
export default mongoose.model('User', UserSchema)
