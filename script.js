var canvas = document.getElementById("myCanvas");
canvas.width = 1200;
canvas.height = 750;
var ctx = canvas.getContext("2d");
ctx.fillStyle = "grey";
canvas.addEventListener("click", returnclick);
objects = [];
let gx = 590;

spaceispressed = false;

leftArrowispressed = false;
rightArrowispressed = false;

function returnclick(event) {
  var [m, r, vx, vy] = initialize();
  var x = event.clientX - canvas.offsetLeft;
  var y = event.clientY - canvas.offsetTop;
  objects.push(new Object(x, y, vx, vy, m, r, "ball"));
}
function update() {
  for (var i = 0; i < objects.length; i++) {
    objects[i].update();
    for (var j = i + 1; j < objects.length; j++) {
      if (areColliding(objects[i], objects[j])) {
        var Pinitialx =
          objects[i].vx * objects[i].m + objects[j].vx * objects[j].m;
        var Pinitialy =
          objects[i].vy * objects[i].m + objects[j].vy * objects[j].m;
        var v1fx =
          (Pinitialx - objects[j].m * (objects[i].vx - objects[j].vx)) /
          (objects[i].m + objects[j].m);
        var v2fx =
          (Pinitialx - objects[i].m * (objects[j].vx - objects[i].vx)) /
          (objects[i].m + objects[j].m);
        var v1fy =
          (Pinitialy - objects[j].m * (objects[i].vy - objects[j].vy)) /
          (objects[i].m + objects[j].m);
        var v2fy =
          (Pinitialy - objects[i].m * (objects[j].vy - objects[i].vy)) /
          (objects[i].m + objects[j].m);
        objects[i].vx = v1fx;
        objects[i].vy = v1fy;
        objects[j].vx = v2fx;
        objects[j].vy = v2fy;

        var dx = objects[i].x - objects[j].x;
        var dy = objects[i].y - objects[j].y;
        var distance = Math.sqrt(dx ** 2 + dy ** 2);
        var overlap = objects[i].r + objects[j].r - distance;
        if (overlap > 0) {
          var angle = Math.atan2(dx, dy);
          objects[i].x += (Math.sin(angle) * overlap) / 2;
          objects[j].x -= (Math.sin(angle) * overlap) / 2;
          objects[i].y += (Math.cos(angle) * overlap) / 2;
          objects[j].y -= (Math.cos(angle) * overlap) / 2;
        }
      }
    }
  }
}

Object.prototype.update = function () {
  //safety
  if (this.completed == "ball") {
    if (this.x <= 0 + this.r) {
      this.x = 0 + this.r;
      this.vx *= -1;
    }
    if (this.x >= canvas.width - this.r) {
      this.x = canvas.width - this.r;
      this.vx *= -1;
    }
    if (this.y <= 0 + this.r) {
      this.y = 0 + this.r;
      this.vy *= -1;
    }
    if (this.y >= 500 - this.r) {
      this.y = 500 - this.r;
      this.vy *= -1;
    }
  } else {
    if (this.y <= 0 + this.r) {
      objects.pop(this.num);
    }
  }
  this.x += this.vx;
  this.y += this.vy;
};

//animate objects
Object.prototype.draw = function () {
  ctx.beginPath();
  ctx.arc(this.x, this.y, this.r, 0, 2 * Math.PI);
  ctx.fillStyle = "blue";
  ctx.fill();
};

//loop
function animate() {
  requestAnimationFrame(animate);

  ctx.clearRect(0, 0, canvas.width, canvas.height);

  for (var i = 0; i < objects.length; i++) {
    objects[i].draw();
    //objects[i].update();
  }

  update();
  Gun_update();
}

animate();

function initialize() {
  return [20, Math.random() * 30, Math.random() * 10, Math.random() * 10];
}

function areColliding(obj1, obj2) {
  var dx = obj1.x - obj2.x;
  var dy = obj1.y - obj2.y;
  var distance = Math.sqrt(dx ** 2 + dy ** 2);
  return distance <= obj1.r + obj2.r;
}

// create Obj
function Object(x, y, vx, vy, m, r, c) {
  this.x = x;
  this.y = y;
  this.vx = vx;
  this.vy = vy;
  this.m = m;
  this.r = r;
  this.completed = c;
  this.num = objects.length + 1;
}

function Gun_update() {
  // GUN
  if (gx > 0 && leftArrowispressed) {
    gx -= 10;
  }
  if (gx < canvas.width - 20 && rightArrowispressed) {
    gx += 10;
  }
  ctx.fillStyle = "black";
  ctx.fillRect(gx, 600, 20, 50);

  if (spaceispressed) {
    objects.push(new Object(gx + 10, 500, 0, -10, 100, 5, "bullet"));
  }
}

// EVENT STUFF
document.addEventListener("keydown", keydownHandler);
document.addEventListener("keyup", keyupHandler);

function keydownHandler(event) {
  if (event.keyCode == 32) {
    spaceispressed = true;
  }
  if (event.keyCode == 37) {
    leftArrowispressed = true;
  }
  if (event.keyCode == 39) {
    rightArrowispressed = true;
  }
}

function keyupHandler(event) {
  if (event.keyCode == 32) {
    spaceispressed = false;
  }
  if (event.keyCode == 37) {
    leftArrowispressed = false;
  }
  if (event.keyCode == 39) {
    rightArrowispressed = false;
  }
}
