// setup canvas

var canvas = document.querySelector('canvas');
var ctx = canvas.getContext('2d');
console.log(ctx);

var width = canvas.width = window.innerWidth;
var height = canvas.height = window.innerHeight;

// function to generate random number

function random(min,max) {
  var num = Math.floor(Math.random()*(max-min)) + min;
  return num;
}

function Ball(x, y, velX, velY, colour, size) {
    this.x = x;
    this.y = y;
    this.velX = velX;
    this.velY = velY;
    this.colour = colour;
    this.size = size;
}

Ball.prototype.draw = function() {
    ctx.beginPath();
    ctx.fillStyle = this.color;
    ctx.arc(this.x, this.y, this.size, 0, 2 * Math.PI);
    ctx.fill();
}