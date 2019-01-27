require('dotenv').config({ silent: true })
const validator = require('email-validator')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const _ = require('lodash')
const createError = require('http-errors')
const db = require('../database/db')

const hashPassword = (password) => {
  return bcrypt.hashSync(password, bcrypt.genSaltSync(8))
}

const comparePassword = (hashPassword, password) => {
  return bcrypt.compareSync(password, hashPassword)
}

const isValidEmail = (email) => {
  return validator.validate(email)
}

const generateToken = (userId) => {
  const token = jwt.sign({ userId }, process.env.SECRET, { expiresIn: '7d' })
  return { token, userId }
}

const verifyToken = async (req, res, next) => {
  try {
    if (!req.token) {
      throw createError(400, 'Token is not provided')
    }
    const decoded = await jwt.verify(req.token, process.env.SECRET)
    const user = await db.getUserById(decoded.userId)
    if (!user) {
      throw createError(400, 'The token you provided is invalid')
    }
    req.user = _.omit(user, 'password')
    next()
  } catch (error) {
    next(error)
  }
}

module.exports = {
  hashPassword,
  comparePassword,
  isValidEmail,
  generateToken,
  verifyToken
}
