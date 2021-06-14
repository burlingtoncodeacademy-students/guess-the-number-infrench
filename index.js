const readline = require('readline');
const { inflateSync } = require('zlib');
const rl = readline.createInterface(process.stdin, process.stdout);

function ask(questionText) {
  return new Promise((resolve, reject) => {
    rl.question(questionText, resolve);
  });
}
// Choose which game is played. 
async function gameSelect() {
  //assigns 1 or 2 to chosenGame
  let chosenGame = await ask(`Welcome to the number guesser game. \nIf you would like me to guess a number, type "1" \nIf you would like to guess a number, type "2" \n`)
  //checks if user input is not 1 or 2, keeps asking until user enters valid response
  while (chosenGame !== "1" && chosenGame !== "2") {
    chosenGame = await ask(`"${chosenGame}" is an invalid input. Try again. `)
  }
  if (chosenGame === "1") {
    //run the function for main game
    compGuess()
  } else if (chosenGame === "2") {
    //run the function for the reverse game
    userGuess()
  }
}
// call the function to choose the game
gameSelect()
// the main game. contains both async function for the main game
function compGuess() {
  // inits max range
  let max;
  // inits and sets min range
  let min = 1
  //inits first guess to be used in both functions within the main game
  let numOne;
  //inits yes or no variable to be used in both functions
  let yesNo;
  // inits the variable to count the number of guesses
  let guessNum = 0
  // Starts the main game, contains the first guess and the while loop
  async function start() {

    console.log("Let's play a game where you (human) make up a number and I (computer) try to guess it.")
    // assigns max value to user input.
    max = await ask("What would you like the maximum number to be? ");
    // makes max an integer
    max = parseInt(max)
    // checks if max is NaN
    while (isNaN(max)) {
      max = await ask('You did not enter a number. Try again. ')
      max = parseInt(max)
    }
    // assigns the user's number to user input
    let secretNumber = await ask(`Pick a number between 1 and ${max}. `);
    // makes secretNumber a number
    secretNumber = parseInt(secretNumber)
    // checks if secretNumber is a number and if it is within the range
    while (isNaN(secretNumber) || secretNumber > max || secretNumber < min) {
      // requests new input if NaN
      if (isNaN(secretNumber)) {
        secretNumber = await ask('You did not enter a number. Try again. ')
        secretNumber = parseInt(secretNumber)
        // requests new input if outside range
      } else if (secretNumber > max || secretNumber < min) {
        secretNumber = await ask(`${secretNumber} is outside the range. Pick another number `)
        secretNumber = parseInt(secretNumber)
      }
    }
    console.log(`You entered: ${secretNumber}`)
    //makes the first guess
    numOne = Math.floor(Math.random() * (max - min + 1) + min)
    // assigns yesNo to user input
    yesNo = await ask(`Is your number ${numOne}? Y or N? `)
    // adds the first guess to the guess count
    guessNum += 1
    // checks if user input is yes or no for yesNo. if not, loops until user inputs yes or no
    while (yesNo.toLowerCase() !== 'n' && yesNo.toLowerCase() !== 'no' && yesNo.toLowerCase() !== 'y' && yesNo.toLowerCase() !== 'yes') {
      yesNo = await ask(`"${yesNo}" is an invalid input. Try again. `)
    }
    // if the guess is incorrect, go to new guess function
    while (yesNo.toLowerCase() === 'n' || yesNo.toLowerCase() === 'no') {
      // checks guess against secret number to detect cheating
      if (numOne === secretNumber) {
        console.log(`Cheater! ${numOne} IS your number! Leave now and never come back! (please come back)`)
        process.exit()
      }
      // assigns numOne to the return output of newGuess
      numOne = await newGuess()
      // if the guess is correct, give victory message and say number of guesses
    } if (yesNo.toLowerCase() === 'y' || yesNo.toLowerCase() === 'yes') {
      console.log(`I was right! You were thinking of ${numOne}. It only took me ${guessNum} guesses.`)
      // ask user to play again
      let again = await ask("Would you like to play again? ")
      if (again.toLowerCase() === 'yes' || again.toLowerCase() === 'y') {
        // reset guessNum and min values
        guessNum = 0
        min = 1
        // send user back to gameSelect function, could also use start() to send user to start of this game
        gameSelect()
        // if user does not enter "yes", exit program
      } else {
        console.log('Goodbye.')
        process.exit()
      }
    }
  }
  // newGuess checks if the guess was too high or low, adjusts the range, and formulates a new guess. 
  async function newGuess() {
    let higherLower = await ask('Is your number higher (h) or lower (l) than my guess? ')
    // if user input is anything other than h or l, keep asking for new higherLower
    while (higherLower.toLowerCase() !== 'h' && higherLower.toLowerCase() !== 'l') {
      higherLower = await ask(`"${higherLower}" is an invalid input. Is your number higher (h) or lower (l) than my guess? `)
    }
    // if user input h
    if (higherLower.toLowerCase() === 'h') {
      // change the range of the number gen by raising the min to the guess 'numOne'. + 1 so it doesn't make the same guess
      min = numOne + 1
      // generate a new number "newNum" within new range
      let newNum = Math.floor((max + min) / 2)
      // reassign yesNo based on new guess
      yesNo = await ask(`Is your number ${newNum}? `)
      // check if yesNo is an invalid input
      while (yesNo.toLowerCase() !== 'n' && yesNo.toLowerCase() !== 'no' && yesNo.toLowerCase() !== 'y' && yesNo.toLowerCase() !== 'yes') {
        yesNo = await ask(`"${yesNo}" is an invalid input. Is your number ${newNum}? `)
      }
      // add one to guess count after new guess
      guessNum += 1
      return newNum
      // if user input l
    } else if (higherLower.toLowerCase() === 'l') {
      // change the range by lowering the max to the guess 'numOne'. -1 so it doesn't make the same guess
      max = numOne - 1
      let newNum = Math.floor((max + min) / 2)
      yesNo = await ask(`Is your number ${newNum}? `)
      // check if yesNo is an invalid input
      while (yesNo.toLowerCase() !== 'n' && yesNo.toLowerCase() !== 'no' && yesNo.toLowerCase() !== 'y' && yesNo.toLowerCase() !== 'yes') {
        yesNo = await ask(`"${yesNo}" is an invalid input. Is your number ${newNum}? `)
      }
      // add one to guess count after new guess
      guessNum += 1
      return newNum
    }
  }
  // calls start function
  start()
}
// the reverse game
function userGuess() {
  async function startReverse() {
    // assigns min range
    let min = 1
    // assigns max range
    let max = 100
    // assigns number of guesses
    let guessNum = 0
    // generates random number for user to guess
    let randNum = Math.floor(Math.random() * (max - min + 1) + min)
    console.log("Let's play a game where I (computer) make up a number and you (human) try to guess it.")
    // asks user for first guess and assigns it to userGuess
    let userGuess = await ask("Guess a number between 1 and 100 ")
    userGuess = parseInt(userGuess)
    // checks if userGuess is NaN or outside range
    while (isNaN(userGuess) || userGuess > max || userGuess < min) {
      if (isNaN(userGuess)) {
        userGuess = await ask('You did not enter a number. Try again. ')
        userGuess = parseInt(userGuess)
      } else if (userGuess > max || userGuess < min) {
        userGuess = await ask(`${userGuess} is outside the range. Pick another number `)
        userGuess = parseInt(userGuess)
      }
    }
    // adds 1 to guess count
    guessNum += 1
    // while loop containing if the guess is correct or incorrect
    // if incorrect, loop until guess is correct
    while (userGuess !== randNum) {
      // if the guess < the num, tell user the guess was too low and await new guess
      if (userGuess < randNum) {
        userGuess = await ask("Your guess was too low. Guess again. ")
        userGuess = parseInt(userGuess)
        // add 1 to guess count
        guessNum += 1
        // checks if guess is NaN or outside range
        while (isNaN(userGuess) || userGuess > max || userGuess < min) {
          if (isNaN(userGuess)) {
            userGuess = await ask('You did not enter a number. Try again. ')
            userGuess = parseInt(userGuess)
          } else if (userGuess > max || userGuess < min) {
            userGuess = await ask(`${userGuess} is outside the range. Pick another number `)
            userGuess = parseInt(userGuess)
          }
        }
        // if the guess > the num, tell user the guess was too high and await guess
      } else if (userGuess > randNum) {
        userGuess = await ask("Your guess was too high. Guess again. ")
        userGuess = parseInt(userGuess)
        // add 1 to guess count
        guessNum += 1
        // checks if guess is NaN or outside range
        while (isNaN(userGuess) || userGuess > max || userGuess < min) {
          if (isNaN(userGuess)) {
            userGuess = await ask('You did not enter a number. Try again. ')
            userGuess = parseInt(userGuess)
          } else if (userGuess > max || userGuess < min) {
            userGuess = await ask(`${userGuess} is outside the range. Pick another number `)
            userGuess = parseInt(userGuess)
          }
        }
      }
      // if guess is correct, ask to play again
    } if (userGuess === randNum) {
      console.log(`Congratulations! ${userGuess} was the correct number! It took you ${guessNum} guesses`)
      let again = await ask("Would you like to play again? ")
      // if yes, call gameSelect function
      if (again.toLowerCase() === 'yes' || again.toLowerCase() === 'y') {
        gameSelect()
        // exit program
      } else {
        console.log('Goodbye.')
        process.exit()
      }
    }
  }
  startReverse()
}