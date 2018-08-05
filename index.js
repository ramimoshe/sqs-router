'use strict';

const SqsWorker   = require('./src/SqsWorker');
const SqsConsumer = require('./src/SqsConsumer');


function createWorker(controllersPath, queueUrl, options) {
    const sqsConsumer = new SqsConsumer(options);
    const sqsWorker   = new SqsWorker(controllersPath, sqsConsumer, queueUrl);

    return sqsWorker;
}

module.exports = {
    workerFactory : {
        create: createWorker
    },
    BaseController: require('./BaseController')
};
