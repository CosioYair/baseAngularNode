const Language = require('../models').Language;
const SharedController = require('./SharedController');

LanguageController = {
    index(req, res) {
        return Language.findAll()
            .then(languages => res.status(200).json({ languages }))
            .catch(error => res.status(400).send(error));
    },

    show(req, res) {

    },

    create(req, res) {

    },

    update(req, res) {

    },

    delete(req, res) {

    },
};

module.exports = LanguageController;