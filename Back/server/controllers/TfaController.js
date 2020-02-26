const Tfa = require('../models').Tfa;
const Language = require('../models').Language;
const SharedController = require('./SharedController');

var TfaController = {
    index(req, res) {
        let languageId = req.query.LanguageId ? req.query.LanguageId : 2;
        TfaController.getTfasByLanguage(languageId).then(tfaTranslations => {
            if (tfaTranslations) {
                let tfas = SharedController.getTranslationRecords(tfaTranslations.Tfas, ['Id', 'Name'], 'TfaTranslation', ['DisplayText']);
                res.json({ tfas });
            }
            else
                res.status(500).send('Tfas not found');
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

    getTfasByLanguage(languageId) {
        return Language.findOne({
            attributes: ['DisplayText'],
            include: [{
                model: Tfa,
                attributes: ['Id', 'Name'],
            }],
            where: {
                Id: languageId
            }
        });
    }
};

module.exports = TfaController;