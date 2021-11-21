'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    queryInterface.addConstraint('categories', {
      type: 'unique',
      fields: ['classroom_id', 'name'],
      name: 'unique_index'
    })
  },

  down: async (queryInterface, Sequelize) => {
    queryInterface.removeConstraint('categories', 'unique_index')
  }
};

