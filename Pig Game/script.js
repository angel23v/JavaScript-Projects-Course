'use strict';

const newGame = document.querySelector('.btn--new');
const player0 = document.querySelector('.player--0');
const player1 = document.querySelector('.player--1');
const hold = document.querySelector('.btn--hold');
const dice = document.querySelector('.btn--roll');
const img = document.querySelector('.dice');

let score1 = document.getElementById('score--0');
let score2 = document.getElementById('score--1');

let currentScore1 = document.getElementById('current--0');
let currentScore2 = document.getElementById('current--1');

let aux = 0;
let playing = true;
img.classList.add('hidden');

const reset = function () {
  score1.textContent = 0;
  score2.textContent = 0;
  currentScore1.textContent = 0;
  currentScore2.textContent = 0;
  player0.classList.add('player--active');
  player1.classList.remove('player--active');
  aux = 0;
  img.classList.add('hidden');
  // dice.classList.remove('hidden');
  // hold.classList.remove('hidden');
  playing = true;
  player0.classList.remove('player--winner');
  player1.classList.remove('player--winner');
};

const random = function () {
  return Math.trunc(Math.random() * 6 + 1);
};

const images = function (number) {
  img.src = `dice-${number}.png`;
};

const hidden = function () {
  img.classList.remove('hidden');
};

const changePlayer = function (currentScore, player, player2) {
  if (playing) {
    let r = random();
    aux += r;
    currentScore.textContent = aux;

    if (r === 1) {
      player.classList.remove('player--active');
      currentScore.textContent = 0;
      player2.classList.add('player--active');
      aux = 0;
      images(r);
    }
    hidden();
    images(r);
  }
};

const changeClases = function (player, player1) {
  if (player.classList.contains('player--active') || r === 1)
    player.classList.remove('player--active');
  player1.classList.add('player--active');
};

const up = function (score, currentScore, player, player1) {
  if (playing) {
    let aux1 = 0;
    let aux2 = 0;

    aux1 = Number(currentScore.textContent);
    aux2 = Number(score.textContent);
    aux2 += aux1;

    score.textContent = aux2;

    if (aux2 >= 100) {
      player.classList.add('player--winner');
      // dice.classList.add('hidden');
      // hold.classList.add('hidden');
      playing = false;
    }

    currentScore.textContent = 0;
    aux = 0;
    changeClases(player, player1);
  }
};

newGame.addEventListener('click', reset);

dice.addEventListener('click', function () {
  if (
    player0.classList.contains('player--active')
      ? changePlayer(currentScore1, player0, player1)
      : changePlayer(currentScore2, player1, player0)
  );
});

hold.addEventListener('click', function () {
  if (
    player0.classList.contains('player--active')
      ? up(score1, currentScore1, player0, player1)
      : up(score2, currentScore2, player1, player0)
  );
});
