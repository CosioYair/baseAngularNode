const User = require('../models').User;
const FileType = require('../models').FileType;
const SharedController = require('./SharedController');
const ActionController = require('./ActionController');

UserController = {
  index(req, res) {
    return User.findAndCountAll()
      .then(users => res.status(200).send(users))
      .catch(error => res.status(400).send(error));
  },

  show(req, res) {
    const oid = req.params.Oid;
    User.findOne({ where: { Oid: oid } })
      .then(user => {
        if (user) {
          res.json({ User: user })
        } else {
          res.status(500).json(errorCodes.UserNotFound);
        }
      })
      .catch(err => SharedController.catchGeneralServerError(err, res));
  },

  create(req, res) {
    let userData = req.body.UserData;
    let confirmEmailUrl = req.body.ConfirmEmailUrl ? req.body.ConfirmEmailUrl : "http://localhost/auth/emailConfirmation";
    let registerTypeId = req.body.RegisterTypeId ? req.body.RegisterTypeId : 1;
    let roleId = req.body.RoleId ? req.body.RoleId : 1;
    UserController.localCreate(userData, registerTypeId, confirmEmailUrl, roleId)
      .then(async user => {
        const status = user.Oid ? 200 : 500;
        if (user.Oid) {
          user = await SharedController.getAuthUserInfo(user.dataValues.Oid);
        }
        res.status(status).send(user);
      });
  },

  update(req, res) {
    let userData = req.body.UserData;
    let query = { returning: true, where: { Oid: req.params.Oid } };
    delete userData.Email;
    delete userData.Password;
    User.update(userData, query)
      .then(async user => {
        user = user[1][0];
        res.json({ User: user });
      })
      .catch(err => {
        let errors = SharedController.setFieldErrors(err);
        res.status(500).send(errors);
      })
  },

  delete(req, res) {

  },

  async localCreate(userData, registerTypeId = 1, confirmEmailUrl = "http://localhost/auth/emailConfirmation", roleId, key = null, additionalInfo = null) {
    let user = await UserController.getFromEmail(userData.Email);
    if (!user) {
      user = await User.create(userData).then(async user => {
        await user.setTfas();
        await user.addRegisterType(registerTypeId, { through: { Key: key, AdditionalInfo: additionalInfo } });
        await user.addProcessesGroup(roleId, 1);
        await user.addRole(roleId);
        if (registerTypeId === 1 && !user.EmailConfirmed) {
          await ActionController.addNewEmailAction(user, 1, "Email confirmation", "To confirm the email, click on the next url:", confirmEmailUrl);
        }
        return user;
      }).catch(err => {
        let errors = SharedController.setFieldErrors(err);
        return errors;
      });
    } else {
      //const validRegisterRole = await user.validateRole(roleId);
      const validRegisterType = await user.validateRegisterType(registerTypeId);
      if (validRegisterType) {
        user = await User.create(userData).catch(err => {
          let errors = SharedController.setFieldErrors(err);
          return errors;
        });
      } else if (registerTypeId === 1) {
        await user.addRegisterType(registerTypeId, { through: { Key: key, AdditionalInfo: additionalInfo } });
        user.Password = userData.Password;
        await user.save();
      }
    }
    return user;
  },

  localShow(Oid) {
    return User.findOne({
      where: {
        Oid
      }
    });
  },

  async fullInfo(req, res) {
    const user = req.user;
    const roleId = req.query.RoleId;
    const fullUserInfo = await SharedController.getFullUserInfo(user.Oid, roleId);
    res.json(fullUserInfo);
  },

  async pendingProcesses(req, res) {
    const oid = req.params.Oid;
    const user = await User.findOne({ where: { Oid: oid } }).catch(err => console.log(err));
    if (user) {
      const pendingProcesses = await user.getPendingProcesses();
      return res.json({ pendingProcesses });
    }
    res.status(500).send('Invalid user');
  },

  async tfas(req, res) {
    const user = req.user;
    const tfas = await user.tfas();
    res.json({ Tfas: tfas });
  },

  async activeTfas(req, res) {
    const email = req.params.Email;
    const user = await UserController.getFromEmail(email);
    const activeTfas = await user.activeTfas();
    res.json({ ActiveTfas: activeTfas });
  },

  async enableTfa(req, res) {
    const user = req.user;
    const tfaId = req.body.tfaId
    let userTfa = await user.getUserTfa(tfaId);
    if (userTfa && tfaId !== 1) {
      userTfa = await user.enableTfa(tfaId);
      res.status(200).json({ Tfa: userTfa });
    }
    res.status(500).send("Invalid TFA");
  },

  async disableTfa(req, res) {
    const user = req.user;
    const tfaId = req.body.tfaId
    if (tfaId !== 1) {
      const userTfa = await user.disableTfa(tfaId);
      res.status(200).json({ Tfa: userTfa });
    }
    res.status(500).send("Invalid TFA");
  },

  addRole(req, res) {
    const query = { returning: true, where: { Oid: req.params.Oid } };
    const roleId = req.body.roleId;
    User.findOne(query)
      .then(user => {
        user.addRole(roleId);
        res.status(200).send("Success");
      });
  },

  async getUnconfirmedUsers(req, res) {
    let unconfirmedUsers = await User.findAll({
      include: [{
        model: FileType,
        attributes: ['Id'],
        where: {
          Id: {
            $in: [1, 2, 3]
          }
        }
      }],
      where: {
        IdentityConfirmed: false
      }
    });
    res.json({ Users: unconfirmedUsers });
  },

  getFromEmail(email, withPassword) {
    if (!withPassword) {
      return User.findOne({
        where: {
          Email: email
        }
      });
    }
    else {
      return User.scope('withPassword')
        .findOne({
          where: {
            Email: email
          }
        });
    }
  },

  getPendingActiveProcessGroups(req, res) {
    const oid = req.params.Oid;
    User.findOne({ where: { Oid: oid } }).then(async user => {
      if (user) {
        const pendingActiveProcessGroups = await user.getPendingProcesses();
        res.json({ PendingProcesses: pendingActiveProcessGroups });
      } else {
        res.status(500).json(errorCodes.UserNotFound);
      }
    }).catch(err => SharedController.catchGeneralServerError(err, res));
  }
};

module.exports = UserController;