const UserFileType = require('../models').UserFileType;
const SharedController = require('./SharedController');

FileTypeController = {
    index(req, res) {
        return UserFileType.findAll({
            attributes: ['Oid', 'Source', 'User', 'FileType']
        })
        .then(userfiletypes => res.status(200).json({ userfiletypes }))
        .catch(error => res.status(400).send(error));
    },

    filesByUser(req, res) {
        const oid = req.params.UserOid;
        return UserFileType.findAll({
            attributes: ['Oid', 'Source', 'User', 'FileType'],
            where: {
                User: oid
            }
        })
        .then(userfiletypes => res.status(200).json({ userfiletypes }))
        .catch(error => res.status(400).send(error));
    },

    fileByUser(req, res) {
        const oid = req.params.UserOid;
        const fileTypeId = req.params.FileTypeId;
        return UserFileType.findOne({
            attributes: ['Oid', 'Source', 'User', 'FileType'],
            where: {
                User: oid,
                FileType: fileTypeId
            }
        })
        .then(userFileType => res.status(200).json({ UserFileType: userFileType }))
        .catch(err => SharedController.catchGeneralServerError(err, res));
    }
};

module.exports = FileTypeController;
