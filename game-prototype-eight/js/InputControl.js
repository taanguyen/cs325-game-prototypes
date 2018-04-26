"use strict"
/**
 * Handles inputs for keyboard and mouse. Redefines isDown as just press rather than held down
 *
 * @author Huu Vu
 * @version 2.2
 * @requires Phaser
 */
class InputControl {
	/**
	 * Registers keyboard inputs and/or mouse buttons for isDown. isDown is defined
	 * as key/button is just pressed rather than is held down
	 * @param {Phaser.Game} game - The current Phaser's game object
	 * @param {Array<Phaser.Keyboard> | Phaser.Keyboard} keyInput - An array of all
	 * keyboard input to register
	 * @param {boolean} mouseLeft - True if mouse left click is to be register
	 * @param {boolean} mouseRight - True if mouse right click is to be register
	 */
	constructor ( game, keyInput, mouseLeft = false, mouseRight = false ) {
		/** @type {Object.<string, [number, boolean, Phaser.Keyboard | Phaser.Pointer]>} */
		let inputs = {};

		// Add all the keys/mouse inputs
		if ( !(keyInput instanceof Array) ) {
			inputs[ keyInput ] = [ 0, false, game.input.keyboard.addKey( keyInput ) ];
		} else {
			keyInput.forEach( ele => {
				inputs[ ele ] = [ 0, false, game.input.keyboard.addKey( ele ) ];
			} );
		} if ( mouseLeft ) {
			inputs[ 1 ] = [ 0, false, game.input.activePointer.leftButton ];
		} if ( mouseRight ) {
			inputs[ 2 ] = [ 0, false, game.input.activePointer.rightButton ];
		}

		/**
		 * Must always be call to update InputControl
		 * @param {Phaser.Game} game - The current Phaser's game object
		 */
		this.update = function ( game ) {
			for ( let key in inputs ) {
				// If key is down
				if ( inputs[ key ][ 2 ].isDown ) {
					if ( inputs[ key ][ 0 ] < game.time.now ) {
						// Key is just pressed
						inputs[ key ][ 1 ] = true;
					} else {
						// The key is still pressed from before
						inputs[ key ][ 1 ] = false;
					}
					inputs[ key ][ 0 ] = game.time.now + 50;
				} else if ( inputs[ key ][ 2 ].isUp ) {
					// Key is up
					inputs[ key ][ 1 ] = false;
				}
			}
		};

		/**
		 * Return if the key/mouse button requested is down (not if it was held)
		 * @param {Phaser.Keyboard | Phaser.Pointer.LEFT_BUTTON | Phaser.Pointer.RIGHT_BUTTON} name -
		 * Name/Input to return isDown info about
		 */
		this.isDown = function ( name ) {
			return inputs[ name ][ 1 ];
		};

		/**
		 * Return true if any one of the inputs is down. False if none of the inputs are down
		 * @param {Array<any>} list
		 */
		this.isAnyDown = function ( list ) {
			let result = false;
			list.forEach( ele => {
				if ( this.isDown( ele ) ) {
					result = true;
				}
			} );
			return result;
		}
	}
}
