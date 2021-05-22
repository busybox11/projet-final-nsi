var pastgrid = []
setInterval(function() {
    if (!isgameover && pastgrid != grid) {
        pastgrid = copy2Darr(grid)
        for (let y = 1; y < grid.length; y++) {
            for (let x = 0; x < grid[y].length; x++) {
                var index = (y - 1) * (grid[y].length) + x
                document.getElementById("tetris-game").children[index].className = tetrominosColors[grid[y][x]]
            }
        }
    }
}, 10)

function gameover() {
    isgameover = true;
    alert("perdu")
}