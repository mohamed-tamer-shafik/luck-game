'use strict';
//state variables declaration starts
let gameMode,
  currentScore = 0,
  currentPlayer = 0,
  totalScores = [0, 0],
  isGameEnded = false;
//state variables declaration ends
//variables to clear timeout on game resetting
let holdClear, pushClear;
//functions for element or elements selection only need element/elements selector as an argument
const selectElement = selector => document.querySelector(selector);
const selectElements = selector => document.querySelectorAll(selector);
//selecting required dom element to be manipulated starts
//El at the end of each variable indicates that this variable stores a dom element
const btnHowToPlayEl = selectElement('.how-to-play');
const overlayEl = selectElement('.overlay');
const popUpEl = selectElement('.pop-up');
const btnCloseEl = selectElement('.fa-x');
const gameModesEl = selectElements('.game-mode');
const gameModesMenuEl = selectElement('.game-modes');
const gameContainerEl = selectElement('.container');
const btnReturnEl = selectElement('.return');
const btnPushCurrentEl = selectElement('.push-current');
const btnHoldCurrentEl = selectElement('.hold-current');
const randomNumberWindowEl = selectElement('.random-number');
const btnNewGame = selectElement('.new-game');
const gameButtons = selectElements('.game-buttons button');
//selecting required dom element to be manipulated ends
//handeling button clicking animation
gameButtons.forEach(function (button) {
  button.addEventListener('click', function () {
    button.classList.add('btn-animation');
    setTimeout(() => button.classList.remove('btn-animation'), 350);
  });
});
//function for swtiching between pages
const pageSwitch = function () {
  btnReturnEl.classList.toggle('hidden');
  gameModesMenuEl.classList.toggle('hidden');
  gameContainerEl.classList.toggle('hidden');
};
//function to control buttons appearance when switching between player in computure mode
const toggleButtons = function () {
  btnPushCurrentEl.classList.toggle('hidden');
  btnHoldCurrentEl.classList.toggle('hidden');
};
//function for switching acitve player between player
const switchActive = function () {
  currentScore = 0;
  selectElement(`.player${currentPlayer}-current-score`).textContent =
    currentScore;
  selectElement(`.playerbox-${currentPlayer}`).classList.remove('active');
  currentPlayer = currentPlayer === 0 ? 1 : 0;
  selectElement(`.playerbox-${currentPlayer}`).classList.add('active');
  if (gameMode === 'c' && currentPlayer === 1) {
    toggleButtons();
    pushClear = setTimeout(pushCurrent, 1500);
  } else if (gameMode === 'c' && currentPlayer === 0) {
    toggleButtons();
  }
};
//handeling pop-up display
btnHowToPlayEl.addEventListener('click', function () {
  overlayEl.classList.remove('hidden');
  popUpEl.classList.remove('hidden');
});
//handeling pop-up hidding
const hidePopUp = function () {
  overlayEl.classList.add('hidden');
  popUpEl.classList.add('hidden');
};
//hidding the pop-up when click close button
btnCloseEl.addEventListener('click', hidePopUp);
//hidding the pop-up when click on the overlay
overlayEl.addEventListener('click', hidePopUp);
//handeling switch from game modes page to the game page
gameModesEl.forEach(function (mode) {
  mode.addEventListener('click', function (e) {
    gameMode = e.target.dataset.mode;
    selectElement('.first-player-name').textContent =
      gameMode === 'c' ? 'You' : 'Player 1';
    selectElement('.second-player-name').textContent =
      gameMode === 'c' ? 'Computer' : 'Player 2';
    pageSwitch();
  });
});
//push current event handler
const pushCurrent = function () {
  if (!isGameEnded) {
    //generating random number between 1 and 6
    const randomNumber = Math.trunc(Math.random() * 6) + 1;
    randomNumberWindowEl.classList.remove('hidden');
    randomNumberWindowEl.textContent = randomNumber;
    if (randomNumber === 1) switchActive();
    else {
      currentScore += randomNumber;
      selectElement(`.player${currentPlayer}-current-score`).textContent =
        currentScore;
      if (gameMode === 'c' && currentPlayer === 1) {
        const decesion = Math.trunc(Math.random() * 4) + 1;
        if (decesion === 1) holdClear = setTimeout(holdCurrent, 1500);
        else pushClear = setTimeout(pushCurrent, 1500);
      }
    }
  }
};
//handeling clicking on push current button
btnPushCurrentEl.addEventListener('click', pushCurrent);
//hold currrent event handler
const holdCurrent = function () {
  if (!isGameEnded) {
    totalScores[currentPlayer] += currentScore;
    selectElement(`.player${currentPlayer}-total-score`).textContent =
      totalScores[currentPlayer];
    if (totalScores[currentPlayer] >= 60) {
      selectElement(`.playerbox-${currentPlayer}`).classList.remove('active');
      selectElement(`.playerbox-${currentPlayer}`).classList.add('winner');
      isGameEnded = true;
    } else switchActive();
  }
};
//handeling clicking on hold button
btnHoldCurrentEl.addEventListener('click', holdCurrent);
//function for game resetting
const gameReset = function () {
  clearTimeout(pushClear);
  clearTimeout(holdClear);
  selectElement(`.playerbox-${currentPlayer}`).classList.remove('winner');
  isGameEnded = false;
  selectElement(`.playerbox-${currentPlayer}`).classList.remove('active');
  randomNumberWindowEl.classList.add('hidden');
  btnHoldCurrentEl.classList.remove('hidden');
  btnPushCurrentEl.classList.remove('hidden');
  currentScore = 0;
  selectElement(`.player${currentPlayer}-current-score`).textContent =
    currentScore;
  currentPlayer = 0;
  selectElement(`.playerbox-${currentPlayer}`).classList.add('active');
  totalScores = [0, 0];
  selectElement(`.player0-total-score`).textContent = 0;
  selectElement(`.player1-total-score`).textContent = 0;
};
//handeling return click
btnReturnEl.addEventListener('click', function () {
  pageSwitch();
  gameReset();
});
//handeling new game button
btnNewGame.addEventListener('click', gameReset);
