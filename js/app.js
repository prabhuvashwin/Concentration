 /**
  * Create a list that holds all of your cards
  */
  let cards = ['fa-diamond', 'fa-paper-plane-o', 'fa-anchor', 'fa-bolt',
           'fa-cube', 'fa-leaf', 'fa-bicycle', 'fa-bomb', 'fa-diamond',
           'fa-paper-plane-o', 'fa-anchor', 'fa-bolt', 'fa-cube', 'fa-leaf',
           'fa-bicycle', 'fa-bomb'];
  const gameStatus = {PLAYING: 1, NOTPLAYING: 2};
  let totalNumberOfMatches = cards.length / 2;
  let maxNumberOfMovesForThreeStars = 12;
  let maxNumberOfMovesForTwoStars = 24;
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
  let status = gameStatus.NOTPLAYING;

  /**
   * initializeTimer - Starts the timer when the game starts
   * - Uses setInterval function to increment the timer value every second
   * - secondsElapsed variable value is used to display timer text
   * - currentTimerIntervalID holds a unique ID which can be used to reset the timer
   */
  function initializeTimer() {
    if (!currentTimerIntervalID){
      currentTimerIntervalID = setInterval(function() {
        if (status === gameStatus.PLAYING) {
          timer.innerText = `${secondsElapsed}`;
          secondsElapsed++;
        }
      }, 1000);
    }
  }

  /**
   * resetTimer - Timer interval unique ID is passed to this function as
   * parameter to reset the timer
   */
  function resetTimer() {
    if(currentTimerIntervalID) {
      clearInterval(currentTimerIntervalID);
      secondsElapsed = 0;
      currentTimerIntervalID = null;
      status = gameStatus.NOTPLAYING;
      timer.innerText = `${secondsElapsed}`;
    }
  }

  /**
   * setRatings - Total number of moves taken by the user to complete the game
   * is passed on as paramter to this function. Rating value can be either
   * 0, 1, 2, 3 depending on the number of moves.
   *
   * @param  {type} numberOfMoves number of moves taken by the user
   * @returns {type} rating as per the specification
   */
  function setRatings(numberOfMoves) {
    let rating = 1;

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
    } else {
      rating = 1;
      starRating[0].classList = 'fa fa-star';
      starRating[1].classList = 'fa fa-star-o';
      starRating[2].classList = 'fa fa-star-o';
    }

    return rating;
  }

  /**
   * shuffle - Display the cards on the page
   * - shuffle the list of cards using the provided "shuffle" method below
   * - loop through each card and create its HTML
   * - add each card's HTML to the page
   * Reference: Shuffle function from http://stackoverflow.com/a/2450976
   * @param  {type} array array of elements to shuffle
   * @returns {type} shuffled array
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

  /**
   * initializeGame - This method initializes the game.
   * - Shuffles the cards to get a random order
   * - Resets all counters, timers
   * - Reinitializes the memory board with shuffled cards
   *
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

    resetTimer();
    initializeTimer();
  }

 /**
  * clickEvent - set up the event listener for a card. If a card is clicked:
  * - display the card's symbol
  * - add the card to a *list* of "open" cards
  * - if the list already has another card, check to see if the two cards match
  *
  * @param  {type} evt holds the value of the card element clicked
  *
  */
 function clickEvent(evt) {
   if (status === gameStatus.NOTPLAYING) {
     status = gameStatus.PLAYING;
   }
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
     status = gameStatus.NOTPLAYING;
     switch (finalRating) {
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

 /**
  * intro - This function displays a message explaining the rules of the game.
  * User can click OK to start the game
  *
  */
 function intro() {
   console.log("intro");
   let msg = '16 blocks. 8 pairs. Click on the second block having the same image' +
              ' after selecting the first one, to lock in the pair.' +
              ' Select all pairs in record time to get maximum stars.' +
              ' 12 moves: 3 stars, 24 moves: 2 stars, 24+ moves: 1 star, ';
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

 /**
  * endGame - Announces the result. User has the choice to either restart
  * the game or stop playing. Choosing to restart the game will initialize
  * the game to the the initial state.
  *
  * @param  {type} message holds the message to display to the user
  *
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
 }

 /**
  * function expression 'addCardClickListener' - This function expression is
  * used attach event listeners to all the cards. The event attached is a click
  * event which is defined in the clickEvent function
  *
  */
 let addCardClickListener = function () {
   const $cards = document.querySelectorAll('.deck>.card');
   [...$cards].forEach($card => $card.addEventListener('click', clickEvent));
 };

 /**
  * restartGame - Here, we attach click event listener to restart button.
  * Clicking this button reinitializes the game
  *
  * @param  {type} 'click'   event on which this event listener triggers
  * @param  {type} function() displays a message asking whether user wants to
  * restart the game or not. User can either restart or cancel.
  *
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

 /** 
  * Starting point of this applications. Initializes the game and displays
  * a message explaining the rules to the user
  */
 intro();
