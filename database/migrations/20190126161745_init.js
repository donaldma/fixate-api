const { TableMap } = require('../../config/Constants')

exports.up = function(knex, Promise) {
  return Promise.all([
    knex.schema.createTable(TableMap.User, function(table) {
      table.increments('id').primary()
      table.string('email').notNull()
      table.string('password').notNull()
      table
        .integer('sessionsCompleted')
        .notNull()
        .defaultTo(0)
      table
        .integer('sessionsIncompleted')
        .notNull()
        .defaultTo(0)
      table.timestamps(true, true)
    }),
    knex.schema.createTable(TableMap.Whisper, function(table) {
      table.increments('id').primary()
      table
        .integer('userId')
        .references('id')
        .inTable('user')
        .onDelete('CASCADE')
        .notNull()
      table.text('content').notNull()
      table.timestamps(true, true)
    }),
    knex.schema.createTable(TableMap.UserWhisperSeenMap, function(table) {
      table.increments('id').primary()
      table
        .integer('userId')
        .references('id')
        .inTable('user')
        .onDelete('CASCADE')
        .notNull()
      table
        .integer('whisperId')
        .references('id')
        .inTable('whisper')
        .onDelete('CASCADE')
        .notNull()
      table.timestamps(true, true)
    })
  ])
}

exports.down = function(knex, Promise) {
  return Promise.all(
    [knex.schema.dropTable(TableMap.User)],
    [knex.schema.dropTable(TableMap.Whisper)],
    [knex.schema.dropTable(TableMap.UserWhisperSeenMap)]
  )
}
