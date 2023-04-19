import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class extends BaseSchema {
  protected tableName = 'jobs'

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')

      /**
       * Uses timestamptz for PostgreSQL and DATETIME2 for MSSQL
       */
      table.string('first_name', 255).notNullable()
      table.string('last_name', 255).notNullable()
      table.string('phone_number', 50).notNullable()
      table.string('email', 255).notNullable()
      table.string('address', 1024).notNullable()
      table.string('postcode', 50).notNullable()
      table.string('state', 255).notNullable()
      table.enum('clothing_type', ['Dress', 'Sari', 'Blouse']).notNullable()
      table.specificType('image_url', 'text[]').notNullable()
      table.text('description').notNullable()
      table.decimal('budget', 12, 2)
      table.integer('quotation_count').notNullable().defaultTo(0)
      table.timestamp('created_at', { useTz: true })
      table.timestamp('updated_at', { useTz: true })
    })
  }

  public async down() {
    this.schema.dropTable(this.tableName)
  }
}
