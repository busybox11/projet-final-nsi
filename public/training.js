var pastgrid = []
var pasthold = []
beginTetrisGame()
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
        document.getElementById("level").innerHTML = currentLevel + 1;
    }
}, 10)

function gameover() {
    isgameover = true;
    alert("perdu")
}

function makeALine() {
    document.getElementById("score").innerHTML = score
}