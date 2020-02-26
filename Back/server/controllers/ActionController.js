const Action = require('../models').Action;
const User = require('../models').User;
const UserAction = require('../models').UserAction;
const MailController = require('./MailController');
const SharedController = require('./SharedController');
const errorCodes = require('../config/errorCodes');
const languages = require('../config/languages');
const UserDeviceController = require('./UserDeviceController');

ActionController = {
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

    async validateToken(req, res) {
        let token = req.query.Token ? req.query.Token : "";
        let userAction = await UserAction.findOne({ where: { Token: token } });
        if (userAction) {
            let validExpDate = SharedController.validateExpDateToken(userAction.ExpDate);
            if (userAction.Active == true && validExpDate) {
                res.status(200).json("Success");
            }
            else if (!validExpDate) {
                ActionController.desactiveUserAction(userAction);
                res.status(500).json(errorCodes.ExpiredToken);
            }
            else {
                ActionController.desactiveUserAction(userAction);
                res.status(500).json(errorCodes.InvalidToken);
            }
        }
        else
            res.status(500).json(errorCodes.InvalidToken);
    },

    getUserByToken(token) {
        return UserAction.findOne({ where: { Token: token } })
            .then(userAction => {
                return userAction ? User.findOne({ where: { Oid: userAction.User } }) : null;
            });
    },

    getActionByToken(token) {
        return UserAction.findOne({ where: { Token: token } })
            .then(userAction => {
                return userAction ? Action.findOne({ where: { Id: userAction.Action } }) : null;
            });
    },

    async newActionByToken(req, res) {
        const hostUrl = req.body.HostUrl;
        const token = req.body.Token;
        const languageId = req.body.LanguageId;
        let action = await ActionController.getActionByToken(token);
        console.log(req.body);
        console.log("---------------");
        console.log(languageId);
        
        
        
        if (action) {
            let user = await ActionController.getUserByToken(token);
            let actionResult = await ActionController.addUserActionByType(user, action.Id, languageId, hostUrl);
            res.status(actionResult.status).json({ Token: actionResult.content });
        } else {
            res.status(500).json(errorCodes.InvalidToken);
        }
    },

    async newActionByUserOid(req, res) {
        const hostUrl = req.body.HostUrl;
        const actionId = req.body.ActionId;
        const userOid = req.body.UserOid;
        let user = await User.findOne({ where: { Oid: userOid } });
        let actionResult = await ActionController.addUserActionByType(user, actionId, hostUrl);
        let response = actionResult.status === 200 ? { Token: actionResult.content } : actionResult.content;
        res.status(actionResult.status).json(response);
    },

    async newActionByUserEmail(req, res) {
        const actionId = req.body.ActionId;
        const userEmail = req.body.UserEmail;
        const hostUrl = req.body.HostUrl;
        const languageId = req.body.LanguageId;
        let user = await User.findOne({ where: { Email: userEmail } });
        let actionResult = await ActionController.addUserActionByType(user, actionId, languageId, hostUrl);
        let response = actionResult.status === 200 ? { Token: actionResult.content } : actionResult.content;
        res.status(actionResult.status).json(response);
    },

    async addUserActionByType(user, actionId, languageId, hostUrl = null) {
        let actionResult = {
            status: 200,
            content: ""
        };
        if (user) {
            switch (actionId) {
                case 1:
                    actionResult.content = await ActionController.addNewEmailAction(user, actionId, languages[languageId].mails.emailConfirmationSubject, languages[languageId].mails.emailConfirmationMessage, hostUrl);
                    break;
                case 3:
                    actionResult.content = await ActionController.addNewEmailAction(user, actionId, languages[languageId].mails.passwordRecoverSubject, languages[languageId].mails.passwordRecoverMessage);
                    break;

                case 5:
                    actionResult.content = await ActionController.addNewEmailAction(user, actionId, languages[languageId].mails.newDeviceSubject, languages[languageId].mails.newDeviceMessage);
                    break;

                default:
                    actionResult.status = 500;
                    actionResult.content = errorCodes.InvalidAction;
                    break;
            }
        } else {
            actionResult.status = 500;
            actionResult.content = errorCodes.UserNotFound;
        }
        return actionResult;
    },

    async addNewEmailAction(user, accionId, emailSubject, emailMessage, hostUrl = null) {
        return ActionController.createNewUserAction(user, accionId, hostUrl).then(userAction => {
            let token = userAction.dataValues.Token;
            const bodyMessage = !hostUrl ? `${emailMessage} ${token}` : `${emailMessage} ${hostUrl}?Token=${token}`;
            console.log(bodyMessage);
            MailController.sendMail(user.Email, emailSubject, bodyMessage);
            return token;
        });
    },

    async createNewUserAction(user, accionId, hostUrl) {
        const userTfa = await user.getUserTfa(1);
        const localToken = !hostUrl ? await user.generateLocalTfaToken(userTfa ? userTfa.Secret : 'HJ4XM4ZQKZJF4LCT') : await SharedController.generateUuidV4();
        let oldUserAction = await ActionController.getActiveUserAction(user.Oid, accionId)
        let exp_date = new Date();
        exp_date.setHours(exp_date.getHours() + 1);
        if (oldUserAction) {
            ActionController.desactiveUserAction(oldUserAction);
        }
        return UserAction.create({
            User: user.Oid,
            Action: accionId,
            ExpDate: exp_date,
            Token: localToken
        });
    },

    getActiveUserAction(userOid, accionId) {
        return UserAction.findOne({
            where: {
                User: userOid,
                Action: accionId,
                Active: true
            }
        }).then(userAction => userAction);
    },

    desactiveUserAction(userAction) {
        userAction.Active = false;
        userAction.save();
    },

    async confirmToken(req, res) {
        let {
            Token,
            Payload
        } = req.body;
        UserAction.findOne({ where: { Token, Active: true } })
            .then(async userAction => {
                if (userAction) {
                    switch (userAction.Action) {
                        case 1:
                            ActionController.confirmUserEmail(userAction.User);
                            break;
                        case 3:
                            ActionController.setNewUserPassword(userAction.User, Payload.NewPassword);
                            break;
                        case 5: {
                            const uuid = SharedController.generateUuidV4();
                            await UserDeviceController.localCreate(uuid, userAction.User, 'desktop');
                            res.cookie('trustedDevice', uuid, { maxAge: 2592000000 });
                            break;
                        }
                        default:
                            res.status(500).json(errorCodes.InvalidToken);
                            return;
                    }
                    ActionController.desactiveUserAction(userAction);
                    res.status(200).json("Success");
                }
                else {
                    res.status(500).json(errorCodes.InvalidToken);
                }
            });
    },

    async confirmUserEmail(Oid) {
        let user = await User.findOne({ where: { Oid } });
        user.EmailConfirmed = true;
        user.save();
    },

    async setNewUserPassword(Oid, NewPassword) {
        let user = await User.findOne({ where: { Oid } });
        user.Password = NewPassword;
        user.save();
    }
};

module.exports = ActionController;