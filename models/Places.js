const { DataTypes } = require('sequelize');
const sequelize = require('../database/database');

const Places = sequelize.define('Places',{

    name: {
        type: DataTypes.STRING,
        allowNul: false
    },
    description: {
        type: DataTypes.TEXT,
        allowNull: false
    },
    howToReach: {
        type: DataTypes.TEXT,
        allowNull: false
    },
    phone: {
        type: DataTypes.STRING,
        allowNull: false
    }

});

module.exports = Places;