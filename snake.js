// <- 0 ^ 1 -> 2 down 3
var LEFT = 0;
var UP = 1;
var RIGHT = 2;
var DOWN = 3;
var IN = 4;
var OUT = 5;

var min = 0;
var max = 500;
var score = 0;

var snakelets = [{
  x: Math.floor((max / 2) / 10) * 10,
  y: Math.floor((max / 2) / 10) * 10, 
  z: Math.floor((max / 2) / 10) * 10
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
  s.z = first.z;
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
    case IN:
      s.z = clamp(s.z - 10);
      break;
    case OUT:
      s.z = clamp(s.z + 10);
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
  var foodkey = JSON.stringify({x: snakelet.x, y: snakelet.y, z: snakelet.z});
  if (foodkey in foods) {
    delete foods[foodkey];
    score += 1;
    snakelets.push({x: slast.x, y: slast.y, z: slast.z});
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
  //var c = document.getElementById('mycanvas');
  //var ctx = c.getContext("2d");
  var c = document.getElementById('mycanvas');
  var gl = c.getContext('webgl');
  gl.clearColor(1.0,1.0,1.0,1.0);
  gl.enable(gl.DEPTH_TEST); 
  gl.depthFunc(gl.LEQUAL); 
  gl.clear(gl.COLOR_BUFFER_BIT|gl.DEPTH_BUFFER_BIT);

  var width = 9;

  gl_FragColor = [0.0, 0.0, 0.0, 1.0];
 
  for (i in snakelets) {
    var snakelet = snakelets[i];
    var x = snakelet.x;
    var y = snakelet.y;
    var z = snakelet.z;

    var vertices = [
      x, y, z,
      x, y, z + width,
      x, y + width, z,
      x, y + width, z + width,
      x + width, y, z,
      x + width, y, z + width,
      x + width, y + width, z,
      x + width, y + width, z + width
    ];

    var snakebuffer = gl.createBuffer();
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, snakebuffer);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);
    gl.drawElements(gl.TRIANGLES, 36, gl.UNSIGNED_SHORT, 0);
  }

  gl_FragColor = [0.0, 1.0, 0.0, 1.0];
  for (indices in foods) {
    var loc = JSON.parse(indices);
    var x = loc.x;
    var y = loc.y;
    var z = loc.z;
    var vertices = [
      x, y, z,
      x, y, z + width,
      x, y + width, z,
      x, y + width, z + width,
      x + width, y, z,
      x + width, y, z + width,
      x + width, y + width, z,
      x + width, y + width, z + width
    ];

    var foodbuffer = gl.createBuffer();
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, foodbuffer);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);
    gl.drawElements(gl.TRIANGLES, 36, gl.UNSIGNED_SHORT, 0);
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
