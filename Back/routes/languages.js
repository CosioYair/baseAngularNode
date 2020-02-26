var express = require('express');
var router = express.Router();
const LanguageController = require('../server/controllers').LanguageController;

router.get('/', LanguageController.index);

module.exports = router;
