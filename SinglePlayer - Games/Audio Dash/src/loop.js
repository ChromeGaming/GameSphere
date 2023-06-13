//------------------------------------------------------------
// Game loop
//------------------------------------------------------------
let updateCounter = 0;
let numUpdates = 0;
loop = kontra.gameLoop({
  update() {
    updateGamepad();

    activeScenes.forEach(scene => scene.update())

    if ((tutorialScene.active || gameScene.active) && !gameOverScene.active && !winScene.active) {
      numUpdates = 0;
      updateCounter += audio.playbackRate;

      while (updateCounter >= 1) {
        numUpdates++
        updateCounter--;
        ship.update();
      }
    }

    if (tutorialScene.active && !isTutorial && !tutorialScene.isHidding) {
      tutorialScene.hide(() => {

        // reset ship points to line up with gameScene move (which starts at 0);
        for (let count = 0, i = ship.points.length - 1, point; point = ship.points[i]; i--) {
          point.x = 0 - tutorialMoveInc * count++;
        }
        gameScene.show();
      });
    }
  },
  render() {
    if (showTutorialBars) {
      ctx.fillStyle = '#00a3dc';
      ctx.fillRect(0, 0, kontra.canvas.width, 160);
      ctx.fillRect(0, kontra.canvas.height - 160, kontra.canvas.width, 160);
    }

    activeScenes.forEach(scene => scene.render())

    if (menuScene.active || optionsScene.active) {
      showHelpText();
    }

    if (tutorialScene.active) {
      tutorialMove += tutorialMoveInc;
      ship.render(tutorialMove);

      if (ship.points.length > maxLength / 2) {
        ship.points.shift();
      }
    }
  }
});

loop.start();