const jwt = require('jsonwebtoken');
const UserController = require('./UserController');
const SharedController = require('./SharedController');
const UserDeviceController = require('./UserDeviceController');
const errorCodes = require('../config/errorCodes');
var dotenv = require('dotenv').config();

AuthController = {
    async signing(req, res) {
        const authUserInfo = await SharedController.getAuthUserInfo(req.user.Oid);
        const token = AuthController.generateJwt(authUserInfo);
        res.json({ token });
    },

    async signup(req, res) {
        let userData = req.body.UserData;
        let confirmEmailUrl = req.body.ConfirmEmailUrl ? req.body.ConfirmEmailUrl : "http://localhost:8080/auth/emailConfirmation";
        let registerTypeId = req.body.RegisterTypeId ? req.body.RegisterTypeId : 1;
        let roleId = req.body.RoleId ? req.body.RoleId : 1;
        const deviceOid = SharedController.generateUuidV4();
        res.cookie('trustedDevice', deviceOid, { maxAge: 2592000000, httpOnly: false });
        UserController.localCreate(userData, registerTypeId, confirmEmailUrl, roleId).then(async user => {
            const status = user.Oid ? 200 : 500;
            if (status === 200) {
                const authUserInfo = await SharedController.getAuthUserInfo(user.Oid);
                const token = AuthController.generateJwt(authUserInfo);
                await UserDeviceController.localCreate(deviceOid, user.dataValues.Oid, 'desktop');
                return res.status(status).json({ token });
            }
            res.status(status).send(user);
        });
    },

    generateJwt(authUserInfo) {
        return jwt.sign(authUserInfo, process.env.SECRET_KEY, { expiresIn: '2h' });
    },

    async oauthLogin(userData, registerTypeId) {
        const key = userData.Key;
        const additionalInfo = userData.additionalInfo;
        let user = await UserController.getFromEmail(userData.Email);
        if (!user) {
            user = await UserController.localCreate(userData, registerTypeId, null, 1, key, additionalInfo);
        }
        if (!user.EmailConfirmed) {
            ActionController.confirmUserEmail(user.Oid);
        }
        await user.addRegisterType(registerTypeId, { through: { Key: key, AdditionalInfo: additionalInfo } });
        const authUserInfo = await SharedController.getAuthUserInfo(user.Oid);
        const token = AuthController.generateJwt(authUserInfo);
        return token;
    },

    async generateLocalTfaToken(req, res) {
        const user = await UserController.getFromEmail(req.params.Email);
        const subject = req.query.Subject;
        const message = req.query.Message;
        const tfaId = 1;
        let userTfa = await user.getUserTfa(tfaId);
        if (userTfa) {
            if (userTfa.Active) {
                const tfaToken = await user.generateLocalTfaToken(userTfa.Secret);
                SharedController.sendMail(user.Email, subject, `${message}: ${tfaToken}`);
                return res.status(200).json({ tfaToken });
            }
        }
        res.status(500).json(errorCodes.Tfa);
    },
};

module.exports = AuthController;