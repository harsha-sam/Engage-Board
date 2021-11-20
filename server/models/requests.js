'use strict';
const {
  Model
} = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Request extends Model {
    static associate(models) {
      const { Classroom, User } = models;
      this.belongsTo(Classroom, {
        as: 'classroom',
        foreignKey: 'classroom_id',
      })
      this.belongsTo(User, {
        as: 'user',
        foreignKey: 'user_id',
      })
    }
  };
  Request.init({
    id: {
      allowNull: false,
      primaryKey: true,
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
    },
    classroom_id: {
      type: DataTypes.UUID,
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE',
      references: {
        model: 'Classroom',
        key: 'id'
      },
      allowNull: false
    },
    user_id: {
      type: DataTypes.STRING,
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE',
      references: {
        model: 'User',
        key: 'id'
      },
      allowNull: false,
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
    tableName: 'requests',
    modelName: 'Request',
  });
  return Request;
};