const { DataTypes } = require('sequelize');
const sequelize = require('../database/database');

const UserPlaces = sequelize.define('UserPlaces', {
  // Define model attributes
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'User',
      key: 'id'
    }
  },
  placeId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'Places',
      key: 'id'
    }
  },
});

module.exports = UserPlaces;