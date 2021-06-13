const express = require("express");
const app = express();
const cors = require('cors');
const morgan = require('morgan');

app.use(express.static('./client/dist/'))
app.use(morgan('tiny'));
app.use(cors());

const http = require('http').Server(app);
const io = require('socket.io')(http, {
  cors: {
    origin: "*"
  }
});
const port = process.env.PORT || 3000;

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/client/dist/index.html');
});

io.on('connection', (socket) => {
  
  socket.emit("chat message", {
    id: new Date(),
    sender: "FIEK-Server",
    msg: "Welcome to our server, type /command to show commands :D"
  })

  socket.on('chat message', msg => {
    io.emit('chat message', msg);
  });
});

http.listen(port, () => {
  console.log(`Socket.IO server running at http://localhost:${port}/`);
});