export default {
    rules: [
        {
            name: 'email',
            description: 'Trigger to send an email',
            eventPattern: {
                source: [process.env.APP_NAME],
                detail: {
                    events: ['email'],
                },
            },
        },
        {
            name: 'asset',
            description: 'Trigger to send an email',
            eventPattern: {
                source: [process.env.APP_NAME],
                detail: {
                    events: ['asset'],
                },
            },
        },
    ],
    targets: [
        {
            ruleName: 'email',
            targets: [
                {
                    Id: 'SQSTestTarget',
                    Arn: `arn:aws:sqs:${process.env.AWS_REGION}:${process.env.AWS_ACCOUNT_ID}:test`,
                    RoleArn: process.env.EVENT_BUS_ROLE,
                },
            ],
        },
        {
            ruleName: 'asset',
            targets: [
                {
                    Id: 'SQSAssetTarget',
                    Arn: `arn:aws:sqs:${process.env.AWS_REGION}:${process.env.AWS_ACCOUNT_ID}:asset`,
                    RoleArn: process.env.EVENT_BUS_ROLE,
                },
            ],
        },
    ],
}
