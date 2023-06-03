'use strict';


js13k.Tile = class extends EngineObject {


	/**
	 * @constructor
	 * @override
	 * @param {Vector2}  pos
	 * @param {Color}    color
	 * @param {number}  [tileIndex = -1]
	 */
	constructor( pos, color, tileIndex = -1 ) {
		super( pos, objectDefaultSize, tileIndex, tileSizeDefault, 0, color );

		this.highlightAttack = false;
		this.highlightMove = false;
		this.renderOrder = -1;
	}


	/**
	 * @override
	 */
	render() {
		drawRect( this.pos, this.size, this.color );

		super.render();

		if( this.highlightAttack ) {
			drawTile( this.pos, vec2( 1 ), 11, vec2( 16 ) );
		}
		else if( this.highlightMove ) {
			drawTile( this.pos, vec2( 1 ), 3, vec2( 16 ) );

			const player = js13k.currentLevel.player;
			const cost = Math.ceil( this.pos.distance( player.pos ) );

			const pos = worldToScreen( vec2( this.pos.x, this.pos.y ) );
			overlayContext.font = '600 16px monospace';
			overlayContext.textAlign = 'center';
			overlayContext.textBaseline = 'middle';

			js13k.UI.writeText( -cost + ' MV', pos.x, pos.y, '#fff7', '#0007', vec2( 1, -1 ) );
		}
	}


	/**
	 * @override
	 */
	update() {
		// Reset states.
		this.highlightMove = false;
		this.highlightAttack = false;

		super.update();
	}


};
