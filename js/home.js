var gameSelect = document.getElementById('game-select');
var leaderboardButton = document.getElementsByClassName('button')[2];

gameSelect.addEventListener('click', difficutlySelected);
leaderboardButton.addEventListener('click', viewLeaderboard);

function difficutlySelected(e) {
  var selected = e.target.alt;
  console.log(selected);
  switch (selected) {
  case 'easy':
    localStorage.setItem('difficulty', 0);
    break;
  case 'medium':
    localStorage.setItem('difficulty', 1);
    break;
  case 'hard':
    localStorage.setItem('difficulty', 2);
    break;
  }
}

function viewLeaderboard() {
  var modal = document.getElementsByClassName('modal-body')[1];
  modal.innerHTML = '';
  if (localStorage.getItem('leaderboard')) {
    leaderboard = JSON.parse(localStorage.getItem('leaderboard'));
    var board = document.createElement('table');
    var newRow = document.createElement('tr');
    var newTh = document.createElement('th');
    newTh.textContent = 'Username';
    newRow.appendChild(newTh);
    newTh = document.createElement('th');
    newTh.textContent = 'Score';
    newRow.appendChild(newTh);
    board.appendChild(newRow);
    modal.appendChild(board);
    for (var i = 0; i < leaderboard.length; i++) {
      newRow = document.createElement('tr');
      var newUser = document.createElement('td');
      var newScore = document.createElement('td');
      newUser.textContent = leaderboard[i].name;
      newScore.textContent = leaderboard[i].score;
      newRow.appendChild(newUser);
      newRow.appendChild(newScore);
      board.appendChild(newRow);
    }
  }
  else {
    var noBoard = document.createElement('p');
    noBoard.textContent = 'There is currently no high scores saved. Go play a game to see you name here!';
    modal.appendChild(noBoard);
  }
}
