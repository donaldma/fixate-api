const { TableMap } = require('../../config/Constants')

exports.up = (knex) => {
  return knex.schema.alterTable(TableMap.Reply, (table) => {
    table.integer('userId')
  })
}

exports.down = (knex) => {
  return knex.schema.alterTable(TableMap.Reply, (table) => {
    table.dropColumn('userId')
  })
}
