var canvas = document.getElementById("myCanvas");
canvas.width = 1200;
canvas.height = 750;
var ctx = canvas.getContext("2d");
ctx.fillStyle = "grey";
canvas.addEventListener("click", returnclick);
let btn = document.getElementById("clear");
btn.addEventListener("click", reset);
objects = [];
let gx = 590;
let bf = 0;
let hits = 0;
let misses = 0;
let outputEl = document.getElementById("output");
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
  // for (var i = 0; i < objects.length; i++) {
  //   objects[i].update();
  //   for (var j = i + 1; j < objects.length; j++) {
  //     if (areColliding(objects[i], objects[j])) {
  //       var Pinitialx =
  //         objects[i].vx * objects[i].m + objects[j].vx * objects[j].m;
  //       var Pinitialy =
  //         objects[i].vy * objects[i].m + objects[j].vy * objects[j].m;
  //       var v1fx =
  //         (Pinitialx - objects[j].m * (objects[i].vx - objects[j].vx)) /
  //         (objects[i].m + objects[j].m);
  //       var v2fx =
  //         (Pinitialx - objects[i].m * (objects[j].vx - objects[i].vx)) /
  //         (objects[i].m + objects[j].m);
  //       var v1fy =
  //         (Pinitialy - objects[j].m * (objects[i].vy - objects[j].vy)) /
  //         (objects[i].m + objects[j].m);
  //       var v2fy =
  //         (Pinitialy - objects[i].m * (objects[j].vy - objects[i].vy)) /
  //         (objects[i].m + objects[j].m);
  //       objects[i].vx = v1fx;
  //       objects[i].vy = v1fy;
  //       objects[j].vx = v2fx;
  //       objects[j].vy = v2fy;
  //       var dx = objects[i].x - objects[j].x;
  //       var dy = objects[i].y - objects[j].y;
  //       var distance = Math.sqrt(dx ** 2 + dy ** 2);
  //       var overlap = objects[i].r + objects[j].r - distance;
  //       if (overlap > 0) {
  //         var angle = Math.atan2(dx, dy);
  //         objects[i].x += (Math.sin(angle) * overlap) / 2;
  //         objects[j].x -= (Math.sin(angle) * overlap) / 2;
  //         objects[i].y += (Math.cos(angle) * overlap) / 2;
  //         objects[j].y -= (Math.cos(angle) * overlap) / 2;
  //       }
  //     }
  //   }
  // }
}

Object.prototype.update = function () {
  //safety
  if (this.c == "ball") {
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
    if (objects[i].c == "OfB") {
      objects.splice(i, 1);
    }
    if (objects[i].c == "hit") {
      objects.splice(i, 1);
    }

    //objects[i].update();
  }

  update();
  Gun_update();
  kill();
  accuracy();
}

animate();

function accuracy() {
  outputEl.innerHTML = `shots fired: ${bf} | shots Hit: ${hits} | shots Missed: ${misses} | Accuracy: ${
    hits / bf
  }`;
}
function kill() {
  for (var i = 0; i < objects.length; i++) {
    objects[i].update();
    if (objects[i].y < 0 + objects[i].r && objects[i].c == "bullet") {
      objects[i].c = "OfB";
      misses++;
    }
    for (var j = i + 1; j < objects.length; j++) {
      if (areColliding(objects[i], objects[j])) {
        if (objects[i].c == "bullet" || objects[j].c == "bullet") {
          objects[i].c = "hit";
          objects[j].c = "hit";
          hits++;
        }
      }
    }
  }
}

function initialize() {
  //[m, r, vx, vy]
  return [20, Math.random() * 50, Math.random() * 5, Math.random() * 5];
}
for (let _ = 0; _ < 20; _++) {
  objects.push(new Object(gx + 10, 600, 0, -10, 100, 5, "ball"));
}
function areColliding(obj1, obj2) {
  var dx = obj1.x - obj2.x;
  var dy = obj1.y - obj2.y;
  var distance = Math.sqrt(dx ** 2 + dy ** 2);
  return distance <= obj1.r + obj2.r;
}

// create Obj
function Object(x, y, vx, vy, m, r, c, n) {
  this.x = x;
  this.y = y;
  this.vx = vx;
  this.vy = vy;
  this.m = m;
  this.r = r;
  this.c = c;
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
  num = objects.length;
  if (spaceispressed) {
    objects.push(new Object(gx + 10, 600, 0, -10, 100, 5, "bullet"));
    bf++;
    spaceispressed = false;
  }
}

function reset() {
  bf = 0;
  hits = 0;
  misses = 0;
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
