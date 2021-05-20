const express = require("express");
const WebSocket = require('ws');
const http = require('http')

const app = express();

const server = http.createServer(app);

const wss = new WebSocket.Server({ server });

wss.on('connection', (ws) => {

    //connection is up, let's add a simple simple event
    ws.on('message', (message) => {

        //log the received message and send it back to the client
        console.log('received: %s', message);
        wss.clients.forEach(client => client.send(message));
    });

    //send immediatly a feedback to the incoming connection    
    ws.send('Hi there, I am a WebSocket server');
});

app.use(express.static(__dirname + '/public/'));

app.get("/", (req, res) => {
    res.sendFile(__dirname + '/views/index.html')
});

app.get("/tetris", (req, res) => {
    res.sendFile(__dirname + '/views/tetris.html')
});

app.get("/training", (req, res) => {
    res.sendFile(__dirname + '/views/training.html')
});

const PORT = 3000;

server.listen(PORT, () => {
    console.log(`Server is running on PORT: ${PORT}`);
});