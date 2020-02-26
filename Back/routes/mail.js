var express = require('express');
var router = express.Router();
const MailController = require('../server/controllers').MailController;
const passport = require('passport');

router.post('/postMail', MailController.postMail);

module.exports = router;