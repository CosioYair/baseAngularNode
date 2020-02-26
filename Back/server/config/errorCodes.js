module.exports = {
    Unauthorized: {
        Code: 401,
        Message: 'Unauthorized'
    },
    EmailPassword: {
        Code: 452,
        Message: 'Invalid email or password'
    },
    Role: {
        Code: 453,
        Message: 'Invalid role for login'
    },
    Tfa: {
        Code: 454,
        Message: 'Invalid TFA token'
    },
    OauthCode: {
        Code: 455,
        Message: 'Invalid oauth token'
    },
    EmailTaken: {
        Code: 456,
        Message: 'This email has already been taken'
    },
    UserNotFound: {
        Code: 457,
        Message: 'User not found'
    },
    InvalidToken: {
        Code: 458,
        Message: 'Invalid token'
    },
    ExpiredToken: {
        Code: 459,
        Message: 'The token has been expired'
    },
    UnrecognizedDevice: {
        Code: 460,
        Message: 'We can not recognize this device.'
    },
    InvalidAction: {
        Code: 461,
        Message: 'Invalid action'
    },
};