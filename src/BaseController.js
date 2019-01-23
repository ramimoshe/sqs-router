/* eslint no-unused-vars: off*/

'use strict';


class BaseController {
    constructor() {
    }

    get type() {
        throw new Error('BaseController - get type was not implemented');
    }

    // joi schema
    get messageContentSchema() {
        throw new Error('BaseController - messageContentSchema was not implemented');
    }

    async initDefaults() {
        return this;
    }

    async handleMessage(messageContent) {
        throw new Error('BaseController - handleMessage was not implemented');
    }
}

module.exports = BaseController;
