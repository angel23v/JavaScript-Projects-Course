'use strict';

// console.log(document.querySelector('.message').textContent);
// document.querySelector('.message').textContent = 'Correct Number!';
// console.log(document.querySelector('.message').textContent);

// document.querySelector('.number').textContent = '?';

// document.querySelector('.guess').value = 23;
// console.log(document.querySelector('.guess').value);

const btn = document.querySelector('.check');

const secretNumber = function () {
  return Math.trunc(Math.random() * 20 + 1);
};

let random = secretNumber();

const displayMsg = function (message) {
  return (document.querySelector('.message').textContent = message);
};

btn.addEventListener('click', function () {
  const input = Number(document.querySelector('.guess').value);
  // console.log(`${input} ${typeof input}`);
  let highScore = document.querySelector('.highscore');
  let score = document.querySelector('.score');
  let backG = document.querySelector('body');

  if (!input) {
    displayMsg('No number! 😠');
  } else if (input === random) {
    displayMsg('Correct Number!');
    document.querySelector('.number').textContent = random;

    if (score.textContent > highScore.textContent) {
      highScore.textContent = score.textContent;
      backG.style.backgroundColor = '#60b347';
    }
    backG.style.backgroundColor = '#60b347';
  } else if (score.textContent > 1) {
    displayMsg(input > random ? 'Too High! 😢' : 'Too Low! 😞');
    score.textContent = score.textContent - 1;
  } else {
    document.querySelector('.number').textContent = random;
    displayMsg('You lost the game 🤣 ');
    const input = Number((document.querySelector('.guess').value = ''));
    backG.style.backgroundColor = '#ff0000';
  }
});

const again = document.querySelector('.again');

again.addEventListener('click', function () {
  let highScore = document.querySelector('.highscore');
  let score = document.querySelector('.score');
  let backG = document.querySelector('body');

  if (score.textContent == 0) {
    score.textContent = 20;
    highScore.textContent = highScore.textContent;
  }
  displayMsg('Start Guessing...');
  document.querySelector('.number').textContent = '?';
  random = secretNumber();
  const input = Number((document.querySelector('.guess').value = ''));
  score.textContent = 20;
  // }
  backG.style.backgroundColor = '#222';
});
