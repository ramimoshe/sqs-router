# sqs-router
SQS reader with simple router by type


### SQS Message Format 
```js
{
   "type": "type1",
   "content": { /* your message */ }
}
```

 
### Usage

```js
  const sqsWorkerFactory = require('sqs-worker').workerFactory;
  const sqsWorker = new sqsWorkerFactory.create('/tmp/controllers', 'https://sqs.us-east-1.amazonaws.com/123123/my-queue', options);
  sqsWorker.on('error', console.error);
  await sqsWorker.init();
  sqsWorker.start();
```
```
 |-- tmp
 |---- controllers
 |-------- myController.js
```
myController.js
```js
const BaseController = require('sqs-worker').BaseController;

class myController extends BaseController {
    constructor() {
        super();
    }

    get type() {
        return 'TYPE1';
    }

    async init() {
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


### Run Tests
```bash
npm test
```


### License
MIT
