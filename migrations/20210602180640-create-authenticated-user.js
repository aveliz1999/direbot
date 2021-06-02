'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return queryInterface.createTable('AuthenticatedUsers', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER.UNSIGNED
      },
      serverId: {
        allowNull: false,
        type: Sequelize.INTEGER.UNSIGNED,
        references: {
          model: 'MinecraftServers',
          id: 'id'
        }
      },
      minecraftUuid: {
        allowNull: true,
        type: Sequelize.STRING(64)
      },
      minecraftUsername: {
        allowNull: true,
        type: Sequelize.STRING(32)
      },
      discordId: {
        allowNull: false,
        type: Sequelize.STRING(32)
      },
      confirmationCode: {
        allowNull: false,
        type: Sequelize.STRING(8)
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
    return queryInterface.dropTable('AuthenticatedUsers')
  }
};
