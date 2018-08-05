'use strict';

const EventEmitter = require('events');
const AWS          = require('aws-sdk');
const Consumer     = require('sqs-consumer');


class SqsConsumer extends EventEmitter {
    constructor(options) {
        super();

        AWS.config.update({
            region         : options.aws.credentials.region || process.env.AWS_REGION,
            accessKeyId    : options.aws.credentials.accessKeyId || process.env.AWS_ACCESS_KEY_ID,
            secretAccessKey: options.aws.credentials.secretAccessKey || process.env.AWS_SECRET_ACCESS_KEY
        });

        this.batchSize = options.aws.batchSize || 10;
    }

    createConsumer(queueUrl, handler) {
        return Consumer.create({
            queueUrl     : queueUrl,
            handleMessage: async (message, done) => {
                try {
                    await handler(message.Body);
                    done();
                } catch (error) {
                    this.emit('error', error);
                    done(error);
                }
            },
            batchSize    : this.batchSize
        }).on('error', this.emit);
    }
}

module.exports = SqsConsumer;
