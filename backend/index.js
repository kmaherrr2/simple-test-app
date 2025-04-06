const express = require('express');
const cors = require('cors');
const { Pool } = require('pg');
const http = require('http');
const { Server } = require('ws');

const app = express();
const server = http.createServer(app);
const wss = new Server({ server, path: '/ws' });

const PORT = 5000;

app.use(cors());
app.use(express.json());

const pool = new Pool({
    user: 'testuser',
    password: 'testpass',
    host: 'db',
    port: 5432,
    database: 'testdb',
});

app.get('/api/message', async (req, res) => {
    res.json({ message: 'Hello from Backend!!!!' });
});

wss.on('connection', (ws) => {
    console.log('Client connected via WebSocket');
    ws.send('Welcome to WebSocket!');

    ws.on('message', (message) => {
        console.log(`Received: ${message}`);
    });

    ws.on('close', () => {
        console.log('Client disconnected');
    });
});

server.listen(PORT, () => {
    console.log(`Backend + WebSocket server running on port ${PORT}`);
});
