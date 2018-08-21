/* eslint no-undef: off*/

'use strict';

const Joi            = require('joi');
const BaseController = require('../../../../../src/BaseController');


class TestController1 extends BaseController {
    constructor() {
        super();
        this.handleMessage = jest.fn();
    }

    get type() {
        return 'TEST_CONTROLLER1';
    }

    get messageContentSchema() {
        return Joi.object({
            age: Joi.number().required()
        }).required();
    }

    async init() {
        return this;
    }

    async handleMessage() {
        return true;
    }
}

module.exports = TestController1;
