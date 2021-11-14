'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('channels', {
      id: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
      },
      name: {
        type: Sequelize.STRING,
        allowNull: false
      },
      classroom_id: {
        type: Sequelize.UUID,
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
        references: {
          model: 'classrooms',
          key: 'id'
        },
        allowNull: false
      },
      category_id: {
        type: Sequelize.UUID,
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
        references: {
          model: 'categories',
          key: 'id'
        },
        allowNull: true
      },
      createdAt: {
        field: 'created_at',
        type: 'TIMESTAMP',
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
        allowNull: false,
      },
      updatedAt: {
        field: 'updated_at',
        type: 'TIMESTAMP',
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
        allowNull: false,
      }
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('channels');
  }
};