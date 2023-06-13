const selectors = {
    boardContainer: document.querySelector('.board-container'),
    board: document.querySelector('.board'),
    moves: document.querySelector('.moves'),
    timer: document.querySelector('.timer'),
    start: document.querySelector('button'),
    win: document.querySelector('.win'),
  };
  
  const state = {
    gameStarted: false,
    flippedCards: 0,
    totalFlips: 0,
    totalTime: 0,
    loop: null,
  };
  
  const shuffle = (array) => {
    const clonedArray = [...array];
  
    for (let i = clonedArray.length - 1; i > 0; i--) {
      const randomIndex = Math.floor(Math.random() * (i + 1));
      const original = clonedArray[i];
  
      clonedArray[i] = clonedArray[randomIndex];
      clonedArray[randomIndex] = original;
    }
  
    return clonedArray;
  };
  
  const pickRandom = (array, items) => {
    const clonedArray = [...array];
    const randomPicks = [];
  
    for (let i = 0; i < items; i++) {
      const randomIndex = Math.floor(Math.random() * clonedArray.length);
  
      randomPicks.push(clonedArray[randomIndex]);
      clonedArray.splice(randomIndex, 1);
    }
  
    return randomPicks;
  };
  
  const generateGame = () => {
    const dimensions = selectors.board.getAttribute('data-dimension');
  
    if (dimensions % 2 !== 0) {
      throw new Error('The dimension of the board must be an even number.');
    }
  
    let emojis = ['🥔', '🍒', '🥑', '🌽', '🥕', '🍇', '🍉', '🍌', '🥭', '🍍'];
    emojis = shuffle(emojis);
    const picks = pickRandom(emojis, (dimensions * dimensions) / 2);
    const items = shuffle([...picks, ...picks]);
    const cards = `
      <div class="board" style="grid-template-columns: repeat(${dimensions}, auto)">
          ${items
            .map(
              (item) => `
              <div class="card">
                  <div class="card-front"></div>
                  <div class="card-back">${item}</div>
              </div>
          `
            )
            .join('')}
      </div>
    `;
  
    const parser = new DOMParser().parseFromString(cards, 'text/html');
  
    selectors.board.replaceWith(parser.querySelector('.board'));
  };
  
  
  const startGame = () => {
    state.gameStarted = true;
    selectors.start.classList.add('disabled');
  
    state.loop = setInterval(() => {
      state.totalTime++;
  
      selectors.moves.innerText = `${state.totalFlips} moves`;
      selectors.timer.innerText = `Time: ${state.totalTime} sec`;
    }, 1000);
  };
  
  const resetCards = () => {
    const cards = document.querySelectorAll('.card');
  
    cards.forEach((card) => {
      card.classList.remove('flipped');
      card.classList.remove('matched');
    });
  };
  
  const flipBackCards = () => {
    const flippedCards = document.querySelectorAll('.card.flipped:not(.matched)');
  
    flippedCards.forEach((card) => {
      card.classList.remove('flipped');
    });
  
    state.flippedCards = 0;
  };
  
  const flipCard = (card) => {
    state.flippedCards++;
    state.totalFlips++;
  
    if (!state.gameStarted) {
      startGame();
    }
  
    if (state.flippedCards <= 2) {
      card.classList.add('flipped');
    }
  
    if (state.flippedCards === 2) {
      const flippedCards = document.querySelectorAll('.flipped:not(.matched)');
  
      if (flippedCards[0].querySelector('.card-back').innerText === flippedCards[1].querySelector('.card-back').innerText) {
        flippedCards[0].classList.add('matched');
        flippedCards[1].classList.add('matched');
      }
  
      setTimeout(() => {
        flipBackCards();
      }, 1000);
    }
  
    if (!document.querySelectorAll('.card:not(.matched)').length) {
      setTimeout(() => {
        selectors.boardContainer.classList.add('flipped');
        selectors.win.innerHTML = `
          <span class="win-text">
            You won!<br />
            with <span class="highlight">${state.totalFlips}</span> moves<br />
            under <span class="highlight">${state.totalTime}</span> seconds
          </span>
          <button id="playAgainButton">Play Again</button>
          <button id="quitButton">Quit</button>
        `;
        document.getElementById('playAgainButton').addEventListener('click', resetGame);
        document.getElementById('quitButton').addEventListener('click', showConfirmationPopup);
  
        clearInterval(state.loop);
      }, 1000);
    }
  };
  
  const resetGame = () => {
  state.gameStarted = false;
  state.flippedCards = 0;
  state.totalFlips = 0;
  state.totalTime = 0;
  clearInterval(state.loop);

  resetCards(); // Flip all cards back to the original position
  generateGame();
  attachEventListeners();
  selectors.boardContainer.classList.remove('flipped');
  selectors.win.innerHTML = '';

};

  const attachEventListeners = () => {
    document.addEventListener('click', (event) => {
      const eventTarget = event.target;
      const eventParent = eventTarget.parentElement;
  
      if (eventTarget.className.includes('card') && !eventParent.className.includes('flipped')) {
        flipCard(eventParent);
      } else if (eventTarget.nodeName === 'BUTTON' && !eventTarget.className.includes('disabled')) {
        startGame();
  
        if (eventTarget.id === 'backButton') {
          showConfirmationPopup();
        }
      }
    });
  
    document.getElementById('confirmButton').addEventListener('click', () => {
      hideConfirmationPopup();
      window.history.back();
    });
  
    document.getElementById('cancelButton').addEventListener('click', () => {
      hideConfirmationPopup();
    });
  };
  
  const showConfirmationPopup = () => {
    document.getElementById('confirmationPopup').style.display = 'flex';
  };
  
  const hideConfirmationPopup = () => {
    document.getElementById('confirmationPopup').style.display = 'none';
  };
  
  generateGame();
  attachEventListeners();
  