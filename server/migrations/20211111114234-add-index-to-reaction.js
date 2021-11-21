'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    queryInterface.addConstraint('reactions', {
      type: 'unique',
      fields: ['message_id', 'user_id', 'reaction'],
      name: 'reactions_unique_index'
    })
  },

  down: async (queryInterface, Sequelize) => {
    queryInterface.removeConstraint('reactions', 'reactions_unique_index')
  }
};
