/*
 * Create a list that holds all of your cards
 */
let cards = ['fa-diamond', 'fa-paper-plane-o', 'fa-anchor', 'fa-bolt',
         'fa-cube', 'fa-leaf', 'fa-bicycle', 'fa-bomb', 'fa-diamond',
         'fa-paper-plane-o', 'fa-anchor', 'fa-bolt', 'fa-cube', 'fa-leaf',
         'fa-bicycle', 'fa-bomb'];
let totalNumberOfMatches = cards.length / 2;
let maxNumberOfMovesForThreeStars = 10;
let maxNumberOfMovesForTwoStars = 20;
let maxNumberOfMovesForOneStar = 40;
let numberOfMoves = 0;
let numberOfMatches = 0;
let numberOfCardsOpened = [];
let deckOfCards = document.querySelector('.deck');
let scorePanel = document.querySelector('.score-panel');
let starRating = document.querySelectorAll('.fa-star');
let restartGame = document.querySelector('.restart');
let moves = document.querySelector('.moves');
let timer = document.querySelector('.timer');
let currentTimerIntervalID = 0;
let delayInMilliseconds = 500;
let secondsElapsed = 0;

/*
 * Starts the timer when the game starts
 *  - Uses setInterval function to increment the timer value every second
 *  - secondsElapsed variable value is used to display timer text
 *  - currentTimerIntervalID holds a unique ID which can be used to reset the timer
 */
function initializeTimer() {
  currentTimerIntervalID = setInterval(function() {
    timer.innerText = `${secondsElapsed}`;
    secondsElapsed++;
  }, 1000);
}

/*
 * Timer interval unique ID is passed to this function as parameter to reset the timer
 */
function resetTimer(t) {
  if(t) {
    clearInterval(t);
    secondsElapsed = 0;
  }
}

/*
 * Total number of moves taken by the user to complete the game is passed on as
 * paramter to this function. Rating value can be either 0, 1, 2, 3 depending on
 * the number of moves.
 */
function setRatings(numberOfMoves) {
  let rating = 0;

  if (numberOfMoves <= maxNumberOfMovesForThreeStars) {
    rating = 3;
    starRating[0].classList = 'fa fa-star';
    starRating[1].classList = 'fa fa-star';
    starRating[2].classList = 'fa fa-star';
  } else if (numberOfMoves > maxNumberOfMovesForThreeStars && numberOfMoves <= maxNumberOfMovesForTwoStars) {
    rating = 2;
    starRating[0].classList = 'fa fa-star';
    starRating[1].classList = 'fa fa-star';
    starRating[2].classList = 'fa fa-star-o';
  } else if (numberOfMoves > maxNumberOfMovesForTwoStars && numberOfMoves <= maxNumberOfMovesForOneStar) {
    rating = 1;
    starRating[0].classList = 'fa fa-star';
    starRating[1].classList = 'fa fa-star-o';
    starRating[2].classList = 'fa fa-star-o';
  } else {
    rating = 0;
    starRating[0].classList = 'fa fa-star-o';
    starRating[1].classList = 'fa fa-star-o';
    starRating[2].classList = 'fa fa-star-o';
  }

  return rating;
}

/*
 * Display the cards on the page
 *   - shuffle the list of cards using the provided "shuffle" method below
 *   - loop through each card and create its HTML
 *   - add each card's HTML to the page
 * Reference: Shuffle function from http://stackoverflow.com/a/2450976
 */
function shuffle(array) {
    var currentIndex = array.length, temporaryValue, randomIndex;

    while (currentIndex !== 0) {
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;
        temporaryValue = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = temporaryValue;
    }

    return array;
}

/*
 * This method initializes the game.
 *  - Shuffles the cards to get a random order
 *  - Resets all counters, timers
 *  - Reinitializes the memory board with shuffled cards
 */
function initializeGame() {
  let shuffledCards = shuffle(cards);

  // Emptying the deck, so as to repopulate it with the shuffled cards
  deckOfCards.innerHTML = "";
  secondsElapsed = 0;
  numberOfMoves = 0;
  numberOfMatches = 0;
  moves.textContent = '0';
  starRating[0].classList = 'fa fa-star';
  starRating[1].classList = 'fa fa-star';
  starRating[2].classList = 'fa fa-star';

  for (let i = 0; i < shuffledCards.length; i++) {
    let node1 = document.createElement('l1');
    node1.classList = 'card';

    let node2 = document.createElement('i');
    node2.classList = `fa ${shuffledCards[i]}`;

    node1.appendChild(node2);

    deckOfCards.appendChild(node1);
  }

  addCardClickListener();

  resetTimer(currentTimerIntervalID);
  initializeTimer();
}

