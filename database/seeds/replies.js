const { TableMap } = require('../../config/Constants')
const db = require('../db')

exports.seed = async function(knex, Promise) {
  const whispers = await db.getAllWhispers()
  return knex(TableMap.Reply)
    .del()
    .then(() => {
      let promises = whispers.map((whis) => {
        return knex(TableMap.Reply).insert({
          whisperId: whis.id,
          content: `whisper reply test ${whis.id}`
        })
      })
      return Promise.all(promises)
    })
}
