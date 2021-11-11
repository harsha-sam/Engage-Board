'use strict';
const {
  Model
} = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Team extends Model {
    static associate(models) {
      const { Category, Channel, User } = models;
      this.hasMany(Category, {
        as: 'categories',
        foreignKey: 'team_id',
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE'
      })
      this.hasMany(Channel, {
        as: 'channels',
        foreignKey: 'team_id',
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE'
      })
      this.belongsTo(User, {
        as: 'admin',
        foreignKey: 'created_by',
      })
    }
  };
  Team.init({
    id: {
      allowNull: false,
      primaryKey: true,
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    created_by: {
      type: DataTypes.STRING,
      references: {
        model: 'users',
        key: 'id'
      },
    },
    members: {
      type: DataTypes.ARRAY(DataTypes.JSON),
      defaultValue: [],
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
    tableName: 'teams',
    modelName: 'Team',
  });
  return Team;
};