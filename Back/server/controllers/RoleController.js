const Role = require('../models').Role;
const Language = require('../models').Language;
const SharedController = require('./SharedController');

var RoleController = {
    index(req, res) {
        let languageId = req.query.LanguageId ? req.query.LanguageId : 2;
        RoleController.getRolesByLanguage(languageId).then(roleTranslations => {
            if (roleTranslations) {
                let roles = SharedController.getTranslationRecords(roleTranslations.Roles, ['Id', 'Name'], 'RoleTranslation', ['DisplayText']);
                res.status(200).json({ Roles: roles });
            }
            else
                res.status(500).send('Roles not found');
        });
    },

    show(req, res) {

    },

    create(req, res) {

    },

    update(req, res) {

    },

    delete(req, res) {

    },

    getRolesByLanguage(languageId) {
        return Language.findOne({
            attributes: ['DisplayText'],
            include: [{
                model: Role,
                attributes: ['Id', 'Name'],
            }],
            where: {
                Id: languageId
            }
        });
    }
};

module.exports = RoleController;