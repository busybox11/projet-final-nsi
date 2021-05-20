const express = require("express");
const WebSocket = require('ws');
const http = require('http');
const PORT = 3000;

const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

var playerInLobby = [];
var games = {}

wss.on('connection', (ws) => {
    ws.on('message', (message) => {
        message = JSON.parse(message)
        switch (message.title) {
            case "newPlayerInLobby":
                playerInLobby.push(ws)
                if (playerInLobby.length>=2) {
                    launchGame()
                }
                ws.send(JSON.stringify({
                    title: "playerInLobbyNb",
                    body: playerInLobby.length
                }))
                break;
        
            default:
                console.log(message)
                break;
        }
    });
    ws.on("close", ()=> {
        //eject from the lobby players array when he leave the lobby page
        playerInLobby.splice(playerInLobby.indexOf(ws), 1)
    });
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

app.get("/lobby", (req, res) => {
    res.sendFile(__dirname + '/views/lobby.html')
});

app.get("/duoGame", (req, res) => {
    gameCode = req.query
    if (games[gameCode]) {
        res.sendFile(__dirname + '/views/duoGame.html')
    }else{
        res.sendFile(__dirname + '/views/index.html')
    }
});

server.listen(PORT, () => {
    console.log(`Server is running on PORT: ${PORT}`);
});

function launchGame(){
    gameCode = generate_token(10)
    //choisis un premier joueur aleatoirement
    player1 = playerInLobby[Math.floor(Math.random() * playerInLobby.length)]
    playerInLobby.splice(playerInLobby.indexOf(player1), 1)
    player2 = playerInLobby[Math.floor(Math.random() * playerInLobby.length)]

    games[gameCode] = [player1, player2]

    player1.send(JSON.stringify({
        title: "gameUrl",
        body: `/duoGame?code=${gameCode}`
    }))
    player2.send(JSON.stringify({
        title: "gameUrl",
        body: `/duoGame?code=${gameCode}`
    }))
}

function generate_token(length){
    //edit the token allowed characters
    var a = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890".split("");
    var b = [];  
    for (var i=0; i<length; i++) {
        var j = (Math.random() * (a.length-1)).toFixed(0);
        b[i] = a[j];
    }
    return b.join("");
}