/* eslint no-unused-vars: off*/

'use strict';

const Joi = require('joi');

class BaseController {
    constructor() {
    }

    get type() {
        throw new Error('BaseController - get type was not implemented');
    }

    // joi schema
    get messageContentSchema() {
        return Joi.any();
    }

    async initDefaults() {
        return this;
    }

    async handleMessage(messageContent) {
        throw new Error('BaseController - handleMessage was not implemented');
    }
}

module.exports = BaseController;
