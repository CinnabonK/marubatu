const WebSocket = require('ws');
const server = new WebSocket.Server({ port: 8080, perMessageDeflate: false });

let clients = [];

server.on('connection', (socket) => {
  clients.push(socket);
  console.log('A new client connected');

  socket.on('message', (message) => {
    // すべてのクライアントにメッセージをブロードキャスト
    clients.forEach(client => {
      if (client !== socket && client.readyState === WebSocket.OPEN) {
        client.send(message);
      }
    });
  });

  socket.on('close', () => {
    clients = clients.filter(client => client !== socket);
  });
});

console.log('Server is listening on port 8080');
