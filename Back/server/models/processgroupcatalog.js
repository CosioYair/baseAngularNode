'use strict';
module.exports = (sequelize, DataTypes) => {
  const ProcessGroupCatalog = sequelize.define('ProcessGroupCatalog', {
    Id: {
      primaryKey: true,
      type: DataTypes.INTEGER,
      autoIncrement: true,
    },
    ProcessGroup: DataTypes.INTEGER,
    Process: DataTypes.INTEGER,
    Step: DataTypes.INTEGER,
  }, {});
  ProcessGroupCatalog.associate = function(models) {
    ProcessGroupCatalog.belongsToMany(models.UserProcessGroup, { through: models.ActiveProcessGroup, foreignKey: 'ProcessGroupCatalog' });
  };
  return ProcessGroupCatalog;
};