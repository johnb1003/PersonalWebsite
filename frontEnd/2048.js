const BOARD_SIZE = 4;
const NEW_TILE_DELAY = 150; // ms
const LOSE_DELAY = 1000; // ms

class GameBoard {
    constructor(dimensions) {
        this.dimensions = dimensions;

        this.boardArr = [];
        this.nullList = [];
        this.frozen = false;
        this.score = 0;

        this.resetBoard();
    }

    resetBoard() {
        this.boardArr = [];
        this.nullList = [];
        this.frozen = false;
        this.score = 0;

        // Initialize boardArr with all null values
        for(let i=0; i<this.dimensions; i++) {
            let row = [];
            for(let j=0; j<this.dimensions; j++) {
                row.push(null);
                this.nullList.push([i, j]);
            }
            this.boardArr.push(row);
        }

        this.addRandom();
        this.addRandom();

        this.displayBoard();
    }

    displayBoard() {
        let boardHTML = '';
        for(let i=0; i<this.dimensions; i++) {
            for(let j=0; j<this.dimensions; j++) {
                let data = this.getDisplayData(this.boardArr[i][j]);
                boardHTML += `<div class="game-tile${data.class}" id="${i}-${j}">${data.val}</div>`
            }
        }
        $('#game-board').html(boardHTML);
    }

    getDisplayData(value) {
        let data = {};
        if(value === null) {
            data.class = '';
            data.val = '';
        }
        else {
            data.class = ` number-${value}`;
            data.val = `${value}`;
        }
        return data;
    }

    updateTileValue(row, col, newValue) {
        let oldValue = this.boardArr[row][col];

        if(oldValue === null) {
            this.removeNull(row, col);
        }

        if(newValue === null) {
            this.addNull(row, col);
        }

        this.boardArr[row][col] = newValue;
    }

    addNull(row, col) {
        this.nullList.push([row, col]);
    }

    removeNull(row, col) {
        this.nullList = this.nullList.filter((e) => {return JSON.stringify(e) !== JSON.stringify([row, col])});
    }

    // Adds either a 2 or 4 to a random open tile on the game board
    addRandom() {
        // Choose random open tile
        let randomIndex = Math.floor(Math.random() * Math.floor(this.nullList.length));
        let coordinates = this.nullList[randomIndex];
        let row = coordinates[0];
        let col = coordinates[1];

        // Decide either a 2 or a 4 (50% chance for each)
        let value = (Math.floor(Math.random() * Math.floor(2))+1) * 2;

        this.updateTileValue(row, col, value);
    }

    moveLeft() {
        if(this.frozen) {
            console.log("FROZEN");
            return;
        }
        let shifted = this.shiftLeft();
        let combined = this.combineLeft();
        if(combined) {
            this.shiftLeft();
        }
        this.displayBoard();

        if(shifted || combined) {
            this.addRandom();
            sleep(NEW_TILE_DELAY).then(() => {
                this.displayBoard();
            });
        }

        if(this.nullList.length === 0 && this.checkLoss()) {
            console.log("You lose!");
            sleep(LOSE_DELAY).then(() => {
                this.lose();
            });
        }
    }

    moveUp() {
        if(this.frozen) {
            console.log("FROZEN");
            return;
        }
        let shifted = this.shiftUp();
        let combined = this.combineUp();
        if(combined) {
            this.shiftUp();
        }
        this.displayBoard();

        if(shifted || combined) {
            this.addRandom();
            sleep(NEW_TILE_DELAY).then(() => {
                this.displayBoard();
            });
        }

        if(this.nullList.length === 0 && this.checkLoss()) {
            console.log("You lose!");
            sleep(LOSE_DELAY).then(() => {
                this.lose();
            });
        }
    }

    moveRight() {
        if(this.frozen) {
            console.log("FROZEN");
            return;
        }
        let shifted = this.shiftRight();
        let combined = this.combineRight();
        if(combined) {
            this.shiftRight();
        }
        this.displayBoard();

        if(shifted || combined) {
            this.addRandom();
            sleep(NEW_TILE_DELAY).then(() => {
                this.displayBoard();
            });
        }

        if(this.nullList.length === 0 && this.checkLoss()) {
            console.log("You lose!");
            sleep(LOSE_DELAY).then(() => {
                this.lose();
            });
        }
    }

    moveDown() {
        if(this.frozen) {
            console.log("FROZEN");
            return;
        }
        let shifted = this.shiftDown();
        let combined = this.combineDown();
        if(combined) {
            this.shiftDown();
        }
        this.displayBoard();

        if(shifted || combined) {
            this.addRandom();
            sleep(NEW_TILE_DELAY).then(() => {
                this.displayBoard();
            });
        }

        if(this.nullList.length === 0 && this.checkLoss()) {
            console.log("You lose!");
            sleep(LOSE_DELAY).then(() => {
                this.lose();
            });
        }
    }

    shiftLeft() {
        let shifted = false;
        for(let i=0; i<this.boardArr.length; i++) {
            let j = 0;
            let openIndices = [];
            while(j < this.boardArr[i].length) {
                if(this.boardArr[i][j] !== null) {

                    // Check if space to shift
                    if(openIndices.length > 0) {
                        // Shift
                        let openIndex = openIndices.shift();
                        this.updateTileValue(i, openIndex, this.boardArr[i][j]);
                        this.updateTileValue(i, j, null);
                        openIndices.push(j);
                        shifted = true;
                    }
                }
                else {
                    openIndices.push(j);
                }
                
                j++;
            }
        }
        return shifted;
    }

