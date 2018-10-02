'use strict';

var map = [];
var shadow = [];
var visibility = [7, 5, 3];
var mapSize = [10000, 20000, 30000];
var scores = [1000, 1500, 2000];
var pits = [3, 5, 7];
var COLS = 80;
var ROWS = 60;
var canvas = document.getElementById('grid');
var context = canvas.getContext('2d');
var busyCoordinates = [];
var player;
var startCoords;
var ladder;
var gem;
var pit = [];
var isShadowToggled = true;
var directions = [-1, 0, 1];
var errors = 0;
var maxErrorsCount = 1000;
var minimumTilesAmount = 1000;
var usernameForm = document.getElementById('username');
var difficulty = parseInt(localStorage.getItem('difficulty'));
usernameForm.addEventListener('submit', handleSubmit);
function Player(userName, coords, score) {
  this.userName = userName;
  this.coords = coords;
  this.score = score;
}
function Ladder(coords) {
  this.coords = coords;
}
function Gem(coords, appear) {
  this.coords = coords;
  this.appear = appear;
}
function Pit(coords) {
  this.coords = coords;
}


function startGame(name) {
  createMap(mapSize[difficulty]);
  setTimeout(gameSetUp(), 1000);
  function gameSetUp() {
    generatePlayer(name);
    generateLadder();
    generateGem();
    generatePit();
    addShadow(visibility[difficulty]);
    drawMap(0, 0, COLS, ROWS);
  }
  document.addEventListener('keydown', keyboardInputHandler, false);
}

function createMap(mapSize) {
  for (var row = 0; row < ROWS; row++) {
    map.push([]);
    for (var col = 0; col < COLS; col++) {
      map[row].push(0);
    }
  }
  var tiles = 0;
  var x = COLS/2;
  var y = ROWS/2;
  for (var i = 0; i < mapSize; i++) {
    var increment = directions[Math.floor(Math.random() * directions.length)];
    if (Math.random() < 0.5) {
      x += increment;
      while (x <= 3 || x >= COLS - 4) {
        x += directions[Math.floor(Math.random() * directions.length)];
        errors++;
        if (errors > maxErrorsCount) {
          if (tiles < minimumTilesAmount) {
            x = COLS / 2;
            y = ROWS / 2;
          } else {
            return;
          }
        }
      }
    } else {
      y += increment;
      while (y <= 3 || y >= ROWS - 4) {
        y += directions[Math.floor(Math.random() * directions.length)];
        errors++;
        if (errors > maxErrorsCount) {
          if (tiles < minimumTilesAmount) {
            x = COLS / 2;
            y = ROWS / 2;
          } else {
            return;
          }
        }
      }
    }
    if (map[y][x] !== 1) {
      map[y][x] = 1;
      tiles++;
    }
    errors = 0;
  }
}

function generatePlayer(name) {
  var coords = generateValidCoords();
  startCoords = coords;
  player = new Player(name, coords, scores[difficulty]);
  addObjToMap(player.coords, 2);
}

function generateLadder() {
  var coords = generateValidCoords();
  ladder = new Ladder(coords);
  addObjToMap(ladder.coords, 4);
}

function generateGem() {
  var coords = generateValidCoords();
  gem = new Gem(coords, true);
  addObjToMap(gem.coords, 3);
}

function generatePit() {
  for( var i = 0; i < pits[difficulty]; i++) {
    var coords = generateValidCoords();
    pit.push(new Pit(coords));
    addObjToMap(pit[i].coords, 1);
  }
}

function generateValidCoords() {
  var x = Math.floor(Math.random() * COLS);
  var y = Math.floor(Math.random() * ROWS);
  while (!areCoordsFree(x, y)) {
    x = Math.floor(Math.random() * COLS);
    y = Math.floor(Math.random() * ROWS);
  }
  return {
    x: x,
    y: y
  };
}

function areCoordsFree(x, y) {
  if (map[y][x] !== 1) {
    return false;
  }
  for (var i = 0; i < busyCoordinates.length; i++) {
    try {
      if (busyCoordinates[i].x === x && busyCoordinates[i].y === y) {
        return false;
      }
    } catch (e) {
      console.log('Error: ' + e);
    }
  }
  return true;
}

function addObjToMap(coords, identifier) {
  map[coords.y][coords.x] = identifier;
  addBusyCoords(coords.x, coords.y);
}

