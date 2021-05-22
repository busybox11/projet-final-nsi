var pastgrid = []
setInterval(function() {
    if (pastgrid != grid) {
        pastgrid = copy2Darr(grid)
        for (let y = 1; y < grid.length; y++) {
            for (let x = 0; x < grid[y].length; x++) {
                var index = (y - 1) * (grid[y].length) + x
                try {
                    document.getElementById("tetris-game").children[index].innerHTML = grid[y][x]
                } catch (e) {}
            }
        }
    }
}, 10)