//initialise toutes les pieces et leurs couleurs
var tetrominosColors = [
    "h-8 w-8",
    "tetromino-block ring-yellow-700 bg-yellow-900",
    "tetromino-block ring-red-700 bg-red-900",
    "tetromino-block ring-blue-700 bg-blue-900",
    "tetromino-block ring-purple-700 bg-purple-900",
    "tetromino-block ring-indigo-700 bg-indigo-900",
    "tetromino-block ring-green-700 bg-green-900",
    "tetromino-block ring-pink-700 bg-pink-900",
    "tetromino-block ring-gray-700 bg-gray-900"
]

var tetrominosLittleColors = [
    "h-2 w-2",
    "tetromino-little-block ring-yellow-700 bg-yellow-900",
    "tetromino-little-block ring-red-700 bg-red-900",
    "tetromino-little-block ring-blue-700 bg-blue-900",
    "tetromino-little-block ring-purple-700 bg-purple-900",
    "tetromino-little-block ring-indigo-700 bg-indigo-900",
    "tetromino-little-block ring-green-700 bg-green-900",
    "tetromino-little-block ring-pink-700 bg-pink-900",
    "tetromino-little-block ring-gray-700 bg-gray-900"
]

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

var rS = [
    [7, 7, 0],
    [0, 7, 7],
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

var keys = {
        "left": 37,
        "right": 39,
        "down": 40,
        "rotate": 38,
        "place": 32,
        "hold": 16,
        "pause": 84
    }
    //recupere les commandes choisis par le joueur
if (localStorage.getItem("inputTetris")) {
    keys = JSON.parse(localStorage.getItem("inputTetris"))
}

var pieces = [L, I, J, S, T, Q, rS]
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
var gridW = 10
var grid = []
var fallingLineGrid = []
var canPushPiece = true
var pieceFalling, nextPiece, holdPiece
var timeLapseFall = levelsInfos[currentLevel]
var ws = new WebSocket("ws://localhost:3000", "protocolOne");
var isgameover = true;
var pause = false;
var canpause = false
var frameCount = 0;
var timePast = 0;
var canFastDown = true
var canHold = true
var nbCantDrop = 0

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
                        document.removeEventListener("keydown", keydown)
                        document.removeEventListener("keyup", keyup)
                    }
                }
            }
        }
        this.drawFallingLine()
        grid = Array.from(newgrid)
    }
    drop(addx, addy) {
        var result = this.canDrop(addx, addy)
        if (result) {
            nbCantDrop = 0
            grid = result
        } else if (nbCantDrop < 1) {
            nbCantDrop++
        } else {
            nbCantDrop = 0
            var linesCut = 0;
            for (let y = 1; y < grid.length; y++) {
                var itt = 0
                while (itt < grid[y].length && grid[y][itt] > 0) {
                    itt++
                }
                if (itt >= grid[y].length) {
                    grid[y] = Array(grid[y].length).fill(0)
                    linesCut++
                }
            }
            if (linesCut) {
                if (linesCut == 1) {
                    score += 40 * (currentLevel + 1)
                } else if (linesCut == 2) {
                    score += 100 * (currentLevel + 1)
                } else if (linesCut == 3) {
                    score += 300 * (currentLevel + 1)
                } else {
                    score += 1200 * (currentLevel + 1)
                }
                for (let j = 0; j < linesCut; j++) {
                    for (let y = grid.length - 1; y > 0; y--) {
                        if (allEqual(grid[y]) && grid[y][0] == 0) {
                            for (let i = y; i > 0; i--) {
                                var tempArr = Array.from(grid[i - 1])
                                grid[i] = Array.from(tempArr)
                            }
                        }
                    }
                }
                makeALine()
            }
            pieceFalling = new Piece(nextPiece)
            canFastDown = false
            canHold = true
            timeLapseFall = levelsInfos[currentLevel]
            nextPiece = copy2Darr(pieces[Math.floor(Math.random() * pieces.length)])
        }
    }
    canDrop(addx, addy) {
        var pastshape = copy2Darr(this.shape)
        var newgrid = copy2Darr(grid)
        if (this.x + addx + (pastshape - cutShape(pastshape)[0]) < 0 || this.x + addx + cutShape(pastshape)[0].length > gridW) {
            addx = 0
        }
        //check if is in the grid else return false
        if (cutBottomShape(pastshape).length - 1 + this.y + addy < grid.length) {
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
                        try {
                            newgrid[y + this.y + addy][x + this.x + addx]
                        } catch (error) {
                            alert(error)
                            gameover()
                        }
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
            this.drawFallingLine()
            return newgrid
        } else {
            return false
        }
    }
    rotate() {
        var pastshape = copy2Darr(this.shape)
        this.shape = rotateArr(this.shape);
        var newgrid = copy2Darr(grid)
            //efface d'abord la piece
        for (let y = 0; y < this.shape.length; y++) {
            for (let x = 0; x < this.shape[y].length; x++) {
                if (newgrid[y + this.y][x + this.x] == this.colorNb && pastshape[y][x] == this.colorNb) {
                    newgrid[y + this.y][x + this.x] = 0
                }
            }
        }
        for (let y = 0; y < this.shape.length; y++) {
            for (let x = 0; x < this.shape[y].length; x++) {
                if (this.shape[y][x]) {
                    //si la piece depasse de la grille
                    if (x + this.x < 0 || x + this.x >= gridW) {
                        this.shape = rotateArr(rotateArr(rotateArr(this.shape)));
                        return false
                    }
                    if (newgrid[y + this.y][x + this.x] == 0) {
                        newgrid[y + this.y][x + this.x] = this.colorNb
                    } else {
                        this.shape = rotateArr(rotateArr(rotateArr(this.shape)));
                        return false
                    }
                }
            }
        }
        if (this.shape.length + this.y >= gridH || this.canDrop(0, 0) == false) {
            this.shape = rotateArr(rotateArr(rotateArr(this.shape)));
            return false
        }
        grid = newgrid
        this.drawFallingLine()
    }
    drawFallingLine() {
        //reinitilise toutes les cases
        for (let y = 0; y < gridH; y++) {
            fallingLineGrid[y] = []
            for (let x = 0; x < gridW; x++) {
                fallingLineGrid[y][x] = 0
            }
        }
        //écart entre la grille coupé et non coupé
        var space = 0
        for (let x = 0; x < this.shape[0].length; x++) {
            var arrVertical = []
            for (let y = 0; y < this.shape.length; y++) {
                arrVertical.push(this.shape[y][x])
            }
            if (allEqual(arrVertical) && arrVertical[0] == 0) {
                space++
            } else {
                x = this.shape[0].length;
            }
        }
        //dessine les traits
        for (let x = 0; x < cutShape(this.shape)[0].length; x++) {
            for (let i = this.y; i < gridH; i++) {
                fallingLineGrid[i][x + this.x + space] = 1
            }
        }
        //previsualise la place de la piece
        // var bottomY = []
        //     //recherche la partie de la piece la plus basse
        // for (let x = 0; x < this.shape[0].length; x++) {
        //     var arrVertical = []
        //     for (let y = 0; y < this.shape.length; y++) {
        //         arrVertical.push(this.shape[y][x])
        //     }
        //     if (allEqual(arrVertical) && arrVertical[0] == 0) {
        //         bottomY[x] = 0
        //     } else {
        //         for (let y = arrVertical.length - 1; y >= 0; y--) {
        //             if (arrVertical[y]) {
        //                 bottomY[x] = -arrVertical.length + y
        //                 y = 0
        //             }
        //         }
        //     }
        // }
        // var mindist = 10
        // for (let x = 0; x < bottomY.length; x++) {
        //     var dist = 0
        // while (grid[this.y + this.shape.length + bottomY[x] + dist][this.x + x] == 0 && this.y + this.shape.length + bottomY[x] + dist < gridH - 1) {
        //     dist++
        // }
        // if (dist < mindist) {
        //     mindist = dist
        // }

        // }
        // for (let y = 0; y < this.shape.length; y++) {
        //     for (let x = 0; x < this.shape[y].length; x++) {
        //         if (this.shape[y][x] == this.colorNb) {
        //             fallingLineGrid[y + this.y + mindist][x + this.x] = 2
        //         }
        //     }
        // }
    }
    erase() {
        for (let y = 0; y < this.shape.length; y++) {
            for (let x = 0; x < this.shape[y].length; x++) {
                if (grid[y + this.y][x + this.x] == this.colorNb && this.shape[y][x] == this.colorNb) {
                    grid[y + this.y][x + this.x] = 0
                }
            }
        }
    }
}

