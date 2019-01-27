const PORT = process.env.PORT || 3001
const express = require('express')
const app = express()
const http = require('http')
const server = http.createServer(app)
const cors = require('cors')
const bodyParser = require('body-parser')
const axios = require('axios')
const cron = require('node-cron')
const bearerToken = require('express-bearer-token')
const knexLogger = require('knex-logger')
const db = require('./database/db')
const apiV1 = require('./routes/apiV1')
const apiV2 = require('./routes/apiV2')
const Helpers = require('./utils/Helpers')

/**
 * START CRON JOBS
 *
 */
cron.schedule('*/15 * * * *', () => {
  console.log('Ping App')
  axios.get('https://fixate.herokuapp.com/api/v1/ping')
})
/**
 * END CRON JOBS
 */

app.use(cors())
app.use(knexLogger(db.knex))
app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())
app.use(bearerToken())
app.use(function(req, res, next) {
  res.header('Access-Control-Allow-Origin', '*')
  res.header(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content-Type, Accept, access_token, Authorization'
  )
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE')
  next()
})

app.use('/api/v1', apiV1)
app.use('/api/v2', apiV2)

app.use(function(err, req, res, next) {
  console.error(err)
  Helpers.handleServerError(res, err)
})

server.listen(PORT, () => {
  console.log('Server running on', PORT)
})
