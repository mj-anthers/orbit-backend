export default {
    rules: [
        {
            name: 'orderCreatedRule',
            description: 'Triggers on order.created events',
            eventPattern: {
                source: ['custom.myapp'],
                'detail-type': ['order.created'],
            },
        },
    ],
    targets: [
        {
            ruleName: 'orderCreatedRule',
            targets: [
                {
                    Id: 'LambdaTarget1',
                    Arn: 'arn:aws:lambda:us-east-1:123456789012:function:OrderHandler',
                    RoleArn: process.env.EVENT_BUS_ROLE,
                },
                {
                    Id: 'SQSTestTarget',
                    Arn: `arn:aws:sqs:${process.env.AWS_REGION}:${process.env.AWS_ACCOUNT_ID}:test`,
                    RoleArn: process.env.EVENT_BUS_ROLE,
                },
            ],
        },
    ],
}
