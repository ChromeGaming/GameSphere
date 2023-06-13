game.update = function () {

    for (var i = 0; i < game.canvas.width * 4; i += 80) {
        if (game.tick % 20 == 0) {
            game.spawnBckParticle(i, -80);
        }

    }

    game.updateBckParticle();
    if (game.currentState == "start") {
        if (random(0, 100) <= 3) {
            game.spawnBug();

        }
        if (game.bugs.length > 0) {
            if (random(0, 50) <= 2) {
                if (random(0, 100) <= 3) {
                    game.spawnBug();

                }
                game.spawnSeakingBullet(game.canvas.width / 2 - 20, game.canvas.height - 80);


            }
        }
        game.score = 0;
    } else if (game.currentState == "play") {
        game.play.update();
    } else if (game.currentState == "preload") {
        game.preload.update();
    } else if (game.currentState == "gameover") {
        game.over.update();
    } else if (game.currentState == "store") {
        game.store.update();
    }


    game.updateBug();

    if (game.highscore < game.score) {
        game.highscore = game.score;
    }

    for (var i = 0; i < game.bugs.length; i++) {
        for (var j = 0; j < game.bullets.length; j++) {
            if (collision(game.bugs[i], game.bullets[j])) {
                game.spawnParticles(game.bugs[i].x, game.bugs[i].y, 11);


                game.bugs[i].HP--;

                if (game.bugs[i].HP <= 0) {
                    game.deleteBug(i);
                }

                if (game.currentState == "play") {
                    game.score += 100;
                    if (game.moneycount > 0) {
                        game.money += 2;
                    } else {
                        game.money += 1;
                    }
                    if (game.score % 10000 == 0 && game.score > 0) {
                        game.spawnAlert("score: " + game.score, "#00ff00");
                        aa.play('powerup');
                    }
                }




                game.deleteBullet(j);
            }
        }
    }
    for (var i = 0; i < game.bugs.length; i++) {
        for (var j = 0; j < game.files.length; j++) {
            if (collision(game.bugs[i], game.files[j])) {
                game.spawnParticles(game.bugs[i].x, game.bugs[i].y, 30);
                game.spawnParticles(game.files[j].x, game.files[j].y, 30);
                game.hits += 0.5;
                game.files[j].HP--;
                game.deleteBug(i);
                game.spawnAlert("file hit", "#ff0000")

            }
        }
    }
    game.gui.update();
    game.updateBullet();
    game.updateParticle();
    game.updateFile();


};