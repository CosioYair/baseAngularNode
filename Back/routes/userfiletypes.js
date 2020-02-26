var express = require('express');
var router = express.Router();
const FileTypeController = require('../server/controllers').FileTypeController;
const passport = require('passport');

router.get('/', FileTypeController.index);
router.get('/:UserOid', [passport.authenticate('jwt', { session: false })], FileTypeController.filesByUser)
router.get('/:UserOid/:FileTypeId', [passport.authenticate('jwt', { session: false })], FileTypeController.fileByUser)

module.exports = router;
