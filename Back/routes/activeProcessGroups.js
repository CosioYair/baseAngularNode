var express = require('express');
var router = express.Router();
const ActiveProcessGroupController = require('../server/controllers').ActiveProcessGroupController;
const middlewares = require('../server/middlewares');
const passport = require('passport');

router.get('/', [passport.authenticate('jwt', { session: false })], ActiveProcessGroupController.index);
router.put('/finish/:Oid',  [passport.authenticate('jwt', { session: false })], ActiveProcessGroupController.finish); // 

module.exports = router;
