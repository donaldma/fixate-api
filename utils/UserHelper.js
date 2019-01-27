const createError = require('http-errors')
const AuthHelper = require('./AuthHelper')
const db = require('../database/db')

const getUserByEmail = async (email, password) => {
  if (!email || !password) {
    throw createError(400, 'Email and password are required')
  }
  if (!AuthHelper.isValidEmail(email)) {
    throw createError(400, 'Please enter a valid email address')
  }
  return await db.getUserByEmail(email)
}

const create = async (email, password) => {
  const user = await getUserByEmail(email, password)
  if (user) {
    throw createError(401, 'User with that Email already exist')
  }
  const hashPassword = AuthHelper.hashPassword(password)
  const [userId] = await db.postUser(email, hashPassword)
  return AuthHelper.generateToken(userId)
}

const login = async (email, password) => {
  const user = await getUserByEmail(email, password)
  if (!user) {
    throw createError(400, 'The credentials you provided is incorrect')
  }
  if (!AuthHelper.comparePassword(user.password, password)) {
    throw createError(400, 'The credentials you provided is incorrect')
  }
  return AuthHelper.generateToken(user.id)
}

module.exports = {
  create,
  login
}
