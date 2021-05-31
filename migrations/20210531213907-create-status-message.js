'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return queryInterface.createTable('StatusMessages', {
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
      apikey: {
        allowNull: false,
        type: Sequelize.CHAR(16)
      },
      minecraftUsername: {
        allowNull: false,
        type: Sequelize.STRING(32)
      },
      minecraftUuid: {
        allowNull: false,
        type: Sequelize.STRING(64)
      },
      channelId: {
        allowNull: false,
        type: Sequelize.STRING(32)
      },
      messageId: {
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
    return queryInterface.dropTable('StatusMessages')
  }
};
