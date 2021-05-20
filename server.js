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
        var title = message.title
        var body = message.body
        switch (title) {
            case "newPlayerInLobby":
                playerInLobby.push(ws)
                ws.send(JSON.stringify({
                    title: "playerInLobbyNb",
                    body: playerInLobby.length
                }))
                if (playerInLobby.length >= 2) {
                    launchGame()
                }
                break;
        
            case "connectToTheDuoGame":
                //si le code exist
                if (games[body.gameCode]) {
                    ws.playerName = body.playerName
                    ws.gameCode = body.gameCode
                    if (!games[body.gameCode][0]) {
                        games[body.gameCode][0] = ws
                    }else if(!games[body.gameCode][1]){
                        games[body.gameCode][1] = ws
                        games[body.gameCode][0].send(JSON.stringify({
                            title: "opponentName",
                            body: ws.playerName
                        }))
                        ws.send(JSON.stringify({
                            title: "opponentName",
                            body: games[body.gameCode][0].playerName
                        }))
                    }else{
                        console.log("partie pleine")
                        ws.close()
                    }
                }else{
                    ws.close()
                }
                break;

            default:
                console.log(message)
                break;
        }
    });
    ws.on("close", ()=> {
        //eject from the lobby players array when he leave the lobby page
        if(playerInLobby.indexOf(ws)>=0){
            playerInLobby.splice(playerInLobby.indexOf(ws), 1)
        }else if(ws.gameCode && games[gameCode]){
            games[gameCode].splice(games[gameCode].indexOf(ws), 1)
            games[gameCode][0].send(JSON.stringify({
                title: "opponentLeftGame"
            }))
            delete games[gameCode][0].gameCode
            delete games[gameCode]
        }
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
    gameCode = req.query.code
    if (games[gameCode]) {
        res.sendFile(__dirname + '/views/duoGame.html')
    }else{
        res.redirect("/lobby")
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

    games[gameCode] = [0, 0]

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