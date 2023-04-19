import { DateTime } from 'luxon'
import { BaseModel, column } from '@ioc:Adonis/Lucid/Orm'

export default class Quote extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public jobId: number

  @column()
  public email: string

  @column()
  public comments: string

  @column()
  public price: number

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime
}
