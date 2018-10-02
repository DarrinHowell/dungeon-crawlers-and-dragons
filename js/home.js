var gameSelect = document.getElementById('game-select');

gameSelect.addEventListener('click', difficutlySelected);

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
