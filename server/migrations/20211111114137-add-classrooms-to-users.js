'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return queryInterface.addColumn('users', 'classrooms', {
      type: Sequelize.ARRAY(Sequelize.UUID),
      defaultValue: []
    });
  },

  down: async (queryInterface, Sequelize) => {
    return queryInterface.removeColumn('users', 'classrooms');
  }
};
