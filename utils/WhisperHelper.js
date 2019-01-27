const createError = require('http-errors')
const db = require('../database/db')
const Helpers = require('./Helpers')

const getRandomWhisper = async (userId) => {
  const userWhisperSeen = await db.getUserWhisperSeen(userId)
  const userWhisperUnseen = await db.getUnseenWhispers(
    userId,
    userWhisperSeen.map((x) => x.whisperId)
  )
  if (userWhisperUnseen.length === 0) {
    throw createError(400, 'No more whispers left')
  }
  const randomWhisper = Helpers.randomFromArray(userWhisperUnseen)
  await db.addUserWhisperSeen(userId, randomWhisper.id)
  return randomWhisper
}

const postWhisper = async (userId, content) => {
  if (!content) {
    throw createError(400, 'Please enter some content')
  }
  const [whisper] = await db.postWhisper(userId, content)
  return whisper[0]
}

const getRandomWhisperV2 = async (userId) => {
  const userWhisperSeen = await db.getUserWhisperSeen(userId)
  const userWhisperUnseen = await db.getUnseenWhispers(
    userId,
    userWhisperSeen.map((x) => x.whisperId)
  )
  if (userWhisperUnseen.length === 0) {
    throw createError(400, 'No more whispers left')
  }
  const whisperReplies = await db.getWhisperReplies(userWhisperUnseen.map((x) => x.id))
  const reply = Helpers.randomFromArray(whisperReplies)
  await db.addUserWhisperSeen(userId, reply.whisperId)
  const whisper = await db.getWhisperById(reply.whisperId)
  return {
    whisper,
    reply
  }
}

const postWhisperV2 = async (userId, content) => {
  if (!content) {
    throw createError(400, 'Please enter some content')
  }
  const [whisper] = await db.postWhisper(userId, content)
  const [reply] = await db.postReply(whisper[0].id)
  return {
    whisper: whisper[0],
    reply
  }
}

const getRandomReply = async (userId) => {
  const whispers = await db.getAllOtherWhispers(userId)
  const replies = await db.getReplies(whispers.map((x) => x.id))
  return Helpers.randomFromArray(replies)
}

const updateReply = async (userId, replyId, content) => {
  if (!replyId) {
    throw createError(400, 'Body parameter replyId is required')
  }
  const [reply] = await db.updateReply(userId, replyId, content)
  return reply
}

module.exports = {
  getRandomWhisper,
  postWhisper,
  getRandomWhisperV2,
  postWhisperV2,
  getRandomReply,
  updateReply
}
