'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('messages', {
      id: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
      },
      sender_id: {
        type: Sequelize.STRING,
        references: {
          model: 'users',
          key: 'id'
        },
        allowNull: false,
      },
      receiver_id: {
        type: Sequelize.STRING,
        references: {
          model: 'users',
          key: 'id'
        },
        allowNull: true,
      },
      channel_id: {
        type: Sequelize.UUID,
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
        references: {
          model: 'channels',
          key: 'id'
        },
        allowNull: true,
      },
      content: {
        type: Sequelize.TEXT,
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
    await queryInterface.dropTable('messages');
  }
};