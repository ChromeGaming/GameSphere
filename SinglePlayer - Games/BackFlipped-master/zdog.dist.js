/*!
 * Zdog v1.1.0
 * Round, flat, designer-friendly pseudo-3D engine
 * Licensed MIT
 * https://zzz.dog
 * Copyright 2019 Metafizzy
 */

/**
 * Boilerplate & utils
 */

( function( root, factory ) {
      // browser global
      root.Zdog = factory();
  }( this, function factory() {
  
  var Zdog = {};
  
  Zdog.TAU = Math.PI * 2;
  
  Zdog.extend = function( a, b ) {
    for ( var prop in b ) {
      a[ prop ] = b[ prop ];
    }
    return a;
  };
  
  Zdog.lerp = function( a, b, alpha ) {
    return ( b - a ) * alpha + a;
  };
  
  Zdog.modulo = function( num, div ) {
    return ( ( num % div ) + div ) % div;
  };
  
  var powerMultipliers = {
    2: function( a ) {
      return a * a;
    },
    3: function( a ) {
      return a * a * a;
    },
    4: function( a ) {
      return a * a * a * a;
    },
    5: function( a ) {
      return a * a * a * a * a;
    },
  };
  
  Zdog.easeInOut = function( alpha, power ) {
    if ( power == 1 ) {
      return alpha;
    }
    alpha = Math.max( 0, Math.min( 1, alpha ) );
    var isFirstHalf = alpha < 0.5;
    var slope = isFirstHalf ? alpha : 1 - alpha;
    slope /= 0.5;
    // make easing steeper with more multiples
    var powerMultiplier = powerMultipliers[ power ] || powerMultipliers[2];
    var curve = powerMultiplier( slope );
    curve /= 2;
    return isFirstHalf ? curve : 1 - curve;
  };
  
  return Zdog;
  
  }));
  /**
   * CanvasRenderer
   */
  
  ( function( root, factory ) {
      // browser global
      root.Zdog.CanvasRenderer = factory();
  }( this, function factory() {
  
  var CanvasRenderer = { isCanvas: true };
  
  CanvasRenderer.begin = function( ctx ) {
    ctx.beginPath();
  };
  
  CanvasRenderer.move = function( ctx, elem, point ) {
    ctx.moveTo( point.x, point.y );
  };
  
  CanvasRenderer.line = function( ctx, elem, point ) {
    ctx.lineTo( point.x, point.y );
  };
  
  CanvasRenderer.bezier = function( ctx, elem, cp0, cp1, end ) {
    ctx.bezierCurveTo( cp0.x, cp0.y, cp1.x, cp1.y, end.x, end.y );
  };
  
  CanvasRenderer.closePath = function( ctx ) {
    ctx.closePath();
  };
  
  CanvasRenderer.setPath = function() {};
  
  CanvasRenderer.renderPath = function( ctx, elem, pathCommands, isClosed ) {
    this.begin( ctx, elem );
    pathCommands.forEach( function( command ) {
      command.render( ctx, elem, CanvasRenderer );
    });
    if ( isClosed ) {
      this.closePath( ctx, elem );
    }
  };
  
  CanvasRenderer.stroke = function( ctx, elem, isStroke, color, lineWidth ) {
    if ( !isStroke ) {
      return;
    }
    ctx.strokeStyle = color;
    ctx.lineWidth = lineWidth;
    ctx.stroke();
  };
  
  CanvasRenderer.fill = function( ctx, elem, isFill, color ) {
    if ( !isFill ) {
      return;
    }
    ctx.fillStyle = color;
    ctx.fill();
  };
  
  CanvasRenderer.end = function() {};
  
  return CanvasRenderer;
  
  }));
  ( function( root, factory ) {
      // browser global
      var Zdog = root.Zdog;
      Zdog.Vector = factory( Zdog );
  
  }( this, function factory( utils ) {
  
  function Vector( position ) {
    this.set( position );
  }
  
  var TAU = utils.TAU;
  
  // 'pos' = 'position'
  Vector.prototype.set = function( pos ) {
    this.x = pos && pos.x || 0;
    this.y = pos && pos.y || 0;
    this.z = pos && pos.z || 0;
    return this;
  };
  
  // set coordinates without sanitizing
  // vec.write({ y: 2 }) only sets y coord
  Vector.prototype.write = function( pos ) {
    if ( !pos ) {
      return this;
    }
    this.x = pos.x != undefined ? pos.x : this.x;
    this.y = pos.y != undefined ? pos.y : this.y;
    this.z = pos.z != undefined ? pos.z : this.z;
    return this;
  };
  
  Vector.prototype.rotate = function( rotation ) {
    if ( !rotation ) {
      return;
    }
    this.rotateZ( rotation.z );
    this.rotateY( rotation.y );
    this.rotateX( rotation.x );
    return this;
  };
  
  Vector.prototype.rotateZ = function( angle ) {
    rotateProperty( this, angle, 'x', 'y' );
  };
  
  Vector.prototype.rotateX = function( angle ) {
    rotateProperty( this, angle, 'y', 'z' );
  };
  
  Vector.prototype.rotateY = function( angle ) {
    rotateProperty( this, angle, 'x', 'z' );
  };
  
  function rotateProperty( vec, angle, propA, propB ) {
    if ( !angle || angle % TAU === 0 ) {
      return;
    }
    var cos = Math.cos( angle );
    var sin = Math.sin( angle );
    var a = vec[ propA ];
    var b = vec[ propB ];
    vec[ propA ] = a*cos - b*sin;
    vec[ propB ] = b*cos + a*sin;
  }
  
  Vector.prototype.isSame = function( pos ) {
    if ( !pos ) {
      return false;
    }
    return this.x === pos.x && this.y === pos.y && this.z === pos.z;
  };
  
  Vector.prototype.add = function( pos ) {
    if ( !pos ) {
      return this;
    }
    this.x += pos.x || 0;
    this.y += pos.y || 0;
    this.z += pos.z || 0;
    return this;
  };
  
  Vector.prototype.subtract = function( pos ) {
    if ( !pos ) {
      return this;
    }
    this.x -= pos.x || 0;
    this.y -= pos.y || 0;
    this.z -= pos.z || 0;
    return this;
  };
  
  Vector.prototype.multiply = function( pos ) {
    if ( pos == undefined ) {
      return this;
    }
    // multiple all values by same number
    if ( typeof pos == 'number' ) {
      this.x *= pos;
      this.y *= pos;
      this.z *= pos;
    } else {
      // multiply object
      this.x *= pos.x != undefined ? pos.x : 1;
      this.y *= pos.y != undefined ? pos.y : 1;
      this.z *= pos.z != undefined ? pos.z : 1;
    }
    return this;
  };
  
  Vector.prototype.transform = function( translation, rotation, scale ) {
    this.multiply( scale );
    this.rotate( rotation );
    this.add( translation );
    return this;
  };
  
  Vector.prototype.lerp = function( pos, alpha ) {
    this.x = utils.lerp( this.x, pos.x || 0, alpha );
    this.y = utils.lerp( this.y, pos.y || 0, alpha );
    this.z = utils.lerp( this.z, pos.z || 0, alpha );
    return this;
  };
  
  Vector.prototype.magnitude = function() {
    var sum = this.x*this.x + this.y*this.y + this.z*this.z;
    return getMagnitudeSqrt( sum );
  };
  
  function getMagnitudeSqrt( sum ) {
    // PERF: check if sum ~= 1 and skip sqrt
    if ( Math.abs( sum - 1 ) < 0.00000001 ) {
      return 1;
    }
    return Math.sqrt( sum );
  }
  
  Vector.prototype.magnitude2d = function() {
    var sum = this.x*this.x + this.y*this.y;
    return getMagnitudeSqrt( sum );
  };
  
  Vector.prototype.copy = function() {
    return new Vector( this );
  };
  
  return Vector;
  
  }));
  /**
   * Anchor
   */
  
  ( function( root, factory ) {
      // browser global
      var Zdog = root.Zdog;
      Zdog.Anchor = factory( Zdog, Zdog.Vector, Zdog.CanvasRenderer,
          Zdog.SvgRenderer );
  }( this, function factory( utils, Vector, CanvasRenderer, SvgRenderer ) {
  
  var TAU = utils.TAU;
  var onePoint = { x: 1, y: 1, z: 1 };
  
  function Anchor( options ) {
    this.create( options || {} );
  }
  
  Anchor.prototype.create = function( options ) {
    this.children = [];
    // set defaults & options
    utils.extend( this, this.constructor.defaults );
    this.setOptions( options );
  
    // transform
    this.translate = new Vector( options.translate );
    this.rotate = new Vector( options.rotate );
    this.scale = new Vector( onePoint ).multiply( this.scale );
    // origin
    this.origin = new Vector();
    this.renderOrigin = new Vector();
  
    if ( this.addTo ) {
      this.addTo.addChild( this );
    }
  };
  
  Anchor.defaults = {};
  
  Anchor.optionKeys = Object.keys( Anchor.defaults ).concat([
    'rotate',
    'translate',
    'scale',
    'addTo',
  ]);
  
  Anchor.prototype.setOptions = function( options ) {
    var optionKeys = this.constructor.optionKeys;
  
    for ( var key in options ) {
      if ( optionKeys.indexOf( key ) != -1 ) {
        this[ key ] = options[ key ];
      }
    }
  };
  
  Anchor.prototype.addChild = function( shape ) {
    if ( this.children.indexOf( shape ) != -1 ) {
      return;
    }
    shape.remove(); // remove previous parent
    shape.addTo = this; // keep parent reference
    this.children.push( shape );
  };
  
  Anchor.prototype.removeChild = function( shape ) {
    var index = this.children.indexOf( shape );
    if ( index != -1 ) {
      this.children.splice( index, 1 );
    }
  };
  
  Anchor.prototype.remove = function() {
    if ( this.addTo ) {
      this.addTo.removeChild( this );
    }
  };
  
  // ----- update ----- //
  
  Anchor.prototype.update = function() {
    if (this.visible == false) {return;} //Custom hack for big scenes where you do culling yourself: if it isn't visible, don't update it.
    // update self
    this.reset();
    // update children
    this.children.forEach( function( child ) {
      child.update();
    });
    this.transform( this.translate, this.rotate, this.scale );
  };
  
  Anchor.prototype.reset = function() {
    this.renderOrigin.set( this.origin );
  };
  
  Anchor.prototype.transform = function( translation, rotation, scale ) {
    this.renderOrigin.transform( translation, rotation, scale );
    // transform children
    this.children.forEach( function( child ) {
      child.transform( translation, rotation, scale );
    });
  };
  
  Anchor.prototype.updateGraph = function() {
    this.update();
    this.updateFlatGraph();
    this.flatGraph.forEach( function( item ) {
      item.updateSortValue();
    });
    // z-sort
    this.flatGraph.sort( Anchor.shapeSorter );
  };
  
  Anchor.shapeSorter = function( a, b ) {
    return a.sortValue - b.sortValue;
  };
  
  // custom getter to check for flatGraph before using it
  Object.defineProperty( Anchor.prototype, 'flatGraph', {
    get: function() {
      if ( !this._flatGraph ) {
        this.updateFlatGraph();
      }
      return this._flatGraph;
    },
    set: function( graph ) {
      this._flatGraph = graph;
    },
  });
  
  Anchor.prototype.updateFlatGraph = function() {
    this.flatGraph = this.getFlatGraph();
  };
  
  // return Array of self & all child graph items
  Anchor.prototype.getFlatGraph = function() {
    var flatGraph = [ this ];
    return this.addChildFlatGraph( flatGraph );
  };
  
  Anchor.prototype.addChildFlatGraph = function( flatGraph ) {
    this.children.forEach( function( child ) {
      var childFlatGraph = child.getFlatGraph();
      Array.prototype.push.apply( flatGraph, childFlatGraph );
    });
    return flatGraph;
  };
  
  Anchor.prototype.updateSortValue = function() {
    this.sortValue = this.renderOrigin.z;
  };
  
  // ----- render ----- //
  
  Anchor.prototype.render = function() {};
  
  // TODO refactor out CanvasRenderer so its not a dependency within anchor.js
  Anchor.prototype.renderGraphCanvas = function( ctx ) {
    //if ( !ctx ) {
      // throw new Error( 'ctx is ' + ctx + '. ' +
      //   'Canvas context required for render. Check .renderGraphCanvas( ctx ).' );
    //}
    this.flatGraph.forEach( function( item ) {
      item.render( ctx, CanvasRenderer );
    });
  };
  
  Anchor.prototype.renderGraphSvg = function( svg ) {
    //if ( !svg ) {
      // throw new Error( 'svg is ' + svg + '. ' +
      //   'SVG required for render. Check .renderGraphSvg( svg ).' );
    //}
    this.flatGraph.forEach( function( item ) {
      item.render( svg, SvgRenderer );
    });
  };
  
  // ----- misc ----- //
  
  Anchor.prototype.copy = function( options ) {
    // copy options
    var itemOptions = {};
    var optionKeys = this.constructor.optionKeys;
    optionKeys.forEach( function( key ) {
      itemOptions[ key ] = this[ key ];
    }, this );
    // add set options
    utils.extend( itemOptions, options );
    var ItemClass = this.constructor;
    return new ItemClass( itemOptions );
  };
  
  Anchor.prototype.copyGraph = function( options ) {
    var clone = this.copy( options );
    this.children.forEach( function( child ) {
      child.copyGraph({
        addTo: clone,
      });
    });
    return clone;
  };
  
  Anchor.prototype.normalizeRotate = function() {
    this.rotate.x = utils.modulo( this.rotate.x, TAU );
    this.rotate.y = utils.modulo( this.rotate.y, TAU );
    this.rotate.z = utils.modulo( this.rotate.z, TAU );
  };
  
  // ----- subclass ----- //
  
  function getSubclass( Super ) {
    return function( defaults ) {
      // create constructor
      function Item( options ) {
        this.create( options || {} );
      }
  
      Item.prototype = Object.create( Super.prototype );
      Item.prototype.constructor = Item;
  
      Item.defaults = utils.extend( {}, Super.defaults );
      utils.extend( Item.defaults, defaults );
      // create optionKeys
      Item.optionKeys = Super.optionKeys.slice(0);
      // add defaults keys to optionKeys, dedupe
      Object.keys( Item.defaults ).forEach( function( key ) {
        if ( !Item.optionKeys.indexOf( key ) != 1 ) {
          Item.optionKeys.push( key );
        }
      });
  
      Item.subclass = getSubclass( Item );
  
      return Item;
    };
  }
  
  Anchor.subclass = getSubclass( Anchor );
  
  return Anchor;
  
  }));
  /**
   * Dragger
   */
  
  ( function( root, factory ) {
      // browser global
      root.Zdog.Dragger = factory( root );
  }( this, function factory( window ) {
  
  // quick & dirty drag event stuff
  // messes up if multiple pointers/touches
  
  // event support, default to mouse events
  
  function noop() {}
  
  function Dragger( options ) {
    this.create( options || {} );
  }
  
  Dragger.prototype.create = function( options ) {
  };
  
  Dragger.prototype.getQueryElement = function( element ) {
    if ( typeof element == 'string' ) {
      // with string, query selector
      element = document.querySelector( element );
    }
    return element;
  };
  
  return Dragger;
  
  }));
  /**
   * Illustration
   */
  
  ( function( root, factory ) {
      // browser global
      var Zdog = root.Zdog;
      Zdog.Illustration = factory( Zdog, Zdog.Anchor, Zdog.Dragger );
  }( this, function factory( utils, Anchor, Dragger ) {
  
  function noop() {}
  var TAU = utils.TAU;
  
  var Illustration = Anchor.subclass({
    element: undefined,
    centered: true,
    zoom: 1,
    dragRotate: false,
    resize: false,
    onPrerender: noop,
    onDragStart: noop,
    onDragMove: noop,
    onDragEnd: noop,
    onResize: noop,
  });
  
  utils.extend( Illustration.prototype, Dragger.prototype );
  
  Illustration.prototype.create = function( options ) {
    Anchor.prototype.create.call( this, options );
    Dragger.prototype.create.call( this, options );
    this.setElement( this.element );
    this.setDragRotate( this.dragRotate );
    this.setResize( this.resize );
  };
  
  Illustration.prototype.setElement = function( element ) {
    element = this.getQueryElement( element );
    //if ( !element ) {
    //  throw new Error( 'Zdog.Illustration element required. Set to ' + element );
    //}
  
    var nodeName = element.nodeName.toLowerCase();
    if ( nodeName == 'canvas' ) {
      this.setCanvas( element );
    } else if ( nodeName == 'svg' ) {
      this.setSvg( element );
    }
  };
  
  Illustration.prototype.setSize = function( width, height ) {
    width = Math.round( width );
    height = Math.round( height );
    if ( this.isCanvas ) {
      this.setSizeCanvas( width, height );
    } else if ( this.isSvg ) {
      this.setSizeSvg( width, height );
    }
  };
  
  Illustration.prototype.setResize = function( resize ) {
    this.resize = resize;
    // create resize event listener
    if ( !this.resizeListener ) {
      this.resizeListener = this.onWindowResize.bind( this );
    }
    // add/remove event listener
    if ( resize ) {
      window.addEventListener( 'resize', this.resizeListener );
      this.onWindowResize();
    } else {
      window.removeEventListener( 'resize', this.resizeListener );
    }
  };
  
  // TODO debounce this?
  Illustration.prototype.onWindowResize = function() {
    this.setMeasuredSize();
    this.onResize( this.width, this.height );
  };
  
  Illustration.prototype.setMeasuredSize = function() {
    var width, height;
    var isFullscreen = this.resize == 'fullscreen';
    if ( isFullscreen ) {
      width = window.innerWidth;
      height = window.innerHeight;
    } else {
      var rect = this.element.getBoundingClientRect();
      width = rect.width;
      height = rect.height;
    }
    this.setSize( width, height );
  };
  
  // ----- render ----- //
  
  Illustration.prototype.renderGraph = function( item ) {
    if ( this.isCanvas ) {
      this.renderGraphCanvas( item );
    } else if ( this.isSvg ) {
      this.renderGraphSvg( item );
    }
  };
  
  // combo method
  Illustration.prototype.updateRenderGraph = function( item ) {
    this.updateGraph();
    this.renderGraph( item );
  };
  
  // ----- canvas ----- //
  
  Illustration.prototype.setCanvas = function( element ) {
    this.element = element;
    this.isCanvas = true;
    // update related properties
    this.ctx = this.element.getContext('2d');
    // set initial size
    this.setSizeCanvas( element.width, element.height );
  };
  
  Illustration.prototype.setSizeCanvas = function( width, height ) {
    this.width = width;
    this.height = height;
    // up-rez for hi-DPI devices
    var pixelRatio = this.pixelRatio = window.devicePixelRatio || 1;
    this.element.width = this.canvasWidth = width * pixelRatio;
    this.element.height = this.canvasHeight = height * pixelRatio;
    var needsHighPixelRatioSizing = pixelRatio > 1 && !this.resize;
    if ( needsHighPixelRatioSizing ) {
      this.element.style.width = width + 'px';
      this.element.style.height = height + 'px';
    }
  };
  
  Illustration.prototype.renderGraphCanvas = function( item ) {
    item = item || this;
    this.prerenderCanvas();
    Anchor.prototype.renderGraphCanvas.call( item, this.ctx );
    this.postrenderCanvas();
  };
  
  Illustration.prototype.prerenderCanvas = function() {
    var ctx = this.ctx;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.clearRect( 0, 0, this.canvasWidth, this.canvasHeight );
    ctx.save();
    if ( this.centered ) {
      var centerX = this.width/2 * this.pixelRatio;
      var centerY = this.height/2 * this.pixelRatio;
      ctx.translate( centerX, centerY );
    }
    var scale = this.pixelRatio * this.zoom;
    ctx.scale( scale, scale );
    this.onPrerender( ctx );
  };
  
  Illustration.prototype.postrenderCanvas = function() {
    this.ctx.restore();
  };
  
  // ----- svg ----- //
  
  // function empty( element ) {
  //   while ( element.firstChild ) {
  //     element.removeChild( element.firstChild );
  //   }
  // }
  
  // ----- drag ----- //
  
  Illustration.prototype.setDragRotate = function( item ) {
    if ( !item ) {
      return;
    } else if ( item === true ) {
      /* eslint consistent-this: "off" */
      item = this;
    }
    this.dragRotate = item;
  
    this.bindDrag( this.element );
  };

  
  return Illustration;
  
  }));
  /**
   * PathCommand
   */
  
  ( function( root, factory ) {
      // browser global
      var Zdog = root.Zdog;
      Zdog.PathCommand = factory( Zdog.Vector );
  }( this, function factory( Vector ) {
  
  function PathCommand( method, points, previousPoint ) {
    this.method = method;
    this.points = points.map( mapVectorPoint );
    this.renderPoints = points.map( mapNewVector );
    this.previousPoint = previousPoint;
    this.endRenderPoint = this.renderPoints[ this.renderPoints.length - 1 ];
    // arc actions come with previous point & corner point
    // but require bezier control points
    // if ( method == 'arc' ) {
    //   this.controlPoints = [ new Vector(), new Vector() ];
    // }
  }
  
  function mapVectorPoint( point ) {
    if ( point instanceof Vector ) {
      return point;
    } else {
      return new Vector( point );
    }
  }
  
  function mapNewVector( point ) {
    return new Vector( point );
  }
  
  PathCommand.prototype.reset = function() {
    // reset renderPoints back to orignal points position
    var points = this.points;
    this.renderPoints.forEach( function( renderPoint, i ) {
      var point = points[i];
      renderPoint.set( point );
    });
  };
  
  PathCommand.prototype.transform = function( translation, rotation, scale ) {
    this.renderPoints.forEach( function( renderPoint ) {
      renderPoint.transform( translation, rotation, scale );
    });
  };
  
  PathCommand.prototype.render = function( ctx, elem, renderer ) {
    return this[ this.method ]( ctx, elem, renderer );
  };
  
  PathCommand.prototype.move = function( ctx, elem, renderer ) {
    return renderer.move( ctx, elem, this.renderPoints[0] );
  };
  
  PathCommand.prototype.line = function( ctx, elem, renderer ) {
    return renderer.line( ctx, elem, this.renderPoints[0] );
  };
  
  return PathCommand;
  
  }));
  /**
   * Shape
   */
  
  ( function( root, factory ) {
      // browser global
      var Zdog = root.Zdog;
      Zdog.Shape = factory( Zdog, Zdog.Vector, Zdog.PathCommand, Zdog.Anchor );
  }( this, function factory( utils, Vector, PathCommand, Anchor ) {
  
  var Shape = Anchor.subclass({
    stroke: 1,
    fill: false,
    color: '#333',
    closed: true,
    visible: true,
    path: [ {} ],
    front: { z: 1 },
    backface: true,
  });
  
  Shape.prototype.create = function( options ) {
    Anchor.prototype.create.call( this, options );
    this.updatePath();
    // front
    this.front = new Vector( options.front || this.front );
    this.renderFront = new Vector( this.front );
    this.renderNormal = new Vector();
  };
  
  var actionNames = [
    'move',
    'line',
  ];
  
  Shape.prototype.updatePath = function() {
    this.setPath();
    this.updatePathCommands();
  };
  
  // place holder for Ellipse, Rect, etc.
  Shape.prototype.setPath = function() {};
  
  // parse path into PathCommands
  Shape.prototype.updatePathCommands = function() {
    var previousPoint;
    this.pathCommands = this.path.map( function( pathPart, i ) {
      // pathPart can be just vector coordinates -> { x, y, z }
      // or path instruction -> { arc: [ {x0,y0,z0}, {x1,y1,z1} ] }
      var keys = Object.keys( pathPart );
      var method = keys[0];
      var points = pathPart[ method ];
      // default to line if no instruction
      var isInstruction = keys.length == 1 && actionNames.indexOf( method ) != -1;
      if ( !isInstruction ) {
        method = 'line';
        points = pathPart;
      }
      // munge single-point methods like line & move without arrays
      var isLineOrMove = method == 'line' || method == 'move';
      var isPointsArray = Array.isArray( points );
      if ( isLineOrMove && !isPointsArray ) {
        points = [ points ];
      }
  
      // first action is always move
      method = i === 0 ? 'move' : method;
      // arcs require previous last point
      var command = new PathCommand( method, points, previousPoint );
      // update previousLastPoint
      previousPoint = command.endRenderPoint;
      return command;
    });
  };
  
  // ----- update ----- //
  
  Shape.prototype.reset = function() {
    this.renderOrigin.set( this.origin );
    this.renderFront.set( this.front );
    // reset command render points
    this.pathCommands.forEach( function( command ) {
      command.reset();
    });
  };
  
  Shape.prototype.transform = function( translation, rotation, scale ) {
    // calculate render points backface visibility & cone/hemisphere shapes
    this.renderOrigin.transform( translation, rotation, scale );
    this.renderFront.transform( translation, rotation, scale );
    this.renderNormal.set( this.renderOrigin ).subtract( this.renderFront );
    // transform points
    this.pathCommands.forEach( function( command ) {
      command.transform( translation, rotation, scale );
    });
    // transform children
    this.children.forEach( function( child ) {
      child.transform( translation, rotation, scale );
    });
  };
  
  Shape.prototype.updateSortValue = function() {
    // sort by average z of all points
    // def not geometrically correct, but works for me
    var pointCount = this.pathCommands.length;
    var firstPoint = this.pathCommands[0].endRenderPoint;
    var lastPoint = this.pathCommands[ pointCount - 1 ].endRenderPoint;
    // ignore the final point if self closing shape
    var isSelfClosing = pointCount > 2 && firstPoint.isSame( lastPoint );
    if ( isSelfClosing ) {
      pointCount -= 1;
    }
  
    var sortValueTotal = 0;
    for ( var i = 0; i < pointCount; i++ ) {
      sortValueTotal += this.pathCommands[i].endRenderPoint.z;
    }
    this.sortValue = sortValueTotal / pointCount;
  };
  
  // ----- render ----- //
  
  Shape.prototype.render = function( ctx, renderer ) {
    var length = this.pathCommands.length;
    if ( !this.visible || !length ) {
      return;
    }
    // do not render if hiding backface
    this.isFacingBack = this.renderNormal.z > 0;
    if ( !this.backface && this.isFacingBack ) {
      return;
    }
    //if ( !renderer ) {
      //throw new Error( 'Zdog renderer required. Set to ' + renderer );
    //}
    // render dot or path
    var isDot = length == 1;
    if ( renderer.isCanvas && isDot ) {
      this.renderCanvasDot( ctx, renderer );
    } else {
      this.renderPath( ctx, renderer );
    }
  };
  
  var TAU = utils.TAU;
  // Safari does not render lines with no size, have to render circle instead
  Shape.prototype.renderCanvasDot = function( ctx ) {
    var lineWidth = this.getLineWidth();
    if ( !lineWidth ) {
      return;
    }
    ctx.fillStyle = this.getRenderColor();
    var point = this.pathCommands[0].endRenderPoint;
    ctx.beginPath();
    var radius = lineWidth/2;
    ctx.arc( point.x, point.y, radius, 0, TAU );
    ctx.fill();
  };
  
  Shape.prototype.getLineWidth = function() {
    if ( !this.stroke ) {
      return 0;
    }
    if ( this.stroke == true ) {
      return 1;
    }
    return this.stroke;
  };
  
  Shape.prototype.getRenderColor = function() {
    // use backface color if applicable
    var isBackfaceColor = typeof this.backface == 'string' && this.isFacingBack;
    var color = isBackfaceColor ? this.backface : this.color;
    return color;
  };
  
  Shape.prototype.renderPath = function( ctx, renderer ) {
    var elem = this.getRenderElement( ctx, renderer );
    var isTwoPoints = this.pathCommands.length == 2 &&
      this.pathCommands[1].method == 'line';
    var isClosed = !isTwoPoints && this.closed;
    var color = this.getRenderColor();
  
    renderer.renderPath( ctx, elem, this.pathCommands, isClosed );
    renderer.stroke( ctx, elem, this.stroke, color, this.getLineWidth() );
    renderer.fill( ctx, elem, this.fill, color );
    renderer.end( ctx, elem );
  };
  
  var svgURI = 'http://www.w3.org/2000/svg';
  
  Shape.prototype.getRenderElement = function( ctx, renderer ) {
    if ( !renderer.isSvg ) {
      return;
    }
    return this.svgElement;
  };
  
  return Shape;
  
  }));
  /**
   * Group
   */
  
  ( function( root, factory ) {
      // browser global
      var Zdog = root.Zdog;
      Zdog.Group = factory( Zdog.Anchor );
  }( this, function factory( Anchor ) {
  
  var Group = Anchor.subclass({
    updateSort: false,
    visible: true,
  });
  
  // ----- update ----- //
  
  Group.prototype.updateSortValue = function() {
    var sortValueTotal = 0;
    this.flatGraph.forEach( function( item ) {
      item.updateSortValue();
      sortValueTotal += item.sortValue;
    });
    // average sort value of all points
    // def not geometrically correct, but works for me
    this.sortValue = sortValueTotal / this.flatGraph.length;
  
    if ( this.updateSort ) {
      this.flatGraph.sort( Anchor.shapeSorter );
    }
  };
  
  // ----- render ----- //
  
  Group.prototype.render = function( ctx, renderer ) {
    if ( !this.visible ) {
      return;
    }
  
    this.flatGraph.forEach( function( item ) {
      item.render( ctx, renderer );
    });
  };
  
  // actual group flatGraph only used inside group
  Group.prototype.updateFlatGraph = function() {
    // do not include self
    var flatGraph = [];
    this.flatGraph = this.addChildFlatGraph( flatGraph );
  };
  
  // do not include children, group handles rendering & sorting internally
  Group.prototype.getFlatGraph = function() {
    return [ this ];
  };
  
  return Group;
  
  }));
  /**
   * Rect
   */
  
  ( function( root, factory ) {
      // browser global
      var Zdog = root.Zdog;
      Zdog.Rect = factory( Zdog.Shape );
  }( this, function factory( Shape ) {
  
  var Rect = Shape.subclass({
    width: 1,
    height: 1,
  });
  
  Rect.prototype.setPath = function() {
    var x = this.width / 2;
    var y = this.height / 2;
    /* eslint key-spacing: "off" */
    this.path = [
      { x: -x, y: -y },
      { x:  x, y: -y },
      { x:  x, y:  y },
      { x: -x, y:  y },
    ];
  };
  
  return Rect;
  
  }));
  /**
   * Box composite shape
   */
  
  ( function( root, factory ) {
      // browser global
      var Zdog = root.Zdog;
      Zdog.Box = factory( Zdog, Zdog.Anchor, Zdog.Shape, Zdog.Rect );
  }( this, function factory( utils, Anchor, Shape, Rect ) {
  
  // ----- BoxRect ----- //
  
  var BoxRect = Rect.subclass();
  // prevent double-creation in parent.copyGraph()
  // only create in Box.create()
  BoxRect.prototype.copyGraph = function() {};
  
  // ----- Box ----- //
  
  var TAU = utils.TAU;
  var faceNames = [
    'frontFace',
    'rearFace',
    'leftFace',
    'rightFace',
    'topFace',
    'bottomFace',
  ];
  
  var boxDefaults = utils.extend( {}, Shape.defaults );
  delete boxDefaults.path;
  faceNames.forEach( function( faceName ) {
    boxDefaults[ faceName ] = true;
  });
  utils.extend( boxDefaults, {
    width: 1,
    height: 1,
    depth: 1,
    fill: true,
  });
  
  var Box = Anchor.subclass( boxDefaults );
  
  Box.prototype.create = function( options ) {
    Anchor.prototype.create.call( this, options );
    this.updatePath();
    // HACK reset fill to trigger face setter
    this.fill = this.fill;
  };
  
  Box.prototype.updatePath = function() {
    // reset all faces to trigger setters
    faceNames.forEach( function( faceName ) {
      this[ faceName ] = this[ faceName ];
    }, this );
  };
  
  faceNames.forEach( function( faceName ) {
    var _faceName = '_' + faceName;
    Object.defineProperty( Box.prototype, faceName, {
      get: function() {
        return this[ _faceName ];
      },
      set: function( value ) {
        this[ _faceName ] = value;
        this.setFace( faceName, value );
      },
    });
  });
  
  Box.prototype.setFace = function( faceName, value ) {
    var rectProperty = faceName + 'Rect';
    var rect = this[ rectProperty ];
    // remove if false
    if ( !value ) {
      this.removeChild( rect );
      return;
    }
    // update & add face
    var options = this.getFaceOptions( faceName );
    options.color = typeof value == 'string' ? value : this.color;
  
    if ( rect ) {
      // update previous
      rect.setOptions( options );
    } else {
      // create new
      rect = this[ rectProperty ] = new BoxRect( options );
    }
    rect.updatePath();
    this.addChild( rect );
  };
  
  Box.prototype.getFaceOptions = function( faceName ) {
    return {
      frontFace: {
        width: this.width,
        height: this.height,
        translate: { z: this.depth/2 },
      },
      rearFace: {
        width: this.width,
        height: this.height,
        translate: { z: -this.depth/2 },
        rotate: { y: TAU/2 },
      },
      leftFace: {
        width: this.depth,
        height: this.height,
        translate: { x: -this.width/2 },
        rotate: { y: -TAU/4 },
      },
      rightFace: {
        width: this.depth,
        height: this.height,
        translate: { x: this.width/2 },
        rotate: { y: TAU/4 },
      },
      topFace: {
        width: this.width,
        height: this.depth,
        translate: { y: -this.height/2 },
        rotate: { x: -TAU/4 },
      },
      bottomFace: {
        width: this.width,
        height: this.depth,
        translate: { y: this.height/2 },
        rotate: { x: TAU/4 },
      },
    }[ faceName ];
  };
  
  // ----- set face properties ----- //
  
  var childProperties = [ 'color', 'stroke', 'fill', 'backface', 'front',
    'visible' ];
  childProperties.forEach( function( property ) {
    // use proxy property for custom getter & setter
    var _prop = '_' + property;
    Object.defineProperty( Box.prototype, property, {
      get: function() {
        return this[ _prop ];
      },
      set: function( value ) {
        this[ _prop ] = value;
        faceNames.forEach( function( faceName ) {
          var rect = this[ faceName + 'Rect' ];
          var isFaceColor = typeof this[ faceName ] == 'string';
          var isColorUnderwrite = property == 'color' && isFaceColor;
          if ( rect && !isColorUnderwrite ) {
            rect[ property ] = value;
          }
        }, this );
      },
    });
  });
  
  return Box;
  
  }));