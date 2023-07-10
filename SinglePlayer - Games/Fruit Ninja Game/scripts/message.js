
var Ucren = require( "lib/ucren" );


exports.postMessage = function( message/*, message, message... */, to ){
	var messages = [].slice.call( arguments, 0 ),
		splitIndex = messages.length - 1;

	to = messages[ splitIndex ];
	messages.slice( 0, splitIndex );

	Ucren.dispatch( to, messages );
};

/**
 * bind an message handler
 * @param {String}   from 	message address
 * @param {Function} fn 	message handler
 */
exports.addEventListener = function( from, fn ){
	Ucren.dispatch( from, fn );
};

/**
 * remove an message handler
 * @param {String}   from 	message address
 * @param {Function} fn 	message handler
 */
exports.removeEventListener = function( from, fn ){
	Ucren.dispatch.remove( from, fn );
};