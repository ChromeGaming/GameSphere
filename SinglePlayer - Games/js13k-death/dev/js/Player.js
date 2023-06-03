'use strict';


js13k.Player = class extends js13k.Creature {


	/**
	 * @constructor
	 * @override
	 * @param {Vector2} pos
	 */
	constructor( pos ) {
		super( 0, pos, vec2( 0.5 ), 16, vec2( 16 ) );

		this.soulPower = 100;
		this.moveDistance = 3;
		this.movesLeft = this.moveDistance;
		this.setAttack( 0 );
	}


	/**
	 *
	 * @private
	 * @param  {js13k.Creature[]} targets
	 * @return {function}
	 */
	_getTurnActionAttackSweepingBlow( targets ) {
		const timer = new Timer( 0.75 );
		const swoosh = new EngineObject( this.pos, vec2( 1 ), 11 );
		swoosh.renderOrder = engineObjects.length;

		this.soulPower -= this.attackCost;

		return cbEnd => {
			if( timer.elapsed() ) {
				let gained = 0;

				targets.forEach( target => {
					target.soulPower -= this.attackDamage;
					js13k.UI.effectSP( target, -this.attackDamage );
					js13k.UI.effectBloodHit( target, this );

					if( target.soulPower <= 0 ) {
						target.die();

						// Destroying an enemy increases soul power.
						this.soulPower += 5;
						gained += 5;
					}
				} );

				if( gained > 0 ) {
					js13k.UI.effectSP( this, gained );
				}

				js13k.soundHit1.play();

				swoosh.destroy();
				cbEnd();
			}
			else {
				const progress = timer.getPercent();
				swoosh.size = vec2( 1 + 2.5 * progress );
				swoosh.angle = progress * Math.PI * 4;
			}
		};
	}


	/**
	 *
	 * @private
	 * @param  {js13k.Creature[]} targets
	 * @return {function}
	 */
	_getTurnActionAttackThrow( targets ) {
		const lastTarget = targets[targets.length - 1];

		const duration = this.pos.distance( lastTarget.pos ) * 0.2;
		const timer = new Timer( duration );

		const hatchet = new EngineObject( vec2( 0 ), vec2( 0.5 ), 2, vec2( 16 ) );
		hatchet.mirror = targets[0].pos.x < this.pos.x;

		this.soulPower -= this.attackCost;

		const handled = [];
		let gained = 0;

		return cbEnd => {
			if( timer.elapsed() ) {
				if( gained > 0 ) {
					js13k.UI.effectSP( this, gained);
				}

				hatchet.destroy();
				cbEnd();
			}
			else {
				const progress = timer.getPercent();
				hatchet.angle = progress * Math.PI * 4;
				hatchet.pos.x = lastTarget.pos.x * progress + this.pos.x * ( 1 - progress );
				hatchet.pos.y = lastTarget.pos.y * progress + this.pos.y * ( 1 - progress );

				for( let i = 0; i < targets.length; i++ ) {
					const target = targets[i];

					if(
						!handled.includes( target ) &&
						hatchet.pos.distance( target.pos ) < 0.9
					) {
						// Each hit reduces the damage further.
						const dmg = max( this.attackDamage - i * 2, 0 );
						target.soulPower -= dmg;
						js13k.UI.effectSP( target, -dmg );
						js13k.UI.effectBloodHit( target, this );
						js13k.soundHit1.play();

						if( target.soulPower <= 0 ) {
							target.die();

							// Destroying an enemy increases soul power.
							this.soulPower += 5;
							gained += 5;
						}

						handled.push( target );
						break;
					}
				}
			}
		};
	}


	/**
	 * @override
	 */
	die() {
		// nothing
	}


	/**
	 *
	 * @override
	 * @param  {js13k.Creature[]} targets
	 * @return {function}
	 */
	getTurnActionAttack( targets ) {
		if( this.attackType == 1 ) {
			return this._getTurnActionAttackThrow( targets );
		}
		else if( this.attackType == 2 ) {
			return this._getTurnActionAttackSweepingBlow( targets );
		}

		return this._getTurnActionAttackNormal( targets );
	}


	/**
	 *
	 * @param {number} type
	 */
	setAttack( type ) {
		const list = [
			// DMG, range, cost
			[12, 1.5, 2], // normal attack
			[ 8, 4.5, 4], // hatchet throw
			[10, 1.5, 6], // sweeping blow
		];

		const attack = list[type];

		this.attackType = type;
		this.attackDamage = attack[0];
		this.attackRange = attack[1];
		this.attackCost = attack[2];
	}


	/**
	 * @override
	 */
	update() {
		if( this.isWalking ) {
			this.tileIndex = 16;
		}
		else if( this.soulPower > 0 ) {
			this.tileIndex = 16;

			if( this._animTimerIdle.elapsed() ) {
				this._animTimerIdle.set( 3 );
			}
			else if( this._animTimerIdle.get() >= -1 ) {
				this.tileIndex = 17;
			}
		}

		super.update();
	}


};
