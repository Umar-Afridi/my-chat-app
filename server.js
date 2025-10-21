const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);

const users = {};
const userIcons = [
    'https://api.multiavatar.com/user1.svg', 'https://api.multiavatar.com/user2.svg',
    'https://api.multiavatar.com/user3.svg', 'https://api.multiavatar.com/user4.svg',
    'https://api.multiavatar.com/user5.svg', 'https://api.multiavatar.com/user6.svg'
];

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});

io.on('connection', (socket) => {
  const randomId = Math.floor(Math.random() * 1000);
  users[socket.id] = {
    name: `Guest${randomId}`,
    icon: userIcons[Math.floor(Math.random() * userIcons.length)]
  };
  console.log(`${users[socket.id].name} connect ho gaya`);

  socket.on('disconnect', () => {
    if(users[socket.id]) {
      console.log(`${users[socket.id].name} disconnect ho gaya`);
      delete users[socket.id];
    }
  });

  socket.on('chat message', (msg) => {
    const messageData = {
      user: users[socket.id].name,
      icon: users[socket.id].icon,
      text: msg
    };
    io.emit('chat message', messageData);
  });
});

const PORT = process.env.PORT || 10000;
server.listen(PORT, () => {
  console.log(`Server port ${PORT} par chal raha hai`);
});
