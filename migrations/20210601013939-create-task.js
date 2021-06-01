'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return queryInterface.createTable('Tasks', {
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
      task: {
        allowNull: false,
        type: Sequelize.JSON
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
    return queryInterface.dropTable('Tasks')
  }
};
