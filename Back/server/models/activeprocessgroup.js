'use strict';
module.exports = (sequelize, DataTypes) => {
  const ActiveProcessGroup = sequelize.define('ActiveProcessGroup', {
    Oid: {
      primaryKey: true,
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4
    },
    ProcessGroupCatalog: DataTypes.INTEGER,
    UserProcessGroup: DataTypes.UUID,
    Finished: DataTypes.BOOLEAN
  }, {});
  ActiveProcessGroup.associate = function (models) {
    // associations can be defined here
  };
  ActiveProcessGroup.prototype.finish = async function () {
    const UserProcessGroup = require('../models').UserProcessGroup;
    this.Finished = true;
    return this.save().then(async activeProcessGroup => {
      const userProcessGroup = await UserProcessGroup.findOne({ where: { Oid: activeProcessGroup.UserProcessGroup } });
      await userProcessGroup.validatePendingUserProcessGroup();
      return activeProcessGroup;
    });
  };
  return ActiveProcessGroup;
};