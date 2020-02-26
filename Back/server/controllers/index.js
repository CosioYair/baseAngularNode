const UserController = require('./UserController');
const AuthController = require('./AuthController');
const ActionController = require('./ActionController');
const SharedController = require('./SharedController');
const MailController = require('./MailController');
const RegisterTypeController = require('./RegisterTypeController');
const RoleController = require('./RoleController');
const ActiveProcessGroupController = require('./ActiveProcessGroupController');
const LanguageController = require('./LanguageController');
const GenderController = require('./GenderController');
const TfaController = require('./TfaController');
const FileTypeController = require('./FileTypeController');
const UserDeviceController = require('./UserDeviceController');

module.exports = {
  TfaController,
  GenderController,
  LanguageController,
  ActiveProcessGroupController,
  UserController,
  AuthController,
  ActionController,
  SharedController,
  MailController,
  RegisterTypeController,
  RoleController,
  FileTypeController,
  UserDeviceController
};