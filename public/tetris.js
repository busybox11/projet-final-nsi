var js = document.createElement("script");
js.type = "text/javascript";
js.src = "./tetrominos.js";
document.body.appendChild(js);

var L = [
    [0, 0, 1],
    [1, 1, 1],
    [0, 0, 0]
]

var I = [
    [0, 0, 0, 0],
    [2, 2, 2, 2],
    [0, 0, 0, 0],
    [0, 0, 0, 0]
]

var J = [
    [3, 0, 0],
    [3, 3, 3],
    [0, 0, 0]
]

var S = [
    [0, 4, 4],
    [4, 4, 0],
    [0, 0, 0]
]

var T = [
    [0, 5, 0],
    [5, 5, 5],
    [0, 0, 0]
]

var Q = [
    [6, 6],
    [6, 6]
]

var pieces = [L, I, J, S, T, Q]
var gridW = 10
var score = 0
var currentLevel = 0
var levelsInfos = [
    48,
    43,
    38,
    33,
    28,
    23,
    18,
    13,
    8,
    6,
    5,
    5,
    5,
    4,
    4,
    4,
    3,
    3,
    3,
    2,
    2,
    2,
    2,
    2,
    2,
    2,
    2,
    2,
    2,
    1
]
var gridH = 21
var grid = []
var canPushPiece = true
var pieceFalling, nextPiece
var timeLapseFall = levelsInfos[currentLevel]
var ws = new WebSocket("ws://localhost:3000", "protocolOne");
var isgameover = false;

class Piece {
    constructor(shape) {
        this.shape = shape;
        this.x = 3;
        this.y = 0;
        this.colorNb = 0
        var newgrid = copy2Darr(grid)
        for (let y = 0; y < this.shape.length; y++) {
            for (let x = 0; x < this.shape[y].length; x++) {
                if (this.shape[y][x]) {
                    this.colorNb = this.shape[y][x]
                    this.colorNb = this.shape[y][x]
                    if (newgrid[y + this.y][x + this.x] == 0) {
                        newgrid[y + this.y][x + this.x] = this.shape[y][x]
                    } else {
                        gameover()
                    }
                }
            }
        }
        grid = Array.from(newgrid)
    }
    drop(addx, addy) {
        var result = this.canDrop(addx, addy)
        if (result) {
            grid = result
        } else {
            var godown = 0;
            for (let y = 1; y < grid.length; y++) {
                var itt = 0
                while (itt < grid[y].length && grid[y][itt] > 0) {
                    itt++
                }
                if (itt >= grid[y].length) {
                    grid[y] = Array(grid[y].length).fill(0)
                    godown++
                }
            }
            if (godown) {
                if (godown == 1) {
                    score += 40 * (currentLevel + 1)
                } else if (godown == 2) {
                    score += 100 * (currentLevel + 1)
                } else if (godown == 3) {
                    score += 300 * (currentLevel + 1)
                } else {
                    score += 1200 * (currentLevel + 1)
                }
                for (let j = 0; j < godown; j++) {
                    for (let y = grid.length - 1; y > 0; y--) {
                        if (allEqual(grid[y]) && grid[y][0] == 0) {
                            for (let i = y; i > 0; i--) {
                                var tempArr = Array.from(grid[i - 1])
                                grid[i] = Array.from(tempArr)
                            }
                        }
                    }
                }
                updateScore()
            }
            pieceFalling = new Piece(nextPiece)
            nextPiece = pieces[Math.floor(Math.random() * pieces.length)]
        }
    }
    canDrop(addx, addy) {
        var pastshape = copy2Darr(this.shape)
        var newgrid = copy2Darr(grid)
        if (this.x + addx + (pastshape - cutShape(pastshape)[0]) < 0 || this.x + addx + cutShape(pastshape)[0].length > gridW) {
            addx = 0
        }
        //check if is in the grid else return false
        if (cutShape(pastshape).length - 1 + this.y + addy < grid.length) {
            //remove the piece of the grid to not check itself 
            for (let y = 0; y < pastshape.length; y++) {
                for (let x = 0; x < pastshape[y].length; x++) {
                    if (pastshape[y][x]) {
                        newgrid[y + this.y][x + this.x] = 0
                    }
                }
            }
            for (let y = 0; y < pastshape.length; y++) {
                for (let x = 0; x < pastshape[y].length; x++) {
                    if (pastshape[y][x]) {
                        if (newgrid[y + this.y + addy][x + this.x + addx] == 0) {
                            newgrid[y + this.y + addy][x + this.x + addx] = this.colorNb
                        } else {
                            if (addx != 0) {
                                return this.canDrop(0, addy)
                            } else {
                                return false
                            }
                        }
                    }
                }
            }
            this.y += addy;
            this.x += addx;
            return newgrid
        } else {
            return false
        }
    }
    rotate() {
        this.shape = rotateArr(this.shape);
        var newgrid = copy2Darr(grid)
        for (let y = 0; y < this.shape.length; y++) {
            for (let x = 0; x < this.shape[y].length; x++) {
                if (newgrid[y + this.y][x + this.x] == this.colorNb) {
                    newgrid[y + this.y][x + this.x] = 0
                }
            }
        }
        for (let y = 0; y < this.shape.length; y++) {
            for (let x = 0; x < this.shape[y].length; x++) {
                if (this.shape[y][x]) {
                    if (newgrid[y + this.y][x + this.x] == 0) {
                        newgrid[y + this.y][x + this.x] = this.colorNb
                    } else {
                        return false
                    }
                }
            }
        }
        if (this.canDrop(0, 0) == false) {
            this.shape = rotateArr(rotateArr(rotateArr(this.shape)));
            return false
        }
        grid = newgrid
    }
}
//init the grid
for (let y = 0; y < gridH; y++) {
    grid[y] = []
    for (let x = 0; x < gridW; x++) {
        grid[y][x] = 0
    }
}
pieceFalling = new Piece(pieces[Math.floor(Math.random() * pieces.length)])
nextPiece = pieces[Math.floor(Math.random() * pieces.length)]

