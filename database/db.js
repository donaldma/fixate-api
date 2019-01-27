'use strict'
const { TableMap } = require('../config/Constants')
const ENV = process.env.NODE_ENV || 'development'
const knexConfig = require('../knexfile')
const knex = require('knex')(knexConfig[ENV])

const getUserWhisperSeen = (userId) => {
  return knex(TableMap.UserWhisperSeenMap).where({ userId })
}

const getUnseenWhispers = (userId, whisperIds) => {
  return knex(TableMap.Whisper)
    .whereNot({ userId })
    .whereNotIn('id', whisperIds)
}

const getAllOtherWhispers = (userId) => {
  return knex(TableMap.Whisper).whereNot({ userId })
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

const getAllWhispers = () => {
  return knex(TableMap.Whisper).select('*')
}

const getWhisperById = (id) => {
  return knex(TableMap.Whisper)
    .where({ id })
    .first()
}

const getWhisperReplies = (whisperIds) => {
  return knex(TableMap.Reply)
    .whereIn('whisperId', whisperIds)
    .whereNotNull('content')
}

const postReply = (whisperId, content) => {
  return knex(TableMap.Reply)
    .returning('*')
    .insert({ whisperId, content })
}

const getReplies = (whisperIds) => {
  return knex(TableMap.Reply)
    .whereNotIn('whisperId', whisperIds)
    .whereNull('content')
}

const updateReply = (userId, replyId, content) => {
  return knex(TableMap.Reply)
    .returning('*')
    .where({ id: replyId })
    .update({ userId, content })
}

module.exports = {
  knex,
  getUserWhisperSeen,
  getUnseenWhispers,
  addUserWhisperSeen,
  postWhisper,
  getUserByEmail,
  getUserById,
  postUser,
  getAllWhispers,
  getWhisperById,
  getWhisperReplies,
  postReply,
  getReplies,
  getAllOtherWhispers,
  updateReply
}
