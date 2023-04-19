import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { schema, rules } from '@ioc:Adonis/Core/Validator'
import { uploadToS3 } from 'App/Helpers/s3'
import Job from 'App/Models/Job'

export default class JobsController {
  //send all jobs
  public async index() {
    return Job.all()
  }
  //send job by id
  public async show({ request, response }: HttpContextContract) {
    const id = request.param('id')

    try {
      const job = await Job.find(id)
      return job
    } catch (error) {
      console.error('Error occurred while querying Job:', error)
      response
        .status(500)
        .send({ message: 'An error occurred while querying the Job.' })
    }
  }
  //create jobs
  public async store({ request, response }: HttpContextContract) {
    const newJobSchema = schema.create({
      first_name: schema.string({ trim: true }, [rules.maxLength(255)]),
      last_name: schema.string({ trim: true }, [rules.maxLength(255)]),
      phone_number: schema.string({ trim: true }, [rules.maxLength(50)]),
      email: schema.string({ trim: true }, [
        rules.email(),
        rules.maxLength(255),
      ]),
      address: schema.string({ trim: true }, [rules.maxLength(1024)]),
      postcode: schema.string({ trim: true }, [rules.maxLength(50)]),
      state: schema.string({ trim: true }, [rules.maxLength(255)]),
      clothing_type: schema.enum(['Dress', 'Sari', 'Blouse']),
      description: schema.string(),
      budget: schema.number.optional(),
    })
    //save images
    try {
      const files = request.files('images')

      if (!files || files.length === 0) {
        return response.badRequest('Files not found')
      }

      const fileUrls = await Promise.all(
        files.map(async (file) => {
          const fileName = file.clientName ?? 'default_name'
          const filePath = `uploads/${new Date().getTime()}-${fileName}`
          const fileUrl = await uploadToS3(file, filePath)
          return fileUrl
        })
      )

      const payload = await request.validate({ schema: newJobSchema })

      const newJob = { ...payload, imageUrl: fileUrls }
      await Job.create(newJob)
      response.status(201).send('create succeed')
    } catch (error) {
      console.error('Error occurred while creating Job:', error)
      response
        .status(500)
        .send({ message: 'An error occurred while creating the Job.' })
    }
  }

  //send jobs by filter
  public async filterJobs({ request, response }: HttpContextContract) {
    const state = request.input('state')?.toUpperCase()
    const clothingType = request.input('clothing_type')?.toUpperCase()

    try {
      const jobs = await Job.query()
        .if(state && state !== 'ALL', (query) => {
          query.whereRaw('UPPER(state) = ?', [state])
        })
        .if(clothingType && clothingType !== 'ALL', (query) => {
          query.whereRaw('UPPER(clothing_type) = ?', [clothingType])
        })
        .exec()

      return jobs
    } catch (error) {
      console.error('Error occurred while querying Job:', error)
      response
        .status(500)
        .send({ message: 'An error occurred while querying the Job.' })
    }
  }
}
