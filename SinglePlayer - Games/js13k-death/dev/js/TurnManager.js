'use strict';


js13k.TurnManager = {


	_creatures: [],
	_current: 0,
	// _turnAction: null,


	/**
	 *
	 * @private
	 */
	_handlePlayerTurn() {
		let cursor = '';
		const mouseX = Math.round( mousePos.x );
		const mouseY = Math.round( mousePos.y );

		const tile = js13k.currentLevel.tiles[mouseX]?.[mouseY];

		if( tile && js13k.UI.isOverCanvas ) {
			const player = js13k.turnCreature;
			const mouseRounded = vec2( mouseX, mouseY );
			const distance = mouseRounded.distance( player.pos );
			const tileContent = js13k.currentLevel.getTileContent( vec2( mouseX, mouseY ) );
			let attackable = null;

			// Show tile as possible move target.
			if( player.movesLeft && this.canMoveToTile( player, tile, tileContent ) ) {
				// Check if tile is in move distance.
				if( distance <= player.movesLeft ) {
					tile.highlightMove = true;
					cursor = 'pointer';

					// Move to tile.
					if( mouseWasPressed( 0 ) ) {
						this._turnAction = player.getTurnActionMove( mouseX, mouseY );
						player.movesLeft -= Math.ceil( distance );
					}
				}
			}
			// Show tile as possible attack target.
			else if(
				player.attacksLeft &&
				/* jshint -W084 */
				( attackable = this.canAttackTile( tileContent ) )
				/* jshint +W084 */
			) {
				// Check if tile is in attack distance.
				if(
					attackable !== player &&
					distance <= player.attackRange
				) {
					let attackables = null;

					// Second better check if target is really attackable.
					// Relevant for attacks with range > 1.
					if(
						/* jshint -W084 */
						( attackables = this._highlightTilesForAttack( tile, player, attackable ) )
						/* jshint +W084 */
					) {
						cursor = 'pointer';

						// Attack creature on the tile.
						if( mouseWasPressed( 0 ) ) {
							this._turnAction = player.getTurnActionAttack( attackables );
							player.attacksLeft--;
						}
					}
				}
			}
		}

		js13k.UI.setCursor( cursor );
	},


	/**
	 *
	 * @private
	 * @param  {js13k.Tile}     tile     - The currently selected tile.
	 * @param  {js13k.Player}   player
	 * @param  {js13k.Creature} creature
	 * @return {?js13k.Creature[]}
	 */
	_highlightTilesForAttack( tile, player, creature ) {
		const attackables = [creature];

		const pos = player.pos.copy();
		pos.x = Math.round( pos.x );
		pos.y = Math.round( pos.y );

		// Sweeping Blow: Highlight all tiles around the player.
		if( player.attackType == 2 ) {
			const tiles = [
				vec2( pos.x + 1, pos.y + 1 ),
				vec2( pos.x + 1, pos.y - 1 ),
				vec2( pos.x + 1, pos.y     ),
				vec2( pos.x - 1, pos.y + 1 ),
				vec2( pos.x - 1, pos.y - 1 ),
				vec2( pos.x - 1, pos.y     ),
				vec2( pos.x,     pos.y + 1 ),
				vec2( pos.x,     pos.y - 1 ),
			];

			attackables[0].expectedDamage = player.attackDamage;

			tiles.forEach( tPos => {
				const t = js13k.currentLevel.tiles[tPos.x]?.[tPos.y];

				if( t ) {
					t.highlightAttack = true;

					const tileContent = js13k.currentLevel.getTileContent( tPos );

					if( tileContent ) {
						const tileCreatures = tileContent.filter( c => c instanceof js13k.Creature );

						tileCreatures.forEach( tc => {
							if( !attackables.includes( tc ) ) {
								tc.expectedDamage = player.attackDamage;
								attackables.push( tc );
							}
						} );
					}
				}
			} );
		}
		// Hatchet Throw: Highlight all tiles from the player to the target.
		else if( player.attackType == 1 ) {
			const tiles = [];

			const normedDirection = tile.pos.subtract( player.pos ).normalize();
			let distance = player.pos.distance( tile.pos );

			const checkContent = o => {
				return !( o instanceof js13k.Creature || o.isBlood );
			};

			while( distance >= 1 ) {
				const target = pos.add( normedDirection.scale( distance ) );
				target.x = Math.round( target.x );
				target.y = Math.round( target.y );

				const t = js13k.currentLevel.tiles[target.x]?.[target.y];

				if( t ) {
					const tileContent = js13k.currentLevel.getTileContent( target );

					// Something is in the way.
					if( tileContent ) {
						if( tileContent.find( checkContent ) ) {
							return null;
						}

						const tileCreatures = tileContent.filter( c => c instanceof js13k.Creature );

						tileCreatures.forEach( tc => {
							if( !attackables.includes( tc ) ) {
								attackables.push( tc );
							}
						} );
					}

					tiles.push( t );
				}
				else {
					return null;
				}

				distance--;
			}

			// Sort targets so it starts with the closer one.
			attackables.sort( ( a, b ) => a.pos.distance( player.pos ) - b.pos.distance( player.pos ) );

			attackables.forEach( ( target, i ) => {
				target.expectedDamage = max( player.attackDamage - i * 2, 0 );
			} );

			tiles.forEach( t => t.highlightAttack = true );
		}
		// Direct Attack
		else {
			attackables[0].expectedDamage = player.attackDamage;

			const tileContent = js13k.currentLevel.getTileContent( creature.pos );

			if( tileContent ) {
				const tileCreatures = tileContent.filter( c => c instanceof js13k.Creature );

				tileCreatures.forEach( tc => {
					if( !attackables.includes( tc ) ) {
						tc.expectedDamage = player.attackDamage;
						attackables.push( tc );
					}
				} );
			}
		}

		tile.highlightAttack = true;

		return attackables;
	},


	/**
	 * Add a creature to the turn list.
	 * It will be added at the end.
	 * @param {js13k.Creature} creature
	 */
	addCreature( creature ) {
		this._creatures.push( creature );
	},


	/**
	 *
	 * @param  {EngineObject[]} tileContent
	 * @return {?js13k.Creature}
	 */
	canAttackTile( tileContent ) {
		return tileContent && tileContent.find( c => c instanceof js13k.Creature );
	},


	/**
	 *
	 * @param  {js13k.Creature}  player
	 * @param  {js13k.Tile}      tile
	 * @param  {?EngineObject[]} tileContent
	 * @return {boolean}
	 */
	canMoveToTile( player, tile, tileContent ) {
		const normedDirection = player.pos.subtract( tile.pos ).normalize();
		let distance = tile.pos.distance( player.pos );

		while( distance >= 1 ) {
			const target = tile.pos.add( normedDirection.scale( distance ) );
			target.x = Math.round( target.x );
			target.y = Math.round( target.y );

			// Tile cannot be moved to if not empty.
			if(
				( target.x !== player.pos.x || target.y !== player.pos.y ) &&
				js13k.currentLevel.getTileContent( target )
			) {
				return false;
			}

			distance--;
		}

		return !tileContent;
	},


	/**
	 *
	 */
	doTurn() {
		if( js13k.currentLevel.playOutroTimer ) {
			return;
		}

		if( this._turnAction ) {
			this._turnAction( _ => this.endTurn() );
			return;
		}

		if( this.isPlayerTurn() ) {
			this._handlePlayerTurn();
		}
		else if( js13k.turnCreature ) {
			this._turnAction = js13k.turnCreature.decideOnTurnAction();

			// Creature could not find a suitable action. End turn.
			if( !this._turnAction ) {
				js13k.turnCreature.attacksLeft = 0;
				js13k.turnCreature.movesLeft = 0;

				this.endTurn();
			}
		}
	},


	/**
	 *
	 */
	endTurn() {
		js13k.currentLevel.updateTileMap();

		if( this.isPlayerTurn() && js13k.currentLevel.checkForAndHandleEnd() ) {
			return;
		}

		if( js13k.currentLevel.player.soulPower <= 0 ) {
			js13k.isGameOver = true;
			js13k.UI.showGameOver();
			js13k.soundDie.play();

			return;
		}

		this._turnAction = null;

		// If creature has no actions left for this
		// round, continue to next creature.
		if(
			js13k.turnCreature.movesLeft < 1 &&
			!js13k.turnCreature.attacksLeft
		) {
			js13k.turnCreature.movesLeft = js13k.turnCreature.moveDistance;
			js13k.turnCreature.attacksLeft = 1;
			js13k.turnCreature = this.next();
		}
	},


	/**
	 * Get the creature which's turn it currently is.
	 * @return {js13k.Creature}
	 */
	get() {
		return this._creatures[this._current];
	},


	/**
	 * Check if it is the player's turn.
	 * @return {boolean}
	 */
	isPlayerTurn() {
		return this.get() === js13k.currentLevel.player;
	},


	/**
	 * Move to the next turn.
	 */
	next() {
		if( ++this._current >= this._creatures.length ) {
			this._current = 0;
		}

		return this.get();
	},


	/**
	 *
	 * @param {js13k.Creature} creature
	 */
	removeCreature( creature ) {
		for( let i = 0; i < this._creatures.length; i++ ) {
			const entry = this._creatures[i];

			if( entry === creature ) {
				this._creatures.splice( i, 1 );

				if( i <= this._current ) {
					this._current--;
				}

				break;
			}
		}
	},


	/**
	 * Reset by removing all creatures.
	 */
	reset() {
		this._creatures = [];
		this._current = 0;
		this._turnAction = null;
	}


};
