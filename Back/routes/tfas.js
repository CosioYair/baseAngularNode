var express = require('express');
var router = express.Router();
const TfaController = require('../server/controllers').TfaController;

router.get('/', TfaController.index);

module.exports = router;
