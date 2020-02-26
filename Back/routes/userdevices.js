var express = require('express');
var router = express.Router();
const UserDeviceController = require('../server/controllers').UserDeviceController;

router.get('/', UserDeviceController.index);

module.exports = router;
