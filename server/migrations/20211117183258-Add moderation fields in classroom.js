
'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return queryInterface.addColumn('classrooms', 'is_moderation_enabled', {
      type: Sequelize.BOOLEAN,
      defaultValue: false
    })
  },

  down: async (queryInterface, Sequelize) => {
    return queryInterface.removeColumn('classrooms', 'is_moderation_enabled')
  }
};
