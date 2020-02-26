'use strict';
module.exports = (sequelize, DataTypes) => {
  const UserDevice = sequelize.define('UserDevice', {
    Oid: {
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4,
      type: DataTypes.UUID
    },
    User: DataTypes.UUID,
    Type: DataTypes.STRING
  }, {});
  UserDevice.associate = function(models) {
    UserDevice.belongsTo(models.User, { foreignKey: 'User', as: 'UserId' });
  };
  return UserDevice;
};