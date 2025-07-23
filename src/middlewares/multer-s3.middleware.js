import multer from 'multer'
import multerS3 from 'multer-s3'
import { v4 as uuidv4 } from 'uuid'
import path from 'path'
import { s3 } from '../../config/aws.js'

const fileFilter = (req, file, cb) => {
    const allowedTypes = ['image/jpeg', 'image/png', 'application/pdf']
    if (allowedTypes.includes(file.mimetype)) cb(null, true)
    else cb(new Error('Invalid file type'), false)
}

const uploadMultipleFiles = (bucketName, folder = '') =>
    multer({
        fileFilter,
        storage: multerS3({
            s3,
            bucket: bucketName,
            acl: 'public-read',
            key: (req, file, cb) => {
                const ext = path.extname(file.originalname)
                const filename = `${folder}${uuidv4()}${ext}`
                cb(null, filename)
            },
        }),
        limits: { fileSize: 10 * 1024 * 1024 }, // 10 MB
    })

export default uploadMultipleFiles
