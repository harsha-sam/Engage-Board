'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    queryInterface.addConstraint('channels', {
      type: 'unique',
      fields: ['category_id', 'name'],
      name: 'channels_unique_index'
    })
  },

  down: async (queryInterface, Sequelize) => {
    queryInterface.removeConstraint('channels', 'channels_unique_index')
  }
};


