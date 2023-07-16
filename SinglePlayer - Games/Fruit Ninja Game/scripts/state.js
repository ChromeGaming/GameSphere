
var Ucren = require( "lib/ucren" );
var timeline = require( "timeline" );


var stack = {};
var cache = {};
var callbacks = {};

exports = function( key ){

	if( cache[ key ] )
	    return cache[ key ];

	return cache[ key ] = {
		is: function( value ){
		    return stack[key] === value;
		},

		isnot: function( value ){
		    return stack[key] !== value;
		},

		ison: function(){
			return this.is( true );
		},

		isoff: function(){
			return this.isnot( true );
		},

		isunset: function(){
			return this.is( undefined );
		},

		set: function(){
			var lastValue = NaN;
			return function( value ){
			    var c;
			    stack[key] = value;
			    if( lastValue !== value && ( c = callbacks[ key ] ) )
			    	for(var i = 0, l = c.length; i < l; i ++)
			    		c[i].call( this, value );
			   	lastValue = value;
			}
		}(),

		get: function(){
		    return stack[key];
		},

		on: function(){
			var me = this;
			me.set( true );
			return {
				keep: function( time ){
					timeline.setTimeout( me.set.saturate( me, false ), time );
				}
			}
		},

		off: function(){
			var me = this;
		    me.set( false );
		    return {
		    	keep: function( time ){
		    		timeline.setTimeout( me.set.saturate( me, true ), time );
		    	}
		    }
		},

		hook: function( fn ){
			var c;
		    if( !( c = callbacks[ key ] ) )
		        callbacks[ key ] = [ fn ];
		    else
		    	c.push( fn );
		},

		unhook: function(){
		    // TODO: 
		}
	}
};