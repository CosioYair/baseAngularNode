var express = require('express');
var router = express.Router();
const GenderController = require('../server/controllers').GenderController;

router.get('/', GenderController.index);

module.exports = router;
