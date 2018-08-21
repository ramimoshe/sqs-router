'use strict';

const _ = require('lodash/fp');


class ConsumerStub {
    constructor() {
        this.injectedData = [];
        this.queueNumber  = 0;
    }

    createConsumer(queueUrl, handler) {
        const csr = new ConsumerStubRunner(queueUrl, handler);
        csr.injectFakeResponseData(this.injectedData[this.queueNumber++]);

        return csr;
    }

    injectFakeResponseData(arrayData) {
        this.injectedData.push(arrayData);
    }
}

class ConsumerStubRunner {
    constructor(queueUrl, handler) {
        this.handler = handler;
    }

    injectFakeResponseData(arrayData) {
        this.arrayData = arrayData;
    }

    start() {
        try {
            _.each((data) => {
                this.handler(data, () => {
                });
            })(this.arrayData);
        }
        catch (err) {
            console.log(err);
        }
    }
}

module.exports = ConsumerStub;
