const readline = require('readline');
const rl = readline.createInterface(process.stdin, process.stdout);

function ask(questionText) {
  return new Promise((resolve, reject) => {
    rl.question(questionText, resolve);
  });
}
// Choose which game is played. 
async function gameSelect() {
  let chosenGame = await ask(`Welcome to the number guesser game. \nIf you would like me to think of a number for you to guess, type "1". \nIf you would like me to guess a number you think of, type "2" \n`)
  if (chosenGame === "1") {
    //run the function for reverse game
    userGuess()
  } else if (chosenGame === "2") {
    //run the function for the main game
    compGuess()
  } 
}
// run the function to choose the game
gameSelect()
// the main game
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
    // assigns the user's number to user input
    let secretNumber = await ask(`Pick a number between 1 and ${max}. `);
    console.log(`You entered: ${secretNumber}`)
    secretNumber = parseInt(secretNumber)

    numOne = Math.floor(Math.random() * (max - min + 1) + min)

    yesNo = await ask(`Is your number ${numOne}? Y or N? `)
    guessNum += 1
    // if the guess is incorrect, go to logic function
    while (yesNo === 'N' || yesNo === 'n' || yesNo === 'No' || yesNo === 'no') {
      // checks guess against secret number to detect cheating
      if (numOne === secretNumber) {
        console.log(`Lies! ${numOne} IS your number! Be gone from me, vile human, be gone!`)
        process.exit()
      }
      numOne = await newGuess()
      // if the guess is correct, 
    } if (yesNo === 'Y' || yesNo === 'y' || yesNo === 'Yes' || yesNo === 'yes') {
      console.log(`I was right! You were thinking of ${numOne}. It only took me ${guessNum} guesses.`)
      let again = await ask("Would you like to play again? ")
      if (again.toLowerCase() === "yes" || again.toLowerCase() === "y") {
        guessNum = 0
        min = 1
        start()
      } else {
        process.exit()
      }
    }
  }

  async function newGuess() {
    let higherLower = await ask('Is your number higher (h) or lower (l) than my guess? ')
    // if the number is higher..
    if (higherLower === 'h' || higherLower === 'H') {
      // change the range of the number gen by raising the min to the guess 'numOne'. + 1 so it doesn't make the same guess
      min = numOne + 1
      // generate a new number "newNum"
      let newNum = Math.floor((max + min) / 2)

      yesNo = await ask(`Is your number ${newNum}? `)
      guessNum += 1

      return newNum
    } else if (higherLower === 'l' || higherLower === 'L') {
      // change the range by lowering the max to the guess 'numOne'
      max = numOne - 1
      let newNum = Math.floor((max + min) / 2)

      yesNo = await ask(`Is your number ${newNum}? `)
      guessNum += 1
      return newNum
    }
  }
  start()
}
// the reverse game
function userGuess() {
  async function start() {
    let min = 1
    let max = 100
    let randNum = Math.floor(Math.random() * (max - min + 1) + min)
    console.log("Let's play a game where I (computer) make up a number and you (human) try to guess it.")
    let guess = await ask("Guess a number between 1 and 100 ")
    guess = parseInt(guess)
    while (guess !== randNum) {
      if (guess < randNum) {
        guess = await ask("Your guess was too low. Guess again. ")
        guess = parseInt(guess)
      } else if (guess > randNum) {
        guess = await ask("Your guess was too high. Guess again. ")
        guess = parseInt(guess)
      }
    } if (guess === randNum) {
      console.log(`Congratulations! ${guess} was the correct number!`)
      process.exit()
    }

  }
  start()
}