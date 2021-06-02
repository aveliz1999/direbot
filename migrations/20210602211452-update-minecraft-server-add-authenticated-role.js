'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return queryInterface.addColumn('MinecraftServers', 'authenticatedRole', {
      allowNull: false,
      type: Sequelize.STRING(32)
    });
  },

  down: async (queryInterface, Sequelize) => {
    return queryInterface.removeColumn('MinecraftServers', 'authenticatedRole');
  }
};
