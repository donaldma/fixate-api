'use strict'

const express = require('express')
const router = express.Router()
const WhisperHelper = require('../utils/WhisperHelper')
const UserHelper = require('../utils/UserHelper')
const AuthHelper = require('../utils/AuthHelper')

router.get('/ping', async (req, res, next) => {
  try {
    res.json({ status: 200 })
  } catch (err) {
    next(err)
  }
})

router.get('/whisper', AuthHelper.verifyToken, async (req, res, next) => {
  try {
    const randomWhisper = await WhisperHelper.getRandomWhisper(req.user.id)
    res.json(randomWhisper)
  } catch (err) {
    next(err)
  }
})

router.post('/whisper', AuthHelper.verifyToken, async (req, res, next) => {
  try {
    const whisper = await WhisperHelper.postWhisper(req.user.id, req.body.content)
    res.json(whisper)
  } catch (err) {
    next(err)
  }
})

router.post('/user', async (req, res, next) => {
  try {
    const user = await UserHelper.create(req.body.email, req.body.password)
    res.json(user)
  } catch (err) {
    next(err)
  }
})

router.post('/user/login', async (req, res, next) => {
  try {
    const user = await UserHelper.login(req.body.email, req.body.password)
    res.json(user)
  } catch (err) {
    next(err)
  }
})

module.exports = router
