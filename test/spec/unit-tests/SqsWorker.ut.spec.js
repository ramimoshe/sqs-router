'use strict';

const Promise      = require('bluebird');
const Worker       = require('../../../src/SqsWorker');
const ConsumerMock = require('./mocks/Consumer');


test('start - 1 valid message with existing controller - should call TEST_CONTROLLER1 handler', async () => {
    const consumerStub    = new ConsumerMock();
    const expectedMessage = {
        type   : 'TEST_CONTROLLER1',
        content: {
            age: 19
        }
    };
    consumerStub.injectFakeResponseData([JSON.stringify(expectedMessage)]);
    const worker = new Worker(`${__dirname}/mocks/controllers`, consumerStub);
    await worker.init();
    worker.start();
    await Promise.delay(100);
    expect(worker._controllers.get('TEST_CONTROLLER1').handleMessage.mock.calls[0][0]).toEqual(expectedMessage.content);
});

test('start - 1 valid message without existing controller - should not call TEST_CONTROLLER1 handler', async (done) => {
    const consumerStub    = new ConsumerMock();
    const expectedMessage = {
        type   : 'NOT_EXISTS',
        content: {
            age: 19
        }
    };
    consumerStub.injectFakeResponseData([JSON.stringify(expectedMessage)]);
    const worker = new Worker(`${__dirname}/mocks/controllers`, consumerStub);
    worker.on('error', () => {
        expect(worker._controllers.get('TEST_CONTROLLER1').handleMessage.mock.calls[0]).toEqual(undefined);
        done();
    });
    await worker.init();
    worker.start();
});

test('start - 1 invalid json message with existing controller - should not call TEST_CONTROLLER1 handler', async (done) => {
    const consumerStub    = new ConsumerMock();
    const expectedMessage = {
        type: 'TEST_CONTROLLER1',
        content : {
            age: 19
        }
    };
    consumerStub.injectFakeResponseData([JSON.stringify(expectedMessage) + 'asd']);
    const worker = new Worker(`${__dirname}/mocks/controllers`, consumerStub);
    worker.on('error', () => {
        expect(worker._controllers.get('TEST_CONTROLLER1').handleMessage.mock.calls[0]).toEqual(undefined);
        done();
    });
    await worker.init();
    worker.start();
});

test('start - 1 invalid message with existing controller - should not call TEST_CONTROLLER1 handler', async (done) => {
    const consumerStub    = new ConsumerMock();
    const expectedMessage = {
        type: 'TEST_CONTROLLER1',
        zzz : {
            age: 19
        }
    };
    consumerStub.injectFakeResponseData([JSON.stringify(expectedMessage)]);
    const worker = new Worker(`${__dirname}/mocks/controllers`, consumerStub);
    worker.on('error', () => {
        expect(worker._controllers.get('TEST_CONTROLLER1').handleMessage.mock.calls[0]).toEqual(undefined);
        done();
    });
    await worker.init();
    worker.start();
});

test('init - no existing controller registered - should throw error', async (done) => {
    const consumerStub    = new ConsumerMock();
    const expectedMessage = {
        type: 'TEST_CONTROLLER1',
        zzz : {
            age: 19
        }
    };
    consumerStub.injectFakeResponseData([JSON.stringify(expectedMessage)]);
    const worker = new Worker(`${__dirname}/mocks/noControllers`, consumerStub);
    try {
        await worker.init();
    } catch (error) {
        error.message === 'No controllers found in the directory';
        done();
    }

});