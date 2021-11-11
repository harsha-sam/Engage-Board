'use strict';
const {
  Model
} = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Category extends Model {
    static associate(models) {
      const { Channel, Team } = models;
      this.hasMany(Channel, {
        as: 'channels',
        foreignKey: 'category_id',
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE'
      })
      this.belongsTo(Team, {
        as: 'team',
        foreignKey: 'team_id',
      })
    }
  };
  Category.init({
    id: {
      allowNull: false,
      primaryKey: true,
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      set(value) {
        this.setDataValue('name', value.toUpperCase())
      }
    },
    team_id: {
      type: DataTypes.UUID,
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE',
      references: {
        model: 'Team',
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
    tableName: 'categories',
    modelName: 'Category',
  });
  return Category;
};