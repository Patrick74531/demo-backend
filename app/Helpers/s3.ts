import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3'
import { MultipartFileContract } from '@ioc:Adonis/Core/BodyParser'
import Env from '@ioc:Adonis/Core/Env'
import * as fs from 'fs'

// Configure AWS S3
const s3 = new S3Client({
  region: Env.get('S3_REGION'),
  credentials: {
    accessKeyId: Env.get('S3_KEY'),
    secretAccessKey: Env.get('S3_SECRET'),
  },
  forcePathStyle: true,
})

export async function uploadToS3(
  file: MultipartFileContract,
  filePath: string
): Promise<string> {
  return new Promise((resolve, reject) => {
    if (!file.tmpPath) {
      reject(new Error('Invalid temporary file path'))
      return
    }

    const fileStream = fs.createReadStream(file.tmpPath)
    const uploadParams = {
      Bucket: Env.get('S3_BUCKET'),
      Key: filePath,
      Body: fileStream,
      ContentType: file.type || 'application/octet-stream',
      ACL: 'public-read',
    }

    s3.send(new PutObjectCommand(uploadParams))
      .then(() => {
        resolve(
          `https://${Env.get('S3_BUCKET')}.s3.${Env.get(
            'S3_REGION'
          )}.amazonaws.com/${filePath}`
        )
      })
      .catch((error) => {
        reject(error)
      })
  })
}
