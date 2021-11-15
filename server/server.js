require("dotenv").config();
const { sequelize } = require('./models');
const express = require('express');
const cors = require('cors');
const { createReaction, deleteReaction } = require('./utils/reactions');
const { createMessage, editMessage, deleteMessage } = require('./utils/messages');
const socketio = require('socket.io');
const morganMiddleware = require('./middleware/morgan')
const http = require('http')
const CHANNEL_NEW_CHAT_MESSAGE_EVENT = "CHANNEL_NEW_CHAT_MESSAGE_EVENT";
const CHANNEL_EDIT_MESSAGE_EVENT = "CHANNEL_EDIT_MESSAGE_EVENT";
const CHANNEL_DELETE_MESSAGE_EVENT = "CHANNEL_DELETE_MESSAGE_EVENT";
const CHANNEL_MESSAGE_NEW_REACTION_EVENT = "CHANNEL_MESSAGE_NEW_REACTION_EVENT";
const CHANNEL_MESSAGE_DELETE_REACTION_EVENT = "CHANNEL_MESSAGE_DELETE_REACTION_EVENT";

main = async () => {
  try {
    const app = express();
    const server = http.createServer(app)

    const corsOptions = {
      exposedHeaders: ['access-token', 'refresh-token'],
    };

    app.use(cors(corsOptions));
    app.use(express.json());
    app.use(morganMiddleware);

    app.use('/auth', require('./routes/auth'))
    app.use('/users', require('./routes/users'))
    app.use('/classrooms', require('./routes/classrooms'))
    app.use('/requests', require('./routes/requests'))
    app.use('/chat', require('./routes/chat'))

    const io = socketio(server, {
      cors: {
        origin: "http://localhost:3000",
        methods: ["GET", "POST", "PATCH", "DELETE"],
        credentials: true
      }
    });

    // runs everytime a client connects
    io.on('connection', socket => {
      console.log('new client connected', socket.id)

      const { channel_id } = socket.handshake.query;
      console.log(channel_id, 'c');
      socket.join(channel_id);

      socket.on(CHANNEL_NEW_CHAT_MESSAGE_EVENT, async (data) => {
        let { sender, content } = data;
        console.log(sender, content, channel_id)
        let msg = await createMessage(sender.id, null, channel_id, content)
        msg = {
          id: msg.id,
          sender,
          content,
          reactions: [],
          channel_id,
          createdAt: msg.createdAt,
          updatedAt: msg.updatedAt
        }
        io.in(channel_id).emit(CHANNEL_NEW_CHAT_MESSAGE_EVENT, msg);
      })

      socket.on(CHANNEL_EDIT_MESSAGE_EVENT, async (data) => {
        let { message_id, new_content } = data;
        await editMessage(message_id, new_content);
        io.in(channel_id).emit(CHANNEL_EDIT_MESSAGE_EVENT, data);
      })

      socket.on(CHANNEL_DELETE_MESSAGE_EVENT, async (data) => {
        let { message_id } = data;
        await deleteMessage(message_id)
        io.in(channel_id).emit(CHANNEL_DELETE_MESSAGE_EVENT, data);
      })

      socket.on(CHANNEL_MESSAGE_NEW_REACTION_EVENT, async (data) => {
        let { message_id, user, reaction } = data;
        await createReaction(message_id, user.id, reaction);
        io.in(channel_id).emit(CHANNEL_MESSAGE_NEW_REACTION_EVENT, data);
      })
      
      socket.on(CHANNEL_MESSAGE_DELETE_REACTION_EVENT, async (data) => {
        let { message_id, user, reaction } = data;
        await deleteReaction(message_id, user.id, reaction);
        io.in(channel_id).emit(CHANNEL_MESSAGE_DELETE_REACTION_EVENT, data);
      })

      socket.on('disconnect', () => {
        console.log('disconnected')
      })
    })

    // createMessage('18AG1A0503', null, 'e93728c9-43e3-46df-b4b2-89e723c948ad', 'ssup?')
    // createMessage('18AG1A0503', null, 'e93728c9-43e3-46df-b4b2-89e723c948ad', 'Yo bois?')
    // createMessage('18AG1A0549', null, 'e93728c9-43e3-46df-b4b2-89e723c948ad', 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Iure iusto provident molestias rem maxime nesciunt quia reiciendis. Maiores labore cum exercitationem quos excepturi earum sequi iure voluptatem necessitatibus. Reiciendis, obcaecati!')
    // createReaction('0995f1ad-61d3-45fe-9c7e-f8925874cfc0', '18AG1A0503', 'Frown')
    // createReaction('0995f1ad-61d3-45fe-9c7e-f8925874cfc0', '18AG1A0503', 'Frown')
    // createReaction('0995f1ad-61d3-45fe-9c7e-f8925874cfc0', '18AG1A0549', 'Like')
    // createReaction('0d768541-3d0c-4e5e-a306-104d91be8971', '18AG1A0554', 'Smile')
    await sequelize.authenticate();
    console.log('Connection has been established successfully.');

    server.listen(process.env.PORT || 4000, () => {
      console.log(`App is running on port ${process.env.PORT || 4000}`)
    })
  } catch (error) {
    console.error('Unable to connect to the database:', error);
  }
}
main();
