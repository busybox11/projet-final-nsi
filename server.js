const express = require("express");
const WebSocket = require('ws');
const http = require('http');
const PORT = 3000;

const app = express();
const bodyParser = require('body-parser')
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

var playersName = []
var games = {}
var modes = ["battle", "rumble"]

wss.on('connection', (ws) => {
    ws.on('message', (message) => {
        message = JSON.parse(message)
        var title = message.title
        var body = message.body
        switch (title) {
            case "connectToTheGame":
                //si le code exist
                if (games[body.gameCode]) {
                    var game = games[body.gameCode]
                    var playersNameGame = []
                    ws.playerName = body.playerName
                    ws.gameCode = body.gameCode
                    ws.status = "waiting"
                    for (let player of game.players) {
                        if (player.playerName == ws.playerName) {
                            ws.send(JSON.stringify({
                                title: "nameAlreadyUsed"
                            }))
                            ws.close();
                            break;
                        }
                        if (player != ws) playersNameGame.push(player.playerName)
                    }
                    console.log(game.players.length)
                    if (game.players.length < game.infos.size) {
                        game.players.push(ws)
                        for (let i = 0; i < game.players.length; i++) {
                            if (game.players[i] != ws) {
                                game.players[i].send(JSON.stringify({
                                    title: "updatePlayers",
                                    body: {
                                        size: game.infos.size,
                                        playersNb: game.players.length,
                                        playerName: ws.playerName
                                    }
                                }))
                            } else {
                                game.players[i].send(JSON.stringify({
                                    title: "joinGame",
                                    body: {
                                        size: game.infos.size,
                                        playersNb: game.players.length,
                                        playersNameGame: playersNameGame
                                    }
                                }))
                            }
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
                if (ws.gameCode && games[ws.gameCode]) {
                    if (games[ws.gameCode].players.length <= 1) return ws.send(JSON.stringify({ title: "errorLaunchingGame", body: "you are alone" }))
                    for (let client of games[ws.gameCode].players) {
                        client.status = "playing"
                        client.send(JSON.stringify({
                            title: "beginMultiGame",
                            body: {
                                playersNb: games[ws.gameCode].players.length
                            }
                        }))
                    }
                }
                break;

            case "tetrisGrid":
                if (ws.gameCode && games[ws.gameCode]) {
                    if (games[ws.gameCode].players.length > 3) break;
                    if (ws.status != "playing") break;
                    for (let i = 0; i < games[ws.gameCode].players.length; i++) {
                        if (!games[ws.gameCode].players[i]) {
                            //error in games list
                            ws.close()
                            break;
                        }
                        if (games[ws.gameCode].players[i] != ws) {
                            games[ws.gameCode].players[i].send(JSON.stringify({
                                title: title,
                                body: {
                                    playerName: ws.playerName,
                                    grid: body.grid,
                                    score: body.score
                                }
                            }))
                        }
                    }
                }
                break;

            case "makeALine":
                if (ws.gameCode && games[ws.gameCode]) {
                    if (ws.status != "playing") break;
                    for (let i = 0; i < games[ws.gameCode].players.length; i++) {
                        if (!games[ws.gameCode].players[i]) {
                            //error in games list
                            ws.close()
                            break;
                        }
                        if (games[ws.gameCode].players[i] != ws) {
                            games[ws.gameCode].players[i].send(JSON.stringify({
                                title: "tetrisGrid",
                                body: {
                                    playerName: ws.playerName,
                                    grid: body.grid,
                                    score: body.score
                                }
                            }))
                        }

                    }
                }
                break;

            case "gameOver":
                if (!ws.gameCode || !games[ws.gameCode]) break;
                ws.status = "spectator";
                var playersPlayingNb = 0;
                var winner
                for (let i = 0; i < games[ws.gameCode].players.length; i++) {
                    if (games[ws.gameCode].players[i].status == "playing") {
                        playersPlayingNb++
                        winner = games[ws.gameCode].players[i].playerName
                    }
                }
                if (playersPlayingNb <= 1) { //si il reste un seul joueur en partie
                    for (let i = 0; i < games[ws.gameCode].players.length; i++) {
                        if (!games[ws.gameCode].players[i]) {
                            //error in games list
                            ws.close()
                            break;
                        }
                        games[ws.gameCode].players[i].send(JSON.stringify({
                            title: "winner",
                            body: {
                                playerName: winner,
                                playersNb: games[ws.gameCode].players.length,
                                size: games[ws.gameCode].infos.size
                            }
                        }))
                        ws.status = "waiting"
                    }
                    break;
                }
                for (let i = 0; i < games[ws.gameCode].players.length; i++) {
                    if (!games[ws.gameCode].players[i]) {
                        //error in games list
                        ws.close()
                        break;
                    }
                    if (games[ws.gameCode].players[i] != ws) {
                        console.log(playersPlayingNb)
                        games[ws.gameCode].players[i].send(JSON.stringify({
                            title: "playerLeave",
                            body: {
                                playerName: ws.playerName,
                                playersNb: playersPlayingNb,
                                size: games[ws.gameCode].infos.size
                            }
                        }))
                    }
                }
                break;

            case "malus":

                break;

            default:
                //renvoie le message aux autres joueurs
                if (ws.gameCode && games[ws.gameCode]) {
                    if (games[gameCode].infos) {
                        for (let i = 0; i < games[ws.gameCode].players.length; i++) {
                            if (!games[ws.gameCode].players[i]) {
                                //error in games list
                                ws.close()
                                break;
                            }
                            if (games[ws.gameCode].players[i] != ws) {
                                games[ws.gameCode].players[i].send(JSON.stringify({
                                    title: title,
                                    body: body
                                }))
                            }
                        }
                    }
                }
                break;
        }
    });
    ws.on("close", () => {
        if (ws.gameCode && games[ws.gameCode]) {
            var gameCode = ws.gameCode
                //retire le ws de la partie
            if (games[gameCode].infos) { //si c'est une partie multi
                if (games[gameCode].players.indexOf(ws) == 0) { //si le createur abandonne la partie
                    games[gameCode].players.splice(games[gameCode].players.indexOf(ws), 1)
                    for (let client of games[gameCode].players) {
                        client.send(JSON.stringify({
                            title: "creatorLeftTheGame"
                        }))
                    }
                    delete games[gameCode]
                } else {
                    games[gameCode].players.splice(games[gameCode].players.indexOf(ws), 1)
                    for (let client of games[gameCode].players) {
                        client.send(JSON.stringify({
                            title: "playerLeave",
                            body: {
                                size: games[gameCode].infos.size,
                                playersNb: games[gameCode].players.length,
                                playerName: ws.playerName
                            }
                        }))
                    }
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

app.get("/training", (req, res) => {
    res.sendFile(__dirname + '/views/training.html')
});

app.get("/games", (req, res) => {
    res.sendFile(__dirname + '/views/gamesList.html')
});
//return to the client all the games available
app.get("/gamesList", (req, res) => {
    var resGames = []
    for (let gameCode of Object.keys(games)) {
        if (games[gameCode].players.length < games[gameCode].infos.size && !games[gameCode].infos.private) {
            resGames.push({ code: gameCode, infos: games[gameCode].infos, playersNb: games[gameCode].players.length })
        }
    }
    res.json(resGames)
});

app.post("/changePlayerName", (req, res) => {
    var newName = req.body.newName
    var oldName = req.body.oldName
        //si ce nom existe deja return
    if (newName.trim().length < 3 || newName.trim().length > 20) return res.redirect("/")
    if (playersName.includes(newName)) return res.redirect("/")
    else { //si il avait un ancien nom on le supprime de la liste et on ajoute ensuite le nouveau
        playersName.splice(playersName.indexOf(oldName), 1)
        playersName.push(newName)
        return res.redirect("/")
    }
})

app.get("/getPlayersName", (req, res) => {
    res.json(playersName)
})

app.get("/getAnonymousPlayerName", (req, res) => {
    var newName = `Player${generate_token(10)}`
    var itt = 0;
    var tokenLenght = 10
    while (playersName.includes(newName)) {
        if (itt > 10) {
            tokenLenght++
            itt = 0
        }
        newName = `Player${generate_token(tokenLenght)}`
        itt++
    }
    playersName.push(newName)
    res.json(newName)
})

app.get("/multi", (req, res) => {
    var gameCode = req.query.code
    if (games[gameCode] && modes.includes(games[gameCode].infos.mode)) {
        if (games[gameCode].players.length <= 0) {
            return res.sendFile(__dirname + `/views/multiCreator${games[gameCode].infos.mode}.html`)
        } else {
            return res.sendFile(__dirname + `/views/multi${games[gameCode].infos.mode}.html`)
        }
    } else {
        return res.redirect("/")
    }
});

app.get("/multiph", (req, res) => {
    return res.sendFile(__dirname + `/views/multiph.html`)
});

app.post("/createGame", (req, res) => {
    var gameName = req.body.gameName
    var gameSize = req.body.gameSize
    var gameMode = req.body.gameMode
    var private = req.body.private != undefined
        //si ce nom existe deja return
    if (games[gameName]) return res.redirect('/games')
    if (gameName.length > 20) return res.redirect('/games')
    if (gameName.match(/^[^a-zA-Z0-9]+$/) ? true : false) return res.redirect('/games')
    gameCode = launchGame(gameName, gameSize, gameMode, private)
    return res.redirect(`/multi?code=${gameCode}`)
})

server.listen(PORT, () => {
    console.log(`Server is running on PORT: ${PORT}`);
});

function launchGame(gameCode, gameSize, gameMode, private) {
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
            mode: gameMode,
            private: private,
            status: "waiting"
        },
        players: []
    }
    return gameCode
}

//génère un code unique
function generate_token(length) {
    var a = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890".split("");
    var b = [];
    for (var i = 0; i < length; i++) {
        var j = (Math.random() * (a.length - 1)).toFixed(0);
        b[i] = a[j];
    }
    return b.join("");
}