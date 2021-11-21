'use strict';
const {
  Model
} = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Channel extends Model {
    static associate(models) {
      const { Classroom, Category, Message } = models;
      this.belongsTo(Classroom, {
        as: 'classroom',
        foreignKey: 'classroom_id',
      })
      this.belongsTo(Category, {
        as: 'category',
        foreignKey: 'category_id',
      })
      this.hasMany(Message, {
        as: 'messages',
        foreignKey: 'channel_id',
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE'
      })
    }
  };
  Channel.init({
    id: {
      allowNull: false,
      primaryKey: true,
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
    },
    name: {
      type: DataTypes.STRING,
      unique: 'compositeIndex',
      allowNull: false
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
    category_id: {
      type: DataTypes.UUID,
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE',
      references: {
        model: 'Category',
        key: 'id'
      },
      unique: 'compositeIndex',
      allowNull: true
    },
    message_permission: {
      type: DataTypes.ARRAY(DataTypes.STRING),
      defaultValue: ['admin', 'monitor', 'student'],
      allowNull: true
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
    tableName: 'channels',
    modelName: 'Channel',
  });
  return Channel;
};