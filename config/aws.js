import AWS from 'aws-sdk'

AWS.config.update({})

const s3 = new AWS.S3()

export { s3 }
