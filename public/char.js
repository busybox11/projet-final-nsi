var player

function setup(){
    createCanvas(windowWidth, windowHeight)
    player = new Player()
}

function draw(){
    keyDown()
    background(255)
    player.render()
    player.changeDir()
}

function keyDown() {
    if (keyIsDown(LEFT_ARROW)) { 
        player.pos.x -= 10
    }if (keyIsDown(RIGHT_ARROW)) { 
        player.pos.x += 10
    }if (keyIsDown(UP_ARROW)) { 
        player.pos.y -= 10
    }if (keyIsDown(DOWN_ARROW)) { 
        player.pos.y += 10
    }
  }

class Player{
    constructor(){
        this.pos = createVector(width/2, height/2)
        this.posRelative = createVector(width/2, height/2)
        this.speed = 10;
        this.dir = createVector(1, 0)
        this.size = 10
    }
    changeDir(){
        
    }
    render(){
        fill(255)
        rect(this.pos.x - this.size/2, this.pos.y - this.size/2, this.size, this.size)
        fill(0)
        this.dir.setMag(1)
        rect((this.pos.x + this.size/2) + this.dir.x - this.size/4, (this.pos.y + this.size/2) + this.dir.y - this.size/4, this.size/2, this.size/2)
    }
}
