const Gender = require('../models').Gender;
const Language = require('../models').Language;
const SharedController = require('./SharedController');

var GenderController = {
    index(req, res) {
        let languageId = req.query.LanguageId ? req.query.LanguageId : 2;
        GenderController.getGendersByLanguage(languageId).then(genderTranslations => {
            if (genderTranslations) {
                let genders = SharedController.getTranslationRecords(genderTranslations.Genders, ['Id', 'Name'], 'GenderTranslation', ['DisplayText']);
                res.json({ Genders: genders });
            }
            else
                res.status(500).send('Genders not found');
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

    getGendersByLanguage(languageId) {
        return Language.findOne({
            attributes: ['DisplayText'],
            include: [{
                model: Gender,
                attributes: ['Id', 'Name'],
            }],
            where: {
                Id: languageId
            }
        });
    }
};

module.exports = GenderController;