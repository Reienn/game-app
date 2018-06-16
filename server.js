const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

const socketIoService = require('./services/socket-io')

const app = express();
const port = 3000;

// app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
require('./routes/routes')(app);

const server = app.listen(port, (err) => {
  if (err) return console.log(err);
  console.log(`Server is listening on port ${port}`);
});
socketIoService.socketIo(server);

mongoose.connect('mongodb://admin:Admin100@ds125388.mlab.com:25388/game-app');
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
    console.log('MongoDB connected');
});