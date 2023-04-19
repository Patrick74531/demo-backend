import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class extends BaseSchema {
  protected tableName = 'quotes'

  public async up() {
    this.schema.table(this.tableName, (table) => {
      table
        .integer('job_id')
        .unsigned()
        .references('id')
        .inTable('jobs')
        .onDelete('CASCADE')
    })
  }
  public async down() {
    this.schema.table(this.tableName, (table) => {
      table.dropColumn('job_id')
    })
  }
}
