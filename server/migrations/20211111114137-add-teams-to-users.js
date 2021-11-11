'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return queryInterface.addColumn('users', 'teams', {
      type: Sequelize.ARRAY(Sequelize.UUID),
      defaultValue: []
    });
  },

  down: async (queryInterface, Sequelize) => {
    return queryInterface.removeColumn('users', 'teams');
  }
};
