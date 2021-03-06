// setup canvas

var canvas = document.querySelector('canvas');
var para = document.querySelector('p');
var ctx = canvas.getContext('2d');
var num_balls = 2;
var evilThickness = 4;
var stopThisMadness = false;
console.log(ctx);

var width = canvas.width = window.innerWidth;
var height = canvas.height = window.innerHeight;

// function to generate random number

function random(min,max) {
  var num = Math.floor(Math.random()*(max-min)) + min;
  return num;
}

function end() {
    para.textContent = "Congratulations! No balls!";
    stopThisMadness = true;
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

Ball.prototype = Object.create(Shape.prototype);
Ball.prototype.constructor = Ball;

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
    if (this.exists && balls[j].exists && !(this === balls[j])) {
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
    this.realSize = this.size + evilThickness/2;
}

EvilCircle.prototype = Object.create(Shape.prototype);
EvilCircle.prototype.constructor = EvilCircle;

EvilCircle.prototype.draw = function() {
    ctx.beginPath();
    ctx.strokeStyle = this.colour;
    ctx.lineWidth = evilThickness;
    ctx.arc(this.x, this.y, this.size, 0, 2 * Math.PI);
    ctx.stroke();
}

EvilCircle.prototype.checkBounds = function() {
  if ((this.x + this.realSize) >= width) {
    this.x = width - this.realSize;
  }

  if ((this.x - this.realSize) <= 0) {
    this.x = this.realSize;
  }

  if ((this.y + this.realSize) >= height) {
    this.y = height - this.realSize;
  }

  if ((this.y - this.realSize) <= 0) {
    this.y = this.realSize;
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
        _this.checkBounds();
    }
}

EvilCircle.prototype.collisionDetect = function() {
  for (var j = 0; j < balls.length; j++) {
    if (balls[j].exists) {
      var dx = this.x - balls[j].x;
      var dy = this.y - balls[j].y;
      var distance = Math.sqrt(dx * dx + dy * dy);

      if (distance < this.realSize + balls[j].size) {
        balls[j].exists = false;
        num_balls--;

        if (!num_balls) {
            end();
        }
      }

      
    }

  }
}

var balls = [];

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
    ball.draw();
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

  //evil.checkBounds();
  evil.draw();
  evil.collisionDetect();

  if(stopThisMadness) {
    ctx.fillStyle = 'rgba(0, 0, 0, 0.25)';
    for (var i = 0; i < 100; i++) {
        ctx.fillRect(0, 0, width, height);
        evil.draw();
    }
    return;

  }

  requestAnimationFrame(loop);
}

loop();