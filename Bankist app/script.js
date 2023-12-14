'use strict';

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// BANKIST APP

/////////////////////////////////////////////////
// Data

// DIFFERENT DATA! Contains movement dates, currency and locale

const account1 = {
  owner: 'Jonas Schmedtmann',
  movements: [200, 455.23, -306.5, 25000, -642.21, -133.9, 79.97, 1300],
  interestRate: 1.2, // %
  pin: 1111,

  movementsDates: [
    '2019-11-18T21:31:17.178Z',
    '2019-12-23T07:42:02.383Z',
    '2020-01-28T09:15:04.904Z',
    '2020-04-01T10:17:24.185Z',
    '2020-05-08T14:11:59.604Z',
    '2020-05-27T17:01:17.194Z',
    '2020-07-11T23:36:17.929Z',
    '2023-11-12T10:51:36.790Z',
  ],
  currency: 'EUR',
  locale: 'pt-PT', // de-DE
};

const account2 = {
  owner: 'Jessica Davis',
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,

  movementsDates: [
    '2019-11-01T13:15:33.035Z',
    '2019-11-30T09:48:16.867Z',
    '2019-12-25T06:04:23.907Z',
    '2020-01-25T14:18:46.235Z',
    '2020-02-05T16:33:06.386Z',
    '2020-04-10T14:43:26.374Z',
    '2020-06-25T18:49:59.371Z',
    '2020-07-26T12:01:20.894Z',
  ],
  currency: 'USD',
  locale: 'en-US',
};

const accounts = [account1, account2];

/////////////////////////////////////////////////
// Elements
const labelWelcome = document.querySelector('.welcome');
const labelDate = document.querySelector('.date');
const labelBalance = document.querySelector('.balance__value');
const labelSumIn = document.querySelector('.summary__value--in');
const labelSumOut = document.querySelector('.summary__value--out');
const labelSumInterest = document.querySelector('.summary__value--interest');
const labelTimer = document.querySelector('.timer');

const containerApp = document.querySelector('.app');
const containerMovements = document.querySelector('.movements');

const btnLogin = document.querySelector('.login__btn');
const btnTransfer = document.querySelector('.form__btn--transfer');
const btnLoan = document.querySelector('.form__btn--loan');
const btnClose = document.querySelector('.form__btn--close');
const btnSort = document.querySelector('.btn--sort');

const inputLoginUsername = document.querySelector('.login__input--user');
const inputLoginPin = document.querySelector('.login__input--pin');
const inputTransferTo = document.querySelector('.form__input--to');
const inputTransferAmount = document.querySelector('.form__input--amount');
const inputLoanAmount = document.querySelector('.form__input--loan-amount');
const inputCloseUsername = document.querySelector('.form__input--user');
const inputClosePin = document.querySelector('.form__input--pin');

/////////////////////////////////////////////////
// Functions
const formatMovemenDate = (date, locale) => {
  const calcDayPassed = (date1, date2) =>
    Math.round(Math.abs(date2 - date1) / (1000 * 60 * 60 * 24));

  const dayPassed = calcDayPassed(new Date(), date);

  if (dayPassed === 0) return 'Today';
  if (dayPassed === 1) return 'Yesterday';
  if (dayPassed <= 7) return `${dayPassed} days ago`;

  return new Intl.DateTimeFormat(locale).format(date);
};

const fomrastCur = function (value, locale, currency) {
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency: currency,
  }).format(value);
};

const displayMovements = function (acc, sort = false) {
  containerMovements.innerHTML = '';

  const movs = sort
    ? acc.movements.slice().sort((a, b) => a - b)
    : acc.movements;

  movs.forEach(function (mov, i) {
    const type = mov > 0 ? 'deposit' : 'withdrawal';

    let date = new Date(acc.movementsDates[i]);

    const displayDate = formatMovemenDate(date, acc.locale);

    const formatted = fomrastCur(mov, acc.locale, acc.currency);

    const html = `
      <div class="movements__row">
        <div class="movements__type movements__type--${type}">${
      i + 1
    } ${type}</div>
        <div class="movements__date">${displayDate}</div>
        <div class="movements__value">${formatted}</div>
      </div>
    `;

    containerMovements.insertAdjacentHTML('afterbegin', html);
  });
};

