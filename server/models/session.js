'use strict';
const {
  Model
} = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Session extends Model {
    static associate(models) {

    }
  };
  Session.init({
    id: {
      allowNull: false,
      primaryKey: true,
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
    },
    user_id: {
      type: DataTypes.STRING,
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE',
      references: {
        model: 'users',
        key: 'id'
      },
    },
    refresh_token: {
      type: DataTypes.STRING,
      allowNull: false
    },
    createdAt: {
      field: 'created_at',
      type: 'TIMESTAMP',
      defaultValue: sequelize.literal('CURRENT_TIMESTAMP'),
      allowNull: false,
    },
    updatedAt: {
      field: 'updated_at',
      type: 'TIMESTAMP',
      defaultValue: sequelize.literal('CURRENT_TIMESTAMP'),
      allowNull: false,
    }
  }, {
    sequelize,
    tableName: 'sessions',
    modelName: 'Session',
  });
  return Session;
};