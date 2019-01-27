const createError = require('http-errors')
const db = require('../database/db')

const getRandomWhisper = async (userId) => {
  const userWhisperSeen = await db.getUserWhisperSeen(userId)
  const userWhisperUnseen = await db.getUnseenWhispers(
    userId,
    userWhisperSeen.map((x) => x.whisperId)
  )
  if (userWhisperUnseen.length === 0) {
    throw createError(400, 'No more unseen whispers left')
  }
  const randomWhisper = userWhisperUnseen[Math.floor(Math.random() * userWhisperUnseen.length)]
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

module.exports = { getRandomWhisper, postWhisper }