const calcDisplayBalance = function (acc) {
  acc.balance = acc.movements.reduce((acc, mov) => acc + mov, 0);

  labelBalance.textContent = fomrastCur(acc.balance, acc.locale, acc.currency);
};

const calcDisplaySummary = function (acc) {
  const incomes = acc.movements
    .filter(mov => mov > 0)
    .reduce((acc, mov) => acc + mov, 0);

  labelSumIn.textContent = fomrastCur(incomes, acc.locale, acc.currency);

  const out = acc.movements
    .filter(mov => mov < 0)
    .reduce((acc, mov) => acc + mov, 0);
  labelSumOut.textContent = fomrastCur(out, acc.locale, acc.currency);

  const interest = acc.movements
    .filter(mov => mov > 0)
    .map(deposit => (deposit * acc.interestRate) / 100)
    .filter((int, i, arr) => {
      // console.log(arr);
      return int >= 1;
    })
    .reduce((acc, int) => acc + int, 0);
  labelSumInterest.textContent = fomrastCur(interest, acc.locale, acc.currency);
};

const createUsernames = function (accs) {
  accs.forEach(function (acc) {
    acc.username = acc.owner
      .toLowerCase()
      .split(' ')
      .map(name => name[0])
      .join('');
  });
};
createUsernames(accounts);

const updateUI = function (acc) {
  // Display movements
  displayMovements(acc);

  // Display balance
  calcDisplayBalance(acc);

  // Display summary
  calcDisplaySummary(acc);
};

///////////////////////////////////////
const nowDate = new Date();
labelDate.textContent = new Intl.DateTimeFormat('en-US').format(nowDate);

// Event handlers
let currentAccount, timer;

const startLogOu = function () {
  const tick = function () {
    // Call the timer every second
    const min = String(Math.trunc(time / 60)).padStart(2, 0);
    const sec = String(time % 60).padStart(2, 0);

    //In each call, print the remaining time to UI
    labelTimer.textContent = `${min}:${sec}`;

    // When time equals 0, stop timer and log out user
    if (time == 0) {
      clearInterval(timer);
      labelWelcome.textContent = 'Log in to get started';
      containerApp.style.opacity = 0;
    }
    //Decrease 1 second
    time--;
  };
  // Setting time to 5 minutes
  let time = 120;

  tick();
  const timer = setInterval(tick, 1000);
  return timer;
};

btnLogin.addEventListener('click', function (e) {
  // Prevent form from submitting
  e.preventDefault();

  currentAccount = accounts.find(
    acc => acc.username === inputLoginUsername.value
  );
  console.log(currentAccount);

  if (currentAccount?.pin === +inputLoginPin.value) {
    // Display UI and message
    labelWelcome.textContent = `Welcome back, ${
      currentAccount.owner.split(' ')[0]
    }`;
    containerApp.style.opacity = 100;

    const nowDate = new Date();
    const options = {
      hour: 'numeric',
      minute: 'numeric',
      day: 'numeric',
      month: 'numeric',
      year: 'numeric',
      // weekday: 'short',
    };

    // const locale = navigator.language;

    labelDate.textContent = new Intl.DateTimeFormat(
      currentAccount.locale,
      options
    ).format(nowDate);

    // Clear input fields
    inputLoginUsername.value = inputLoginPin.value = '';
    inputLoginPin.blur();

    //Timer
    if (timer) clearInterval(timer);
    timer = startLogOu();
    // Update UI
    updateUI(currentAccount);
  }
});

