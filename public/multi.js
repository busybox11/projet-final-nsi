var ws = new WebSocket(`ws:${window.location.host}//`, "protocolOne");
var oppponentGrid = []
ws.onopen = function() {
    var url = new URL(window.location.href);
    var gameCode = url.searchParams.get("code");
    var userName = localStorage.getItem("userName")
    if (!userName) {
        userName = "anonymous"
    }
    ws.send(JSON.stringify({
        title: "connectToTheGame",
        body: {
            gameCode: gameCode,
            playerName: userName
        }
    }))
}
ws.onmessage = function(message) {
    message = JSON.parse(message.data)
    switch (message.title) {
        case "updatePlayers":
            document.getElementById("playersNb").innerHTML = `${message.body.nbInGame} / ${message.body.size}`
            break;

        case "beginMultiGame":
            document.getElementById("waiting").classList.add("hidden")
            document.getElementById("game").classList.remove("hidden")
            beginTetrisGame()
            break;

        case "errorLaunchingGame":
            alert(message.body)
            break;

        case "creatorLeftTheGame":
            alert("désolé le createur a quitté la partie vous allez être redirigé")
            window.location.replace("/")
            break;

        case "tetrisGrid":
            oppponentGrid = message.body.grid
            for (let y = 1; y < oppponentGrid.length; y++) {
                for (let x = 0; x < oppponentGrid[y].length; x++) {
                    var index = (y - 1) * (oppponentGrid[y].length) + x
                    document.getElementById("opponent-tetris-game").children[index].className = tetrominosColors[oppponentGrid[y][x]]
                }
            }
            break;

        default:
            break;
    }
}
ws.onclose = function() {
    window.location.replace("/")
}
var pastgrid = []
var pasthold = []
setInterval(function() {
    if (!isgameover && pastgrid != grid) {
        pastgrid = copy2Darr(grid)
            //show the grid
        for (let y = 1; y < grid.length; y++) {
            for (let x = 0; x < grid[y].length; x++) {
                var index = (y - 1) * (grid[y].length) + x
                document.getElementById("tetris-game").children[index].className = tetrominosColors[grid[y][x]]
            }
        }
        //show the falling lines
        for (let y = 1; y < fallingLineGrid.length; y++) {
            for (let x = 0; x < fallingLineGrid[y].length; x++) {
                var index = (y - 1) * (grid[y].length) + x
                if (fallingLineGrid[y][x] && !document.getElementById("tetris-game").children[index].className.includes("tetromino-block")) {
                    if (fallingLineGrid[y][x] == 2) {
                        document.getElementById("tetris-game").children[index].className = "h-8 w-8 bg-green-900"
                    } else {
                        document.getElementById("tetris-game").children[index].className = "h-8 w-8 bg-gray-900"
                    }
                }
            }
        }
        //show the next piece
        for (let y = 0; y < 4; y++) {
            for (let x = 0; x < 4; x++) {
                document.getElementById("tetris-nextPiece").children[y * 4 + x].className = "h-8 w-8"
            }
        }
        for (let y = 0; y < nextPiece.length; y++) {
            for (let x = 0; x < nextPiece[y].length; x++) {
                var index = y * 4 + x
                document.getElementById("tetris-nextPiece").children[index].className = tetrominosColors[nextPiece[y][x]]
            }
        }
        //show the hold piece
        if (pasthold != holdPiece) {
            pasthold = copy2Darr(holdPiece)
            for (let y = 0; y < 4; y++) {
                for (let x = 0; x < 4; x++) {
                    document.getElementById("tetris-hold").children[y * 4 + x].className = "h-8 w-8";
                }
            }
            for (let y = 0; y < holdPiece.length; y++) {
                for (let x = 0; x < holdPiece[y].length; x++) {
                    var index = y * 4 + x
                    if (!canHold && holdPiece[y][x]) {
                        document.getElementById("tetris-hold").children[index].className = "tetromino-block ring-gray-500 bg-gray-700"
                    } else {
                        document.getElementById("tetris-hold").children[index].className = tetrominosColors[holdPiece[y][x]]
                    }
                }
            }
        }
        // document.getElementById("level").innerHTML = currentLevel + 1;
        ws.send(JSON.stringify({
            title: "tetrisGrid",
            body: grid
        }));
    }
}, 10)

function gameover() {
    isgameover = true;
    ws.send(JSON.stringify({
        title: "gameOver",
        body: {
            score: score,
            time: timePast,
            level: currentLevel
        }
    }))
    alert("perdu")
}

function updateScore() {
    document.getElementById("score").innerHTML = score
}