require("dotenv").config();
const { sequelize } = require('./models');
const express = require('express');
const cors = require('cors');
const socketio = require('socket.io');
const morganMiddleware = require('./middleware/morgan')
const http = require('http')

main = async () => {
  try {
    const app = express();
    const server = http.createServer(app)

    const corsOptions = {
      exposedHeaders: ['access-token', 'refresh-token', 'expires-in'],
    };

    app.use(cors(corsOptions));
    app.use(express.json());
    app.use(morganMiddleware);

    app.use('/auth', require('./routes/auth'))
    app.use('/users', require('./routes/users'))
    app.use('/classrooms', require('./routes/classrooms'))
    app.use('/requests', require('./routes/requests'))

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
