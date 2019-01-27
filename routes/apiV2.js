'use strict'

const express = require('express')
const router = express.Router()
const WhisperHelper = require('../utils/WhisperHelper')
const AuthHelper = require('../utils/AuthHelper')

router.get('/whisper', AuthHelper.verifyToken, async (req, res, next) => {
  try {
    const randomWhisperReply = await WhisperHelper.getRandomWhisperV2(req.user.id)
    res.json(randomWhisperReply)
  } catch (err) {
    next(err)
  }
})

router.post('/whisper', AuthHelper.verifyToken, async (req, res, next) => {
  try {
    const whisperReply = await WhisperHelper.postWhisperV2(req.user.id, req.body.content)
    res.json(whisperReply)
  } catch (err) {
    next(err)
  }
})

router.get('/reply', AuthHelper.verifyToken, async (req, res, next) => {
  try {
    const reply = await WhisperHelper.getRandomReply(req.user.id)
    res.json(reply)
  } catch (err) {
    next(err)
  }
})

router.patch('/reply', AuthHelper.verifyToken, async (req, res, next) => {
  try {
    const reply = await WhisperHelper.updateReply(req.user.id, req.body.replyId, req.body.content)
    res.json(reply)
  } catch (err) {
    next(err)
  }
})

module.exports = router
