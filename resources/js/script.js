'use strict';

////////////////////////////////////////////////
// BANKIST APP

// Data
const account1 = {
  owner: 'Jonas Schmedtmann',
  movements: [200, 450, -400, 3000, -650, -130, 70, 1300],
  interestRate: 1.2, // %
  pin: 1111,
};

const account2 = {
  owner: 'Jessica Davis',
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,
};

const account3 = {
  owner: 'Steven Thomas Williams',
  movements: [200, -200, 340, -300, -20, 50, 400, -460],
  interestRate: 0.7,
  pin: 3333,
};

const account4 = {
  owner: 'Sarah Smith',
  movements: [430, 1000, 700, 50, 90],
  interestRate: 1,
  pin: 4444,
};

const accounts = [account1, account2, account3, account4];

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


const displayMovements = function(movements, sort = false){
  containerMovements.innerHTML = '';

  const movs = sort ? movements.slice().sort((a, b) => a - b) : movements;

  movs.forEach(function(mov, i) {
    const type = mov > 0 ? `deposit` : `withdrawal`
    const html = `
      <div class="movements__row">
      <div class="movements__type movements__type--${type}">${i + 1} ${type}</div>
      <div class="movements__value">${mov} €</div>
      </div>`
      containerMovements.insertAdjacentHTML('afterbegin', html)
  });
};



const createUsernames = function(user){
  user.forEach(function(acc) {
    acc.username = acc.owner.toLowerCase().split(' ').map(name => name[0]).join('');
  });
  
}
createUsernames(accounts);

const calcDisplayBalance = function(acc) {
  acc.balance = acc.movements.reduce((acc,mov) => acc + mov, 0); 
  labelBalance.textContent = `${acc.balance} €`
}


const calcDisplaySummary = function(acc) {
  const incomes = acc.movements
  .filter(mov => mov > 0)
  .reduce((acc, mov) => acc + mov, 0);
  labelSumIn.textContent = `${Math.abs(incomes)}€`;
  
  const out = acc.movements.filter(mov => mov < 0).reduce((acc, mov) => acc + mov, 0);
  labelSumOut.textContent = `${Math.abs(out)}€`

  const interest = acc.movements
  .filter(mov => mov > 0)
  .map(deposit => deposit * acc.interestRate/100)
  .filter(int => int >= 1)
  .reduce((acc, int) => acc + int, 0);
  labelSumInterest.textContent = `${interest}€`;

};

const updateUI = function(acc) {

  // display movements
  calcDisplayBalance(currentAccount);
      //diplay summary 
    calcDisplaySummary(currentAccount);
      //display movements
    displayMovements(currentAccount.movements);
};

//evem listener
let currentAccount;

btnLogin.addEventListener('click', function(e) {
  //prevent form from refreshing
  e.preventDefault();
  currentAccount = accounts.find(acc => acc.username === inputLoginUsername.value);

  console.log(currentAccount);
  //optional chaingin only checks pin if account exists
    if (currentAccount?.pin === Number(inputLoginPin.value)){
      //display UI and welcome message
      labelWelcome.textContent =`Welcome Back ${currentAccount.owner.split(' ')[0]}`
      containerApp.style.opacity = '1';
      //clear fields

      inputLoginPin.value = inputLoginUsername.value = '';
      inputLoginPin.blur();
      inputLoginUsername.blur();
      //display and calculate balance
      updateUI(currentAccount);
      
    };

});

btnTransfer.addEventListener('click', function(e){
  e.preventDefault();
  const amount = Number(inputTransferAmount.value);
  const receiverAccount = accounts.find(acc => acc.username === inputTransferTo.value);

  console.log(amount, receiverAccount);

  if(amount <= currentAccount.balance && amount > 0 && receiverAccount?.username !== currentAccount.username) {
    currentAccount.movements.push(-amount);
    receiverAccount.movements.push(amount);

    updateUI(currentAccount);

    
  };
  inputTransferAmount.value = inputTransferTo.value = '';

});

