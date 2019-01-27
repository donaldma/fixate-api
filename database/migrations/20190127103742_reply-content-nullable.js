const { TableMap } = require('../../config/Constants')

exports.up = (knex) => {
  return knex.schema.alterTable(TableMap.Reply, (table) => {
    table
      .text('content')
      .nullable()
      .alter()
  })
}

exports.down = (knex) => {
  return knex.schema.alterTable(TableMap.Reply, (table) => {
    table
      .text('content')
      .notNullable()
      .alter()
  })
}
