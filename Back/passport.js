const passport = require('passport');
const JWTStrategy = require('passport-jwt').Strategy;
const LocalStrategy = require('passport-local').Strategy;
const CustomStrategy = require('passport-custom').Strategy;
const FacebookStrategy = require('passport-facebook').Strategy;
const FacebookTokenStrategy = require('passport-facebook-token');
const GoogleStrategy = require('passport-google-oauth2').Strategy;
const GooglePlusTokenStrategy = require('passport-google-plus-token');
const { ExtractJwt } = require('passport-jwt');
const UserController = require('./server/controllers').UserController;
const User = require('./server/models').User;
const googleRegisterType = 2;
const facebookRegisterType = 3;
const errorCodes = require('./server/config/errorCodes');
var dotenv = require('dotenv').config();

//JWT Strategy
passport.use(new JWTStrategy({
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: process.env.SECRET_KEY
}, async (payload, done) => {
    try {
        const user = await User.findOne({ where: { Oid: payload.Oid } });
        if (!user) {
            return done(null, false);
        }
        done(null, user);
    } catch (error) {
        done(error, false);
    }
}));

//Local Strategy
passport.use(new LocalStrategy({
    usernameField: 'Email',
    passwordField: 'Password',
    passReqToCallback: true
}, async (req, Email, Password, done) => {
    try {
        const user = await User.scope('withPassword').findOne({ where: { Email } });
        if (user) {
            if (user.validatePassword(Password)) {
                return done(null, user);
            }
        }
        done(null, false, errorCodes.EmailPassword);
    } catch (error) {
        done(error, false);
    }
}));

//Custom 2FA Strategy
passport.use('custom-2fa', new CustomStrategy(
    async (req, done) => {
        try {
            const user = req.user;
            if (user.TfaActive) {
                const tfaId = req.body.tfaId;
                const tfaToken = req.body.tfaToken;
                const validToken = await user.verifyTfaToken(tfaId, tfaToken);
                if (!validToken) {
                    return done(null, false, errorCodes.Tfa);
                }
            }
            done(null, user);
        } catch (error) {
            done(error, false);
        }
    }
));

//Facebook token Strategy
passport.use(new FacebookTokenStrategy({
    clientID: process.env.FACEBOOK_APP_ID,
    clientSecret: process.env.FACEBOOK_APP_SECRET
}, function (accessToken, refreshToken, profile, done) {
    const email = profile.emails[0].value;
    const oauthResponse = {
        registerTypeId: facebookRegisterType,
        userData: {
            Email: email,
            Name: `${profile.name.givenName} ${profile.name.familyName}`,
            Key: profile.id,
            AdditionalInfo: ''
        }
    };
    done(null, oauthResponse)
}));

//Facebook Strategy
passport.use(new FacebookStrategy({
    clientID: process.env.FACEBOOK_APP_ID,
    clientSecret: process.env.FACEBOOK_APP_SECRET,
    callbackURL: process.env.FACEBOOK_APP_CALLBACK_URL,
    profileFields: ['id', 'emails', 'name']
},
    (accessToken, refreshToken, profile, done) => {
        const email = profile.emails[0].value;
        const oauthResponse = {
            registerTypeId: facebookRegisterType,
            userData: {
                Email: email,
                Name: `${profile.name.givenName} ${profile.name.familyName}`,
                Key: profile.id,
                AdditionalInfo: ''
            }
        };
        done(null, oauthResponse)
    }
));

//Google token Strategy
passport.use(new GooglePlusTokenStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET
}, function (accessToken, refreshToken, profile, done) {
    const email = profile.emails[0].value;
    const oauthResponse = {
        registerTypeId: googleRegisterType,
        userData: {
            Email: email,
            Name: `${profile.name.givenName} ${profile.name.familyName}`,
            Key: profile.id,
            AdditionalInfo: ''
        }
    };
    done(null, oauthResponse)
}));

//Google Strategy
passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: process.env.GOOGLE_CLIENT_CALLBACK_URL,
    passReqToCallback: true
},
    (req, accessToken, refreshToken, profile, done) => {
        const oauthResponse = {
            registerTypeId: googleRegisterType,
            userData: {
                Email: profile.email,
                Name: `${profile.displayName.replace(/\b\w/g, l => l.toUpperCase())}`,
                Key: profile.id,
                AdditionalInfo: ''
            }
        };
        done(null, oauthResponse)
    }
));