btnLoan.addEventListener('click', function(e){
  e.preventDefault();
  const amount = Number(inputLoanAmount.value)

  if (amount > 0 && currentAccount.movements.some(mov => mov >= amount * 0.1)){
    currentAccount.movements.push(amount);
    updateUI(currentAccount);
  }

  inputLoanAmount.vale = '';
});

btnClose.addEventListener('click', function(e){
  e.preventDefault();
  if(currentAccount?.pin === Number(inputClosePin.value) &&currentAccount.username === inputCloseUsername.value )
  {
    const index = accounts.findIndex(acc => acc.username === currentAccount.username);
    
    //Delete Account
    accounts.splice(index, 1);
    //hide UI
    containerApp.style.opacity = '0';

  }
  inputCloseUsername.value = inputClosePin.value = '';
});
let sorted = false;

btnSort.addEventListener('click', function(e){
  e.preventDefault();
  displayMovements(currentAccount.movements, !sorted);
  sorted = !sorted;
})

/*
//Maximum Value
const maxValue = movements.reduce(function(acc,mov){
  if (acc > mov){
  return acc;
  }
  else {
    return mov;
  }
}, movements[0]);

console.log(maxValue);

//findindex finds the first indexs that matches the condition
const index = accounts.findIndex(acc => acc.username === currentAccount.username);
    accounts.splice(index, 1);

//REDUCE METHOD
//accumalator is like a snowball must set the snowball to zero
// const balance = movements.reduce(function(acc, cur, i,arr){
//   console.log(`iteration ${i}: ${acc}`);
//   return acc + cur;
// },0 );

// const balance = movements.reduce((acc, cur) => acc + cur ,0 );
// console.log(balance);

// let balance2 = 0;
// for(const mov of movements) balance2 += mov;
// console.log(balance2);
/*
// FILTER METHOD


const deposits = movements.filter(mov => mov > 0);
const withdrawals = movements.filter(mov => mov < 0);

console.log(movements);
console.log(deposits);
console.log(withdrawals);





// const depositsFor = [];
// for(const mov of movements) if(mov > 0) depositsFor.push(mov);
// console.log(depositsFor);

/////////////////////////////////////////////////
/////////////////////////////////////////////////



// LECTURES

// MAP
const currencies = new Map([
  ['USD', 'United States dollar'],
  ['EUR', 'Euro'],
  ['GBP', 'Pound sterling'],
]);

currencies.forEach(function(value,key,map) {
  console.log(`${key}: ${value}`);
});


const currenciesUnique = new Set(['USD', 'GBP', 'USD', 'EUR', 'EUR']);
currenciesUnique.forEach(function(value, _, map) {
  console.log(`${value}: ${value}`);
});


/////////////////////////////////////////////////

let arr = ['a', 'b', 'c', 'd', 'e'];
arr.splice(0,2);
// FIRST PAREMETER REMOVES THE ARRAY ELEMENTS UP TO THAT NUMBER SECOND DOES IT FROM THE BACK
console.log(arr.slice(1,-2));
console.log([...arr]);
console.log(arr);
console.log(arr.slice(1,2));

//MUTATES:SPLICE IS THE SAME BUT REMOVES FROM THE BACK
//console.log(arr.splice(2));
arr.splice(1,2);
console.log(arr);
arr.splice(-1);
console.log(arr);

// MUTATES INTO REVERSE
arr = ['a', 'b', 'c', 'd', 'e'];
let arr2 = ['j', 'i', 'h', 'g', 'f'];
console.log(arr2.reverse());
console.log(arr2);

//CONCAT
const letters = arr.concat(arr2);
console.log(letters);
console.log([...arr, ...arr2]);

// JOIN
console.log(letters.join('-'));



const arr = [23, 11, 64];
console.log(arr.at(0));
console.log(arr[0]);

console.log(arr.at(-1));
console.log(arr[arr.length-1]);
console.log(arr.slice(-1)[0]);

console.log('harry'.at(-1));

const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];

// OF
for(const movement of movements) {
  if(movement > 0) {
    console.log(`You deposited ${movement}`);
  }
    else {
      console.log(`You withdrew ${Math.abs(movement)}`);
    }
  
}

for(const [i, movement] of movements.entries()) {
  if(movement > 0) {
    console.log(`Movement ${i + 1} You deposited ${movement}`);
  }
    else {
      console.log(`Movement ${i + 1} You withdrew ${Math.abs(movement)}`);
    }
  
}

// FOR EACH
console.log(`-------FOREACH`)
movements.forEach(function(movement, index, array){
  if(movement > 0) {
    console.log(`Movement ${index + 1} You deposited ${movement}`);
  }
    else {
      console.log(`Movement ${index + 1} You withdrew ${Math.abs(movement)}`);
    }
});

// 0: function(200)
// 1: function(450)
// 2: function(400);
// ...



/////// array methods
const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];

// MAP returns new array after appling operation
const eurToUsd = 1.1;

const movementsUSD = movements.map(mov => mov*eurToUsd
);

console.log(movements);
console.log(movementsUSD);

const movementsUSDfor = []
for(const mov of movements) movementsUSDfor.push(mov *eurToUsd)

console.log(movementsUSDfor)
const movementsDescription = movements.map((mov,i) => 
  (`Movement ${i + 1}: You ${mov > 0 ? 'deposited' : 'withdrew'} ${Math.abs(mov)}`)
  );

  console.log(movementsDescription);

// FILTER returns new array after checking test condition

// REDUCE adds all elements together and returns this value

const eurToUsd = 1.1;
const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];
console.log(movements)


const totalDepositsUSD = movements
.filter(mov => mov > 0)
.map(mov => mov * eurToUsd)
.reduce((acc,mov) => acc + mov, 0);
console.log(totalDepositsUSD)

labelSumIn.textContent = totalDepositsUSD;


//FIND METHOD
const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];

//find returns the first element that fits the condition the filter returns a new array with and find return just the first value
const firstWithdrawal = movements.find(mov => mov < 0);
console.log(firstWithdrawal);

console.log(accounts);

const account = accounts.find(acc => acc.owner === 'Jessica Davis');
console.log(account);

for(accounts of )



// SOME movements checks if a  condition is true and returns a boollean value
const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];

const anyDeposits  = movements.some( mov => mov > 3400);
console.log(anyDeposits);



//EVERY returns true if every element in array is true for condition 
console.log(account4.movements.every(mov => mov > 0));
console.log(movements.every(mov => mov > 0));

// Seperate callback
const deposit = mov => mov>0;


console.log(movements.every(deposit));
console.log(account4.movements.every(deposit));

//FLAT unests and combines nested arrays into one array
const arr = [[1,2,3], [4,5,6], 7, 8];
console.log(arr.flat());

const arrDeep = [[[1,2],3], [4,[5,6]], 7, 8];
console.log(arrDeep.flat(3));

const overallBalance = accounts
.map(acc => acc.movements)
.flat()
.reduce((acc,mov) => acc + mov, 0);
console.log(overallBalance);

//FLAT MAP maps through the whole array and flatten it same as a map method just flattens at the end however it does only go one level deep

const overallBalance = accounts
.flatmap(acc => acc.movements)
.reduce((acc,mov) => acc + mov, 0);
console.log(overallBalance);



/// SORTING ARRAYS 

//strings
const owners = ['Jonas', 'Zach', 'Adam', 'Martha'];
console.log(owners.sort());
console.log(owners);

//numbers

const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];
console.log(movements.sort());

// return < 0 A,B (keep order)
//return > 0 B, A (switch order)

// //acsending
// movements.sort((a,b) => {
//   if(a > b) return 1;
//   if(b > a) return -1;
// });
// console.log(movements);
// //desending
// movements.sort((a,b) => {
//   if(a > b) return -1;
//   if(b > a) return 1;
// });
// console.log(movements);

movements.sort((a,b) => a- b);
console.log(movements);
movements.sort((a,b) => b - a);
console.log(movements);
*/