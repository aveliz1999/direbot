'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return queryInterface.createTable('MinecraftServers', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER.UNSIGNED
      },
      apikey: {
        allowNull: false,
        type: Sequelize.CHAR(16)
      },
      name: {
        allowNull: false,
        type: Sequelize.STRING(32)
      },
      statusChannel: {
        allowNull: false,
        type: Sequelize.STRING(32)
      },
      chatChannel: {
        allowNull: false,
        type: Sequelize.STRING(32)
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE(3)
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE(3)
      }
    })
  },

  down: async (queryInterface, Sequelize) => {
    return queryInterface.dropTable('MinecraftServers')
  }
};