    shiftUp() {
        let shifted = false;
        for(let i=0; i<this.boardArr.length; i++) {
            let j = 0;
            let openIndices = [];
            while(j < this.boardArr.length) {
                if(this.boardArr[j][i] !== null) {

                    // Check if space to shift
                    if(openIndices.length > 0) {
                        // Shift
                        let openIndex = openIndices.shift();
                        this.updateTileValue(openIndex, i, this.boardArr[j][i]);
                        this.updateTileValue(j, i, null);
                        openIndices.push(j);
                        shifted = true;
                    }
                }
                else {
                    openIndices.push(j);
                }
                
                j++;
            }
        }
        return shifted;
    }

    shiftRight() {
        let shifted = false;
        for(let i=0; i<this.boardArr.length; i++) {
            let j = this.boardArr[i].length-1;
            let openIndices = [];
            while(j >= 0) {
                if(this.boardArr[i][j] !== null) {

                    // Check if space to shift
                    if(openIndices.length > 0) {
                        // Shift
                        let openIndex = openIndices.shift();
                        this.updateTileValue(i, openIndex, this.boardArr[i][j]);
                        this.updateTileValue(i, j, null);
                        openIndices.push(j);
                        shifted = true;
                    }
                }
                else {
                    openIndices.push(j);
                }
                
                j--;
            }
        }
        return shifted;
    }

    shiftDown() {
        let shifted = false;
        for(let i=0; i<this.boardArr.length; i++) {
            let j = this.boardArr[i].length-1;
            let openIndices = [];
            while(j >= 0) {
                if(this.boardArr[j][i] !== null) {

                    // Check if space to shift
                    if(openIndices.length > 0) {
                        // Shift
                        let openIndex = openIndices.shift();
                        this.updateTileValue(openIndex, i, this.boardArr[j][i]);
                        this.updateTileValue(j, i, null);
                        openIndices.push(j);
                        shifted = true;
                    }
                }
                else {
                    openIndices.push(j);
                }
                
                j--;
            }
        }
        return shifted;
    }

    combineLeft() {
        let combined = false;
        for(let i=0; i<this.dimensions; i++) {
            let j = 0;
            while(j < this.boardArr.length-1) {
                let val = this.boardArr[i][j];
                if(val !== null && val === this.boardArr[i][j+1]) {
                    // Combine
                    this.updateTileValue(i, j, 2 * val);
                    this.updateTileValue(i, j+1, null);
                    this.score += 2 * val;
                    combined = true;
                }
                j++;
            }
        }
        return combined;
    }

    combineUp() {
        let combined = false;
        for(let i=0; i<this.dimensions; i++) {
            let j = 0;
            while(j < this.boardArr.length-1) {
                let val = this.boardArr[j][i];
                if(val !== null && val === this.boardArr[j+1][i]) {
                    // Combine
                    this.updateTileValue(j, i, 2 * val);
                    this.updateTileValue(j+1, i, null);
                    this.score += 2 * val;
                    combined = true;
                }
                j++;
            }
        }
        return combined;
    }

    combineRight() {
        let combined = false;
        for(let i=0; i<this.dimensions; i++) {
            let j = this.boardArr[i].length-1;
            while(j >= 1) {
                let val = this.boardArr[i][j];
                if(val !== null && val === this.boardArr[i][j-1]) {
                    // Combine
                    this.updateTileValue(i, j, 2 * val);
                    this.updateTileValue(i, j-1, null);
                    this.score += 2 * val;
                    combined = true;
                }
                j--;
            }
        }
        return combined;
    }

    combineDown() {
        let combined = false;
        for(let i=0; i<this.dimensions; i++) {
            let j = this.boardArr[i].length-1;
            while(j >= 1) {
                let val = this.boardArr[j][i];
                if(val !== null && val === this.boardArr[j-1][i]) {
                    // Combine
                    this.updateTileValue(j, i, 2 * val);
                    this.updateTileValue(j-1, i, null);
                    this.score += 2 * val;
                    combined = true;
                }
                j--;
            }
        }
        return combined;
    }

    checkLoss() {
        let loss = true;
        for(let i=0; i<this.dimensions; i++) {
            for(let j=0; j<this.dimensions; j++) {
                if(j+1 < this.dimensions && this.boardArr[i][j] === this.boardArr[i][j+1]) {
                    return false;
                }
                else if(i+1 < this.dimensions && this.boardArr[i][j] === this.boardArr[i+1][j]) {
                    return false;
                }
            }
        }
        this.frozen = true;
        return loss;
    }

    lose() {
        $('#score').text(this.score);
        $('#lose-background').css('display', 'flex');
    }
}

$(document).ready( () => {

    game = new GameBoard(BOARD_SIZE);


    $('#new-game-button').click( () => {
        game.resetBoard();
        $('#lose-background').css('display', 'none');
    });


    // Swipe touchscreen input
    $(document).swipe({
        swipeLeft:function(event, distance, duration, fingerCount, fingerData, currentDirection) {
            game.moveLeft();
        },
        swipeUp:function(event, distance, duration, fingerCount, fingerData, currentDirection) {
            game.moveUp();
        },
        swipeRight:function(event, distance, duration, fingerCount, fingerData, currentDirection) {
            game.moveRight();
        },
        swipeDown:function(event, distance, duration, fingerCount, fingerData, currentDirection) {
            game.moveDown();
        }
    });

    // Arrow key input
    $(document).keydown( (e) => {
        switch(e.keyCode) {
            case 37: 
            // Left
            game.moveLeft();
            break;

            case 38: 
            // Up
            game.moveUp();
            break;

            case 39: 
            // Right
            game.moveRight();
            break;

            case 40: 
            // Down
            game.moveDown();
            break;

            default:
                return;
        }
        e.preventDefault();
    });
});

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }