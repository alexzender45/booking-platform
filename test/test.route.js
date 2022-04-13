const Router = require('express');
const { authenticate, permit } = require('../core/auth');
const TestingController = require('./testing.controller/testing');
//

const router = Router();
const { testing } = new TestingController();

router
  .route('/')
  .get(testing);

module.exports = router;