btnTransfer.addEventListener('click', function (e) {
  e.preventDefault();
  const amount = +inputTransferAmount.value;
  const receiverAcc = accounts.find(
    acc => acc.username === inputTransferTo.value
  );
  inputTransferAmount.value = inputTransferTo.value = '';

  if (
    amount > 0 &&
    receiverAcc &&
    currentAccount.balance >= amount &&
    receiverAcc?.username !== currentAccount.username
  ) {
    // Doing the transfer
    currentAccount.movements.push(-amount);
    receiverAcc.movements.push(amount);

    currentAccount.movementsDates.push(new Date());
    receiverAcc.movementsDates.push(new Date());
    // Update UI
    updateUI(currentAccount);

    //Reset timer
    clearInterval(timer);
    timer = startLogOu();
  }
});

btnLoan.addEventListener('click', function (e) {
  e.preventDefault();

  const amount = +inputLoanAmount.value;

  const amountRounded = Math.round(amount);

  if (
    amountRounded > 0 &&
    currentAccount.movements.some(mov => mov >= amountRounded * 0.1)
  ) {
    setTimeout(function () {
      // Add movement
      currentAccount.movements.push(amountRounded);
      currentAccount.movementsDates.push(new Date().toISOString());

      // Update UI
      updateUI(currentAccount);

      //Reset timer
      clearInterval(timer);
      timer = startLogOu();
    }, 2500);
  }

  inputLoanAmount.value = '';
});

btnClose.addEventListener('click', function (e) {
  e.preventDefault();

  if (
    inputCloseUsername.value === currentAccount.username &&
    +inputClosePin.value === currentAccount.pin
  ) {
    const index = accounts.findIndex(
      acc => acc.username === currentAccount.username
    );
    console.log(index);
    // .indexOf(23)

    // Delete account
    accounts.splice(index, 1);

    // Hide UI
    containerApp.style.opacity = 0;
  }

  inputCloseUsername.value = inputClosePin.value = '';
});

let sorted = false;
btnSort.addEventListener('click', function (e) {
  e.preventDefault();
  displayMovements(currentAccount, !sorted);
  sorted = !sorted;
});

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// LECTURES

//Binary base 2-0 1
console.log(0.1 + 0.2);
console.log(0.1 + 0.2 === 0.3);

//String to Number
console.log(Number('23'));
console.log(+'23');

//Parsing
//The strings needs to star with a number // parseInt method
console.log(Number.parseInt('30px')); // Here JS gets the number(s) without weird symbols or anything which is not a number

//accepts second arguments called regex
console.log(Number.parseInt('30px', 10));

console.log(Number.parseInt('2.5rem', 10));
console.log(Number.parseFloat('2.5rem'));

// Check if values is not a number
console.log('IS NAN');
console.log(Number.isNaN(20));
console.log(Number.isNaN('20'));
console.log(Number.isNaN(+'20'));
console.log(Number.isNaN(23 / 0));

// Check if value is a number
console.log('IS FINITIVE');
console.log(Number.isFinite(20));
console.log(Number.isFinite('20'));
console.log(Number.isFinite('20'));
console.log(Number.isFinite(23 / 0));

console.log(Number.isInteger(23, 0));

//Cuadrado de un numero
console.log(Math.sqrt(25));
console.log(25 ** (1 / 2));
console.log(8 ** (1 / 2));

// Find the max and min value
console.log(Math.max(5, 18, 23, 11));
console.log(Math.min(23, 5, 3, 2, 34));

console.log(Math.PI * Number.parseFloat('10px')) ** 2;

// Numero random
console.log(Math.trunc(Math.random() * 6 + 1));

// Numero random entre min and max
const randomInt = (min, max) =>
  Math.trunc(Math.random() * (max - min) + 1) + min;

console.log(randomInt(10, 20));

// Rounding Integers
console.log(Math.trunc(23.2));

console.log('ROUND');
// Redondea el numero
console.log(Math.round(23.3));
console.log(Math.round(23.6));

console.log(Math.round(26.5));
console.log(Math.round(26.4));

// Do the same as trunck when they are dealing with positive numbers
// But with negative numbers floor round the number
console.log(Math.floor(-23.3));
console.log(Math.floor('23.9'));

// Rounding decimal numbers
// toFixed return a string
console.log((2.7).toFixed(0)); // 3
console.log((2.7).toFixed(2)); // 2.700
console.log((2.345).toFixed(2)); // 2.35
console.log(+(2.345).toFixed(2)); // 2.35 type number