document.addEventListener("keydown", function(event) {
    if (event.code == "ArrowDown") {
        timeLapseFall = 2
    }
    if (event.code === 'ArrowLeft' && pieceFalling) {
        pieceFalling.drop(-1, 0)
    } else if (event.code === "ArrowRight" && pieceFalling) {
        pieceFalling.drop(1, 0)
    }
    if (event.code === "ArrowUp" && pieceFalling) {
        pieceFalling.rotate()
    }
});

document.addEventListener("keyup", event => {
    if (event.code == "ArrowDown") {
        timeLapseFall = levelsInfos[currentLevel]
    }
})

var frameCount = 0;

//function executed every frame
setInterval(function() {
    if (frameCount % timeLapseFall == 0 && !isgameover) {
        if (pieceFalling) {
            pieceFalling.drop(0, 1)
        }
        if (frameCount > 1000) {
            frameCount = 0
            if (currentLevel < levelsInfos.length - 1) currentLevel++
        }
    }
    frameCount++
}, 10)

const allEqual = arr => arr.every(val => val === arr[0]);

function cutShape(arr) {
    var newarr = copy2Darr(arr)
    var arrVertical = copy2Darr(arr)
    rotateArr(arrVertical)
    for (let y = 0; y < newarr.length; y++) {
        if (allEqual(newarr[y]) && newarr[y][0] == 0) {
            newarr.splice(y, 1)
        }
    }
    for (let x = 0; x < arrVertical.length; x++) {
        if (allEqual(arrVertical[x]) && arrVertical[x][0] == 0) {
            for (let y = 0; y < newarr.length; y++) {
                newarr[y].splice(x, 1)
            }
        }
    }
    return newarr
}

function rotateArr(matrix) {
    var newArr = Array.from(matrix)
    const n = newArr.length;
    const x = Math.floor(n / 2);
    const y = n - 1;
    for (let i = 0; i < x; i++) {
        for (let j = i; j < y - i; j++) {
            k = newArr[i][j];
            newArr[i][j] = newArr[y - j][i];
            newArr[y - j][i] = newArr[y - i][y - j];
            newArr[y - i][y - j] = newArr[j][y - i]
            newArr[j][y - i] = k
        }
    }
    return newArr
}

function copy2Darr(arr) {
    var newArr = []
    for (let i = 0; i < arr.length; i++) {
        newArr.push(Array.from(arr[i]))
    }
    return newArr
}