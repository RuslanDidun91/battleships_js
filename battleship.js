let model = {
    boardSize: 7,
    numShips: 3,
    shipLength: 3,
    shipsSunk: 0,
    ships: [
        {locations: ["0", "0", "0"], hits: ["", "", ""]},
        {locations: ["0", "0", "0"], hits: ["", "", ""]},
        {locations: ["0", "0", "0"], hits: ["", "", ""]}
    ],
    //method receive coordinates of fire
    fire: function (guess) {
        for (let i = 0; i < this.numShips; i++) {
            //we received ship object
            let ship = this.ships[i];
            //for every ship if (coordinates == true - fire is successful)
            //indexOf search value and return its index (or -1 in not found)
            let index = ship.locations.indexOf(guess);
            if (index >= 0) {
                ship.hits[index] = 'hit';
                view.displayHitShip(guess);
                view.displayMessage('Hit');
                //проверка потоплен ли корабль
                if (this.isSunk(ship)) {
                    view.displayMessage('You sunk Battleship');
                    this.shipsSunk++;
                }
                return true;
            }
        }
        view.displayMiss(guess);
        view.displayMessage('You missed');
        return false;
    },
    //func checks either ship sunk or not
    isSunk: function (ship) {
        for (let i = 0; i < this.shipLength; i++) {
            if (ship.hits[i] !== 'hit') {
                return false;
            }
        }
        return true;
    },
    //generate ship location
    generateShipLocation: function () {
        let locations
        for (let i = 0; i < this.numShips; i++) {
            do {
                locations = this.generateShip();
            } while (this.collision(locations))
            this.ships[i].locations = locations;
        }
        console.log('ships array: ');
        console.log(this.ships);
    },
    generateShip: function () {
        let direction = Math.floor(Math.random() * 2);
        let row, col;

        if (direction === 1) { //horizontal ship position
            row = Math.floor(Math.random() * this.boardSize);
            col = Math.floor(Math.random() * (this.boardSize - this.shipLength + 1));
        } else { // vertical ship position
            row = Math.floor(Math.random() * (this.boardSize - this.shipLength + 1));
            col = Math.floor(Math.random() * this.boardSize);
        }
        let newShipLocations = [];
        for (let i = 0; i < this.shipLength; i++) {
            if (direction === 1) {
                newShipLocations.push(row + '' + (col + i));
            } else {
                newShipLocations.push((row + i) + '' + col);
            }
        }
        return newShipLocations;
    },
    collision: function (locations) {
        for (let i = 0; i < this.numShips; i++) {
            let ship = this.ships[i];
            for (let j = 0; j < locations.length; j++) {
                if (ship.locations.indexOf(locations[j]) >= 0) {
                    return true;
                }
            }
        }
        return false;
    }
};

//object displays hit,miss and message
let view = {
    displayMessage: function (msg) {
        let messageArea = document.getElementById('messageArea');
        messageArea.innerHTML = msg;
    },
    displayHitShip: function (location) {
        let cell = document.getElementById(location);
        cell.setAttribute('class', 'hit');
    },
    displayMiss: function (location) {
        let miss = document.getElementById(location);
        miss.setAttribute('class', 'miss');
    }
};

let controller = {
    guesses: 0,
    processGuess: function (guess) {
        let location = parseGuess(guess);
        if (location) {
            this.guesses++
            let hit = model.fire(location);
            if (hit && model.shipsSunk === model.numShips) {
                view.displayMessage('you sank battleships, in ' +
                    this.guesses + ' guesses');
            }
        }
    }
}

//function parse number to correct number on the board
function parseGuess(guess) {
    let alphabet = ['a', 'b', 'c', 'd', 'e', 'f', 'g'];
    if (guess === null || guess.length !== 2) {
        alert('Please enter a valid number');
    } else {
        let firstChar = guess.charAt(0);
        let row = alphabet.indexOf(firstChar);
        let column = guess.charAt(1);
        if (isNaN(row) || isNaN(column)) {
            alert('this number is not on the board');
        } else if (row < 0 || row >= model.boardSize ||
            column < 0 || column >= model.boardSize) {
            alert('Oops, that is off the board');
        } else {
            return row + column;
        }
    }
    return null;
}

function handleFireButton() {
    let guessInput = document.getElementById('guessInput');
    let guess = guessInput.value;
    controller.processGuess(guess);
    //delete input value every time
    guessInput.value = '';
}

//enter button press
function handleKeyPress(e) {
    let fireButton = document.getElementById('fireButton');
    if (e.keyCode === 13) {
        fireButton.click();
        return false;
    }
}

window.onload = init;

//getting value from the button
function init() {
    let fireButton = document.getElementById('fireButton');
    fireButton.onclick = handleFireButton;
    //adding enterButton press
    let guessInput = document.getElementById('guessInput');
    guessInput.onkeypress = handleKeyPress;

    //generate ships on the board
    model.generateShipLocation();
}





