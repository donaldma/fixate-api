const createError = require('http-errors')
const cheerio = require('cheerio')
const request = require('request-promise')
const twilio = require('twilio')
const client = new twilio(process.env.TWILIO_SID, process.env.TWILIO_TOKEN)

const parseName = (string) => {
  return string
    .split('-')
    .join(' ')
    .toLowerCase()
}

const checkTickets = async (movieId, locationId, date) => {
  const movieName = parseName(movieId)
  const locationName = parseName(locationId)
  const url = `https://www.cineplex.com/Showtimes/${movieId}/${locationId}?Date=${date}`
  const numbersToNotify = ['7788653098', '7789529922']
  let message
  await request(url, (error, response, html) => {
    if (error) {
      throw createError(500, 'Error in cheerio request connection')
    }

    const $ = cheerio.load(html)
    const notAvailableError = $('div.error-simple')
      .filter(function() {
        return $(this)
          .text()
          .includes('is not playing at the location')
      })
      .get()

    if (notAvailableError.length === 1) {
      console.log('not available')
      message = 'not available'
      return
    }

    console.log('available')
    message = 'available'
    numbersToNotify.forEach((x) => {
      client.messages.create({
        body: `Movie tickets for ${movieName} at ${locationName} on ${date} is now available. ${url}`,
        to: x,
        from: '6042601688'
      })
    })
  })

  return message
}

module.exports = {
  checkTickets
}
