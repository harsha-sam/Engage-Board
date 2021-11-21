'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    queryInterface.addConstraint('requests', {
      type: 'unique',
      fields: ['classroom_id', 'user_id'],
      name: 'requests_unique_index'
    })
  },

  down: async (queryInterface, Sequelize) => {
    queryInterface.removeConstraint('requests', 'requests_unique_index')
  }
};
