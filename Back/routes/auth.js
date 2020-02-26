var express = require('express');
var router = express.Router();
const AuthController = require('../server/controllers').AuthController;
const middlewares = require('../server/middlewares');
const passport = require('passport');

router.post('/', [middlewares.passportLocalStrategy, middlewares.validateLoginRole, middlewares.validateTrustedDevice, middlewares.passport2FAStrategy], AuthController.signing);
router.post('/localLogin', [middlewares.passportLocalStrategy, middlewares.validateLoginRole, middlewares.validateTrustedDevice, middlewares.passport2FAStrategy], AuthController.signing);
router.post('/signup', AuthController.signup);
router.get('/generateLocalTfaToken/:Email', AuthController.generateLocalTfaToken);

router.get('/facebook', (req, res, next) => {
    req.session.returnTo = req.query.returnTo;
    next();
}, [passport.authenticate('facebook', { scope: ['email'] })]);

router.post('/facebook/token', (req, res, next) => {
    passport.authenticate('facebook-token', { session: false }, async (err, oauthResponse, info) => {
        if (err) { return next(err); }
        const token = await AuthController.oauthLogin(oauthResponse.userData, oauthResponse.registerTypeId);
        res.json({ token });
    })(req, res, next);
});

router.get('/facebook/callback', (req, res, next) => {
    passport.authenticate('facebook', {
        session: false,
        failureRedirect: req.session.returnTo
    }, async (err, oauthResponse, info) => {
        if (err) { return next(err); }
        const token = await AuthController.oauthLogin(oauthResponse.userData, oauthResponse.registerTypeId);
        res.redirect(`${req.session.returnTo}?token=${token}`);
        delete req.session.returnTo;
    })(req, res, next);
});

router.get('/google', (req, res, next) => {
    req.session.returnTo = req.query.returnTo;
    next();
}, [passport.authenticate('google', {
    scope: [
        'https://www.googleapis.com/auth/userinfo.profile',
        'https://www.googleapis.com/auth/userinfo.email'
    ]
})]);

router.post('/google/token', (req, res, next) => {
    passport.authenticate('google-plus-token', { session: false }, async (err, oauthResponse, info) => {
        if (err) { return next(err); }
        const token = await AuthController.oauthLogin(oauthResponse.userData, oauthResponse.registerTypeId);
        res.json({ token });
    })(req, res, next);
});

router.get('/google/callback', (req, res, next) => {
    passport.authenticate('google', {
        session: false,
        failureRedirect: req.session.returnTo
    }, async (err, oauthResponse, info) => {
        if (err) { return next(err); }
        const token = await AuthController.oauthLogin(oauthResponse.userData, oauthResponse.registerTypeId);
        res.redirect(`${req.session.returnTo}?token=${token}`);
        delete req.session.returnTo;
    })(req, res, next);
});

module.exports = router;
