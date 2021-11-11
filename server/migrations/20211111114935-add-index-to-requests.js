'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    queryInterface.addIndex('requests', ['team_id', 'user_id'])
  },

  down: async (queryInterface, Sequelize) => {
    queryInterface.removeIndex('requests', ['team_id', 'user_id'])
  }
};
