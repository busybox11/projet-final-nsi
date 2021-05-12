var gridW = 10
var gridH = 20
var grid = []
var size = 20
var canPushPiece = true
var pieceFalling
var timeLapseFall = 15

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
    stroke(200)
    pieceFalling = new Piece(pieces[Math.floor(Math.random() * pieces.length)])
}

//function executed every frame
function draw() {
    keydown()
    background(255)
        //draw the grid
    for (let y = 0; y < grid.length; y++) {
        for (let x = 0; x < grid[y].length; x++) {
            if (grid[y][x] == 1) {
                fill(0, 70, 200)
            } else if (grid[y][x] == 2) {
                fill(0, 100, 0)
            } else if (grid[y][x] == 3) {
                fill(200, 80, 0)
            } else if (grid[y][x] == 4) {
                fill(100, 0, 100)
            } else if (grid[y][x] == 5) {
                fill(100, 100, 0)
            } else if (grid[y][x] == 6) {
                fill(10, 100, 200)
            } else {
                fill(255, 255, 255)
            }
            rect(x * size, y * size, size, size)
        }
    }
    if (frameCount % timeLapseFall == 0) {
        if (pieceFalling) {
            pieceFalling.drop(0, 1)
        }
    }
}

function keydown() {
    if (keyIsDown(DOWN_ARROW)) {
        timeLapseFall = 2
    } else {
        timeLapseFall = 15
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
    if (keyCode === UP_ARROW) {
        if (pieceFalling) {
            pieceFalling.rotate()
        }
    }
}

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
            pieceFalling = new Piece(pieces[Math.floor(Math.random() * pieces.length)])
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
        grid = newgrid
    }
}

function gameover() {
    console.log("perdu")
    throw new Error("Stop script");
}

const allEqual = arr => arr.every(val => val === arr[0]);

function cutShape(arr) {
    var newarr = copy2Darr(arr)
    var arrVertical = copy2Darr(arr)
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



class Piece2 {
    constructor(shape) {
        this.shape = shape;
        this.x = 3;
        this.y = 0;
        this.colorNb = 0;
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
            pieceFalling = new Piece(pieces[Math.floor(Math.random() * pieces.length)])
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
        grid = newgrid
    }
}