/*
 * set up the event listener for a card. If a card is clicked:
 *  - display the card's symbol (put this functionality in another function that you call from this one)
 *  - add the card to a *list* of "open" cards (put this functionality in another function that you call from this one)
 *  - if the list already has another card, check to see if the two cards match
 *    + if the cards do match, lock the cards in the open position (put this functionality in another function that you call from this one)
 *    + if the cards do not match, remove the cards from the list and hide the card's symbol (put this functionality in another function that you call from this one)
 *    + increment the move counter and display it on the page (put this functionality in another function that you call from this one)
 *    + if all cards have matched, display a message with the final score (put this functionality in another function that you call from this one)
 */
 function clickEvent(evt) {
   let card = evt.currentTarget;
   let finalRating;
   if (card.classList.contains('show') || card.classList.contains('match')) {
     return true;
   }

   card.classList.add('open', 'show');

   numberOfCardsOpened.push(card);

   if (numberOfCardsOpened.length > 1) {
     if (card.innerHTML == numberOfCardsOpened[0].innerHTML) {
       let opened1 = deckOfCards.querySelectorAll('.open');
       console.log("opened1:");
       console.log(opened1);
       for (let o1 of opened1) {
         o1.classList.add('match', 'animated', 'infinite', 'rotateIn');
       }
       setTimeout(function() {
         let matched = deckOfCards.querySelectorAll('.match');
         console.log("matched: " + matched);
         for (let m of matched) {
           m.classList.remove('open', 'show', 'animated', 'infinite', 'rotateIn');
         }
       }, delayInMilliseconds);
       numberOfMatches++;
     } else {
       let opened2 = deckOfCards.querySelectorAll('.open');
       console.log("opened2:");
       console.log(opened2);
       for (let o2 of opened2) {
         o2.classList.add('notmatch', 'animated', 'infinite', 'shake');
       }

       setTimeout(function() {
         let opened3 = deckOfCards.querySelectorAll('.open');
         console.log("opened3:");
         console.log(opened3);
         for (let o3 of opened3) {
           o3.classList.remove('open', 'show', 'notmatch', 'animated', 'infinite', 'shake');
         }
       }, delayInMilliseconds);
     }

     numberOfCardsOpened = [];
     numberOfMoves++;
     finalRating = setRatings(numberOfMoves);
     moves.innerText = numberOfMoves;
   }

   // End game if all cards are matched
   if (totalNumberOfMatches === numberOfMatches) {
     let message = `Number of moves: ${numberOfMoves}. Time taken: ${secondsElapsed} seconds. ${finalRating} star rating. `;
     switch (finalRating) {
       case 0:
         message += `Try harder.`;
         break;
       case 1:
         message += `You can do better.`;
         break;
       case 2:
         message += `Great going.`;
         break;
       case 3:
         message += `Record time.`;
         break;
     }
     setTimeout(function() {
       console.log(message);
       endGame(message);
     }, 500);
   }
 }

 /*
  * This function displays a message explaining the rules of the game.
  * User can click OK to start the game
  */
 function intro() {
   console.log("intro");
   let msg = '16 blocks. 8 pairs. Click on the second block having the same image' +
              ' after selecting the first one, to lock in the pair.' +
              ' Select all pairs in record time to get maximum stars.' +
              ' 10 moves: 3 stars, 20 moves: 2 stars, 40 moves: 1 star, ' +
              ' 40+ moves: Try again :)';
   console.log(msg);
   swal({
     allowEscapeKey: false,
     title: 'Lets test your memory today! ;)',
     text: msg,
     type: 'info',
     showCancelButton: false,
     confirmButtonText: 'OK! Lets Play :)',
     confirmButtonColor: '#498eff'
   }).then(function (result) {
     if (result) {
       initializeGame();
     }
   });
 }

 /*
  * Announces the result. User has the choice to either restart the game or
  * stop playing. Choosing to restart the game will initialize the game to the
  * the initial state.
  */
 function endGame(message) {
   swal({
     allowEscapeKey: false,
     title: 'Winner!!!!',
     text: message,
     type: 'success',
     showCancelButton: true,
     confirmButtonText: 'Yes! Restart Game Now!!!',
     confirmButtonColor: '#498eff',
     cancelButtonColor: '#ff1e1e'
   }).then(function (result) {
     if (result) {
       initializeGame();
     }
   });
   resetTimer(currentTimerIntervalID);
 }

 /*
  * This function expression is used attach event listeners to all the cards
  * The event attached is a click event which is defined in the clickEvent function
  */
 let addCardClickListener = function () {
   const $cards = document.querySelectorAll('.deck>.card');
   [...$cards].forEach($card => $card.addEventListener('click', clickEvent));
 };

 /*
  * Here, we attach click event listener to restart button.
  * Clicking this button reinitializes the game
  */
 restartGame.addEventListener('click', function() {
  swal({
    allowEscapeKey: true,
    title: 'Are you sure you want to restart the game?',
    text: 'All progress will be lost',
    type: 'warning',
    showCancelButton: true,
    confirmButtonText: 'Yes! Restart Game Now!!!',
    confirmButtonColor: '#498eff',
    cancelButtonColor: '#ff1e1e'
  }).then(function (result) {
    if (result) {
      initializeGame();
    }
  })
});

/*
 * intro function is the first function called when the page is loaded
 * This displays an introduction message explaining the rules to the game
 */
 intro();
