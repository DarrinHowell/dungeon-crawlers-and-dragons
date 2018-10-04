'use strict';

var map = [];
var shadow = [];
var visibility = [7, 5, 3];
var mapSize = [10000, 20000, 30000];
var scores = [1000, 1500, 2000];
var pits = [3, 5, 7];
var ladderCoordsRange = [8, 12, 16];
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
var isShadowToggled = false;
var directions = [-1, 0, 1];
var errors = 0;
var maxErrorsCount = 1000;
var minimumTilesAmount = 1000;
var usernameForm = document.getElementById('username');
var difficulty = parseInt(localStorage.getItem('difficulty'));
var leaderboard = [];
var scoreDisplay = document.getElementById('score');
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
  createMap(mapSize[difficulty], visibility[difficulty]);
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

function createMap(mapSize, border) {
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
      while (x <= (border + 1) || x >= COLS - (border + 1)) {
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
      while (y <= (border + 1) || y >= ROWS - (border + 1)) {
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
  console.log('Player Start Coords are :', startCoords);
  player = new Player(name, coords, scores[difficulty]);
  addObjToMap(player.coords, 2);
}

function resetPlayer(x, y) {
  drawObject(x, y, 'white');
  player.coords.x = x;
  player.coords.y = y;
  addObjToMap(player.coords, 2);
  wipeShadowAddShadow(visibility[difficulty]);
  drawMap(0, 0, COLS, ROWS);
}

function generateLadder() {
  var coords = generateValidLadderCoords();
  ladder = new Ladder(coords);
  console.log('ladder coords are: ', coords);
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

function generateValidLadderCoords() {
  var x = Math.floor(Math.random() * COLS);
  var y = Math.floor(Math.random() * ROWS);
  while (!areLadderCoordsFree(x, y)) {
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

function areLadderCoordsFree(x, y) {
  if (map[y][x] !== 1) {
    return false;
  }
  for(var i = 0; i < ladderCoordsRange[difficulty]; i++){
    if(player.coords.x + i === x ||
        player.coords.x - i === x ||
        player.coords.y + i === y ||
        player.coords.y - i === y){
      return false;
    }
  }
  for (var j = 0; j < busyCoordinates.length; j++) {
    try {
      if (busyCoordinates[j].x === x && busyCoordinates[j].y === y) {
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

function wipeShadowAddShadow(difficulty) {
  var startX = player.coords.x - difficulty;
  var startY = player.coords.y - difficulty;
  var endX = player.coords.x + difficulty;
  var endY = player.coords.y + difficulty;
  shadow = [];
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
    scoreDisplay.innerHTML = '<h2>Score: ' + player.score + '</h2>';
    if (player.score === 0) {
      endGame();
    }
    for(var i = 0; i < pits[difficulty]; i++) {
      if(x === pit[i].coords.x && y === pit[i].coords.y) {
        removeObject(oldX, oldY);
        x = startCoords.x;
        y = startCoords.y;
        resetPlayer(x, y);
        break;
      }
    }
    updatePlayerPosition(player.coords.x, player.coords.y, x, y, visibility[difficulty]);
    drawMap(oldX - visibility[difficulty] - 1, oldY - visibility[difficulty] - 1, x + visibility[difficulty] + 2, y + visibility[difficulty] + 2);
    if(x === gem.coords.x && y === gem.coords.y) {
      player.score = player.score + 500;
      scoreDisplay.innerHTML = '<h2>Score: ' + player.score + '</h2>';
    }
    if(x === ladder.coords.x && y === ladder.coords.y) {
      endGame();
    }
  }
}

function handleSubmit(e) {
  e.preventDefault();
  var username = e.target.name.value;
  usernameForm.setAttribute('class', 'hidden');
  scoreDisplay.removeAttribute('class');
  startGame(username);
  scoreDisplay.innerHTML = '<h2>Score: ' + player.score + '</h2>';
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

function Score(name, score) {
  this.name = name;
  this.score = score;
  leaderboard.push(this);
}

function endGame() {
  var existingUser = false;
  var div = document.getElementsByClassName('game-input2')[0];
  document.removeEventListener('keydown', keyboardInputHandler, false);
  if (player.score === 0) {
    div.innerHTML = '<p>You have run out of points and lost :(</p> <a href="index.html#howTo"><p>Play Again</p></a>';
    div.setAttribute('class', 'end-screen1');
  }
  else if (localStorage.getItem('leaderboard')) {
    leaderboard = JSON.parse(localStorage.getItem('leaderboard'));
    for (var i =0; i <leaderboard.length; i++) {
      if (leaderboard[i].name === player.userName) {
        existingUser = true;
        if (player.score > leaderboard[i].score) {
          div.innerHTML = '<p>Well done ' + player.userName + ', you earned a new high score of ' + player.score + '!</p> <a href="index.html#howTo"><p>Play Again</p></a>';
          div.setAttribute('class', 'end-screen2');
          leaderboard[i].score = player.score;
          sortScores();
          localStorage.setItem('leaderboard', JSON.stringify(leaderboard));
        }
        else if (player.score < leaderboard[i].score) {
          div.innerHTML = '<p>Well done ' + player.userName + '! You made it to the end and earned a score of ' + player.score + '. Your current high score is ' + leaderboard[i].score + '.</p> <a href="index.html#howTo"><p>Play Again</p></a>';
          div.setAttribute('class', 'end-screen3');
        }
        else {
          div.innerHTML = '<p>Well done ' + player.userName + '! You made it to the end and earned a score of ' + player.score + ', tying your high score.</p> <a href="index.html#howTo"><p>Play Again</p></a>';
          div.setAttribute('class', 'end-screen4');
        }
        break;
      }
    }

    if (!existingUser) {
      new Score(player.userName, player.score);
      sortScores();
      localStorage.setItem('leaderboard', JSON.stringify(leaderboard));
      div.innerHTML = '<p>Well done ' + player.userName + '! You made it to the end earned a score of ' + player.score + '!</p> <a href="index.html#howTo"><p>Play Again</p></a>';
      div.setAttribute('class', 'end-screen2');
    }
  }
  else {
    new Score(player.userName, player.score);
    localStorage.setItem('leaderboard', JSON.stringify(leaderboard));
    div.innerHTML = '<p>Well done ' + player.userName + '! You made it to the end earned a score of ' + player.score + '!</p> <a href="index.html#howTo"><p>Play Again</p></a>';
    div.setAttribute('class', 'end-screen2');
  }
}

function sortScores() {
  leaderboard.sort(function (a, b) {
    var scoreA = a.score;
    var scoreB = b.score;

    if (scoreA < scoreB) {
      return 1;
    }
    if (scoreA > scoreB) {
      return -1;
    }

    return 0;
  });
}
