var map = [];
var rooms = 0;
var shadow = [];
var visibility = 3;
var COLS = 80;
var ROWS = 60;
var canvas = document.getElementById("grid");
var context = canvas.getContext("2d");
var busyCoordinates = [];
var player;
var isShadowToggled = true;
var directions = [-1, 0, 1];
var errors = 0;
var maxErrorsCount = 1000;
var minimumTilesAmount = 1000;
class Player {
  constructor(level, health, coords, xp) {
    this.level = level;
    this.health = health;
    this.coords = coords;
    this.xp = xp;
  }
}
  
startGame()
  
function startGame() {
  createMap();
  setTimeout(gameSetUp(), 1000)
  function gameSetUp() {
    generatePlayer();
    addShadow();
    drawMap(0, 0, COLS, ROWS);
  }
    
}
  
function createMap() {
  for (var row = 0; row < ROWS; row++) {
    map.push([]);
    for (var col = 0; col < COLS; col++) {
      map[row].push(0);
    }
  }
  var tiles = 0;
  var x = COLS/2;
  var y = ROWS/2;
  for (var i = 0; i < 30000; i++) {
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
    if (map[y][x] != 1) {
      map[y][x] = 1;
      tiles++
    }
    errors = 0;
  }
    
};
  
function addShadow() {
  var startX = (player.coords.x - visibility) < 0 ? 0 : player.coords.x - visibility;
  var startY = (player.coords.y - visibility) < 0 ? 0 : player.coords.y - visibility;
  var endX = (player.coords.x + visibility) >= COLS ? COLS - 1 : player.coords.x + visibility;
  var endY = (player.coords.y + visibility) >= ROWS ? ROWS - 1 : player.coords.y + visibility;
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
      if (isShadowToggled && shadow[row][col] == 0) {
        drawObject(col, row, "black");
      } else {
        switch (map[row][col]) {
        case 1:
          color = "white";
          break;
        case 2:
          color = "blue";
          break;
        case 3:
          color = "red";
          break;
        case 4:
          color = "green";
          break;
        case 5:
          color = "orange";
          break;
        default:
          color = "grey";
        }
        drawObject(col, row, color);
      } 
    }
  }
}
  
function areCoordsFree(x, y) {
  if (map[y][x] != 1) {
    return false;
  }
  for (var i = 0; i < busyCoordinates.length; i++) {
    try {
      if (busyCoordinates[i].x == x && busyCoordinates[i].y == y) {
        return false;
      }
    } catch (e) {
      console.log("Error: " + e);
    }
  }
  return true;
}
  
  
function addBusyCoords(x, y) {
  busyCoordinates.push({
    x: x,
    y: y
  });
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
  
function generatePlayer() {
  var coords = generateValidCoords();
  player = new Player(1, 100, coords, 30);
  addObjToMap(player.coords, 2);
}

function addObjToMap(coords, identifier) {
  map[coords.y][coords.x] = identifier;
  addBusyCoords(coords.x, coords.y);
}
  
function drawObject(x, y, color) {
  context.beginPath();
  context.rect(x * 10, y * 10, 10, 10);
  context.fillStyle = color;
  context.fill();
}

$(document).keydown(function(e) {
  var x = player.coords.x;
  var y = player.coords.y;
  var oldX = player.coords.x;
  var oldY = player.coords.y;
  switch (e.which) {
  case 37: //left
    x--;
    break;
  case AA: 
    x--;
  case 38: // up
    y--;
    break;
  case 39: // right
    x++;
    break;
  case 40: // down
    y++;
    break;
  default:
    return;
  }
  if(map[y][x] != 0) {
    if (map[y][x] == 4) {
      player.health += POTIONS[Math.floor(Math.random() * POTIONS.length)];
      removeObjFromMap(x, y);
    } else if (map[y][x] == 5) {
      player.weapon = WEAPONS[Math.floor(Math.random() * WEAPONS.length)];
      removeObjFromMap(x, y);
    }
    updatePlayerPosition(player.coords.x, player.coords.y, x, y);
    drawMap(oldX - visibility - 1, oldY - visibility - 1, x + visibility + 2, y + visibility + 2);
  }
  e.preventDefault();
});
  
function resetGame() {
  busyCoordinates = [];
  shadow = [];
  map = [];
}
  
function userWins() {
  alert("YOU CONQUERED THE DUNGEON!");
  resetGame();
  startGame();
};
  
function gameOver() {
  alert("GAME OVER");
  resetGame();
  startGame();
};
  
function removeObjFromMap(x, y) {
  map[y][x] = 1;
};
  
function updatePlayerPosition(oldX, oldY, newX, newY) {
  removeObjFromMap(oldX, oldY);
  map[newY][newX] = 2;
  player.coords = {x : newX, y : newY};
    
  var startX = (oldX - visibility) < 0 ? 0 : oldX - visibility;
  var startY = (oldY - visibility) < 0 ? 0 : oldY - visibility;
  var endX = (newX + visibility) >= COLS ? COLS - 1 : newX + visibility;
  var endY = (newY + visibility) >= ROWS ? ROWS - 1 : newY + visibility;
    
  if (oldX > newX) {
    startX = newX - visibility;
    endX = oldX + visibility;
  }
  if (oldY > newY) {
    startY = newY - visibility;
    endY = oldY + visibility;
  }
  for (var row = startY; row <= endY; row++) {
    for (var col = startX; col <= endX; col++) {
      if (row >= newY - visibility && row <= newY + visibility && col >= newX - visibility && col <= newX + visibility) {
        shadow[row][col] = 1;
      } else {
        shadow[row][col] = 0;
      }
    }
  }
}
  
function toggleShadow() {
  isShadowToggled = !isShadowToggled;
  drawMap(0, 0, COLS, ROWS);
}