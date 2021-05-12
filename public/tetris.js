var gridW = 10
var gridH = 20
var grid = []
var size = 20
var canPushPiece = true
var pieceFalling
var timeLapseFall = 10

var L = [
    [0, 0, 1],
    [1, 1, 1],
    [0, 0, 0]
]

var I = [
    [0, 0, 0, 0],
    [1, 1, 1, 1],
    [0, 0, 0, 0],
    [0, 0, 0, 0]
]

var J = [
    [1, 0, 0],
    [1, 1, 1],
    [0, 0, 0]
]

var S = [
    [0, 1, 1],
    [1, 1, 0],
    [0, 0, 0]
]

var T = [
    [0, 1, 0],
    [1, 1, 1],
    [0, 0, 0]
]

//function executed one time before the first frame
function setup() {
    createCanvas(windowWidth, windowHeight)
        //init the grid
    for (let y = 0; y < gridH; y++) {
        grid[y] = []
        for (let x = 0; x < gridW; x++) {
            grid[y][x] = 0
        }
    }
    pieceFalling = new Piece(L)
}

//function executed every frame
function draw() {
    background(255)
        //draw the grid
    for (let y = 0; y < grid.length; y++) {
        for (let x = 0; x < grid[y].length; x++) {
            fill(255 - grid[y][x] * 255)
            rect(x * size, y * size, size, size)
        }
    }
    if (frameCount % timeLapseFall == 0) {
        if (pieceFalling) {
            pieceFalling.drop(0, 1)
        }
    }
}

function keyPressed() {
    if (keyCode === LEFT_ARROW) {
        if (pieceFalling) {
            pieceFalling.drop(-1, 0)
        }
    } else if (keyCode === RIGHT_ARROW) {
        if (pieceFalling) {
            pieceFalling.drop(1, 0)
        }
    }
    if (keyCode === DOWN_ARROW) {
        timeLapseFall = 2
    } else {
        timeLapseFall = 10
    }
}

class Piece {
    constructor(shape) {
        this.shape = shape;
        this.x = 3;
        this.y = 0;
        this.color = color(random(0, 255), random(0, 255), random(0, 255))
        var newgrid = Array.from(grid)
        for (let y = 0; y < this.shape.length; y++) {
            for (let x = 0; x < this.shape[y].length; x++) {
                if (this.shape[y][x]) {
                    if (newgrid[y + this.y][x + this.x] == 0) {
                        newgrid[y + this.y][x + this.x] = 1
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
            pieceFalling = new Piece(I)
        }
    }
    canDrop(addx, addy) {
        var pastshape = copy2Darr(this.shape)
        var newgrid = copy2Darr(grid)
        if (this.x + addx < 0 || this.x + addx + pastshape[0].length > gridW) {
            addx = 0
        }
        //check if is in the grid else return false
        if (pastshape.length - 1 + this.y + addy < grid.length) {
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
                            newgrid[y + this.y + addy][x + this.x + addx] = 1
                        } else {
                            return false
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
}

function gameover() {
    console.log("perdu")
}

const allEqual = arr => arr.every(val => val === arr[0]);

function cutShape(arr) {
    var arrVertical = copy2Darr(arr)
    console.table(arr)
    console.table(rotateArr(arrVertical))
    console.table(arrVertical)
    for (let y = 0; y < arr.length; y++) {
        if (allEqual(arr[y]) && arr[y][0] == 0) {
            arr.splice(y, 1)
        }
    }
    for (let x = 0; x < arrVertical.length; x++) {
        if (allEqual(arrVertical[x]) && arrVertical[x][0] == 0) {
            for (let y = 0; y < arr.length; y++) {
                arr[y].splice(x, 1)
            }
        }
    }
    return arr
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