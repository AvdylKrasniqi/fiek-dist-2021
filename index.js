const express = require("express");
const app = express();
const cors = require('cors');
const morgan = require('morgan');
const { ExpressPeerServer } = require("peer");
const fs = require("fs");

app.use(morgan('tiny'));
app.use(cors());

const https = require('https').createServer({
  key: fs.readFileSync('key.pem'),
  cert: fs.readFileSync('cert.pem')
}, app);
const io = require('socket.io')(https, {
  cors: {
    origin: "*"
  }
});
const port = process.env.PORT || 3000;


const peerServer = ExpressPeerServer(https, {
  debug: true,
});

app.use("/peerjs", peerServer);

app.use(express.static('./client/dist/'))


// app.get('/', (req, res) => {
//   res.sendFile(__dirname + '/client/dist/index.html');
// });


let commands = `/startvideo 
/stopvideo 
/changenickname`

io.on('connection', (socket) => {
  
  socket.emit("chat message", {
    id: new Date(),
    sender: "FIEK-Server",
    msg: "Welcome to our server, type /commands to show commands :D"
  });


  socket.on("join-room", (userId) => {
    socket.broadcast.emit("user-connected", userId);
  });
  

  socket.on('chat message', message => {
    if(message.msg == "/commands"){
      socket.emit('chat message', {
        id: new Date(),
        sender: "FIEK-Server", 
        msg: commands
      })
      return;
    }
    io.emit('chat message', message);
  });
});

https.listen(port, () => {
  console.log(`Socket.IO server running at https://localhost:${port}/`);
});
