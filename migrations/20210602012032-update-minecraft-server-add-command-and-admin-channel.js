'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('MinecraftServers', 'commandsChannel', {
      allowNull: false,
      type: Sequelize.STRING(32)
    });
    return queryInterface.addColumn('MinecraftServers', 'adminChannel', {
      allowNull: false,
      type: Sequelize.STRING(32)
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('MinecraftServers', 'adminChannel');
    return queryInterface.removeColumn('MinecraftServers', 'commandsChannel');
  }
};