function addBusyCoords(x, y) {
  busyCoordinates.push({
    x: x,
    y: y
  });
}

function addShadow(difficulty) {
  var startX = player.coords.x - difficulty;
  var startY = player.coords.y - difficulty;
  var endX = player.coords.x + difficulty;
  var endY = player.coords.y + difficulty;
  for (var row = 0; row < ROWS; row++) {
    shadow.push([]);
    for (var col = 0; col < COLS; col++) {
      if (row >= startY && row <= endY && col >= startX && col <= endX) {
        shadow[row].push(1);
      } else {
        shadow[row].push(0);
      }
    }
  }
}

function drawMap(startX, startY, endX, endY) {
  var color;
  for (var row = startY; row < endY; row++) {
    for (var col = startX; col < endX; col++) {
      if (isShadowToggled && shadow[row][col] === 0) {
        drawObject(col, row, 'black');
      } else {
        switch (map[row][col]) {
        case 1:
          color = 'white';
          break;
        case 2:
          color = 'blue';
          break;
        case 3:
          color = 'purple';
          break;
        case 4:
          color = 'green';
          break;
        case 5:
          color = 'red';
          break;
        default:
          color = 'grey';
        }
        drawObject(col, row, color);
      }
    }
  }
}

function drawObject(x, y, color) {
  context.beginPath();
  context.rect(x * 10, y * 10, 10, 10);
  context.fillStyle = color;
  context.fill();
}

function keyboardInputHandler(e) {
  e.preventDefault();
  var x = player.coords.x;
  var y = player.coords.y;
  var oldX = player.coords.x;
  var oldY = player.coords.y;
  switch (e.key) {
  case 'ArrowLeft': //left
    x--;
    console.log('Key pressed e.key');
    break;
  case 'a': //left
    x--;
    break;
  case 'ArrowUp': // up
    y--;
    break;
  case 'w': // up
    y--;
    break;
  case 'ArrowRight': // right
    x++;
    break;
  case 'd': // right
    x++;
    break;
  case 'ArrowDown': // down
    y++;
    break;
  case 's': // down
    y++;
    break;
  default:
    return;
  }
  if(map[y][x] !== 0) {
    player.score = player.score - 5;
    for(var i = 0; i < pits[difficulty]; i++) {
      if(x === pit[i].coords.x && y === pit[i].coords.y) {
        isShadowToggled = false;
        x = startCoords.x;
        y = startCoords.y;
        isShadowToggled = true;
      }
    }
    updatePlayerPosition(player.coords.x, player.coords.y, x, y, visibility[difficulty]);
    drawMap(oldX - visibility[difficulty] - 1, oldY - visibility[difficulty] - 1, x + visibility[difficulty] + 2, y + visibility[difficulty] + 2);
    addShadow(visibility[difficulty]);
    if(x === gem.coords.x && y === gem.coords.y) {
      player.score = player.score + 500;
    }
    if(x === ladder.coords.x && y === ladder.coords.y) {
      alert('You WON! Your score was ' + player.score);
    }
  }
}

function handleSubmit(e) {
  e.preventDefault();
  var username = e.target.name.value;
  usernameForm.setAttribute('class', 'hidden');
  startGame(username);
}

function updatePlayerPosition(oldX, oldY, newX, newY, difficulty) {
  removeObject(oldX, oldY);
  map[newY][newX] = 2;
  player.coords = {x : newX, y : newY};
  var startX = (oldX - difficulty) < 0 ? 0 : oldX - difficulty;
  var startY = (oldY - difficulty) < 0 ? 0 : oldY - difficulty;
  var endX = (newX + difficulty) >= COLS ? COLS - 1 : newX + difficulty;
  var endY = (newY + difficulty) >= ROWS ? ROWS - 1 : newY + difficulty;
  if (oldX > newX) {
    startX = newX - difficulty;
    endX = oldX + difficulty;
  }
  if (oldY > newY) {
    startY = newY - difficulty;
    endY = oldY + difficulty;
  }
  for (var row = startY; row <= endY; row++) {
    for (var col = startX; col <= endX; col++) {
      if (row >= newY - difficulty && row <= newY + difficulty && col >= newX - difficulty && col <= newX + difficulty) {
        shadow[row][col] = 1;
      } else {
        shadow[row][col] = 0;
      }
    }
  }
}

function removeObject(x, y) {
  map[y][x] = 1;
}
