# sqs-router
SQS reader with simple router by type

[![NPM version](https://img.shields.io/npm/v/sqs-router.svg?style=flat)](https://npmjs.org/package/sqs-router)
[![NPM Downloads](https://img.shields.io/npm/dm/sqs-router.svg?style=flat)](https://npmjs.org/package/sqs-router)
[![Node.js Version](https://img.shields.io/node/v/sqs-router.svg?style=flat)](http://nodejs.org/download/)


### SQS Message Format 
```js
{
   "type": "TYPE_1",
   "content": { /* your message */ }
}
```

 
### Usage

```js
  const sqsWorkerFactory = require('sqs-worker').workerFactory;

  const sqsWorker = new sqsWorkerFactory.create('/tmp/controllers', 'https://sqs.us-east-1.amazonaws.com/123123/my-queue', options);
  sqsWorker.on('error', console.error);
  (await sqsWorker.init()).start();
```
```
 |-- tmp
 |---- controllers
 |-------- myController.js
```
myController.js
```js
const Joi = require('joi');
const BaseController = require('sqs-worker').BaseController;

class myController extends BaseController {
    constructor() {
        super();
    }

    get type() {
        return 'TYPE_1';
    }
    
    get messageContentSchema() {
        // Joi schema for message.content (https://github.com/hapijs/joi)
        // schema example: 
        return Joi.object({
            age: Joi.number().required()
        }).required();
    }

    async initDefaults() {
        return this;
    }
    
    async handleMessage(messageContent) {
        // your handling code
    }
}

module.exports = myController;
```


### Configuration
##### options
  - aws
    - credentials
      - region: (default from env AWS_REGION)
      - accessKeyId: (default from env AWS_ACCESS_KEY_ID)
      - secretAccessKey: (default from env AWS_SECRET_ACCESS_KEY)
    - batchSize: Size of batch (default 10)

### Events
- error: notify failures during the message processing
- message: notify status of the message processing (PROCESSING, PROCEED)


### Run Tests
```bash
npm test
```


### License
MIT
