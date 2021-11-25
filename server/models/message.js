'use strict';
const {
  Model
} = require('sequelize');
const axios = require('axios');
const { sendEmail } = require('../utils/sendEmail');
const {
  CHANNEL_DELETE_MESSAGE_EVENT
} = require("../socketevents");

module.exports = (sequelize, DataTypes) => {
  class Message extends Model {
    static associate(models) {
      const { User, Channel, Reaction } = models;
      this.belongsTo(User, {
        as: 'sender',
        foreignKey: 'sender_id',
      })
      this.belongsTo(User, {
        as: 'receiver',
        foreignKey: 'receiver_id',
      })
      this.belongsTo(Channel, {
        as: 'channel',
        foreignKey: 'channel_id',
      })
      this.hasMany(Reaction, {
        as: 'reactions',
        foreignKey: 'message_id',
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE'
      })
    }
    async checkModeration() {
      let message = this;
      if (message.channel_id) {
        const { Channel, Classroom, User } = sequelize.models;
        let userFind = User.findOne({
          where: {
            id: message.sender_id
          },
          attributes: ['email', 'full_name', 'id'],
        })
        let channel = await Channel.findOne({
          where: {
            id: message.channel_id
          },
          attributes: ['id', 'name'],
          include: [
            {
              model: Classroom,
              as: 'classroom',
              attributes: ['id',
                'name',
                'is_moderation_enabled',
              ]
            }
          ]
        })
        let classroom = channel.classroom;
        if (classroom.is_moderation_enabled) {
          let endpoint = process.env.AZURE_CONTENT_MODERATOR_ENDPOINT
          endpoint += `moderate/v1.0/ProcessText/Screen?`
          endpoint += `&classify=true&language=eng`
          axios.post(endpoint, message.content, {
            headers: {
              "Ocp-Apim-Subscription-Key": process.env.AZURE_CONTENT_MODERATOR_API_KEY,
              'Content-Type': 'text/plain'
            },
          })
            .then(async (res) => {
              if (res.data?.Classification?.ReviewRecommended) {
                let user = await userFind;
                let to = user.email;
                let html = `<p>Hey, ${user.full_name}. Your message "${message.content}" in the ${channel.name} channel of ${classroom.name} classroom is removed as it contains words or phrases that have been identified as profanity.</p>`
                const email = {
                  to,
                  from: {
                    name: 'Engage Board',
                    email: process.env.SENDER_MAIL,
                  },
                  subject: 'Warning for Profanity',
                  text: `Hey, ${user.full_name}. Your message "${message.content}" in the ${channel.name} channel of ${classroom.name} classroom is removed as it contains words or phrases that have been identified as profanity.`,
                  html,
                }
                sendEmail(email)
                io.in(channel.id).emit(CHANNEL_DELETE_MESSAGE_EVENT, {
                  message_id: message.id,
                  profanity_delete: true,
                  sender_id: message.sender_id
                });
                return message.destroy()
              }
            })
            .catch((err) => { console.log(err) })
        }
      }
    }
  };
  Message.init({
    id: {
      allowNull: false,
      primaryKey: true,
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
    },
    sender_id: {
      type: DataTypes.STRING,
      references: {
        model: 'User',
        key: 'id'
      },
      allowNull: false,
    },
    receiver_id: {
      type: DataTypes.STRING,
      references: {
        model: 'User',
        key: 'id'
      },
      allowNull: true,
    },
    channel_id: {
      type: DataTypes.UUID,
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE',
      references: {
        model: 'Channel',
        key: 'id'
      },
      allowNull: true,
    },
    content: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    createdAt: {
      field: 'created_at',
      type: 'TIMESTAMP',
      defaultValue: sequelize.literal('CURRENT_TIMESTAMP'),
      allowNull: false,
    },
    updatedAt: {
      field: 'updated_at',
      type: 'TIMESTAMP',
      defaultValue: sequelize.literal('CURRENT_TIMESTAMP'),
      allowNull: false,
    }
  }, {
    hooks: {
      afterCreate: (message) => message.checkModeration(),
      afterUpdate: (message) => message.checkModeration()
    },
    sequelize,
    tableName: 'messages',
    modelName: 'Message',
  });
  return Message;
};