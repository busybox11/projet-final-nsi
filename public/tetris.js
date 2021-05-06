var gridW = 10
var gridH = 20
var grid = []
var size = 20
var canPushPiece = true
var pieceFalling

var L = [[0,0,0],
         [1,1,1],
         [1,0,0]]

var I = [[0,0,0,0],
         [1,1,1,1],
         [0,0,0,0],
         [0,0,0,0]]

var J = [[1,0,0],
         [1,1,1],
         [0,0,0]]
         
var S = [[0,0,0],
         [0,1,1],
         [1,1,0]]

var T = [[0,0,0],
         [1,1,1],
         [0,1,0]]

//function executed one time before the first frame
function setup(){
    createCanvas(windowWidth, windowHeight)
    //init the grid
    for (let y = 0; y < gridH; y++) {
        grid[y] = []
        for (let x = 0; x < gridW; x++) {
            grid[y][x] = 0
        }
    }
}

//function executed every frame
function draw(){
    background(255)
    //draw the grid
    for (let y = 0; y < grid.length; y++) {
        for (let x = 0; x < grid[y].length; x++) {
            fill(255 - grid[y][x]*255)
            rect(x * size , y * size, size, size)
        }
    }
    if(pieceFalling){
        pieceFalling.drop()
    }
    if(canPushPiece){
        canPushPiece = false
        pieceFalling = new Piece(Lpiece)
    }
}

class Piece{
    constructor(shape){
        this.shape = shape;
        this.x = 3;
        this.y = 0;
        this.color = color(random(0,255), random(0,255), random(0,255))
    }
    drop(){
        this.y += 1
    }
    canDrop(){
        var newgrid = new Array.from(grid)
        for (let y = 0; y < shape.length; y++) {
            for (let x = 0; x < shape[y].length; x++) {
                if (newgrid[y + this.y][x + this.x] == 0) {
                    newgrid[y + this.y][x + this.x] = 1
                }else{
                    return false
                }
            }
        }
        return newgrid
    }
}

function gameover(){
    console.log("perdu")
}