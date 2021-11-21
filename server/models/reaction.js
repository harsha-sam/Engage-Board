'use strict';
const {
  Model
} = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Reaction extends Model {
    static associate(models) {
      const { User, Message } = models;
      this.belongsTo(User, {
        as: 'user',
        foreignKey: 'user_id',
      })
      this.belongsTo(Message, {
        as: 'message',
        foreignKey: 'message_id',
      })
    }
  };
  Reaction.init({
    id: {
      allowNull: false,
      primaryKey: true,
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
    },
    message_id: {
      type: DataTypes.UUID,
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE',
      references: {
        model: 'Message',
        key: 'id'
      },
      unique: 'compositeIndex',
      allowNull: false,
    },
    user_id: {
      type: DataTypes.STRING,
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE',
      references: {
        model: 'User',
        key: 'id'
      },
      unique: 'compositeIndex',
      allowNull: false,
    },
    reaction: {
      type: DataTypes.ENUM(['Like', 'Smile', 'Frown', 'Heart']),
      unique: 'compositeIndex',
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
    tableName: 'reactions',
    modelName: 'Reaction',
  });
  return Reaction;
};