'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    queryInterface.addIndex('reactions', ['message_id', 'user_id', 'reaction'])
  },

  down: async (queryInterface, Sequelize) => {
    queryInterface.removeIndex('reactions', ['message_id', 'user_id', 'reaction'])
  }
};
