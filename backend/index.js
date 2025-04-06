const express = require('express');
const cors = require('cors');
const { Pool } = require('pg');

const app = express();
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
    res.json({ message: 'Hello from Backend!' });
});

app.listen(PORT, () => {
    console.log(`Backend running on port ${PORT}`);
});
