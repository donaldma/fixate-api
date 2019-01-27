const { TableMap } = require('../../config/Constants')
const arr = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20]
const userIds = [3, 4]

exports.seed = function(knex, Promise) {
  return knex(TableMap.Whisper)
    .del()
    .then(() => {
      let promises = arr.map((x) => {
        const randomUserId = userIds[Math.floor(Math.random() * userIds.length)]
        return knex(TableMap.Whisper).insert({
          userId: randomUserId,
          content: `whisper test ${x}`
        })
      })
      return Promise.all(promises)
    })
}
