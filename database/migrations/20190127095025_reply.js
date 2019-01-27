const { TableMap } = require('../../config/Constants')

exports.up = function(knex, Promise) {
  return Promise.all([
    knex.schema.createTable(TableMap.Reply, function(table) {
      table.increments('id').primary()
      table
        .integer('whisperId')
        .references('id')
        .inTable('whisper')
        .onDelete('CASCADE')
        .notNull()
      table.text('content').notNull()
      table.timestamps(true, true)
    })
  ])
}

exports.down = function(knex, Promise) {
  return Promise.all([knex.schema.dropTable(TableMap.Reply)])
}
