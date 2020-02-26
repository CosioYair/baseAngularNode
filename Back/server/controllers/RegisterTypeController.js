const RegisterType = require('../models').RegisterType;

var RegisterTypeController = {
    index(req, res) {

    },

    show(req, res) {

    },

    create(req, res) {

    },

    update(req, res) {

    },

    delete(req, res) {

    },

    async verifyUserRegisterType(user, registerTypeId) {
        return user.getRegisterTypes({
            through: {
                where: {
                    RegisterType: registerTypeId
                }
            }
        });
    },

};

module.exports = RegisterTypeController;