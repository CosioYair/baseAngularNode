var express = require('express');
var router = express.Router();
const ActionController = require('../server/controllers').ActionController;

router.post('/confirmToken', ActionController.confirmToken);
router.get('/validateToken', ActionController.validateToken);
router.post('/newActionByToken', ActionController.newActionByToken);
router.post('/newActionByUserOid', ActionController.newActionByUserOid);
router.post('/newActionByUserEmail', ActionController.newActionByUserEmail);

module.exports = router;
