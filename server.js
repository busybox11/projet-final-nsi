const express = require("express");
const WebSocket = require('ws');
const http = require('http');
const PORT = 3000;

const app = express();
const bodyParser = require('body-parser')
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
                }));
                if (playerInLobby.length >= 2) {
                    launchDuoGame()
                }
                break;

            case "connectToTheDuoGame":
                //si le code exist
                if (games[body.gameCode]) {
                    ws.playerName = body.playerName
                    ws.gameCode = body.gameCode
                    if (!games[body.gameCode][0]) {
                        games[body.gameCode][0] = ws
                    } else if (!games[body.gameCode][1]) {
                        games[body.gameCode][1] = ws
                        games[body.gameCode][0].send(JSON.stringify({
                            title: "beginGame",
                            body: ws.playerName
                        }))
                        ws.send(JSON.stringify({
                            title: "beginGame",
                            body: games[body.gameCode][0].playerName
                        }))
                    } else {
                        //partie pleine
                        ws.close()
                    }
                } else {
                    ws.close()
                }
                break;

            case "connectToTheGame":
                //si le code exist
                if (games[body.gameCode]) {
                    var game = games[body.gameCode]
                    ws.playerName = body.playerName
                    ws.gameCode = body.gameCode
                    if (game.players.length < game.infos.size) {
                        game.players.push(ws)
                        for (let i = 0; i < game.players.length; i++) {
                            game.players[i].send(JSON.stringify({
                                title: "updatePlayers",
                                body: {
                                    size: game.infos.size,
                                    nbInGame: game.players.length
                                }
                            }))
                        }
                    } else {
                        //partie pleine
                        ws.close()
                    }
                } else {
                    ws.close()
                }
                break;

            case "launchMultiGame":
                if(ws.gameCode && games[ws.gameCode]){
                    if (games[gameCode].players.length <= 1 )return ws.send(JSON.stringify({title: "errorLaunchingGame", body: "you are alone"}))
                    for (let client of games[gameCode].players) {
                        client.send(JSON.stringify({
                            title: "beginMultiGame"
                        }))
                    }
                }
                break;

            default:
                //renvoie le message aux autres joueurs
                if (ws.gameCode && games[ws.gameCode]) {
                    for (let i = 0; i < games[ws.gameCode].length; i++) {
                        if (!games[ws.gameCode][i]) {
                            //error in games list
                            ws.close()
                            break;
                        }
                        if (games[ws.gameCode][i] != ws) {
                            games[ws.gameCode][i].send(JSON.stringify({
                                title: title,
                                body: body
                            }))
                        }
                    }
                }
                break;
        }
    });
    ws.on("close", () => {
        //eject from the lobby players array when he leave the lobby page
        if (playerInLobby.indexOf(ws) >= 0) {
            playerInLobby.splice(playerInLobby.indexOf(ws), 1)
        } else if (ws.gameCode && games[ws.gameCode]) {
            var gameCode = ws.gameCode
                //retire le ws de la partie
            if (games[gameCode].infos) {//si c'est une partie multi
                if (games[gameCode].players.indexOf(ws) == 0) {//si le createur abandonne la partie
                    games[gameCode].players.splice(games[gameCode].players.indexOf(ws), 1)
                    for (let client of games[gameCode].players) {
                        client.send(JSON.stringify({
                            title: "creatorLeftTheGame"
                        }))
                    }
                    delete games[gameCode]
                }else{
                    games[gameCode].players.splice(games[gameCode].players.indexOf(ws), 1)
                    for (let client of games[gameCode].players) {
                        client.send(JSON.stringify({
                            title: "updatePlayers",
                            body: {
                                size: games[gameCode].infos.size,
                                nbInGame: games[gameCode].players.length
                            }
                        }))
                    }
                }
            } else {//si c'est un partie duo
                games[gameCode].splice(games[gameCode].indexOf(ws), 1)
                for (let client of games[gameCode]) {
                    client.send(JSON.stringify({
                        title: "opponentLeftGame"
                    }))
                }
                if (games[ws.gameCode].length <= 1) {
                    delete games[gameCode][0].gameCode
                    delete games[gameCode]
                }
            }
        }
    });
});

app.use(express.static(__dirname + '/public/'));
app.use(bodyParser.urlencoded({ extended: false }));

app.get("/", (req, res) => {
    res.sendFile(__dirname + '/views/index.html')
});

app.get("/params", (req, res) => {
    res.sendFile(__dirname + '/views/params.html')
});

app.get("/training", (req, res) => {
    res.sendFile(__dirname + '/views/training.html')
});

app.get("/lobby", (req, res) => {
    res.sendFile(__dirname + '/views/lobby.html')
});

app.get("/games", (req, res) => {
    res.sendFile(__dirname + '/views/gamesList.html')
});

app.get("/gamesList", (req, res) => {
    res.json(games)
});

app.get("/duoGame", (req, res) => {
    var gameCode = req.query.code
    if (games[gameCode]) {
        res.sendFile(__dirname + '/views/duoGame.html')
    } else {
        res.redirect("/lobby")
    }
});

app.get("/multi", (req, res) => {
    var gameCode = req.query.code
    if (games[gameCode]) {
        if (games[gameCode].players.length <= 0) {
            return res.sendFile(__dirname + '/views/multiCreator.html')
        } else {
            return res.sendFile(__dirname + '/views/multi.html')
        }
    } else {
        return res.redirect("/")
    }
});

app.post("/createGame", (req, res) => {
    var gameName = req.body.gameName
    var gameSize = req.body.gameSize
        //si ce nom existe deja return
    if (games[gameName]) return res.redirect('/')
    gameCode = launchGame(gameName, gameSize)
    return res.redirect(`/multi?code=${gameCode}`)
})

server.listen(PORT, () => {
    console.log(`Server is running on PORT: ${PORT}`);
});

function launchDuoGame() {
    var gameCode = generate_token(10)
    var itt = 0;
    var tokenLenght = 10
    while (games[gameCode]) {
        if (itt > 10) {
            tokenLenght++
            itt = 0
        }
        gameCode = generate_token(tokenLenght)
        itt++
    }
    //choisis un premier joueur aleatoirement
    var player1 = playerInLobby[Math.floor(Math.random() * playerInLobby.length)]
    playerInLobby.splice(playerInLobby.indexOf(player1), 1)
    var player2 = playerInLobby[Math.floor(Math.random() * playerInLobby.length)]

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

function launchGame(gameCode, gameSize) {
    //génère un token inexistant si la partie n'a pas de nom
    if (!gameCode) {
        gameCode = generate_token(10)
        var itt = 0;
        var tokenLenght = 10
        while (games[gameCode]) {
            if (itt > 10) {
                tokenLenght++
                itt = 0
            }
            gameCode = generate_token(tokenLenght)
            itt++
        }
    }
    //verifie que la taille de la partie ne soit pas trop grande
    if (gameSize > 100) gameSize = 100
    games[gameCode] = {
        infos: {
            size: gameSize,
            mode: "battle"
        },
        players: []
    }
    return gameCode
}

function generate_token(length) {
    //edit the token allowed characters
    var a = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890".split("");
    var b = [];
    for (var i = 0; i < length; i++) {
        var j = (Math.random() * (a.length - 1)).toFixed(0);
        b[i] = a[j];
    }
    return b.join("");
}