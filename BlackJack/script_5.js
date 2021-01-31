
// ?                                                      --------------- BLACKJACK -------------



// objects we will need to interact with the HTML
let blackjackGame = {
    'you'      : {'scoreSpan': '#your-blackjack-score', 'div': '#your-box', 'score': 0},
    'dealer'   : {'scoreSpan': '#dealer-blackjack-score', 'div': '#dealer-box', 'score': 0},
    'cards'    : ['2','3','4','5','6','7','8','9','10','J','Q','K','A'],
    'cardsMap' : {'2': 2, '3': 3, '4': 4, '5': 5, '6': 6, '7': 7, '8': 8, '9': 9, '10': 10, 'J': 10, 'Q': 10, 'K': 10, 'A': [1, 11]},
    'wins'  : 0,
    'losses': 0,
    'draws' : 0,
    'isStand': false,
    'turnsOver': false
}

const YOU      = blackjackGame['you']
const DEALER   = blackjackGame['dealer']
const CARDS    = blackjackGame['cards']
const CARDSMAP = blackjackGame['cardsMap']

const hitSound  = new Audio('sounds/swish.m4a');
const winSound  = new Audio('sounds/cash.mp3' );
const lossSound = new Audio('sounds/aww.mp3'  );

// add click events to HIT, STAND, DEAL from html 
document.querySelector('#blackjack-hit-btn' ).addEventListener('click',  blackjackHit);
document.querySelector('#blackjack-deal-btn').addEventListener('click', blackjackDeal);
document.querySelector('#blackjack-stand-btn').addEventListener('click',  dealerLogic);

// ----------- main function numer 1 ------------
function blackjackHit(){
    if(blackjackGame['isStand'] === false){ // is the button stand has NOT been activated, then you can hit
        let card = randomCard();
        showCard(YOU, card);
        updateScore(card, YOU);
        showScore(YOU);
    }
}

//  ---------- main function numer 2 -----------
function blackjackDeal(){
    if(blackjackGame['turnsOver'] === true){
         //reset the isStand so the dealerLogc can work 
         blackjackGame['isStand'] = false;
        //  select all images(cards) from each flex-box 
        let yourimages   = document.querySelector('#your-box'  ).querySelectorAll('img');
        let dealerimages = document.querySelector('#dealer-box').querySelectorAll('img');

        //remove the cards of player and dealer with an array
        for(let i = 0; i < yourimages.length; ++i){
            yourimages[i].remove();
        }
        for(let i = 0; i < dealerimages.length; ++i){
            dealerimages[i].remove();
        }

        //reset the score to 0 in the front-end and back-end
        YOU['score'] = 0;
        DEALER['score'] = 0;
        document.querySelector('#your-blackjack-score').textContent = 0;
        document.querySelector('#dealer-blackjack-score').textContent = 0;

        // reset the colors to be white again
        document.querySelector('#your-blackjack-score').style.color   = 'white';
        document.querySelector('#dealer-blackjack-score').style.color = 'white';

        //reset the let´s play at the top of the table
        document.querySelector('#blackjack-result').textContent = 'Let´s Play!';
        document.querySelector('#blackjack-result').style.color = 'black';

        blackjackGame['turnsOver'] = true;
    }
}

function sleep(ms){
    return new Promise(resolve => setTimeout(resolve, ms));
}

// ------------ main function numer 3 -------------
async function dealerLogic(){ // BlackJack stand button
    blackjackGame['isStand'] = true;
    while(DEALER['score'] < 16 && blackjackGame['isStand'] === true){
        let card = randomCard();
        showCard(DEALER, card);
        updateScore(card, DEALER);
        showScore(DEALER);
        await sleep(1000);
    }
    blackjackGame['turnsOver'] = true;
    let winner = computeWinner();
    showResult(winner);
}

function randomCard(){
    let randomIndex = Math.floor(Math.random() * 13);
    return CARDS[randomIndex];
}

function showCard(activePlayer, randomCard){
    //  if we have less than 21, then we can add a card if we want
    if(activePlayer['score'] <= 21){
        hitSound.play();
        let cardImage = document.createElement('img'); //creat an elemtn of type 'img'
        cardImage.src = "images/" + randomCard + ".PNG"; // select a random card and set it to the src of the variable
        cardImage.width = 100; //ajust the width so it fits in the flex-box 
        document.querySelector(activePlayer['div']).appendChild(cardImage); //we append
    }
}

function updateScore(card, activePlayer){
    if (card === 'A'){ // if adding 11 keeps me below or  == 21, add 11. Otherwise, add 1
        if(activePlayer['score'] + CARDSMAP[card][1] <= 21){ // CARDSMAP[card][1] == 'A' --> 11
            activePlayer['score'] += CARDSMAP[card][1];

        } else {
            activePlayer['score'] += CARDSMAP[card][0]; // CARDSMAP[card][0] == 'A' --> 1
        }
    } else {
        activePlayer['score'] += CARDSMAP[card]; // if its not 'A' then add the normal value
    }
}

function showScore(activePlayer){
    if(activePlayer['score'] > 21){
        document.querySelector(activePlayer['scoreSpan']).textContent = 'BUST!';
        document.querySelector(activePlayer['scoreSpan']).style.color = 'red';
    } else {
        document.querySelector(activePlayer['scoreSpan']).textContent = activePlayer['score'];
    }
}

// compute winner and return who just won
// update the table with the wins, losses and draws 
function computeWinner(){
    let winner;
    // if you have < or = to 21 
    if(YOU['score'] <= 21){
        if(YOU['score'] > DEALER['score'] || DEALER['score'] > 21){
            blackjackGame['wins']++;
            winner = YOU;

        } else if(YOU['score'] < DEALER['score']){
            blackjackGame['losses']++;
            winner = DEALER;

        } else if(YOU['score'] === DEALER['score']){
            blackjackGame['draws']++;
        }
        // if the player bust there are two posibilitys
    } else if(YOU['score'] > 21 && DEALER['score'] <= 21){
        winner = DEALER;
        blackjackGame['losses']++;

    } else if( DEALER['score'] > 21 && YOU['score'] > 21){
        blackjackGame['draws']++;
    }

    return winner;
}

function showResult(winner){
    let message, messageColor;

    if(blackjackGame['turnsOver'] === true){
        if(winner === YOU){
            document.querySelector('#wins').textContent = blackjackGame['wins'];
            message = 'You won!';
            messageColor = 'green';
            winSound.play();
        } else if(winner === DEALER){
            document.querySelector('#losses').textContent = blackjackGame['losses'];
            message = 'You lost!';
            messageColor = 'red';
            lossSound.play();
        } else {
            document.querySelector('#draws').textContent = blackjackGame['draws'];
            message = 'You drew';
            messageColor = 'orange';
        }
        document.querySelector('#blackjack-result').textContent = message;
        document.querySelector('#blackjack-result').style.color = messageColor;
    }
}  