//-------------------------------------------

console.log(5 % 2);
console.log(5 / 2);

const isEven = n => n % 2 === 0;

console.log(isEven(8));
console.log(isEven(23));
console.log(isEven(892));

labelBalance.addEventListener('click', () => {
  [...document.querySelectorAll('.movements__row')].forEach((row, i) => {
    if (i % 2 === 0) row.style.backgroundColor = 'orangered';
    if (i % 3 === 0) row.style.backgroundColor = 'blue';
  });
});

// 287,460,000,000
const diameter = 287_460_000_000; // console: 287460000000
console.log(diameter);

const priceCents = 345_99;
console.log(priceCents);

const transferFree = 15_00;
const transferFree2 = 1_500;

console.log(transferFree);
console.log(transferFree2);

const PI = 3.14_15;
console.log(PI);

console.log(Number('230_000'));
console.log(parseInt('230_000'));

// The biggest number that JS can safely represents
console.log(2 ** 53 - 1);
console.log(Number.MAX_SAFE_INTEGER);

console.log(437642939474827894204829487289n);
console.log(BigInt(437642939474827894204829487289));

//Operations
console.log(100000n + 100000n);
console.log(535355981374875323244253n * 1000000n);

const huge = 425353937831980933n;
const num = 23;

console.log(huge * BigInt(num));

console.log(20n > 15); // true
console.log(20n === 20); // false because they are not the same data type
console.log(typeof 20n); // Big int
console.log(20n == 20); // true becase only checks the content

console.log(huge + ' is REALLY BIG');

// console.log(Math.sqrt(16n));

//Divisions
console.log(10n / 3n); // 3n
console.log(10 / 3); // 3.33333333

// Create a date
const now = new Date();
console.log(now);

console.log('--------------------------------------------------');
console.log(new Date('Nov 18 2023 13:06:42'));
console.log(new Date('November 23, 2002'));
console.log(new Date('November 14, 1969'));
console.log(new Date('August 1 1961'));
console.log(new Date('May 30 2005'));
console.log('--------------------------------------------------');

console.log(new Date(account1.movementsDates[0]));
console.log(new Date(2034, 12, 19, 23, 4, 14));
console.log(new Date(0));
console.log(new Date(3 * 24 * 60 * 60 * 1000));

console.log('--------------------------------------------------');

// Woriking with dates
const future = new Date(2037, 10, 19, 15, 23);
console.log(future);
console.log(future.getFullYear());
console.log(future.getMonth());
console.log(future.getDate()); // Day of the month
console.log(future.getDay()); // Day of the week
console.log(future.getHours());
console.log(future.getMinutes());
console.log(future.getSeconds());
console.log(future.toISOString());
console.log(future.getTime());
console.log(new Date(2142278580000));

console.log(Date.now());

future.setFullYear(2044);
console.log(future);
console.log('--------------------------------------------------');

// day/month/year
// const future2 = new Date(2037, 10, 19, 15, 23);
// console.log(+future2);

// const days = calcDayPassed(new Date(2037, 10, 19), new Date(2037, 10, 9));
// console.log(days);
const opts = {
  style: 'currency', // currency, unit,
  currency: 'MEX',
  // useGrouping: false,
};

const no = 4442534.12;
console.log('US:', new Intl.NumberFormat('en-US', opts).format(no));
console.log('Mexico:', new Intl.NumberFormat('es-MX', opts).format(no));
console.log('Germany:', new Intl.NumberFormat('de-DE', opts).format(no));

// SET TIME OUT
const ingredients = ['olives', 'spinach'];

const pizzaTimer = setTimeout(
  (ing, ing2) => console.log(`Here is your pizza w ${ing} and ${ing2}`),
  3000,
  ...ingredients
);

console.log('Waiting...');

if (ingredients.includes('spinach')) clearTimeout(pizzaTimer);

// setInterval

setInterval(function () {
  const now = new Date();
  console.log(now);
}, 7000);
