'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return queryInterface.addColumn('channels', 'message_permission', {
      type: Sequelize.ARRAY(Sequelize.STRING),
      defaultValue: ['admin', 'monitor', 'student'],
      allowNull: false
    })
  },

  down: async (queryInterface, Sequelize) => {
    return queryInterface.removeColumn('classrooms', 'message_permission')
  }
};
