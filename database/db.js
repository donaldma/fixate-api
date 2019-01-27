'use strict'
const { TableMap } = require('../config/Constants')
const ENV = process.env.NODE_ENV || 'development'
const knexConfig = require('../knexfile')
const knex = require('knex')(knexConfig[ENV])

const getUserWhisperSeen = (userId) => {
  return knex(TableMap.UserWhisperSeenMap).where({ userId })
}

const getUnseenWhispers = (userId, seenWhisperIds) => {
  return knex(TableMap.Whisper)
    .whereNot({ userId })
    .whereNotIn('id', seenWhisperIds)
}

const addUserWhisperSeen = (userId, whisperId) => {
  return Promise.all([
    knex(TableMap.UserWhisperSeenMap).insert({ userId, whisperId }),
    knex(TableMap.User)
      .where({ id: userId })
      .increment('sessionsCompleted', 1)
  ])
}

const postWhisper = (userId, content) => {
  return Promise.all([
    knex(TableMap.Whisper)
      .returning('*')
      .insert({ userId, content }),
    knex(TableMap.User)
      .where({ id: userId })
      .increment('sessionsIncompleted', 1)
  ])
}

const getUserByEmail = (email) => {
  return knex(TableMap.User)
    .where({ email })
    .first()
}

const getUserById = (id) => {
  return knex(TableMap.User)
    .where({ id })
    .first()
}

const postUser = (email, password) => {
  return knex(TableMap.User)
    .returning('id')
    .insert({ email, password })
}

module.exports = {
  knex,
  getUserWhisperSeen,
  getUnseenWhispers,
  addUserWhisperSeen,
  postWhisper,
  getUserByEmail,
  getUserById,
  postUser
}
