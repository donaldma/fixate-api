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
const apiRoutes = require('./routes/api')
const Helpers = require('./utils/Helpers')

/**
 * START CRON JOBS
 *
 */
cron.schedule('*/15 * * * *', () => {
  console.log('Ping App')
  axios.get('https://www.google.com/')
})
/**
 * END CRON JOBS
 */

app.use(cors())
app.use(knexLogger(db.knex))
app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())
app.use(bearerToken())

app.use('/api', apiRoutes)

app.use(function(err, req, res, next) {
  console.error(err)
  Helpers.handleServerError(res, err)
})

server.listen(PORT, () => {
  console.log('Server running on', PORT)
})