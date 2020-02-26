var express = require('express');
var router = express.Router();
const UserController = require('../server/controllers').UserController;
const middlewares = require('../server/middlewares');
const passport = require('passport');

/* GET users listing. */
router.post('/', [passport.authenticate('jwt', { session: false }), middlewares.isSuperAdmin], UserController.create);
router.get('/', [passport.authenticate('jwt', { session: false })], UserController.index); 
router.get('/:Oid', [passport.authenticate('jwt', { session: false })], UserController.show);
router.get('/:Oid/pendingActiveProcessGroups', [passport.authenticate('jwt', { session: false })], UserController.getPendingActiveProcessGroups);
router.get('/fullInfo', [passport.authenticate('jwt', { session: false })], UserController.fullInfo); 
router.put('/:Oid',  [passport.authenticate('jwt', { session: false })], UserController.update); 
router.post('/addRole/:Oid',  [passport.authenticate('jwt', { session: false })], UserController.addRole); 
router.post('/enableTfa',  [passport.authenticate('jwt', { session: false })], UserController.enableTfa); 
router.post('/disableTfa',  [passport.authenticate('jwt', { session: false })], UserController.disableTfa); 
router.get('/:Oid/tfas',  [passport.authenticate('jwt', { session: false })], UserController.tfas); 
router.get('/:Oid/activeTfas/:Email', UserController.activeTfas); 
router.get('/pendingProcesses/:Oid',  [passport.authenticate('jwt', { session: false })], UserController.pendingProcesses); 
router.get('/:Oid/unconfirmed',  [passport.authenticate('jwt', { session: false }), middlewares.isAdmin], UserController.getUnconfirmedUsers);

module.exports = router;
