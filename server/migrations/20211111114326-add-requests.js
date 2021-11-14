'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('requests', {
      id: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
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
      user_id: {
        type: Sequelize.STRING,
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
        references: {
          model: 'users',
          key: 'id'
        },
        allowNull: false,
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
    await queryInterface.dropTable('requests');
  }
};
