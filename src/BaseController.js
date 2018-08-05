/* eslint no-unused-vars: off*/

'use strict';


class BaseController {
    constructor() {
    }

    get type() {
        throw new Error('BaseController#type - get type was not implemented');
    }

    async initDefaults() {
        return this;
    }

    async handleMessage(messageContent) {
        throw new Error('BaseController#type - handleMessage was not implemented');
    }
}

module.exports = BaseController;