//lance la partie
function beginTetrisGame(pauseAuthorized = false) {
    canpause = pauseAuthorized;
    score = 0;
    makeALine()
    currentLevel = 0;

    //init the grid
    for (let y = 0; y < gridH; y++) {
        grid[y] = []
        fallingLineGrid[y] = []
        for (let x = 0; x < gridW; x++) {
            grid[y][x] = 0
            fallingLineGrid[y][x] = 0
        }
    }
    pieceFalling = new Piece(pieces[Math.floor(Math.random() * pieces.length)])
    nextPiece = copy2Darr(pieces[Math.floor(Math.random() * pieces.length)])
    holdPiece = []
    document.addEventListener("keydown", keydown);
    document.addEventListener("keyup", keyup)
    isgameover = false;
}

function keydown(event) {
    if (event.keyCode == keys["pause"][0]) {
        pause = !pause
        try {
           setPause()
        } catch (error) {
            
        }
    }
    if (pause && canpause) return
    if (event.keyCode == keys["down"][0] && canFastDown) {
        timeLapseFall = 2
    }
    if (event.keyCode == keys["left"][0] && pieceFalling) {
        pieceFalling.drop(-1, 0)
    } else if (event.keyCode == keys["right"][0] && pieceFalling) {
        pieceFalling.drop(1, 0)
    }
    if (event.keyCode == keys["rotate"][0] && pieceFalling) {
        pieceFalling.rotate()
    }
    if (event.keyCode == keys["place"][0] && pieceFalling) {
        var pastPiece = pieceFalling
        var itt = 0
        while (pastPiece == pieceFalling && itt < gridH + 3) {
            pieceFalling.drop(0, 1)
            itt++
        }
    }
    if (event.keyCode == keys["hold"][0] && pieceFalling && canHold) {
        canHold = false
        pieceFalling.erase()
        canFastDown = false
        timeLapseFall = levelsInfos[currentLevel]
        if (holdPiece.length <= 0) {
            //si il n'y a aucune piece dans le hold
            holdPiece = copy2Darr(pieceFalling.shape)
            pieceFalling = new Piece(nextPiece)
            nextPiece = copy2Darr(pieces[Math.floor(Math.random() * pieces.length)])
        } else {
            var mem = copy2Darr(holdPiece)
            holdPiece = copy2Darr(pieceFalling.shape)
            pieceFalling = new Piece(mem)
        }
    }
}

