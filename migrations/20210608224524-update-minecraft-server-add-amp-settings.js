'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('MinecraftServers', 'ampServerEndpoint', {
      allowNull: true,
      type: Sequelize.STRING(128)
    });
    await queryInterface.addColumn('MinecraftServers', 'ampServerUsername', {
      allowNull: true,
      type: Sequelize.STRING(128)
    });
    return queryInterface.addColumn('MinecraftServers', 'ampServerPassword', {
      allowNull: true,
      type: Sequelize.STRING(128)
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('MinecraftServers', 'ampServerPassword');
    await queryInterface.removeColumn('MinecraftServers', 'ampServerUsername');
    return queryInterface.removeColumn('MinecraftServers', 'ampServerEndpoint');
  }
};
