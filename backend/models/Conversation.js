const { Sequelize, DataTypes } = require('sequelize');
const sequelize = require('../database');

const Message = sequelize.define('Message', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  senderId: {
    type: DataTypes.INTEGER,
    references: {
      model: 'Users',
      key: 'id',
    },
  },
  text: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  timestamp: {
    type: DataTypes.DATE,
    allowNull: false,
  },
});

const Conversation = sequelize.define('Conversation', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
});

Conversation.belongsToMany(User, { through: 'ConversationUser' });
User.belongsToMany(Conversation, { through: 'ConversationUser' });

Conversation.hasMany(Message);
Message.belongsTo(Conversation);

module.exports = { User, Conversation, Message };