function keyup(event) {
    if (event.keyCode == keys["down"][0]) {
        timeLapseFall = levelsInfos[currentLevel]
        canFastDown = true
    }
}
//function executed every frame
setInterval(function() {
    if (pause && canpause) return
    if (!isgameover) {
        if (frameCount % timeLapseFall == 0) {
            if (pieceFalling) {
                pieceFalling.drop(0, 1)
            }
            if (frameCount > 3000) {
                frameCount = 0
                if (currentLevel < levelsInfos.length - 1) currentLevel++
            }
        }
        frameCount++
        timePast++
    }
}, 10)

const allEqual = arr => arr.every(val => val === arr[0]);

//cut the sides of the array who contain 0 in all line and column
function cutShape(arr) {
    var newarr = copy2Darr(arr)
    for (let y = newarr.length - 1; y >= 0; y--) {
        if (allEqual(newarr[y]) && newarr[y][0] == 0) {
            newarr.splice(y, 1)
        }
    }
    for (let x = newarr[0].length - 1; x >= 0; x--) {
        var arrVertical = []
        for (let y = 0; y < newarr.length; y++) {
            arrVertical.push(newarr[y][x])
        }
        if (allEqual(arrVertical) && arrVertical[0] == 0) {
            for (let y = 0; y < newarr.length; y++) {
                newarr[y].splice(x, 1)
            }
        }
    }
    return newarr
}

//cut the bottom side of the array (cut the 0 elements)
function cutBottomShape(arr) {
    var newarr = copy2Darr(arr)
    for (let y = newarr.length - 1; y >= 0; y--) {
        if (allEqual(newarr[y]) && newarr[y][0] == 0) {
            newarr.splice(y, 1)
        } else {
            y = 0
        }
    }
    return newarr
}

//tourne un array de 90 degrés
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

//copy une double array
function copy2Darr(arr) {
    var newArr = []
    for (let i = 0; i < arr.length; i++) {
        newArr.push(Array.from(arr[i]))
    }
    return newArr
}