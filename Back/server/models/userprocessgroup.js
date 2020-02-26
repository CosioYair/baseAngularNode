'use strict';
module.exports = (sequelize, DataTypes) => {
  const UserProcessGroup = sequelize.define('UserProcessGroup', {
    Oid: {
      primaryKey: true,
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4
    },
    User: DataTypes.UUID,
    ProcessGroup: DataTypes.INTEGER,
    Finished: DataTypes.BOOLEAN
  }, {});
  UserProcessGroup.associate = function (models) {
    UserProcessGroup.belongsToMany(models.ProcessGroupCatalog, { through: models.ActiveProcessGroup, foreignKey: 'UserProcessGroup' });
  };
  UserProcessGroup.prototype.validatePendingUserProcessGroup = async function () {
    const activeProcessGroups = await this.getProcessGroupCatalogs();
    let finished = true;
    activeProcessGroups.map(activeProcessGroup => {
      if(activeProcessGroup.ActiveProcessGroup.Finished !== true) {
        finished = false;
      }
    });
    this.Finished = finished;
    return this.save();
  };
  return UserProcessGroup;
};