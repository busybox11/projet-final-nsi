var ws = new WebSocket(`ws:${window.location.host}//`, "protocolOne");
var oppponentGrid = []
var playersNb = 0
var userName
ws.onopen = function() {
    var url = new URL(window.location.href);
    var gameCode = url.searchParams.get("code");
    userName = localStorage.getItem("userName")
    if (!userName) {
        loadUserName()
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
        case "nameAlreadyUsed":
            localStorage.removeItem("userName")
            window.location.replace("/")
            break;

        case "updatePlayers":
            document.getElementById("playersNb").innerHTML = `${message.body.playersNb} / ${message.body.size}`
            document.getElementById("opponentsGame").innerHTML += `
            <div id="${message.body.playerName}-tetris-game" class="grid grid-cols-10 w-24 h-44 border-4 border-gray-700 mx-8 my-4">
                <div class="h-2 w-2"></div><div class="h-2 w-2"></div><div class="h-2 w-2"></div><div class="h-2 w-2"></div><div class="h-2 w-2"></div><div class="h-2 w-2"></div><div class="h-2 w-2"></div><div class="h-2 w-2"></div><div class="h-2 w-2"></div><div class="h-2 w-2"></div>
                <div class="h-2 w-2"></div><div class="h-2 w-2"></div><div class="h-2 w-2"></div><div class="h-2 w-2"></div><div class="h-2 w-2"></div><div class="h-2 w-2"></div><div class="h-2 w-2"></div><div class="h-2 w-2"></div><div class="h-2 w-2"></div><div class="h-2 w-2"></div>
                <div class="h-2 w-2"></div><div class="h-2 w-2"></div><div class="h-2 w-2"></div><div class="h-2 w-2"></div><div class="h-2 w-2"></div><div class="h-2 w-2"></div><div class="h-2 w-2"></div><div class="h-2 w-2"></div><div class="h-2 w-2"></div><div class="h-2 w-2"></div>
                <div class="h-2 w-2"></div><div class="h-2 w-2"></div><div class="h-2 w-2"></div><div class="h-2 w-2"></div><div class="h-2 w-2"></div><div class="h-2 w-2"></div><div class="h-2 w-2"></div><div class="h-2 w-2"></div><div class="h-2 w-2"></div><div class="h-2 w-2"></div>
                <div class="h-2 w-2"></div><div class="h-2 w-2"></div><div class="h-2 w-2"></div><div class="h-2 w-2"></div><div class="h-2 w-2"></div><div class="h-2 w-2"></div><div class="h-2 w-2"></div><div class="h-2 w-2"></div><div class="h-2 w-2"></div><div class="h-2 w-2"></div>
                <div class="h-2 w-2"></div><div class="h-2 w-2"></div><div class="h-2 w-2"></div><div class="h-2 w-2"></div><div class="h-2 w-2"></div><div class="h-2 w-2"></div><div class="h-2 w-2"></div><div class="h-2 w-2"></div><div class="h-2 w-2"></div><div class="h-2 w-2"></div>
                <div class="h-2 w-2"></div><div class="h-2 w-2"></div><div class="h-2 w-2"></div><div class="h-2 w-2"></div><div class="h-2 w-2"></div><div class="h-2 w-2"></div><div class="h-2 w-2"></div><div class="h-2 w-2"></div><div class="h-2 w-2"></div><div class="h-2 w-2"></div>
                <div class="h-2 w-2"></div><div class="h-2 w-2"></div><div class="h-2 w-2"></div><div class="h-2 w-2"></div><div class="h-2 w-2"></div><div class="h-2 w-2"></div><div class="h-2 w-2"></div><div class="h-2 w-2"></div><div class="h-2 w-2"></div><div class="h-2 w-2"></div>
                <div class="h-2 w-2"></div><div class="h-2 w-2"></div><div class="h-2 w-2"></div><div class="h-2 w-2"></div><div class="h-2 w-2"></div><div class="h-2 w-2"></div><div class="h-2 w-2"></div><div class="h-2 w-2"></div><div class="h-2 w-2"></div><div class="h-2 w-2"></div>
                <div class="h-2 w-2"></div><div class="h-2 w-2"></div><div class="h-2 w-2"></div><div class="h-2 w-2"></div><div class="h-2 w-2"></div><div class="h-2 w-2"></div><div class="h-2 w-2"></div><div class="h-2 w-2"></div><div class="h-2 w-2"></div><div class="h-2 w-2"></div>
                <div class="h-2 w-2"></div><div class="h-2 w-2"></div><div class="h-2 w-2"></div><div class="h-2 w-2"></div><div class="h-2 w-2"></div><div class="h-2 w-2"></div><div class="h-2 w-2"></div><div class="h-2 w-2"></div><div class="h-2 w-2"></div><div class="h-2 w-2"></div>
                <div class="h-2 w-2"></div><div class="h-2 w-2"></div><div class="h-2 w-2"></div><div class="h-2 w-2"></div><div class="h-2 w-2"></div><div class="h-2 w-2"></div><div class="h-2 w-2"></div><div class="h-2 w-2"></div><div class="h-2 w-2"></div><div class="h-2 w-2"></div>
                <div class="h-2 w-2"></div><div class="h-2 w-2"></div><div class="h-2 w-2"></div><div class="h-2 w-2"></div><div class="h-2 w-2"></div><div class="h-2 w-2"></div><div class="h-2 w-2"></div><div class="h-2 w-2"></div><div class="h-2 w-2"></div><div class="h-2 w-2"></div>
                <div class="h-2 w-2"></div><div class="h-2 w-2"></div><div class="h-2 w-2"></div><div class="h-2 w-2"></div><div class="h-2 w-2"></div><div class="h-2 w-2"></div><div class="h-2 w-2"></div><div class="h-2 w-2"></div><div class="h-2 w-2"></div><div class="h-2 w-2"></div>
                <div class="h-2 w-2"></div><div class="h-2 w-2"></div><div class="h-2 w-2"></div><div class="h-2 w-2"></div><div class="h-2 w-2"></div><div class="h-2 w-2"></div><div class="h-2 w-2"></div><div class="h-2 w-2"></div><div class="h-2 w-2"></div><div class="h-2 w-2"></div>
                <div class="h-2 w-2"></div><div class="h-2 w-2"></div><div class="h-2 w-2"></div><div class="h-2 w-2"></div><div class="h-2 w-2"></div><div class="h-2 w-2"></div><div class="h-2 w-2"></div><div class="h-2 w-2"></div><div class="h-2 w-2"></div><div class="h-2 w-2"></div>
                <div class="h-2 w-2"></div><div class="h-2 w-2"></div><div class="h-2 w-2"></div><div class="h-2 w-2"></div><div class="h-2 w-2"></div><div class="h-2 w-2"></div><div class="h-2 w-2"></div><div class="h-2 w-2"></div><div class="h-2 w-2"></div><div class="h-2 w-2"></div>
                <div class="h-2 w-2"></div><div class="h-2 w-2"></div><div class="h-2 w-2"></div><div class="h-2 w-2"></div><div class="h-2 w-2"></div><div class="h-2 w-2"></div><div class="h-2 w-2"></div><div class="h-2 w-2"></div><div class="h-2 w-2"></div><div class="h-2 w-2"></div>
                <div class="h-2 w-2"></div><div class="h-2 w-2"></div><div class="h-2 w-2"></div><div class="h-2 w-2"></div><div class="h-2 w-2"></div><div class="h-2 w-2"></div><div class="h-2 w-2"></div><div class="h-2 w-2"></div><div class="h-2 w-2"></div><div class="h-2 w-2"></div>
                <div class="h-2 w-2"></div><div class="h-2 w-2"></div><div class="h-2 w-2"></div><div class="h-2 w-2"></div><div class="h-2 w-2"></div><div class="h-2 w-2"></div><div class="h-2 w-2"></div><div class="h-2 w-2"></div><div class="h-2 w-2"></div><div class="tetromino-little-block ring-red-700 bg-red-900"></div>
            </div>`
            break;

        case "joinGame":
            document.getElementById("playersNb").innerHTML = `${message.body.playersNb} / ${message.body.size}`
            for (let name of message.body.playersNameGame) {
                document.getElementById("opponentsGame").innerHTML += `
                <div id="${message.body.playerName}-tetris-game" class="grid grid-cols-10 w-24 h-44 border-4 border-gray-700 mx-8 my-4">
                    <div class="h-2 w-2"></div><div class="h-2 w-2"></div><div class="h-2 w-2"></div><div class="h-2 w-2"></div><div class="h-2 w-2"></div><div class="h-2 w-2"></div><div class="h-2 w-2"></div><div class="h-2 w-2"></div><div class="h-2 w-2"></div><div class="h-2 w-2"></div>
                    <div class="h-2 w-2"></div><div class="h-2 w-2"></div><div class="h-2 w-2"></div><div class="h-2 w-2"></div><div class="h-2 w-2"></div><div class="h-2 w-2"></div><div class="h-2 w-2"></div><div class="h-2 w-2"></div><div class="h-2 w-2"></div><div class="h-2 w-2"></div>
                    <div class="h-2 w-2"></div><div class="h-2 w-2"></div><div class="h-2 w-2"></div><div class="h-2 w-2"></div><div class="h-2 w-2"></div><div class="h-2 w-2"></div><div class="h-2 w-2"></div><div class="h-2 w-2"></div><div class="h-2 w-2"></div><div class="h-2 w-2"></div>
                    <div class="h-2 w-2"></div><div class="h-2 w-2"></div><div class="h-2 w-2"></div><div class="h-2 w-2"></div><div class="h-2 w-2"></div><div class="h-2 w-2"></div><div class="h-2 w-2"></div><div class="h-2 w-2"></div><div class="h-2 w-2"></div><div class="h-2 w-2"></div>
                    <div class="h-2 w-2"></div><div class="h-2 w-2"></div><div class="h-2 w-2"></div><div class="h-2 w-2"></div><div class="h-2 w-2"></div><div class="h-2 w-2"></div><div class="h-2 w-2"></div><div class="h-2 w-2"></div><div class="h-2 w-2"></div><div class="h-2 w-2"></div>
                    <div class="h-2 w-2"></div><div class="h-2 w-2"></div><div class="h-2 w-2"></div><div class="h-2 w-2"></div><div class="h-2 w-2"></div><div class="h-2 w-2"></div><div class="h-2 w-2"></div><div class="h-2 w-2"></div><div class="h-2 w-2"></div><div class="h-2 w-2"></div>
                    <div class="h-2 w-2"></div><div class="h-2 w-2"></div><div class="h-2 w-2"></div><div class="h-2 w-2"></div><div class="h-2 w-2"></div><div class="h-2 w-2"></div><div class="h-2 w-2"></div><div class="h-2 w-2"></div><div class="h-2 w-2"></div><div class="h-2 w-2"></div>
                    <div class="h-2 w-2"></div><div class="h-2 w-2"></div><div class="h-2 w-2"></div><div class="h-2 w-2"></div><div class="h-2 w-2"></div><div class="h-2 w-2"></div><div class="h-2 w-2"></div><div class="h-2 w-2"></div><div class="h-2 w-2"></div><div class="h-2 w-2"></div>
                    <div class="h-2 w-2"></div><div class="h-2 w-2"></div><div class="h-2 w-2"></div><div class="h-2 w-2"></div><div class="h-2 w-2"></div><div class="h-2 w-2"></div><div class="h-2 w-2"></div><div class="h-2 w-2"></div><div class="h-2 w-2"></div><div class="h-2 w-2"></div>
                    <div class="h-2 w-2"></div><div class="h-2 w-2"></div><div class="h-2 w-2"></div><div class="h-2 w-2"></div><div class="h-2 w-2"></div><div class="h-2 w-2"></div><div class="h-2 w-2"></div><div class="h-2 w-2"></div><div class="h-2 w-2"></div><div class="h-2 w-2"></div>
                    <div class="h-2 w-2"></div><div class="h-2 w-2"></div><div class="h-2 w-2"></div><div class="h-2 w-2"></div><div class="h-2 w-2"></div><div class="h-2 w-2"></div><div class="h-2 w-2"></div><div class="h-2 w-2"></div><div class="h-2 w-2"></div><div class="h-2 w-2"></div>
                    <div class="h-2 w-2"></div><div class="h-2 w-2"></div><div class="h-2 w-2"></div><div class="h-2 w-2"></div><div class="h-2 w-2"></div><div class="h-2 w-2"></div><div class="h-2 w-2"></div><div class="h-2 w-2"></div><div class="h-2 w-2"></div><div class="h-2 w-2"></div>
                    <div class="h-2 w-2"></div><div class="h-2 w-2"></div><div class="h-2 w-2"></div><div class="h-2 w-2"></div><div class="h-2 w-2"></div><div class="h-2 w-2"></div><div class="h-2 w-2"></div><div class="h-2 w-2"></div><div class="h-2 w-2"></div><div class="h-2 w-2"></div>
                    <div class="h-2 w-2"></div><div class="h-2 w-2"></div><div class="h-2 w-2"></div><div class="h-2 w-2"></div><div class="h-2 w-2"></div><div class="h-2 w-2"></div><div class="h-2 w-2"></div><div class="h-2 w-2"></div><div class="h-2 w-2"></div><div class="h-2 w-2"></div>
                    <div class="h-2 w-2"></div><div class="h-2 w-2"></div><div class="h-2 w-2"></div><div class="h-2 w-2"></div><div class="h-2 w-2"></div><div class="h-2 w-2"></div><div class="h-2 w-2"></div><div class="h-2 w-2"></div><div class="h-2 w-2"></div><div class="h-2 w-2"></div>
                    <div class="h-2 w-2"></div><div class="h-2 w-2"></div><div class="h-2 w-2"></div><div class="h-2 w-2"></div><div class="h-2 w-2"></div><div class="h-2 w-2"></div><div class="h-2 w-2"></div><div class="h-2 w-2"></div><div class="h-2 w-2"></div><div class="h-2 w-2"></div>
                    <div class="h-2 w-2"></div><div class="h-2 w-2"></div><div class="h-2 w-2"></div><div class="h-2 w-2"></div><div class="h-2 w-2"></div><div class="h-2 w-2"></div><div class="h-2 w-2"></div><div class="h-2 w-2"></div><div class="h-2 w-2"></div><div class="h-2 w-2"></div>
                    <div class="h-2 w-2"></div><div class="h-2 w-2"></div><div class="h-2 w-2"></div><div class="h-2 w-2"></div><div class="h-2 w-2"></div><div class="h-2 w-2"></div><div class="h-2 w-2"></div><div class="h-2 w-2"></div><div class="h-2 w-2"></div><div class="h-2 w-2"></div>
                    <div class="h-2 w-2"></div><div class="h-2 w-2"></div><div class="h-2 w-2"></div><div class="h-2 w-2"></div><div class="h-2 w-2"></div><div class="h-2 w-2"></div><div class="h-2 w-2"></div><div class="h-2 w-2"></div><div class="h-2 w-2"></div><div class="h-2 w-2"></div>
                    <div class="h-2 w-2"></div><div class="h-2 w-2"></div><div class="h-2 w-2"></div><div class="h-2 w-2"></div><div class="h-2 w-2"></div><div class="h-2 w-2"></div><div class="h-2 w-2"></div><div class="h-2 w-2"></div><div class="h-2 w-2"></div><div class="tetromino-little-block ring-red-700 bg-red-900"></div>
                </div>`
            }
            break;

        case "playerLeave":
            document.getElementById("playersNb").innerHTML = `${message.body.playersNb} / ${message.body.size}`
            document.getElementById("opponentsGame").removeChild(document.getElementById(`${message.body.playerName}-tetris-game`));
            resizePlayersGridArrangement(message.body)
            break;

        case "beginMultiGame":
            resizePlayersGridArrangement(message.body)
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
                    if (playersNb <= 2) {
                        document.getElementById(`${message.body.playerName}-tetris-game`).children[index].className = tetrominosColors[oppponentGrid[y][x]]
                    } else {
                        document.getElementById(`${message.body.playerName}-tetris-game`).children[index].className = tetrominosLittleColors[oppponentGrid[y][x]]
                    }
                }
            }
            break;

        case "winner":
            if (message.body.playerName == userName) {
                youWin()
            }
            document.getElementById("waiting").classList.remove("hidden")
            document.getElementById("game").classList.add("hidden")
            document.getElementById("playersNb").innerHTML = `${message.body.playersNb} / ${message.body.size}`
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
            body: {
                grid: grid,
                score: score
            }
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

function makeALine() {
    document.getElementById("score").innerHTML = score
    ws.send(JSON.stringify({
        title: "makeALine",
        body: {
            grid: grid,
            score: score
        }
    }))
}

function resizePlayersGridArrangement(body) {
    playersNb = body.playersNb
    if (playersNb <= 1) {
        if (!isgameover) {
            youWin()
        } else {
            document.getElementById("waiting").classList.remove("hidden")
            document.getElementById("game").classList.add("hidden")
        }
    } else if (playersNb == 2) {
        document.getElementById("playerGame").classList.remove("justify-center")
        document.getElementById("playerGame").classList.add("justify-start")

        document.getElementById("opponentsGame").className = ""
        document.getElementById("opponentsGame").children[0].classList.add("justify-end")
    }
}

function youWin() {
    alert("you win !!!")
}