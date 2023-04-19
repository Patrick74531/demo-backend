import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { schema, rules } from '@ioc:Adonis/Core/Validator'
import Quote from 'App/Models/Quote'
import Mail from '@ioc:Adonis/Addons/Mail'
import Job from 'App/Models/Job'

export default class QuotesController {
  public async store({ request, response }: HttpContextContract) {
    const newQuoteSchema = schema.create({
      email: schema.string({ trim: true }, [
        rules.email(),
        rules.maxLength(255),
      ]),
      comments: schema.string(),
      price: schema.number(),
      jobId: schema.number(),
    })

    try {
      const payload = await request.validate({ schema: newQuoteSchema })

      await Quote.create(payload)
      response.status(201).send('create succeed')

      const { email, comments, price, jobId } = payload

      // Send email
      await Mail.send((message) => {
        message.from('coderpatrick889@gmail.com').to(email).subject('New Quote')
          .html(`
            <p>Dear customer,</p>
            <p>Here is your quote information:</p>
            <p>Comments: ${comments}</p>
            <p>Price: ${price} aud</p>
            <p>Thank you for using our service!</p>
          `)
      })

      // Update job quotationCount
      const job = await Job.find(jobId)
      if (!job) {
        return response.status(404).send({ message: 'Job not found.' })
      }
      job.quotationCount += 1
      await job.save()
    } catch (error) {
      console.error('Error occurred while creating Quote:', error)
      response
        .status(500)
        .send({ message: 'An error occurred while creating the Quote.' })
    }
  }
}
