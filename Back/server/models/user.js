'use strict';
var CustomValidations = require('../CustomValidations');
var modelName = 'User';
const Speakeasy = require('speakeasy');
module.exports = (sequelize, DataTypes) => {
  const Op = sequelize.Op
  const User = sequelize.define(modelName, {
    Oid: {
      primaryKey: true,
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4
    },
    Name: {
      type: DataTypes.STRING
    },
    Email: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        isEmail: true,
        isUnique: CustomValidations.isUnique(modelName, "Email")
      },
    },
    Password: {
      type: DataTypes.STRING,
      allowNull: true,
      validate: {
        len: {
          min: 6,
          msg: "Password must be atleast 6 characters in length"
        }
      }
    },
    Gender: {
      type: DataTypes.INTEGER
    },
    Birthdate: {
      type: DataTypes.DATE
    },
    Phone: {
      type: DataTypes.STRING
    },
    NumExt: {
      type: DataTypes.STRING
    },
    NumInt: {
      type: DataTypes.STRING
    },
    Suburb: {
      type: DataTypes.STRING
    },
    Street: {
      type: DataTypes.STRING
    },
    Town: {
      type: DataTypes.STRING
    },
    State: {
      type: DataTypes.STRING
    },
    Country: {
      type: DataTypes.STRING
    },
    PostalCode: {
      type: DataTypes.STRING
    },
    TfaActive: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    },
    EmailConfirmed: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    },
    IdentityConfirmed: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    },
    Active: {
      type: DataTypes.BOOLEAN,
      defaultValue: true
    }
  }, {
      defaultScope: {
        attributes: { exclude: ['Password', 'Active', 'createdAt', 'updatedAt'] },
      },
      scopes: {
        withPassword: {
          attributes: { exclude: ['Active', 'createdAt', 'updatedAt'] },
        }
      },
      hooks: {
        beforeCreate: function (user) {
          const bcrypt = require('bcryptjs');
          user.Password = user.Password ? user.Password : "";
          user.Password = bcrypt.hashSync(user.Password, 10);
        },
        beforeSave: function (user) {
          const bcrypt = require('bcryptjs');
          if (user.Password) {
            if (user.Password.length !== 60) {
              user.Password = user.Password ? user.Password : "";
              user.Password = bcrypt.hashSync(user.Password, 10);
            }
          }
        }
      }
    });
  User.associate = function (models) {
    User.belongsToMany(models.RegisterType, { through: models.UserRegisterType, foreignKey: 'User' });
    User.belongsToMany(models.Role, { through: models.UserRole, foreignKey: 'User' });
    User.belongsToMany(models.Action, { through: models.UserAction, foreignKey: 'User' });
    User.belongsToMany(models.Tfa, { through: models.UserTfa, foreignKey: 'User' });
    User.belongsToMany(models.ProcessGroup, { through: models.UserProcessGroup, foreignKey: 'User' });
    User.belongsTo(models.Gender, { foreignKey: 'Gender', as: 'GenderId' });
    User.belongsToMany(models.FileType, { through: models.UserFileType, foreignKey: 'User' });
    User.hasMany(models.UserDevice);
  };
  User.prototype.addProcessesGroup = async function (roleId, groupTypeId) {
    const ProcessGroup = require('../models').ProcessGroup;
    const processGroup = await ProcessGroup.findOne({ where: { GroupType: groupTypeId, Role: roleId } });
    if (processGroup) {
      let userProcessGroup = await this.addProcessGroup(processGroup.Id);
      if (userProcessGroup[0]) {
        userProcessGroup = userProcessGroup[0][0];
        const processes = await processGroup.getProcesses();
        await Promise.all(processes.map(process => {
          const processGroupCatalog = process.ProcessGroupCatalog;
          processGroupCatalog.addUserProcessGroup(userProcessGroup.Oid);
        }));
      }
    }
  };
  User.prototype.getPendingProcesses = async function () {
    let groupProcesses = {};
    const pendingProcessGroups = await this.getPendingProcessGroups();
    await Promise.all(pendingProcessGroups.map(async processGroup => {
      const groupType = await processGroup.getGroupTypes();
      const formatedProcesses = await processGroup.getFormatedProcesses(processGroup.UserProcessGroup.Oid);
      groupProcesses[groupType.Name] = formatedProcesses;
    }));
    return groupProcesses;
  };
  User.prototype.getPendingProcessGroups = async function () {
    return this.getProcessGroups({
      through: {
        where: {
          Finished: {
            $not: true
          }
        }
      }
    });
  };
  User.prototype.validatePassword = function (confirmPassword) {
    const bcrypt = require('bcryptjs');
    this.Password = this.Password ? this.Password : "";
    return bcrypt.compareSync(confirmPassword, this.Password)
  };
  User.prototype.validateRole = async function (roleId) {
    if (typeof (roleId) === 'string') {
      roleId = [roleId];
    }
    return this.getRoles({
      through: {
        where: {
          Role: {
            $or: roleId
          }
        }
      }
    }).then(roles => roles.length > 0);
  };
  User.prototype.getFormatedPrivileges = async function () {
    let formatedPrivileges = [];
    return this.getRoles()
      .then(async roles => {
        await Promise.all(
          roles.map(async role => {
            const rolePrivileges = await role.getFormatedPrivileges();
            formatedPrivileges = [...formatedPrivileges, ...rolePrivileges]
          })
        );
        return formatedPrivileges;
      });
  };
  User.prototype.validateRegisterType = async function (registerTypeId) {
    return this.getRegisterTypes({
      through: {
        where: {
          RegisterType: registerTypeId
        }
      }
    }).then(registerTypes => registerTypes.length > 0)
  };
  User.prototype.getUserTfa = async function (tfaId) {
    return this.getTfas({
      through: {
        where: {
          Tfa: tfaId
        }
      }
    }).then(tfas => {
      if (tfas.length > 0) {
        return tfas[0].UserTfa;
      }
      return null;
    });
  };
  User.prototype.setTfas = function () {
    const Tfa = require('../models').Tfa;
    Tfa.all().then(tfas => {
      tfas.map(tfa => {
        this.setSecret(tfa.Id);
      });
    });
  };
  User.prototype.setSecret = async function (tfaId) {
    const secret = Speakeasy.generateSecret({
      length: 10,
      name: this.Email,
      issuer: 'IcoApp',
    });
    const qrCode = await this.getTfaQrCode(secret.base32);
    return this.addTfa(tfaId, {
      through: {
        Secret: secret.base32,
        QrCode: qrCode,
        Active: tfaId === 1
      }
    });
  };
  User.prototype.getTfaQrCode = async function (secret) {
    var QRCode = require('qrcode');
    var otpauthUrl = Speakeasy.otpauthURL({
      secret: secret,
      label: this.Email,
      issuer: 'IcoApp',
      encoding: 'base32'
    });
    return QRCode.toDataURL(otpauthUrl);
  };
  User.prototype.enableTfa = function (tfaId) {
    return this.getTfas({
      through: {
        where: {
          Tfa: tfaId
        }
      }
    }).then(async tfas => {
      if (tfas.length > 0) {
        tfas[0].UserTfa.Active = true;
        await tfas[0].UserTfa.save();
        this.validateActiveTfas();
        return tfas[0].UserTfa;
      }
      return null;
    });
  };
  User.prototype.disableTfa = async function (tfaId) {
    return this.getTfas({
      through: {
        where: {
          Tfa: tfaId
        }
      }
    }).then(async tfas => {
      if (tfas.length > 0) {
        tfas[0].UserTfa.Active = false;
        await tfas[0].UserTfa.save();
        this.validateActiveTfas();
        return tfas[0].UserTfa;
      }
      return null;
    });
  };
  User.prototype.tfas = async function () {
    return this.getTfas()
      .then(activeTfas => {
        return activeTfas.map(activeTfa => {
          let tfa = {
            Id: activeTfa.Id,
            Name: activeTfa.Name,
            QrCode: activeTfa.UserTfa.QrCode,
            Active: activeTfa.UserTfa.Active
          };
          return tfa;
        });
      });
  };
  User.prototype.activeTfas = async function () {
    return this.getTfas({
      through: {
        where: {
          Active: true
        }
      }
    }).then(activeTfas => {
      return activeTfas.map(activeTfa => {
        let tfa = {
          Id: activeTfa.Id,
          Name: activeTfa.Name,
          QrCode: activeTfa.UserTfa.QrCode,
          Active: activeTfa.UserTfa.Active
        };
        return tfa;
      });
    });
  };
  User.prototype.validateActiveTfas = async function () {
    this.activeTfas().then(tfas => {
      tfas = tfas.filter(tfa => tfa.Id !== 1);
      this.TfaActive = tfas.length > 0 ? true : false;
      this.save();
    });
  };
  User.prototype.generateLocalTfaToken = async function (secret) {
    return Speakeasy.totp({
      secret,
      encoding: 'base32',
      step: 60, // Seconds by step
      window: 5 // Number of steps
    });
  };
  User.prototype.verifyTfaToken = async function (tfaId, tfaToken) {
    const userTfa = await this.getUserTfa(tfaId, true);
    let validToken;
    if (userTfa) {
      if (userTfa.Active) {
        switch (tfaId) {
          case 1:
            validToken = await this.verifyLocalTfaToken(userTfa.Secret, tfaToken);
            break;

          default:
            validToken = await this.verifyOauthTfaToken(userTfa.Secret, tfaToken);
            break;
        }
      }
    }
    return validToken;
  };
  User.prototype.verifyLocalTfaToken = async function (secret, token) {
    return Speakeasy.totp.verifyDelta({
      secret,
      encoding: 'base32',
      token,
      step: 60, // Seconds by step
      window: 5 // Number of steps
    });
  };
  // To get the correct token in oauth applications, be sure the server system and
  // the device time be the same
  User.prototype.verifyOauthTfaToken = async function (secret, token) {
    return Speakeasy.totp.verify({
      secret,
      encoding: 'base32',
      token
    });
  };
  User.prototype.getFileByType = function (fileTypeId) {
    return this.getFileTypes({
      through: {
        where: {
          FileType: fileTypeId
        }
      }
    }).then(filetTypes => {
      if (filetTypes[0]) {
        return filetTypes[0];
      }
      return null;
    });
  };
  return User;
};