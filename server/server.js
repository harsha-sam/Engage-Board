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
const NEW_CHAT_MESSAGE_EVENT = "NEW_CHAT_MESSAGE_EVENT";
const EDIT_MESSAGE_EVENT = "EDIT_MESSAGE_EVENT";
const DELETE_MESSAGE_EVENT = "DELETE_MESSAGE_EVENT";
const MESSAGE_NEW_REACTION_EVENT = "MESSAGE_NEW_REACTION_EVENT";
const MESSAGE_DELETE_REACTION_EVENT = "MESSAGE_DELETE_REACTION_EVENT";

main = async () => {
  try {
    const app = express();
    const server = http.createServer(app)

    const corsOptions = {
      exposedHeaders: ['access-token', 'refresh-token'],
    };

    app.use(cors(corsOptions));
    app.use(express.json({ limit: '10mb' }));
    app.use(morganMiddleware);

    app.use('/auth', require('./routes/auth'))
    app.use('/users', require('./routes/users'))
    app.use('/classrooms', require('./routes/classrooms'))
    app.use('/channels', require('./routes/channels'))
    app.use('/requests', require('./routes/requests'))
    app.use('/chat', require('./routes/chat'))
    app.use('/notes', require('./routes/notes'))

    // cors for socket
    const io = socketio(server, {
      cors: {
        origin: "*",
        methods: ["GET", "POST", "PATCH", "DELETE"],
        credentials: true
      }
    });

    global.io = io

    // runs everytime a client connects
    io.on('connection', socket => {
      console.log('new client connected', socket.id)

      const { channel_id, receiver_id, sender_id } = socket.handshake.query;
      let room = ''
      if (channel_id)
        socket.join(channel_id);
      else if (receiver_id && sender_id) {
        let compare = receiver_id.localeCompare(sender_id)
        let secret = process.env.DIRECT_MESSAGE_ROOM_SECRET
        if (compare === 1 || compare === 0) {
          room = sender_id + secret + receiver_id
        }
        else if (compare === -1) {
          room = receiver_id + secret + sender_id
        }
        console.log("room join", room)
        socket.join(room)
      }

      // when new message is received on a specific channel
      socket.on(CHANNEL_NEW_CHAT_MESSAGE_EVENT, async (data) => {
        let { sender, content } = data;
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

      // when a message is edited on a specific channel
      socket.on(CHANNEL_EDIT_MESSAGE_EVENT, async (data) => {
        let { message_id, new_content } = data;
        await editMessage(message_id, new_content);
        io.in(channel_id).emit(CHANNEL_EDIT_MESSAGE_EVENT, data);
      })

      // when a message is deleted on a specific channel
      socket.on(CHANNEL_DELETE_MESSAGE_EVENT, async (data) => {
        let { message_id } = data;
        await deleteMessage(message_id)
        io.in(channel_id).emit(CHANNEL_DELETE_MESSAGE_EVENT, data);
      })

      // when a message gets a new reaction on a specific channel
      socket.on(CHANNEL_MESSAGE_NEW_REACTION_EVENT, async (data) => {
        let { message_id, user, reaction } = data;
        await createReaction(message_id, user.id, reaction);
        io.in(channel_id).emit(CHANNEL_MESSAGE_NEW_REACTION_EVENT, data);
      })

      // when a reaction on a message of a specific channel is deleted
      socket.on(CHANNEL_MESSAGE_DELETE_REACTION_EVENT, async (data) => {
        let { message_id, user, reaction } = data;
        await deleteReaction(message_id, user.id, reaction);
        io.in(channel_id).emit(CHANNEL_MESSAGE_DELETE_REACTION_EVENT, data);
      })

      // when new direct message is received 
      socket.on(NEW_CHAT_MESSAGE_EVENT, async (data) => {
        let { sender, receiver, content } = data;
        let msg = await createMessage(sender.id, receiver.id, null, content)
        msg = {
          id: msg.id,
          sender,
          content,
          reactions: [],
          receiver_id,
          createdAt: msg.createdAt,
          updatedAt: msg.updatedAt
        }
        io.in(room).emit(NEW_CHAT_MESSAGE_EVENT, msg);
      })

      // when a direct message is edited
      socket.on(EDIT_MESSAGE_EVENT, async (data) => {
        let { message_id, new_content } = data;
        await editMessage(message_id, new_content);
        io.in(room).emit(EDIT_MESSAGE_EVENT, data);
      })

      // when a message is deleted on a specific channel
      socket.on(DELETE_MESSAGE_EVENT, async (data) => {
        let { message_id } = data;
        await deleteMessage(message_id)
        io.in(room).emit(DELETE_MESSAGE_EVENT, data);
      })

      // when a message gets a new reaction
      socket.on(MESSAGE_NEW_REACTION_EVENT, async (data) => {
        let { message_id, user, reaction } = data;
        await createReaction(message_id, user.id, reaction);
        io.in(room).emit(MESSAGE_NEW_REACTION_EVENT, data);
      })

      // when a reaction on a message is deleted
      socket.on(MESSAGE_DELETE_REACTION_EVENT, async (data) => {
        let { message_id, user, reaction } = data;
        await deleteReaction(message_id, user.id, reaction);
        io.in(room).emit(MESSAGE_DELETE_REACTION_EVENT, data);
      })

      socket.on('disconnect', () => {
        console.log('disconnected')
      })
    })

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
