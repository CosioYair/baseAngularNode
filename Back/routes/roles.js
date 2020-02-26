var express = require('express');
var router = express.Router();
const RoleController = require('../server/controllers').RoleController;
const passport = require('passport');

router.get('/', RoleController.index);

module.exports = router;
