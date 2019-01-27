'use strict'

const express = require('express')
const router = express.Router()
const WhisperHelper = require('../utils/WhisperHelper')
const AuthHelper = require('../utils/AuthHelper')

router.get('/whisper', AuthHelper.verifyToken, async (req, res, next) => {
  try {
    const randomWhisperReply = await WhisperHelper.getRandomWhisperReply(req.user.id)
    res.json(randomWhisperReply)
  } catch (err) {
    next(err)
  }
})

module.exports = router
