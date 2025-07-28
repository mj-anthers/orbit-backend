import path from 'path'
import { v4 as uuidv4 } from 'uuid'
import { s3 } from '../../config/aws.js'
import multer from 'multer'
import { PutObjectCommand } from '@aws-sdk/client-s3'

const fileFilter = (req, file, cb) => {
    const allowedMimeTypes = ['image/jpeg', 'image/png', 'image/webp']
    const ext = path.extname(file.originalname).toLowerCase()

    if (
        allowedMimeTypes.includes(file.mimetype) &&
        ['.jpg', '.jpeg', '.png', '.webp', 'application/pdf'].includes(ext)
    ) {
        cb(null, true)
    } else {
        cb(new Error(`❌ Invalid file type: ${file.originalname}`), false)
    }
}

const uploadMultipleFiles = multer({
    storage: multer.memoryStorage(),
    limits: { fileSize: 10 * 1024 * 1024 }, // 10 MB
    fileFilter,
}).array('files', 10)

const uploadFilesToS3 = async (req, res, next) => {
    try {
        req.files = await Promise.all(
            req.files.map(async (file) => {
                const ext = path.extname(file.originalname)
                const key = `${uuidv4()}${ext}`

                const result = await s3.send(
                    new PutObjectCommand({
                        Bucket: process.env.S3_BUCKET,
                        Key: key,
                        Body: file.buffer,
                        ContentType: file.mimetype,
                    })
                )
                return {
                    ...result,
                    type: file.mimetype,
                    name: key,
                }
            })
        )
        next()
    } catch (error) {
        next(error)
    }
}

export default { uploadMultipleFiles, uploadFilesToS3 }
