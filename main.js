// setup canvas

var canvas = document.querySelector('canvas');
var para = document.querySelector('p';)
var ctx = canvas.getContext('2d');
console.log(ctx);

var width = canvas.width = window.innerWidth;
var height = canvas.height = window.innerHeight;

// function to generate random number

function random(min,max) {
  var num = Math.floor(Math.random()*(max-min)) + min;
  return num;
}

function Shape(x, y, velX, velY) {
    this.x = x;
    this.y = y;
    this.velX = velX;
    this.velY = velY;
    this.exists = true;
}

function Ball(x, y, velX, velY, colour, size) {
    Shape.call(this, x, y, velX, velY);
    this.colour = colour;
    this.size = size;
}

Ball.prototype = new Shape;

Ball.prototype.draw = function() {
    ctx.beginPath();
    ctx.fillStyle = this.colour;
    ctx.arc(this.x, this.y, this.size, 0, 2 * Math.PI);
    ctx.fill();
}

Ball.prototype.update = function() {
  if ((this.x + this.size) >= width) {
    this.velX = -(this.velX);
  }

  if ((this.x - this.size) <= 0) {
    this.velX = -(this.velX);
  }

  if ((this.y + this.size) >= height) {
    this.velY = -(this.velY);
  }

  if ((this.y - this.size) <= 0) {
    this.velY = -(this.velY);
  }

  this.x += this.velX;
  this.y += this.velY;
}

Ball.prototype.collisionDetect = function() {
  for (var j = 0; j < balls.length; j++) {
    if (!(this === balls[j])) {
      var dx = this.x - balls[j].x;
      var dy = this.y - balls[j].y;
      var distance = Math.sqrt(dx * dx + dy * dy);

      if (distance < this.size + balls[j].size) {
        balls[j].colour = this.colour = 'rgb(' + random(0, 255) + ',' + random(0, 255) + ',' + random(0, 255) +')'; //balls[j].size > this.size ? balls[j].colour : this.colour;
      }
    }
  }
}

function EvilCircle(x, y) {
    Shape.call(this, x, y, 20, 20);
    this.colour = 'white';
    this.size = 10;
}

EvilCircle.prototype = new Shape;

EvilCircle.prototype.draw = function() {
    ctx.beginPath();
    ctx.strokeStyle = this.colour;
    ctx.lineWidth = 3;
    ctx.arc(this.x, this.y, this.size, 0, 2 * Math.PI);
    ctx.stroke();
}

EvilCircle.prototype.checkBounds = function() {
  if ((this.x + this.size) >= width) {
    this.x -= this.size;
  }

  if ((this.x - this.size) <= 0) {
    this.x += this.size;
  }

  if ((this.y + this.size) >= height) {
    this.y -= this.size;
  }

  if ((this.y - this.size) <= 0) {
    this.y += this.size;
  }

}

EvilCircle.prototype.setControls = function() {
    var _this = this;
    window.onkeydown = function(e) {
        if (e.keyCode === 65) {
        _this.x -= _this.velX;
        } else if (e.keyCode === 68) {
        _this.x += _this.velX;
        } else if (e.keyCode === 87) {
        _this.y -= _this.velY;
        } else if (e.keyCode === 83) {
        _this.y += _this.velY;
    }
  }
}

EvilCircle.prototype.collisionDetect = function() {
  for (var j = 0; j < balls.length; j++) {
    if (balls[j].exists) {
      var dx = this.x - balls[j].x;
      var dy = this.y - balls[j].y;
      var distance = Math.sqrt(dx * dx + dy * dy);

      if (distance < this.size + balls[j].size) {
        balls[j].exists = false;
        return true;
      }

      
    }

    return false;
  }
}

var balls = [];
var num_balls = 25;
var evil = new EvilCircle(random(0,width), random(0,height));
evil.setControls();

function loop() {
  ctx.fillStyle = 'rgba(0, 0, 0, 0.25)';
  ctx.fillRect(0, 0, width, height);

  while (balls.length < num_balls) {
    var ball = new Ball(
      random(0,width),
      random(0,height),
      random(-7,7),
      random(-7,7),
      'rgb(' + random(0,255) + ',' + random(0,255) + ',' + random(0,255) +')',
      random(10,20)
    );
    balls.push(ball);
  }

  para.textContent = "Ball count: " + num_balls;

  for (var i = 0; i < balls.length; i++) {
    if (balls[i].exists) {
        balls[i].draw();
        balls[i].update();
        balls[i].collisionDetect();
    }
  }

  evil.checkBounds();
  evil.draw();
  if(evil.collisionDetect()) { num_balls-- };

  requestAnimationFrame(loop);
}

loop();