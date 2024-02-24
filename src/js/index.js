const express = require('express');
const http = require('http');
const socketIo = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

// Middleware to parse JSON bodies
app.use(express.json());

// RESTful API route for player login
app.post('/api/player/login', (req, res) => {
    const playerAddress = req.body.address;
    console.log('Player Ethereum Address:', playerAddress);
    
    // Logic to record the player address in your database or manage sessions

    res.json({ message: `Player logged in with address: ${playerAddress}` });
});

// Your existing Socket.IO setup and other routes
app.get('/', (req, res) => {
  res.send('Hello World!');
});

server.listen(3000, () => {
  console.log('Server listening on port 3000');
});
