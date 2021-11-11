'use strict';
const {
  Model
} = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Message extends Model {
    static associate(models) {
      const { User, Channel, Reaction } = models;
      this.belongsTo(User, {
        as: 'sender',
        foreignKey: 'sender_id',
      })
      this.belongsTo(User, {
        as: 'receiver',
        foreignKey: 'receiver_id',
      })
      this.belongsTo(Channel, {
        as: 'channel',
        foreignKey: 'channel_id',
      })
      this.hasMany(Reaction, {
        as: 'reactions',
        foreignKey: 'message_id',
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE'
      })
    }
  };
  Message.init({
    id: {
      allowNull: false,
      primaryKey: true,
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
    },
    sender_id: {
      type: DataTypes.STRING,
      references: {
        model: 'User',
        key: 'id'
      },
      allowNull: false,
    },
    receiver_id: {
      type: DataTypes.STRING,
      references: {
        model: 'User',
        key: 'id'
      },
      allowNull: true,
    },
    channel_id: {
      type: DataTypes.UUID,
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE',
      references: {
        model: 'Channel',
        key: 'id'
      },
      allowNull: true,
    },
    content: {
      type: DataTypes.TEXT,
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
    tableName: 'messages',
    modelName: 'Message',
  });
  return Message;
};