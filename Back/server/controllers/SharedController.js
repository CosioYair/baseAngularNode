const User = require('../models').User;
const Role = require('../models').Role;
const MailController = require('./MailController');
const errorCodes = require('../config/errorCodes');
const dotenv = require('dotenv').config();

var SharedController = {
    setFieldErrors(err) {
        let responseErrors = {};
        let errors = [];
        errors = err.errors ? err.errors : [{ path: "generalError", message: err }];
        errors.map(error => {
            switch (error.path) {
                case 'Email':
                    if (error.message.match(/is already in use/)) {
                        responseErrors[error.path] = errorCodes.EmailTaken;
                    } else {
                        responseErrors[error.path] = error.message
                    }
                    break;

                case 'Oid':
                    responseErrors[error.path] = errorCodes.EmailTaken;
                    break;

                default:
                    break;
            }
        });
        return responseErrors;
    },

    async getFullUserInfo(Oid, roleId) {
        let fullUser = {};
        const user = await User.findOne({ where: { Oid } });
        const role = await Role.findOne({ where: { Id: roleId } });
        const pendingProcesses = await user.getPendingProcesses();
        const privileges = await role.getFormatedPrivileges();
        fullUser = SharedController.mergeObjects([
            user.dataValues,
            { privileges },
            { pendingProcesses }
        ]);
        fullUser.roleId = roleId;
        return fullUser;
    },

    hashPassword(password) {
        const bcrypt = require('bcryptjs');
        return bcrypt.hashSync(password, 10);
    },

    mergeObjects(objectsArray) {
        let merge = {};
        objectsArray.map(object => {
            merge = { ...merge, ...object };
        });
        return merge;
    },

    uploadUserImage(req, res, next) {
        let imagePath = req.file.path.replace("public\\", "").split("\\").join("/");
        let baseUrl = `${process.env.SERVER_IP ? process.env.SERVER_IP : 'http://localhost'}:${process.env.PORT ? process.env.PORT : '3000'}`;
        let fullPath = `${baseUrl}/${imagePath}`;
        let type = req.query.FileType;
        const user = req.user;
        user.removeFileType(type);
        user.addFileType(type, {
            through: {
                Source: baseUrl + req.file.path.replace('public', '')
            }
        })
        res.status(200).json({ fullPath });
    },

    getTranslationRecords(fullRecords, recorFields, translationKey, translationFields) {
        return fullRecords.map(record => {
            let translations = {};
            recorFields.forEach(field => {
                translations[field] = record[field];
            });
            translationFields.forEach(field => {
                translations[field] = record[translationKey][field];
            });
            return translations;
        });
    },

    catchGeneralDbError(err) {
        let customError;
        let customErrorCode;
        const foreingKey = err.original.detail.match(/\b(?:Key|is not present in table)\b/gi).length === 2;
        const constraint = err.original.constraint.split('_').pop();
        if (foreingKey) {
            customErrorCode = { ...errorCodes.InvalidField };
            customErrorCode.Message = `${customErrorCode.Message} ${constraint}`;
            customError = customErrorCode;
        } else {
            customError = errorCodes.SomethingWrong;
        }
        console.log(err);
        return customError;
    },

    catchGeneralServerError(err, res) {
        console.log(err);
        if (err.TimeoutError) {
            return res.status(500).json(errorCodes.TimeOut);
        }
        return res.status(500).json(errorCodes.SomethingWrong);
    },

    async setHasManyRecors(instance, associatioRecords, getMethod, createMethod) {
        const currentRecords = await instance[getMethod]();
        const deleteRecords = SharedController.getRecordsToDelete(currentRecords, updateRecords, primaryKey);
        await Promise.all(deleteRecords.map(deleteRecord => deleteRecord.destroy()));
        if (updateRecords.length === 0) {
            return updateRecords;
        }
        return await Promise.all(updateRecords.map(async updateRecord => {
            if (updateRecord[primaryKey]) {
                let currentRecord = await instance[getMethod]({ where: { [primaryKey]: updateRecord[primaryKey] } });
                if (currentRecord.length > 0) {
                    const updateKeys = Object.keys(updateRecord);
                    currentRecord = currentRecord[0];
                    updateKeys.map(key => currentRecord[key] = updateRecord[key]);
                    return await currentRecord.save();
                }
            }
            delete updateRecord[primaryKey];
            return instance[createMethod](updateRecord);
        })).catch(err => SharedController.catchGeneralDbError(err));
    },

    async setBelongsToManyRecors(instance, updateRecords, getMethod, addMethod, subInstance, mainInstance, primaryKey = 'Oid') {
        const currentRecords = await instance[getMethod]().map(currentRecord => currentRecord[subInstance]);
        const deleteRecords = SharedController.getRecordsToDelete(currentRecords, updateRecords, primaryKey);
        await Promise.all(deleteRecords.map(deleteRecord => deleteRecord.destroy()));
        return await Promise.all(updateRecords.map(updateRecord => {
            let through = { ...updateRecord };
            updateRecord[primaryKey] ? delete through[primaryKey] : delete through[mainInstance];
            return instance[addMethod](updateRecord[through[primaryKey] ? through[primaryKey] : mainInstance], { through })
                .then(newRecords => {
                    if (newRecords[0]) {
                        if (newRecords[0][0][primaryKey]) {
                            return newRecords[0][0]
                        }
                    }
                    return updateRecord
                });
        })).catch(err => SharedController.catchGeneralDbError(err));
    },

    getRecordsToDelete(currentObjs, updateObjs, key) {
        let deleteRecords = [];
        currentObjs.map(currentObj => {
            const found = updateObjs.find(updateObj => updateObj[key] == currentObj[key]);
            if (!found) {
                deleteRecords.push(currentObj);
            }
        });
        return deleteRecords;
    },

    sendMail(email, subject, message) {
        MailController.sendMail(email, subject, message);
    },

    sendManyMails(emails, subject, message) {
        emails.map(email => {
            MailController.sendMail(email, subject, message);
        });
    },

    validateExpDateToken(expDate) {
        let today = new Date();
        expDate = new Date(expDate);
        return today <= expDate;
    },

    getAuthUserInfo(oid) {
        let authInfo = {};
        let query = { where: { Oid: oid } };
        return User.findOne(query).then(async user => {
            const privileges = await user.getFormatedPrivileges();
            authInfo = {
                Oid: user.Oid,
                Privileges: privileges
            };
            return authInfo;
        });
    },

    generateUuidV4() {
        const uuidv1 = require('uuid/v1');
        return uuidv1();
    },

};

module.exports = SharedController;