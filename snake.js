// <- 0 ^ 1 -> 2 down 3
var LEFT = 0;
var UP = 1;
var RIGHT = 2;
var DOWN = 3;

var min = 0;
var max = 500;
var score = 0;

var snakelets = [{
  x: Math.floor((max / 2) / 10) * 10,
  y: Math.floor((max / 2) / 10) * 10
}];
var foods = {};

function clamp(val) {
  if (val < min) {
    return max;
  } else if (val >= max) {
    return min;
  } else {
    return val;
  }
}

// size 10x10
function moveSnake(dir) {
  var slast = snakelets.pop();
  if (snakelets.length > 0) {
    var first = snakelets[0];
  } else {
    var first = slast;
  }

  s = {};
  s.x = first.x;
  s.y = first.y;
  switch(dir) {
    case LEFT:
      s.x = clamp(s.x - 10);
      break;
    case UP:
      s.y = clamp(s.y - 10);
      break;
    case DOWN:
      s.y = clamp(s.y + 10);
      break;
    case RIGHT:
      s.x = clamp(s.x + 10);
      break;
  }
  snakelets.unshift(s);
  checkFood(slast);
  checkDeath();
  checkWin();
  redraw();
}

function checkFood(slast) {
  var snakelet = snakelets[0];
  var foodkey = JSON.stringify({x: snakelet.x, y: snakelet.y});
  if (foodkey in foods) {
    delete foods[foodkey];
    score += 1;
    snakelets.push({x: slast.x, y: slast.y});
  }
}


function getRandomInt (min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function checkDeath() {
  var pos = {};
  var dead = false;
  for (i in snakelets) {
    var snakekey = JSON.stringify(snakelets[i]);
    if (snakekey in pos) {
      dead = true;
    } else {
      pos[snakekey] = snakelets[i];
    }
  }

  if (dead) {
    score = 0;
    alert('A loserar is you');
    resetGame();
  }
}

function checkWin() {
  function isEmptyObject(obj) {
    var name;
    for (name in obj) {
      return false;
    }
    return true;
  }
  if (isEmptyObject(foods)) {
    alert("a winrar is you");
    resetGame();
  }
}


function redraw() {
  var c = document.getElementById('mycanvas');
  var ctx = c.getContext("2d");
  ctx.clearRect(min, min, max * 2, max * 2)
  ctx.fillStyle = "#000000";
  for (i in snakelets) {
    var snakelet = snakelets[i];
    ctx.fillRect(snakelet.x,snakelet.y,9,9);
  }

  ctx.fillStyle = "#00FF00";
  for (indices in foods) {
    var loc = JSON.parse(indices);
    ctx.fillRect(loc.x,loc.y,9,9);
  }

  var scoreEl = document.getElementById('score');
  scoreEl.innerHTML = score;
}

var dir = LEFT;

function genFood() {
  for (var i = 0; i < 100; i++) {
    var foodLoc = {};
    foodLoc.x = Math.floor(getRandomInt(min,max) / 10) * 10;
    foodLoc.y = Math.floor(getRandomInt(min,max) / 10) * 10;
    foods[JSON.stringify(foodLoc)] = foodLoc;
    1 / 0;
  }
}
genFood();

setInterval(function() {
  moveSnake(dir);
}, 100);


window.onkeydown = function(e) {
  console.log(e);
  switch (e.keyCode) {
  case 65:
    dir = LEFT;
    break;
  case 87:
    dir = UP;
    break;
  case 68:
    dir = RIGHT;
    break;
  case 83:
    dir = DOWN;
    break;
  } 
};

function resetGame() {
  foods = {};
  genFood();
  snakelets = [{
    x: Math.floor((max / 2) / 10) * 10,
    y: Math.floor((max / 2) / 10) * 10
  }];
}
