/* eslint no-undef: off*/

'use strict';

const BaseController = require('../../../../../src/BaseController');


class TestController1 extends BaseController {
    constructor() {
        super();
        this.handleMessage = jest.fn();
    }

    get type() {
        return 'TEST_CONTROLLER1';
    }

    async init() {
        return this;
    }
}

module.exports = TestController1;
