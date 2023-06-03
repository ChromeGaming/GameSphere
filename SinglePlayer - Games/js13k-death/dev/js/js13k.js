'use strict';


/**
 * @namespace js13k
 */
const js13k = {
	// currentLevel: null,
	// isGameOver: false,
	// turnCreature: null,
};


window.addEventListener( 'load', () => {
	// showWatermark = true;

	engineInit(
		// init/setup
		() => {
			js13k.soundDie = new Sound( [1.4,.05,507,.01,.21,.36,1,3.99,0,.1,0,0,.19,1.7,0,.9,0,.35,.16,.34] );
			js13k.soundHit1 = new Sound( [.8,,305,.01,.03,.09,3,1.27,2.7,,,,,.5,,.5,,.85,.02,.24] );
			js13k.soundHit2 = new Sound( [1.1,.05,257,.01,.01,.14,1,2.2,-8.6,.1,0,0,0,1.4,0,.1,0,.8,.02,0] );

			js13k.currentLevel = new js13k.Level();
			js13k.turnCreature = js13k.TurnManager.get();

			setTimeout( () => js13k.UI.init(), 10 );
		},

		// update, handle game state
		() => {
			if( js13k.isGameOver ) {
				return;
			}

			if( js13k.currentLevel.playOutroTimer ) {
				return;
			}

			if( mouseWheel < 0 ) {
				cameraScale -= 32;
			}
			else if( mouseWheel > 0 ) {
				cameraScale += 32;
			}

			cameraScale = clamp( cameraScale, 96, 256 );

			const player = js13k.currentLevel.player;

			if( player ) {
				if( keyWasPressed( 69 ) ) {
					if( js13k.TurnManager.isPlayerTurn() ) {
						js13k.UI.buttonEndTurn.click();
					}
				}
				// Digit1, Numpad1
				else if( keyWasPressed( 49 ) || keyWasPressed( 97 ) ) {
					player.setAttack( 0 );
				}
				// Digit2, Numpad2
				else if( keyWasPressed( 50 ) || keyWasPressed( 98 ) ) {
					player.setAttack( 1 );
				}
				// Digit3, Numpad3
				else if( keyWasPressed( 51 ) || keyWasPressed( 99 ) ) {
					player.setAttack( 2 );
				}
			}
		},

		// post update
		() => {
			if( js13k.isGameOver ) {
				return;
			}

			// Escape: toggle pause
			if( keyWasPressed( 27 ) ) {
				paused = !paused;
			}

			js13k.currentLevel.update();
		},

		// before rendering, draw background effects
		() => {},

		// after rendering, draw overlay, e.g. UI
		() => {
			// Pause screen
			if( paused ) {
				overlayContext.fillStyle = '#0007';
				overlayContext.fillRect( 0, 0, overlayCanvas.width, overlayCanvas.height );

				overlayContext.font = '600 italic 72px monospace';
				overlayContext.textAlign = 'center';
				overlayContext.textBaseline = 'bottom';

				js13k.UI.writeText(
					'PAUSED',
					overlayCanvas.width * 0.5, overlayCanvas.height * 0.5,
					'#d0a', '#0ac',
					vec2( 3, 0 )
				);
			}

			if( js13k.isGameOver ) {
				return;
			}

			js13k.currentLevel.renderAfter();

			if( !js13k.currentLevel.playOutroTimer ) {
				js13k.UI.drawHUD();
			}
		},

		// sprite sheet
		'tiles.png'
	);
} );
