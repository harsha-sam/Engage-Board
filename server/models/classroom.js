'use strict';
const {
  Model
} = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Classroom extends Model {
    static associate(models) {
      const { Category, Channel, User } = models;
      this.hasMany(Category, {
        as: 'categories',
        foreignKey: 'classroom_id',
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE'
      })
      this.hasMany(Channel, {
        as: 'channels',
        foreignKey: 'classroom_id',
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE'
      })
      this.belongsTo(User, {
        as: 'admin',
        foreignKey: 'created_by',
      })
    }
  };
  Classroom.init({
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
      type: DataTypes.JSONB,
      defaultValue: {},
    },
    is_moderation_enabled: {
      type: DataTypes.BOOLEAN,
      defaultValue: true
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
    hooks: {
      afterCreate: async (classroom) => {
        const { Category, Channel } = sequelize.models;
        const classroom_id = classroom.id;
        let categories = await Category.bulkCreate([{
          name: 'important',
          classroom_id,
        },
        {
          name: 'general',
          classroom_id
        },
        {
          name: 'classes',
          classroom_id
        },
        ], {
          returning: true
        })
        await Channel.bulkCreate([{
          name: 'announcements',
          classroom_id,
          category_id: categories[0].id,
          message_permission: ['admin', 'monitor']
        },
        {
          name: 'general',
          classroom_id,
          category_id: categories[1].id
        },
        {
          name: 'helpMe',
          classroom_id,
          category_id: categories[1].id
        },
        {
          name: 'lectures',
          classroom_id,
          category_id: categories[2].id
        },
        {
          name: 'doubts',
          classroom_id,
          category_id: categories[2].id
        }
        ])
      }
    },
    sequelize,
    tableName: 'classrooms',
    modelName: 'Classroom',
  });
  return Classroom;
};