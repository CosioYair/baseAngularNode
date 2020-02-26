var dotenv = require('dotenv').config();
const jwt = require('jsonwebtoken');
const passport = require('passport');
const errorCodes = require('./config/errorCodes');
const UserDeviceController = require('./controllers/UserDeviceController');

//Custom middlewares
const Middlewares = {
    verifyJwt(req, res, next) {
        let bearerToken = req.headers["authorization"] ? req.headers["authorization"].split(' ')[1] : "";
        jwt.verify(bearerToken, process.env.SECRET_KEY, (err, authData) => {
            if (err)
                res.status(401).json(errorCodes.Unauthorized)
            next();
        })
    },

    validateLoginRole(req, res, next) {
        const user = req.user;
        const roleId = req.body.RoleId ? req.body.RoleId : '1';
        user.validateRole(roleId).then(validRole => {
            if (!validRole) {
                return res.status(500).json(errorCodes.Role);
            }
            next();
        });
    },

    isSuperAdmin(req, res, next) {
        const user = req.user;
        user.validateRole('3').then(validRole => {
            if (!validRole) {
                return res.status(500).json(errorCodes.Role);
            }
            next();
        });
    },

    isAdmin(req, res, next) {
        const user = req.user;
        user.validateRole(['2', '3']).then(validRole => {
            if (!validRole) {
                return res.status(500).json(errorCodes.Role);
            }
            next();
        });
    },

    async validateTrustedDevice(req, res, next) {
        if (req.cookies['trustedDevice']) {
            const devices = await UserDeviceController.userDevicesByUserId(req.user.Oid);
            const trustedDevice = devices.filter(device => device.Oid === req.cookies['trustedDevice'].toString());
            if (!trustedDevice[0]) {
                return res.status(500).json(errorCodes.UnrecognizedDevice);
            }
        } else {
            return res.status(500).json(errorCodes.UnrecognizedDevice);
        }
        next();
    },

    passportLocalStrategy(req, res, next) {
        Middlewares.passportCustomCallback(req, res, next, 'local');
    },

    passport2FAStrategy(req, res, next) {
        Middlewares.passportCustomCallback(req, res, next, 'custom-2fa');
    },

    passportCustomOauthStrategy(req, res, next) {
        Middlewares.passportCustomCallback(req, res, next, 'custom-oauth');
    },

    passportCustomCallback(req, res, next, strategy) {
        passport.authenticate(strategy, { session: false }, function (err, user, info) {
            if (err) {
                return next(err);
            }
            if (!user) {
                return res.status(500).json(info);
            }
            req.user = user;
            next();
        })(req, res, next);
    }
};

module.exports = Middlewares;
