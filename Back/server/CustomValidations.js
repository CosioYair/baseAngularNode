module.exports = {
    isUnique(modelName, field) {
        return function (value, next) {
            var Model = require("./models")[modelName];
            var query = {};
            query[field] = value;
            Model.find({ where: query }).then(function (obj) {
                if (obj) {
                    next(`The ${field.split("_").join(" ")} ${value} is already in use`);
                } else {
                    next();
                }
            });
        };
    }
}