'use strict';

const EventEmitter = require('events');
const fs           = require('fs');
const promisify    = require('util').promisify;
const _            = require('lodash/fp');
const Promise      = require('bluebird');
const Joi          = require('joi');


const messageStatuses = {
    processing: 'PROCESSING',
    proceed   : 'PROCEED'
};

const readdirAsync = promisify(fs.readdir);

class SqsWorker extends EventEmitter {
    constructor(controllersPath, consumer, queueUrl) {
        super();
        this._controllersPath = controllersPath;
        this._consumer        = consumer;
        this._queueUrl        = queueUrl;
    }

    async init() {
        this._queue                = this._consumer.createConsumer(this._queueUrl, this._handleMessage.bind(this));
        this._controllers          = new Map();
        const controllersFilePaths = await readdirAsync(this._controllersPath);
        await Promise.map(controllersFilePaths, async (controllerFilePath) => {
            const controllerClass = require(`${this._controllersPath}/${controllerFilePath}`);
            if (controllerClass.__proto__.name !== 'BaseController') return;

            const controller = await (new controllerClass()).initDefaults();
            this._controllers.set(controller.type, controller);
        });

        if (this._controllers.size === 0) throw Error('No controllers found in the directory');

        return this;
    }

    get messageSchema() {
        return Joi.object({
            type   : Joi.any().valid(_.values([...this._controllers.keys()])).required(),
            content: Joi.any().required()
        }).required().unknown(false);
    }

    start() {
        this._queue.start();
    }

    async _handleMessage(message) {
        try {
            const jsonMessage = JSON.parse(message);
            if (this._validateMessage(jsonMessage, this.messageSchema).error) return;

            const controller              = this._controllers.get(jsonMessage.type);
            const contentValidationResult = this._validateMessage(jsonMessage.content, controller.messageContentSchema);
            if (contentValidationResult.error) return;

            this.emit('message', { type: jsonMessage.type, status: messageStatuses.processing });
            await controller.handleMessage(contentValidationResult.value);
            this.emit('message', { type: jsonMessage.type, status: messageStatuses.proceed });
        } catch (error) {
            this.emit('error', error);
        }
    }

    _validateMessage(message, schema) {
        const validationResult = Joi.validate(message, schema);
        if (validationResult.error) {
            this.emit('error', new Error(`Invalid message, error: ${validationResult.error}, message: ${JSON.stringify(message)}`));
        }

        return validationResult;
    }
}

module.exports = SqsWorker;
