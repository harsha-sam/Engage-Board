'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    queryInterface.addIndex('requests', ['classroom_id', 'user_id'])
  },

  down: async (queryInterface, Sequelize) => {
    queryInterface.removeIndex('requests', ['classroom_id', 'user_id'])
  }
};
