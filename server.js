const WebSocket = require('ws');
const server = new WebSocket.Server({
  port: 8080,
  perMessageDeflate: false  // 圧縮を無効にする
});

let clients = [];

server.on('connection', (socket) => {
  clients.push(socket);
  console.log('A new client connected');

  socket.on('message', (message) => {
    clients.forEach(client => {
      if (client !== socket && client.readyState === WebSocket.OPEN) {
        client.send(message);
      }
    });
  });

  socket.on('close', () => {
    clients = clients.filter(client => client !== socket);
  });

  socket.on('error', (err) => {
    console.error('WebSocket error:', err);
  });
});

console.log('Server is listening on port 8080');
