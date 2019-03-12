'use strict'

const createError = require('http-errors')
const express = require('express')
const router = express.Router()
const BotHelper = require('../utils/BotHelper')

router.get('/movie/:movieId/:locationId', async (req, res, next) => {
  try {
    if (req.headers.authorization !== process.env.AUTH_SECRET) {
      throw createError(401, 'Not Authorized')
    }
    await BotHelper.checkTickets(req.params.movieId, req.params.locationId, req.query.Date)
    res.json({ status: 200 })
  } catch (err) {
    next(err)
  }
})

module.exports = router
