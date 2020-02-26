const UserDevice = require('../models').UserDevice;

UserDeviceController = {
  localCreate(oid, userOid, type) {
    return UserDevice.create({
      Oid: oid,
      User: userOid,
      Type: type
    })
  },

  index(req, res) {
    return UserDevice.findAll({
      attributes: [
        'Oid',
        'User',
        'Type'
      ]
    })
    .then(userDevices => res.status(200).json({ userDevices }))
    .catch(error => res.status(400).send(error));
  },

  userDevicesByUserId(userOid) {
    return UserDevice.findAll({
      attributes: [
        'Oid',
        'User',
        'Type'
      ],
      where: {
        User: userOid
      }
    })
  },

  lastUserDevice(req, res) {
    return UserDevice.findAll({
      limit: 1,
      attributes: [
        'Oid'
      ],
      where: {
        User: req.params.Oid
      },
      order: [ [ 'createdAt', 'DESC' ]]
    })
    .then(userdevice => {
        res.cookie('trustedDevice', userdevice.Oid, { maxAge: 2592000000 });
        res.status(200).json({ userdevice });
      })
    .catch(error => res.status(400).send(error));
  }
};

module.exports = UserDeviceController;
