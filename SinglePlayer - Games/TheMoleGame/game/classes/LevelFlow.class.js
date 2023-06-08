(function () {
  "use strict";

  window.LevelFlow = function (options) {
    var mapLoader = new MapLoader();
    var levels = [];
    var that = this;

    function loadLevel(num) {
      var level = mapLoader.getLevel(num);

      if (!level) {
        throw new Error('Unknown level #' + num);
        return;
      }

      //crate new game
      var game = new Game(level);

      var boardDiv = document.createElement('div');
      boardDiv.classList.add('board-wrapper');
      boardDiv.id = 'level_' + num;

      //set up new HTML board
      var htmlBoard = new HTMLBoard({
        game: game,
        container: boardDiv
      });

      (options.container).appendChild(boardDiv);

      levels.push({
        level: level,
        game: game,
        htmlBoard: htmlBoard,
        boardDiv: boardDiv
      })
    }

    function init() {
      for (var i = 0, l = mapLoader.getNumberOfLevels(); i < l; i++) {
        loadLevel(i);
      }

      window.onresize = function() {
        for(var i=0;i<levels.length;i++) {
          levels[i].htmlBoard.reset();
        }

        centerTheBoard();
      };
    }

    init();

    function centerTheBoard() {
      var game = levels[currentLevel].game;
      var boardDiv = levels[currentLevel].boardDiv;
      var scrollContainer = (options.container).parentNode;
      var htmlBoard = levels[currentLevel].htmlBoard;
      var tileSize = htmlBoard.getTileSize();

      var containerWidth = scrollContainer.clientWidth;
      var boardWidth = game.getBoard().getWidth() * htmlBoard.getTileSize();
      var boardOffset = boardDiv.offsetLeft;

      var playerPosition = playerXPos * tileSize;
      var xMargin = (containerWidth - boardWidth) / 2;

      var to = 0;
      if(xMargin < 0) {
        if(playerPosition < ( containerWidth - 2 * tileSize )) {
          to =  - boardOffset;
        } else {
          //center mole;
          to = - (boardOffset + playerXPos * tileSize - containerWidth/2 + tileSize);
        }
      } else {
        //center board
        to = - (boardOffset - (containerWidth - boardWidth) / 2);
      }

      (options.container).style.transform = 'translate3d(' + to + 'px, 0, 0)';
      (options.container).style.webkitTransform = 'translate3d(' + to + 'px, 0, 0)';
      (options.container).style.MozTransform = 'translate3d(' + to + 'px, 0, 0)';
    }

    var currentLevel = null;
    var playerXPos = 0;
    var rafRequestId = null;

    this.playLevel = function (num) {
      localStorage.level = num;
      currentLevel = num;

      var game = levels[currentLevel].game;
      var htmlBoard = levels[currentLevel].htmlBoard;

      htmlBoard.enable();

      function gameLoop() {
        game.update();

        rafRequestId = requestAnimationFrame(gameLoop);
      }

      gameLoop();

      document.getElementById('title').innerHTML = game.getName();

      game.on('object-moved', function(item) {
        if(item.type === 'mole') {
          playerXPos = item.to.x;
          centerTheBoard();
        }
      });

      game.on('princess-found', function () {
        localStorage.clear();
        htmlBoard.removeEventListeners();
        setTimeout(function() {htmlBoard.changeMoleLook('down');}, 400);
        setTimeout(function() {htmlBoard.changeMoleLook('right');}, 800);
        setTimeout(function() {htmlBoard.changeMoleLook('down');}, 1200);
        setTimeout(function() {htmlBoard.changeMoleLook('right');}, 1600);
        setTimeout(function() {htmlBoard.changeMoleLook('down');}, 2000);
        setTimeout(function() {location.reload();}, 2400);

      });

      //TODO show win screen
      game.on('game-won', function (stars) {
        console.log('Level won with ' + stars + ' stars!');

        setTimeout(function () {
          //clean up
          game.destroy();
          htmlBoard.disable();
          cancelAnimationFrame(rafRequestId);

          that.playLevel(currentLevel + 1);
        }, 500);
      });

      //TODO show loose screen
      game.on('game-lost', function () {
        console.log('You lost :(');
      });

      game.start();

      playerXPos = 0;
      centerTheBoard();
    };

    this.resetCurrentLevel = function() {
      var game = levels[currentLevel].game;

      game.reset();
      cancelAnimationFrame(rafRequestId);

      this.playLevel(currentLevel);
    };

  };

})();