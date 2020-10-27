var letters = [' ','a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z']; 
let currLetters = [15, 10, 7, 21, 0, 4, 17, 18, 9, 1];
let nextLetters = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
let finalLetters = [10, 15, 8, 14, 0, 2, 21, 18, 14, 19];
var letterSwaps = 0;
var MAX_SWAPS = 2;
var currUpdated = false;
var SERVICE_ID = 'service_46w97me';
var TEMPLATE_ID = 'contact_form';
var USER_ID = 'user_C1CqKuly0eGBzsrvOc6IZ';

// Regular expression to check valid emails. Source: http://emailregex.com/
const emailRegEx = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

// Initialize emailJS for contact section
/*
(function() {
    emailjs.init(USER_ID);
})();
*/

async function nameIntro() {
    
    await sleep(800);
    await changeLetters();
    await sleep(200);
    $('#lock-image').addClass('shake');
    await sleep(400);
    $('#lock-image').removeClass('shake');
    await sleep(400);
    await changeLetters();
    await sleep(200);
    $('#lock-image').addClass('shake');
    await sleep(400);
    $('#lock-image').removeClass('shake');
    await sleep(400);
    await changeLetters();
    await sleep(800);
    await explodeAnimation();

    // DEV PURPOSES ONLY
    /*
    $('#intro-container').css('display', 'none');
    $('.main').css('display', 'flex');
    */
}

async function explodeAnimation() {
    $('#lock-image').addClass('explode');
    await sleep(800)
    $('#lock-image').removeClass('explode');
    $('#intro-container').css('display', 'none');
    $('.main').css('display', 'flex');
    $('#content').css('display', 'block');
    $('#nav-bar').css('display', 'flex');
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

//////////////////////////////////////////////////////////////
// Contact section / Send email methods
//////////////////////////////////////////////////////////////

function validEmail(email) {
    if(email == '' || !emailRegEx.test(email)) {
        return false;
    }
    return true;
}

function validMessage(message) {
    if(message === '' || message === undefined) {
        return false;
    }
    return true;
}

$(document).ready( () => {
    nameIntro();

    $('#email-submit-button').click( async () => {
    
        let emailValid=false, messageValid=false;
        let from = $('#email-from').val();
        let subject = $('#email-subject').val();
        let message = $('#email-message').val();
    
        $('#error-message-email').css('display', 'none');
        $('#error-message-message').css('display', 'none');
    
        if(validEmail(from)) {
            emailValid = true;
        }
        else {
            $('#error-message-email').css('display', 'block');
        }
    
        if(validMessage(message)) {
            messageValid = true;
        }
        else {
            $('#error-message-message').css('display', 'block');
        }

        if(emailValid && messageValid) {
            let templateParams = {
                'from': from,
                'subject': subject,
                'message': message
            }
    
            let response = await emailjs.send(SERVICE_ID, TEMPLATE_ID, templateParams, USER_ID);
            if(response.status === 200) {
                alert('Email was successfully sent!')
                $('#email-from').val() = '';
                $('#email-subject').val() = '';
                $('#email-message').val() = '';
            }
            else {
                console.log(`Error code: ${response.status}`);
                alert('Error: Email failed to send.');
            }
        }
    });
});

function sleep(ms) {
    return new Promise( (resolve) => setTimeout(resolve, ms));
}