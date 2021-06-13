const readline = require('readline');
const rl = readline.createInterface(process.stdin, process.stdout);

function ask(questionText) {
    return new Promise((resolve, reject) => {
        rl.question(questionText, resolve);
    });
}

async function start() {
    let min = 1
    let max = 100
    let randNum = Math.floor(Math.random() * (max - min + 1) + min)
    console.log("Let's play a game where I (computer) make up a number and you (human) try to guess it.")
    let guess = await ask("Guess a number between 1 and 100 ")
    guess = parseInt(guess)
    while (guess !== randNum) {
        while (isNaN(secretNumber) || secretNumber > max || secretNumber < min) {
            if (isNaN(secretNumber)) {
              secretNumber = await ask('You did not enter a number. Try again. ')
              secretNumber = parseInt(secretNumber)
            } else if (secretNumber > max || secretNumber < min) {
              secretNumber = await ask(`${secretNumber} is outside the range. Pick another number `)
              secretNumber = parseInt(secretNumber)
            }
          }
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