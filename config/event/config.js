export default {
    rules: [
        {
            name: 'email',
            description: 'Trigger to send an email',
            eventPattern: {
                source: [process.env.APP_NAME],
                'detail-type': ['email'],
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
    ],
}
