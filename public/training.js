var pastgrid = []
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
                    document.getElementById("tetris-game").children[index].className = "h-8 w-8 bg-gray-900"
                }
            }
        }
        //show the next piece
        for (let y = 0; y < 4; y++) {
            for (let x = 0; x < 5; x++) {
                document.getElementById("tetris-nextPiece").children[y * 5 + x].className = ""
            }
        }
        for (let y = 0; y < nextPiece.length; y++) {
            for (let x = 0; x < nextPiece[y].length; x++) {
                var index = y * 5 + x
                document.getElementById("tetris-nextPiece").children[index].className = tetrominosColors[nextPiece[y][x]]
            }
        }
        document.getElementById("level").innerHTML = `level ${currentLevel + 1}`;
    }
}, 10)

function gameover() {
    isgameover = true;
    alert("perdu")
}

function updateScore() {
    document.getElementById("score").innerHTML = `${score} pts`
}