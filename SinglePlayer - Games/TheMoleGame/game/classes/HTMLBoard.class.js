(function () {
  window.HTMLBoard = function (options) {
    var that = this, game = options.game, container = options.container, moleClass = 'down', tileSize = 50;

    function onKeyDown(e) {


      switch (e.keyCode) {
        case 38:
          game.nextMoleMove('up');
          that.changeMoleLook('up');
          break;
        case 40:
          game.nextMoleMove('down');
          that.changeMoleLook('down');
          break;
        case 37:
          game.nextMoleMove('left');
          that.changeMoleLook('left');
          break;
        case 39:
          game.nextMoleMove('right');
          that.changeMoleLook('right');
          break;
      }

      e.preventDefault();
    }

    function onMouseDown(e) {
      goByClick(e);

      // TODO continious mole move implement
    }

    function goByClick(e) {
      var molePosition = document.querySelector(".board-wrapper.active .tile.tile--mole").getBoundingClientRect(),
        molePositionRight = molePosition.left + molePosition.width,
        molePositionBottom = molePosition.top + molePosition.height,
        clickX = e.clientX,
        clickY = e.clientY;

      if(e.touches) {
        clickX = e.touches[0].clientX;
        clickY = e.touches[0].clientY;
      }

      if (molePosition.left < clickX && clickX < molePositionRight) {
        if (molePosition.top < clickY && clickY < molePositionBottom) {
          console.log("mole clicked"); // collision with mole
        } else if (molePosition.top < clickY) {
          // collision X only
          game.nextMoleMove('down');
          that.changeMoleLook('down');
        } else {
          game.nextMoleMove('up');
          that.changeMoleLook('up');
        }
      } else if (molePosition.top < clickY && clickY < molePositionBottom) {
        // collision Y only
        if (molePosition.left < clickX) {
          game.nextMoleMove('right');
          that.changeMoleLook('right');
        } else {
          game.nextMoleMove('left');
          that.changeMoleLook('left');
        }
      }
    }

    function init() {
      var w = window,
        e = document.documentElement,
        g = e.getElementsByTagName('body')[0],
        y = w.innerHeight || e.clientHeight || g.clientHeight;

      tileSize = Math.floor(y / 7);
      that.draw();
    }

    //TODO move it elsewhere
    function addListeners() {
      document.addEventListener('keydown', onKeyDown);

      if('ontouchstart' in document.documentElement) {
        document.addEventListener('touchstart', onMouseDown);
      } else {
        document.addEventListener('mousedown', onMouseDown);
      }

      game.on('game-started', that.draw);

      //TODO instead of redrawing whole thing, mov
      game.on('object-moved', function (data) {
        console.log('object ', data.type, ' (#', data.id, ') moved from X:', data.from.x, ', Y:', data.from.y, ' to X:', data.to.x, ', Y:', data.to.y);

        //Moving objects animation
        var el = container.querySelector("#item_" + data.id);

        el.classList.add('anim');
        el.style.transform = 'translate(' + tileSize * data.to.x + 'px, ' + tileSize * data.to.y + 'px)';
        el.style.webkitTransform = 'translate(' + tileSize * data.to.x + 'px, ' + tileSize * data.to.y + 'px)';
        el.style.MozTransform = 'translate(' + tileSize * data.to.x + 'px, ' + tileSize * data.to.y + 'px)';
      });

      game.on('bug-eaten', function (id) {
        console.log('bug ', id, ' eaten');
        //TODO add more exciting anim
        document.querySelector('#item_' + id).classList.add('remove-anim');
      });

      game.on('dirt-removed', function (id) {
        console.log('dirt ', id, ' removed');
        //TODO add more exciting anim
        document.querySelector('#item_' + id).classList.add('remove-anim');
      });

      game.on('mole-killed', function (data) {
        console.log('mole ', data.mole, ' killed');
        //TODO add more exciting anim
        document.querySelector('#item_' + data.mole).classList.add('remove-anim');
        document.querySelector('#item_' + data.rock).classList.add('bloody');
      });

      game.on('rock-pushed', function (id) {
        console.log('rock', id, 'rock');
      });

      //TODO add animation
      game.on('cant-push-that-rock', function (id) {
        console.log('cant-push-that-rock', id, 'cant-push-that-rock');
      });

      game.on('door-opened', function (id) {
        console.log('door ', id, ' are now open');
        //TODO add more exciting anim
        document.querySelector('#item_' + id).classList.add('remove-anim');
      });

      game.on('princess-found', function () {
        console.log('princess found!');
        //TODO add more exciting anim
      });
    }

    function removeListeners() {
      document.removeEventListener('keydown', onKeyDown);
      document.removeEventListener('touchstart', onMouseDown);
      document.removeEventListener('mousedown', onMouseDown);
    }

    this.getTileSize = function () {
      return tileSize;
    };

    this.reset = function () {
      init();
    };

    this.draw = function () {
      var container = options.container;
          container.style.backgroundSize =  tileSize + 'px';
      var board = game.getBoard();

      var boardNode = document.createDocumentFragment();

      var tileNode = document.createElement('div');
      tileNode.classList.add('tile');

      var tileInnerNode = document.createElement('div');
      tileInnerNode.classList.add('tile__inner');
      tileNode.appendChild(tileInnerNode);

      for (var i = 0, h = board.getHeight(); i < h; i++) {
        for (var j = 0, w = board.getWidth(); j < w; j++) {
          var tile = board.getTile(j, i);
          var newNode = tileNode.cloneNode(true);
          newNode.classList.add('tile--' + tile.getType());
          if (tile.getType() === "mole") {
            newNode.classList.add(moleClass);
          }
          newNode.id = 'item_' + tile.getId();
          newNode.style.width = tileSize + 'px';
          newNode.style.height = tileSize + 'px';
          newNode.style.transform = 'translate(' + tileSize * j + 'px, ' + tileSize * i + 'px)';
          newNode.style.webkitTransform = 'translate(' + tileSize * j + 'px, ' + tileSize * i + 'px)';
          newNode.style.MozTransform = 'translate(' + tileSize * j + 'px, ' + tileSize * i + 'px)';
          boardNode.appendChild(newNode);
        }
      }

      DOMHelper.purgeElement(container);

      container.style.marginLeft = '-' + tileSize + 'px';
      container.style.width = tileSize * board.getWidth() + "px";
      container.style.height = tileSize * board.getHeight() + "px";

      container.appendChild(boardNode);
    };

    this.changeMoleLook = function (direction) {
      moleClass = direction;
      var mole = container.querySelector(".tile--mole");
      if (mole) {
        mole.classList.remove('up');
        mole.classList.remove('down');
        mole.classList.remove('left');
        mole.classList.remove('right');
        mole.classList.add(moleClass);
      }
    };

    this.enable = function () {
      (options.container).classList.add('active');

      addListeners();
    };

    this.disable = function () {
      (options.container).classList.remove('active');

      removeListeners();
    };

    this.removeEventListeners = removeListeners;

    init();
  };

}());