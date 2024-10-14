const WebSocket = require('ws');
const http = require('http');
const fs = require('fs');
const path = require('path');

// HTTPサーバーを作成
const server = http.createServer((req, res) => {
    const filePath = path.join(__dirname, 'index.html');
    fs.readFile(filePath, (err, data) => {
        if (err) {
            res.writeHead(500);
            res.end('Error loading index.html');
        } else {
            res.writeHead(200, { 'Content-Type': 'text/html' });
            res.end(data);
        }
    });
});

// WebSocketサーバーを作成
const wss = new WebSocket.Server({ server });

// クライアント接続時の処理
wss.on('connection', (ws) => {
    console.log('A new client connected');

    ws.on('message', (message) => {
        console.log(`Received: ${message}`);
        // 全クライアントにメッセージを送信
        wss.clients.forEach(client => {
            if (client !== ws && client.readyState === WebSocket.OPEN) {
                client.send(message);
            }
        });
    });
});

// サーバーを起動
server.listen(8080, () => {
    console.log('Server is listening on port 8080');
});
