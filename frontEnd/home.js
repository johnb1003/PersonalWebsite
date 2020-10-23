var letters = [' ','a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z']; 
let currLetters = [15, 10, 7, 21, 0, 4, 17, 18, 9, 1];
let nextLetters = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
let finalLetters = [10, 15, 8, 14, 0, 2, 21, 18, 14, 19];
var letterSwaps = 0;
var MAX_SWAPS = 2;
var currUpdated = false;

async function nameIntro() {
    await changeLetters();
    await sleep(200);
    $('#lock-image').addClass('shake');
    await sleep(600);
    $('#lock-image').removeClass('shake');
    await sleep(400);
    await changeLetters();
    await sleep(200);
    $('#lock-image').addClass('shake');
    await sleep(600);
    $('#lock-image').removeClass('shake');
    await sleep(400);
    await changeLetters();
}

async function changeLetters() {
    await fillNextLetters();
    while(!currUpdated) {
        await updateCurrLetters();
        await showLetters(currLetters);
        await sleep(50);
    }
    currUpdated = false;
}

function fillNextLetters() {
    if(letterSwaps >= MAX_SWAPS) {
        nextLetters = finalLetters;
        return;
    }

    letterSwaps++;
    for(let i=0; i<nextLetters.length; i++) {
        if(i === 4) {
            continue;
        }
        nextLetters[i] = getRandomLetterIndex();
    }
}

function updateCurrLetters() {
    let updated = false;
    for(let i=0; i<currLetters.length; i++) {
        if(currLetters[i] < nextLetters[i]) {
            currLetters[i]++;
            updated = true;
        }
        else if(currLetters[i] > nextLetters[i]) {
            currLetters[i]--;
            updated = true;
        }
    }
    currUpdated = !updated;
}

function showLetters(letterArr) {
    let lettersHTML = '<div id="first-name">';
    for(let i=0; i<letterArr.length; i++) {
        if(i === 4) {
            lettersHTML += `</div><div class="letter-container" id="name-space"><p class="letter" id="letter-4">&nbsp;</p></div><div id="last-name">`;
            continue;
        }
        lettersHTML += `<div class="letter-container"><p class="letter" id="letter-${i}">${letters[letterArr[i]]}</p></div>`;
    }
    lettersHTML += `</div>`;
    $('#name-container').html(lettersHTML);
}

function getRandomLetterIndex() {
    return Math.floor(Math.random() * Math.floor(letters.length-1))+1;
}

$(document).ready( () => {
    nameIntro();
});

function sleep(ms) {
    return new Promise( (resolve) => setTimeout(resolve, ms));
  }