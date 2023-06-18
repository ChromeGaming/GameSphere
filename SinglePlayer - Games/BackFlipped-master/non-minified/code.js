function SfxrParams(){this.setSettings=function(r){for(var t=0;t<24;t++)this[String.fromCharCode(97+t)]=r[t]||0;this.c<.01&&(this.c=.01);var a=this.b+this.c+this.e;if(a<.18){var e=.18/a;this.b*=e,this.c*=e,this.e*=e}}}function SfxrSynth(){var r,t,a,e,s,n,i,h,f,c,o,v;this._params=new SfxrParams,this.reset=function(){var r=this._params;e=100/(r.f*r.f+.001),s=100/(r.g*r.g+.001),n=1-r.h*r.h*r.h*.01,i=-r.i*r.i*r.i*1e-6,r.a||(o=.5-r.n/2,v=5e-5*-r.o),h=r.l>0?1-r.l*r.l*.9:1+r.l*r.l*10,f=0,c=1==r.m?0:(1-r.m)*(1-r.m)*2e4+32},this.totalReset=function(){this.reset();var e=this._params;return r=e.b*e.b*1e5,t=e.c*e.c*1e5,a=e.e*e.e*1e5+10,r+t+a|0},this.synthWave=function(u,b){var w=this._params,l=1!=w.s||w.v,m=w.v*w.v*.1,y=1+3e-4*w.w,g=w.s*w.s*w.s*.1,k=1+1e-4*w.t,S=1!=w.s,p=w.x*w.x,d=w.g,x=w.q||w.r,A=w.r*w.r*w.r*.2,q=w.q*w.q*(w.q<0?-1020:1020),M=w.p?32+((1-w.p)*(1-w.p)*2e4|0):0,_=w.d,U=w.j/2,j=w.k*w.k*.01,C=w.a,P=r,R=1/r,W=1/t,z=1/a,B=5/(1+w.u*w.u*20)*(.01+g);B>.8&&(B=.8),B=1-B;for(var D,E,F,G,H,I,J=!1,K=0,L=0,N=0,O=0,Q=0,T=0,V=0,X=0,Y=0,Z=0,$=new Array(1024),rr=new Array(32),tr=$.length;tr--;)$[tr]=0;for(tr=rr.length;tr--;)rr[tr]=2*Math.random()-1;for(tr=0;tr<b;tr++){if(J)return tr;if(M&&++Y>=M&&(Y=0,this.reset()),c&&++f>=c&&(c=0,e*=h),(e*=n+=i)>s&&(e=s,d>0&&(J=!0)),E=e,U>0&&(Z+=j,E*=1+Math.sin(Z)*U),(E|=0)<8&&(E=8),C||((o+=v)<0?o=0:o>.5&&(o=.5)),++L>P)switch(L=0,++K){case 1:P=t;break;case 2:P=a}switch(K){case 0:N=L*R;break;case 1:N=1+2*(1-L*W)*_;break;case 2:N=1-L*z;break;case 3:N=0,J=!0}x&&((F=0|(q+=A))<0?F=-F:F>1023&&(F=1023)),l&&y&&((m*=y)<1e-5?m=1e-5:m>.1&&(m=.1)),I=0;for(var ar=8;ar--;){if(++V>=E&&(V%=E,3==C))for(var er=rr.length;er--;)rr[er]=2*Math.random()-1;switch(C){case 0:H=V/E<o?.5:-.5;break;case 1:H=1-V/E*2;break;case 2:H=(H=(G=(G=V/E)>.5?6.28318531*(G-1):6.28318531*G)<0?1.27323954*G+.405284735*G*G:1.27323954*G-.405284735*G*G)<0?.225*(H*-H-H)+H:.225*(H*H-H)+H;break;case 3:H=rr[Math.abs(32*V/E|0)]}l&&(D=T,(g*=k)<0?g=0:g>.1&&(g=.1),S?(Q+=(H-T)*g,Q*=B):(T=H,Q=0),O+=(T+=Q)-D,H=O*=1-m),x&&($[X%1024]=H,H+=$[(X-F+1024)%1024],X++),I+=H}I*=.125*N*p,u[tr]=I>=1?32767:I<=-1?-32768:32767*I|0}return b}}var synth=new SfxrSynth;window.jsfxr=function(r){synth._params.setSettings(r);var t=synth.totalReset(),a=new Uint8Array(4*((t+1)/2|0)+44),e=2*synth.synthWave(new Uint16Array(a.buffer,44),t),s=new Uint32Array(a.buffer,0,44);s[0]=1179011410,s[1]=e+36,s[2]=1163280727,s[3]=544501094,s[4]=16,s[5]=65537,s[6]=44100,s[7]=88200,s[8]=1048578,s[9]=1635017060,s[10]=e,e+=44;for(var n=0,i="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/",h="data:audio/wav;base64,";n<e;n+=3){var f=a[n]<<16|a[n+1]<<8|a[n+2];h+=i[f>>18]+i[f>>12&63]+i[f>>6&63]+i[63&f]}return n-=e,h.slice(0,h.length-n)+"==".slice(0,n)};

/*!
 * Zdog v1.1.0
 * Round, flat, designer-friendly pseudo-3D engine
 * Licensed MIT
 * https://zzz.dog
 * Copyright 2019 Metafizzy
 */
!function(t,e){"object"==typeof module&&module.exports?module.exports=e():t.Zdog=e()}(this,function(){var t={};t.TAU=2*Math.PI,t.extend=function(t,e){for(var r in e)t[r]=e[r];return t},t.lerp=function(t,e,r){return(e-t)*r+t},t.modulo=function(t,e){return(t%e+e)%e};var e={2:function(t){return t*t},3:function(t){return t*t*t},4:function(t){return t*t*t*t},5:function(t){return t*t*t*t*t}};return t.easeInOut=function(t,r){if(1==r)return t;var i=(t=Math.max(0,Math.min(1,t)))<.5,o=i?t:1-t,n=(e[r]||e[2])(o/=.5);return n/=2,i?n:1-n},t}),function(t,e){"object"==typeof module&&module.exports?module.exports=e():t.Zdog.CanvasRenderer=e()}(this,function(){var t={isCanvas:!0,begin:function(t){t.beginPath()},move:function(t,e,r){t.moveTo(r.x,r.y)},line:function(t,e,r){t.lineTo(r.x,r.y)},bezier:function(t,e,r,i,o){t.bezierCurveTo(r.x,r.y,i.x,i.y,o.x,o.y)},closePath:function(t){t.closePath()},setPath:function(){},renderPath:function(e,r,i,o){this.begin(e,r),i.forEach(function(i){i.render(e,r,t)}),o&&this.closePath(e,r)},stroke:function(t,e,r,i,o){r&&(t.strokeStyle=i,t.lineWidth=o,t.stroke())},fill:function(t,e,r,i){r&&(t.fillStyle=i,t.fill())},end:function(){}};return t}),function(t,e){"object"==typeof module&&module.exports?module.exports=e():t.Zdog.SvgRenderer=e()}(this,function(){var t={isSvg:!0},e=t.round=function(t){return Math.round(1e3*t)/1e3};function r(t){return e(t.x)+","+e(t.y)+" "}return t.begin=function(){},t.move=function(t,e,i){return"M"+r(i)},t.line=function(t,e,i){return"L"+r(i)},t.bezier=function(t,e,i,o,n){return"C"+r(i)+r(o)+r(n)},t.closePath=function(){return"Z"},t.setPath=function(t,e,r){e.setAttribute("d",r)},t.renderPath=function(e,r,i,o){var n="";i.forEach(function(i){n+=i.render(e,r,t)}),o&&(n+=this.closePath(e,r)),this.setPath(e,r,n)},t.stroke=function(t,e,r,i,o){r&&(e.setAttribute("stroke",i),e.setAttribute("stroke-width",o))},t.fill=function(t,e,r,i){var o=r?i:"none";e.setAttribute("fill",o)},t.end=function(t,e){t.appendChild(e)},t}),function(t,e){if("object"==typeof module&&module.exports)module.exports=e(require("./boilerplate"));else{var r=t.Zdog;r.Vector=e(r)}}(this,function(t){function e(t){this.set(t)}var r=t.TAU;function i(t,e,i,o){if(e&&e%r!=0){var n=Math.cos(e),s=Math.sin(e),h=t[i],a=t[o];t[i]=h*n-a*s,t[o]=a*n+h*s}}function o(t){return Math.abs(t-1)<1e-8?1:Math.sqrt(t)}return e.prototype.set=function(t){return this.x=t&&t.x||0,this.y=t&&t.y||0,this.z=t&&t.z||0,this},e.prototype.write=function(t){return t?(this.x=null!=t.x?t.x:this.x,this.y=null!=t.y?t.y:this.y,this.z=null!=t.z?t.z:this.z,this):this},e.prototype.rotate=function(t){if(t)return this.rotateZ(t.z),this.rotateY(t.y),this.rotateX(t.x),this},e.prototype.rotateZ=function(t){i(this,t,"x","y")},e.prototype.rotateX=function(t){i(this,t,"y","z")},e.prototype.rotateY=function(t){i(this,t,"x","z")},e.prototype.isSame=function(t){return!!t&&(this.x===t.x&&this.y===t.y&&this.z===t.z)},e.prototype.add=function(t){return t?(this.x+=t.x||0,this.y+=t.y||0,this.z+=t.z||0,this):this},e.prototype.subtract=function(t){return t?(this.x-=t.x||0,this.y-=t.y||0,this.z-=t.z||0,this):this},e.prototype.multiply=function(t){return null==t?this:("number"==typeof t?(this.x*=t,this.y*=t,this.z*=t):(this.x*=null!=t.x?t.x:1,this.y*=null!=t.y?t.y:1,this.z*=null!=t.z?t.z:1),this)},e.prototype.transform=function(t,e,r){return this.multiply(r),this.rotate(e),this.add(t),this},e.prototype.lerp=function(e,r){return this.x=t.lerp(this.x,e.x||0,r),this.y=t.lerp(this.y,e.y||0,r),this.z=t.lerp(this.z,e.z||0,r),this},e.prototype.magnitude=function(){return o(this.x*this.x+this.y*this.y+this.z*this.z)},e.prototype.magnitude2d=function(){return o(this.x*this.x+this.y*this.y)},e.prototype.copy=function(){return new e(this)},e}),function(t,e){if("object"==typeof module&&module.exports)module.exports=e(require("./boilerplate"),require("./vector"),require("./canvas-renderer"),require("./svg-renderer"));else{var r=t.Zdog;r.Anchor=e(r,r.Vector,r.CanvasRenderer,r.SvgRenderer)}}(this,function(t,e,r,i){var o=t.TAU,n={x:1,y:1,z:1};function s(t){this.create(t||{})}return s.prototype.create=function(r){this.children=[],t.extend(this,this.constructor.defaults),this.setOptions(r),this.translate=new e(r.translate),this.rotate=new e(r.rotate),this.scale=new e(n).multiply(this.scale),this.origin=new e,this.renderOrigin=new e,this.addTo&&this.addTo.addChild(this)},s.defaults={},s.optionKeys=Object.keys(s.defaults).concat(["rotate","translate","scale","addTo"]),s.prototype.setOptions=function(t){var e=this.constructor.optionKeys;for(var r in t)-1!=e.indexOf(r)&&(this[r]=t[r])},s.prototype.addChild=function(t){-1==this.children.indexOf(t)&&(t.remove(),t.addTo=this,this.children.push(t))},s.prototype.removeChild=function(t){var e=this.children.indexOf(t);-1!=e&&this.children.splice(e,1)},s.prototype.remove=function(){this.addTo&&this.addTo.removeChild(this)},s.prototype.update=function(){this.reset(),this.children.forEach(function(t){t.update()}),this.transform(this.translate,this.rotate,this.scale)},s.prototype.reset=function(){this.renderOrigin.set(this.origin)},s.prototype.transform=function(t,e,r){this.renderOrigin.transform(t,e,r),this.children.forEach(function(i){i.transform(t,e,r)})},s.prototype.updateGraph=function(){this.update(),this.updateFlatGraph(),this.flatGraph.forEach(function(t){t.updateSortValue()}),this.flatGraph.sort(s.shapeSorter)},s.shapeSorter=function(t,e){return t.sortValue-e.sortValue},Object.defineProperty(s.prototype,"flatGraph",{get:function(){return this._flatGraph||this.updateFlatGraph(),this._flatGraph},set:function(t){this._flatGraph=t}}),s.prototype.updateFlatGraph=function(){this.flatGraph=this.getFlatGraph()},s.prototype.getFlatGraph=function(){var t=[this];return this.addChildFlatGraph(t)},s.prototype.addChildFlatGraph=function(t){return this.children.forEach(function(e){var r=e.getFlatGraph();Array.prototype.push.apply(t,r)}),t},s.prototype.updateSortValue=function(){this.sortValue=this.renderOrigin.z},s.prototype.render=function(){},s.prototype.renderGraphCanvas=function(t){if(!t)throw new Error("ctx is "+t+". Canvas context required for render. Check .renderGraphCanvas( ctx ).");this.flatGraph.forEach(function(e){e.render(t,r)})},s.prototype.renderGraphSvg=function(t){if(!t)throw new Error("svg is "+t+". SVG required for render. Check .renderGraphSvg( svg ).");this.flatGraph.forEach(function(e){e.render(t,i)})},s.prototype.copy=function(e){var r={};return this.constructor.optionKeys.forEach(function(t){r[t]=this[t]},this),t.extend(r,e),new(0,this.constructor)(r)},s.prototype.copyGraph=function(t){var e=this.copy(t);return this.children.forEach(function(t){t.copyGraph({addTo:e})}),e},s.prototype.normalizeRotate=function(){this.rotate.x=t.modulo(this.rotate.x,o),this.rotate.y=t.modulo(this.rotate.y,o),this.rotate.z=t.modulo(this.rotate.z,o)},s.subclass=function e(r){return function(i){function o(t){this.create(t||{})}return o.prototype=Object.create(r.prototype),o.prototype.constructor=o,o.defaults=t.extend({},r.defaults),t.extend(o.defaults,i),o.optionKeys=r.optionKeys.slice(0),Object.keys(o.defaults).forEach(function(t){1!=!o.optionKeys.indexOf(t)&&o.optionKeys.push(t)}),o.subclass=e(o),o}}(s),s}),function(t,e){"object"==typeof module&&module.exports?module.exports=e(t):t.Zdog.Dragger=e(t)}(this,function(t){var e="mousedown",r="mousemove",i="mouseup";function o(){}function n(t){this.create(t||{})}return t.PointerEvent?(e="pointerdown",r="pointermove",i="pointerup"):"ontouchstart"in t&&(e="touchstart",r="touchmove",i="touchend"),n.prototype.create=function(t){this.onDragStart=t.onDragStart||o,this.onDragMove=t.onDragMove||o,this.onDragEnd=t.onDragEnd||o,this.bindDrag(t.startElement)},n.prototype.bindDrag=function(t){(t=this.getQueryElement(t))&&(t.style.touchAction="none",t.addEventListener(e,this))},n.prototype.getQueryElement=function(t){return"string"==typeof t&&(t=document.querySelector(t)),t},n.prototype.handleEvent=function(t){var e=this["on"+t.type];e&&e.call(this,t)},n.prototype.onmousedown=n.prototype.onpointerdown=function(t){this.dragStart(t,t)},n.prototype.ontouchstart=function(t){this.dragStart(t,t.changedTouches[0])},n.prototype.dragStart=function(e,o){e.preventDefault(),this.dragStartX=o.pageX,this.dragStartY=o.pageY,t.addEventListener(r,this),t.addEventListener(i,this),this.onDragStart(o)},n.prototype.ontouchmove=function(t){this.dragMove(t,t.changedTouches[0])},n.prototype.onmousemove=n.prototype.onpointermove=function(t){this.dragMove(t,t)},n.prototype.dragMove=function(t,e){t.preventDefault();var r=e.pageX-this.dragStartX,i=e.pageY-this.dragStartY;this.onDragMove(e,r,i)},n.prototype.onmouseup=n.prototype.onpointerup=n.prototype.ontouchend=n.prototype.dragEnd=function(){t.removeEventListener(r,this),t.removeEventListener(i,this),this.onDragEnd()},n}),function(t,e){if("object"==typeof module&&module.exports)module.exports=e(require("./boilerplate"),require("./anchor"),require("./dragger"));else{var r=t.Zdog;r.Illustration=e(r,r.Anchor,r.Dragger)}}(this,function(t,e,r){function i(){}var o=t.TAU,n=e.subclass({element:void 0,centered:!0,zoom:1,dragRotate:!1,resize:!1,onPrerender:i,onDragStart:i,onDragMove:i,onDragEnd:i,onResize:i});return t.extend(n.prototype,r.prototype),n.prototype.create=function(t){e.prototype.create.call(this,t),r.prototype.create.call(this,t),this.setElement(this.element),this.setDragRotate(this.dragRotate),this.setResize(this.resize)},n.prototype.setElement=function(t){if(!(t=this.getQueryElement(t)))throw new Error("Zdog.Illustration element required. Set to "+t);var e=t.nodeName.toLowerCase();"canvas"==e?this.setCanvas(t):"svg"==e&&this.setSvg(t)},n.prototype.setSize=function(t,e){t=Math.round(t),e=Math.round(e),this.isCanvas?this.setSizeCanvas(t,e):this.isSvg&&this.setSizeSvg(t,e)},n.prototype.setResize=function(t){this.resize=t,this.resizeListener||(this.resizeListener=this.onWindowResize.bind(this)),t?(window.addEventListener("resize",this.resizeListener),this.onWindowResize()):window.removeEventListener("resize",this.resizeListener)},n.prototype.onWindowResize=function(){this.setMeasuredSize(),this.onResize(this.width,this.height)},n.prototype.setMeasuredSize=function(){var t,e;if("fullscreen"==this.resize)t=window.innerWidth,e=window.innerHeight;else{var r=this.element.getBoundingClientRect();t=r.width,e=r.height}this.setSize(t,e)},n.prototype.renderGraph=function(t){this.isCanvas?this.renderGraphCanvas(t):this.isSvg&&this.renderGraphSvg(t)},n.prototype.updateRenderGraph=function(t){this.updateGraph(),this.renderGraph(t)},n.prototype.setCanvas=function(t){this.element=t,this.isCanvas=!0,this.ctx=this.element.getContext("2d"),this.setSizeCanvas(t.width,t.height)},n.prototype.setSizeCanvas=function(t,e){this.width=t,this.height=e;var r=this.pixelRatio=window.devicePixelRatio||1;this.element.width=this.canvasWidth=t*r,this.element.height=this.canvasHeight=e*r,r>1&&!this.resize&&(this.element.style.width=t+"px",this.element.style.height=e+"px")},n.prototype.renderGraphCanvas=function(t){t=t||this,this.prerenderCanvas(),e.prototype.renderGraphCanvas.call(t,this.ctx),this.postrenderCanvas()},n.prototype.prerenderCanvas=function(){var t=this.ctx;if(t.lineCap="round",t.lineJoin="round",t.clearRect(0,0,this.canvasWidth,this.canvasHeight),t.save(),this.centered){var e=this.width/2*this.pixelRatio,r=this.height/2*this.pixelRatio;t.translate(e,r)}var i=this.pixelRatio*this.zoom;t.scale(i,i),this.onPrerender(t)},n.prototype.postrenderCanvas=function(){this.ctx.restore()},n.prototype.setSvg=function(t){this.element=t,this.isSvg=!0,this.pixelRatio=1;var e=t.getAttribute("width"),r=t.getAttribute("height");this.setSizeSvg(e,r)},n.prototype.setSizeSvg=function(t,e){this.width=t,this.height=e;var r=t/this.zoom,i=e/this.zoom,o=this.centered?-r/2:0,n=this.centered?-i/2:0;this.element.setAttribute("viewBox",o+" "+n+" "+r+" "+i),this.resize?(this.element.removeAttribute("width"),this.element.removeAttribute("height")):(this.element.setAttribute("width",t),this.element.setAttribute("height",e))},n.prototype.renderGraphSvg=function(t){t=t||this,function(t){for(;t.firstChild;)t.removeChild(t.firstChild)}(this.element),this.onPrerender(this.element),e.prototype.renderGraphSvg.call(t,this.element)},n.prototype.setDragRotate=function(t){t&&(!0===t&&(t=this),this.dragRotate=t,this.bindDrag(this.element))},n.prototype.dragStart=function(){this.dragStartRX=this.dragRotate.rotate.x,this.dragStartRY=this.dragRotate.rotate.y,r.prototype.dragStart.apply(this,arguments)},n.prototype.dragMove=function(t,e){var i=e.pageX-this.dragStartX,n=e.pageY-this.dragStartY,s=Math.min(this.width,this.height),h=i/s*o,a=n/s*o;this.dragRotate.rotate.x=this.dragStartRX-a,this.dragRotate.rotate.y=this.dragStartRY-h,r.prototype.dragMove.apply(this,arguments)},n}),function(t,e){if("object"==typeof module&&module.exports)module.exports=e(require("./vector"));else{var r=t.Zdog;r.PathCommand=e(r.Vector)}}(this,function(t){function e(e,o,n){this.method=e,this.points=o.map(r),this.renderPoints=o.map(i),this.previousPoint=n,this.endRenderPoint=this.renderPoints[this.renderPoints.length-1],"arc"==e&&(this.controlPoints=[new t,new t])}function r(e){return e instanceof t?e:new t(e)}function i(e){return new t(e)}e.prototype.reset=function(){var t=this.points;this.renderPoints.forEach(function(e,r){var i=t[r];e.set(i)})},e.prototype.transform=function(t,e,r){this.renderPoints.forEach(function(i){i.transform(t,e,r)})},e.prototype.render=function(t,e,r){return this[this.method](t,e,r)},e.prototype.move=function(t,e,r){return r.move(t,e,this.renderPoints[0])},e.prototype.line=function(t,e,r){return r.line(t,e,this.renderPoints[0])},e.prototype.bezier=function(t,e,r){var i=this.renderPoints[0],o=this.renderPoints[1],n=this.renderPoints[2];return r.bezier(t,e,i,o,n)};return e.prototype.arc=function(t,e,r){var i=this.previousPoint,o=this.renderPoints[0],n=this.renderPoints[1],s=this.controlPoints[0],h=this.controlPoints[1];return s.set(i).lerp(o,9/16),h.set(n).lerp(o,9/16),r.bezier(t,e,s,h,n)},e}),function(t,e){if("object"==typeof module&&module.exports)module.exports=e(require("./boilerplate"),require("./vector"),require("./path-command"),require("./anchor"));else{var r=t.Zdog;r.Shape=e(r,r.Vector,r.PathCommand,r.Anchor)}}(this,function(t,e,r,i){var o=i.subclass({stroke:1,fill:!1,color:"#333",closed:!0,visible:!0,path:[{}],front:{z:1},backface:!0});o.prototype.create=function(t){i.prototype.create.call(this,t),this.updatePath(),this.front=new e(t.front||this.front),this.renderFront=new e(this.front),this.renderNormal=new e};var n=["move","line","bezier","arc"];o.prototype.updatePath=function(){this.setPath(),this.updatePathCommands()},o.prototype.setPath=function(){},o.prototype.updatePathCommands=function(){var t;this.pathCommands=this.path.map(function(e,i){var o=Object.keys(e),s=o[0],h=e[s];1==o.length&&-1!=n.indexOf(s)||(s="line",h=e);var a="line"==s||"move"==s,p=Array.isArray(h);a&&!p&&(h=[h]);var u=new r(s=0===i?"move":s,h,t);return t=u.endRenderPoint,u})},o.prototype.reset=function(){this.renderOrigin.set(this.origin),this.renderFront.set(this.front),this.pathCommands.forEach(function(t){t.reset()})},o.prototype.transform=function(t,e,r){this.renderOrigin.transform(t,e,r),this.renderFront.transform(t,e,r),this.renderNormal.set(this.renderOrigin).subtract(this.renderFront),this.pathCommands.forEach(function(i){i.transform(t,e,r)}),this.children.forEach(function(i){i.transform(t,e,r)})},o.prototype.updateSortValue=function(){var t=this.pathCommands.length,e=this.pathCommands[0].endRenderPoint,r=this.pathCommands[t-1].endRenderPoint;t>2&&e.isSame(r)&&(t-=1);for(var i=0,o=0;o<t;o++)i+=this.pathCommands[o].endRenderPoint.z;this.sortValue=i/t},o.prototype.render=function(t,e){var r=this.pathCommands.length;if(this.visible&&r&&(this.isFacingBack=this.renderNormal.z>0,this.backface||!this.isFacingBack)){if(!e)throw new Error("Zdog renderer required. Set to "+e);var i=1==r;e.isCanvas&&i?this.renderCanvasDot(t,e):this.renderPath(t,e)}};var s=t.TAU;o.prototype.renderCanvasDot=function(t){var e=this.getLineWidth();if(e){t.fillStyle=this.getRenderColor();var r=this.pathCommands[0].endRenderPoint;t.beginPath();var i=e/2;t.arc(r.x,r.y,i,0,s),t.fill()}},o.prototype.getLineWidth=function(){return this.stroke?1==this.stroke?1:this.stroke:0},o.prototype.getRenderColor=function(){return"string"==typeof this.backface&&this.isFacingBack?this.backface:this.color},o.prototype.renderPath=function(t,e){var r=this.getRenderElement(t,e),i=!(2==this.pathCommands.length&&"line"==this.pathCommands[1].method)&&this.closed,o=this.getRenderColor();e.renderPath(t,r,this.pathCommands,i),e.stroke(t,r,this.stroke,o,this.getLineWidth()),e.fill(t,r,this.fill,o),e.end(t,r)};return o.prototype.getRenderElement=function(t,e){if(e.isSvg)return this.svgElement||(this.svgElement=document.createElementNS("http://www.w3.org/2000/svg","path"),this.svgElement.setAttribute("stroke-linecap","round"),this.svgElement.setAttribute("stroke-linejoin","round")),this.svgElement},o}),function(t,e){if("object"==typeof module&&module.exports)module.exports=e(require("./anchor"));else{var r=t.Zdog;r.Group=e(r.Anchor)}}(this,function(t){var e=t.subclass({updateSort:!1,visible:!0});return e.prototype.updateSortValue=function(){var e=0;this.flatGraph.forEach(function(t){t.updateSortValue(),e+=t.sortValue}),this.sortValue=e/this.flatGraph.length,this.updateSort&&this.flatGraph.sort(t.shapeSorter)},e.prototype.render=function(t,e){this.visible&&this.flatGraph.forEach(function(r){r.render(t,e)})},e.prototype.updateFlatGraph=function(){this.flatGraph=this.addChildFlatGraph([])},e.prototype.getFlatGraph=function(){return[this]},e}),function(t,e){if("object"==typeof module&&module.exports)module.exports=e(require("./shape"));else{var r=t.Zdog;r.Rect=e(r.Shape)}}(this,function(t){var e=t.subclass({width:1,height:1});return e.prototype.setPath=function(){var t=this.width/2,e=this.height/2;this.path=[{x:-t,y:-e},{x:t,y:-e},{x:t,y:e},{x:-t,y:e}]},e}),function(t,e){if("object"==typeof module&&module.exports)module.exports=e(require("./shape"));else{var r=t.Zdog;r.RoundedRect=e(r.Shape)}}(this,function(t){var e=t.subclass({width:1,height:1,cornerRadius:.25,closed:!1});return e.prototype.setPath=function(){var t=this.width/2,e=this.height/2,r=Math.min(t,e),i=Math.min(this.cornerRadius,r),o=t-i,n=e-i,s=[{x:o,y:-e},{arc:[{x:t,y:-e},{x:t,y:-n}]}];n&&s.push({x:t,y:n}),s.push({arc:[{x:t,y:e},{x:o,y:e}]}),o&&s.push({x:-o,y:e}),s.push({arc:[{x:-t,y:e},{x:-t,y:n}]}),n&&s.push({x:-t,y:-n}),s.push({arc:[{x:-t,y:-e},{x:-o,y:-e}]}),o&&s.push({x:o,y:-e}),this.path=s},e}),function(t,e){if("object"==typeof module&&module.exports)module.exports=e(require("./shape"));else{var r=t.Zdog;r.Ellipse=e(r.Shape)}}(this,function(t){var e=t.subclass({diameter:1,width:void 0,height:void 0,quarters:4,closed:!1});return e.prototype.setPath=function(){var t=(null!=this.width?this.width:this.diameter)/2,e=(null!=this.height?this.height:this.diameter)/2;this.path=[{x:0,y:-e},{arc:[{x:t,y:-e},{x:t,y:0}]}],this.quarters>1&&this.path.push({arc:[{x:t,y:e},{x:0,y:e}]}),this.quarters>2&&this.path.push({arc:[{x:-t,y:e},{x:-t,y:0}]}),this.quarters>3&&this.path.push({arc:[{x:-t,y:-e},{x:0,y:-e}]})},e}),function(t,e){if("object"==typeof module&&module.exports)module.exports=e(require("./boilerplate"),require("./shape"));else{var r=t.Zdog;r.Polygon=e(r,r.Shape)}}(this,function(t,e){var r=e.subclass({sides:3,radius:.5}),i=t.TAU;return r.prototype.setPath=function(){this.path=[];for(var t=0;t<this.sides;t++){var e=t/this.sides*i-i/4,r=Math.cos(e)*this.radius,o=Math.sin(e)*this.radius;this.path.push({x:r,y:o})}},r}),function(t,e){if("object"==typeof module&&module.exports)module.exports=e(require("./boilerplate"),require("./vector"),require("./anchor"),require("./ellipse"));else{var r=t.Zdog;r.Hemisphere=e(r,r.Vector,r.Anchor,r.Ellipse)}}(this,function(t,e,r,i){var o=i.subclass({fill:!0}),n=t.TAU;o.prototype.create=function(){i.prototype.create.apply(this,arguments),this.apex=new r({addTo:this,translate:{z:this.diameter/2}}),this.renderCentroid=new e},o.prototype.updateSortValue=function(){this.renderCentroid.set(this.renderOrigin).lerp(this.apex.renderOrigin,3/8),this.sortValue=this.renderCentroid.z},o.prototype.render=function(t,e){this.renderDome(t,e),i.prototype.render.apply(this,arguments)},o.prototype.renderDome=function(t,e){if(this.visible){var r=this.getDomeRenderElement(t,e),i=Math.atan2(this.renderNormal.y,this.renderNormal.x),o=this.diameter/2*this.renderNormal.magnitude(),s=this.renderOrigin.x,h=this.renderOrigin.y;if(e.isCanvas){var a=i+n/4,p=i-n/4;t.beginPath(),t.arc(s,h,o,a,p)}else e.isSvg&&(i=(i-n/4)/n*360,this.domeSvgElement.setAttribute("d","M "+-o+",0 A "+o+","+o+" 0 0 1 "+o+",0"),this.domeSvgElement.setAttribute("transform","translate("+s+","+h+" ) rotate("+i+")"));e.stroke(t,r,this.stroke,this.color,this.getLineWidth()),e.fill(t,r,this.fill,this.color),e.end(t,r)}};return o.prototype.getDomeRenderElement=function(t,e){if(e.isSvg)return this.domeSvgElement||(this.domeSvgElement=document.createElementNS("http://www.w3.org/2000/svg","path"),this.domeSvgElement.setAttribute("stroke-linecap","round"),this.domeSvgElement.setAttribute("stroke-linejoin","round")),this.domeSvgElement},o}),function(t,e){if("object"==typeof module&&module.exports)module.exports=e(require("./boilerplate"),require("./path-command"),require("./shape"),require("./group"),require("./ellipse"));else{var r=t.Zdog;r.Cylinder=e(r,r.PathCommand,r.Shape,r.Group,r.Ellipse)}}(this,function(t,e,r,i,o){function n(){}var s=i.subclass({color:"#333",updateSort:!0});s.prototype.create=function(){i.prototype.create.apply(this,arguments),this.pathCommands=[new e("move",[{}]),new e("line",[{}])]},s.prototype.render=function(t,e){this.renderCylinderSurface(t,e),i.prototype.render.apply(this,arguments)},s.prototype.renderCylinderSurface=function(t,e){if(this.visible){var r=this.getRenderElement(t,e),i=this.frontBase,o=this.rearBase,n=i.renderNormal.magnitude(),s=i.diameter*n+i.getLineWidth();this.pathCommands[0].renderPoints[0].set(i.renderOrigin),this.pathCommands[1].renderPoints[0].set(o.renderOrigin),e.isCanvas&&(t.lineCap="butt"),e.renderPath(t,r,this.pathCommands),e.stroke(t,r,!0,this.color,s),e.end(t,r),e.isCanvas&&(t.lineCap="round")}};s.prototype.getRenderElement=function(t,e){if(e.isSvg)return this.svgElement||(this.svgElement=document.createElementNS("http://www.w3.org/2000/svg","path")),this.svgElement},s.prototype.copyGraph=n,o.subclass().prototype.copyGraph=n;var h=r.subclass({diameter:1,length:1,frontFace:void 0,fill:!0}),a=t.TAU;h.prototype.create=function(){r.prototype.create.apply(this,arguments),this.group=new s({addTo:this,color:this.color,visible:this.visible});var t=this.length/2,e=this.backface||!0;this.frontBase=this.group.frontBase=new o({addTo:this.group,diameter:this.diameter,translate:{z:t},rotate:{y:a/2},color:this.color,stroke:this.stroke,fill:this.fill,backface:this.frontFace||e,visible:this.visible}),this.rearBase=this.group.rearBase=this.frontBase.copy({translate:{z:-t},rotate:{y:0},backface:e})},h.prototype.render=function(){};return["stroke","fill","color","visible"].forEach(function(t){var e="_"+t;Object.defineProperty(h.prototype,t,{get:function(){return this[e]},set:function(r){this[e]=r,this.frontBase&&(this.frontBase[t]=r,this.rearBase[t]=r,this.group[t]=r)}})}),h}),function(t,e){if("object"==typeof module&&module.exports)module.exports=e(require("./boilerplate"),require("./vector"),require("./path-command"),require("./anchor"),require("./ellipse"));else{var r=t.Zdog;r.Cone=e(r,r.Vector,r.PathCommand,r.Anchor,r.Ellipse)}}(this,function(t,e,r,i,o){var n=o.subclass({length:1,fill:!0}),s=t.TAU;n.prototype.create=function(){o.prototype.create.apply(this,arguments),this.apex=new i({addTo:this,translate:{z:this.length}}),this.renderApex=new e,this.renderCentroid=new e,this.tangentA=new e,this.tangentB=new e,this.surfacePathCommands=[new r("move",[{}]),new r("line",[{}]),new r("line",[{}])]},n.prototype.updateSortValue=function(){this.renderCentroid.set(this.renderOrigin).lerp(this.apex.renderOrigin,1/3),this.sortValue=this.renderCentroid.z},n.prototype.render=function(t,e){this.renderConeSurface(t,e),o.prototype.render.apply(this,arguments)},n.prototype.renderConeSurface=function(t,e){if(this.visible){this.renderApex.set(this.apex.renderOrigin).subtract(this.renderOrigin);var r=this.renderNormal.magnitude(),i=this.renderApex.magnitude2d(),o=this.renderNormal.magnitude2d(),n=Math.acos(o/r),h=Math.sin(n),a=this.diameter/2*r;if(a*h<i){var p=Math.atan2(this.renderNormal.y,this.renderNormal.x)+s/2,u=i/h,d=Math.acos(a/u),c=this.tangentA,l=this.tangentB;c.x=Math.cos(d)*a*h,c.y=Math.sin(d)*a,l.set(this.tangentA),l.y*=-1,c.rotateZ(p),l.rotateZ(p),c.add(this.renderOrigin),l.add(this.renderOrigin),this.setSurfaceRenderPoint(0,c),this.setSurfaceRenderPoint(1,this.apex.renderOrigin),this.setSurfaceRenderPoint(2,l);var f=this.getSurfaceRenderElement(t,e);e.renderPath(t,f,this.surfacePathCommands),e.stroke(t,f,this.stroke,this.color,this.getLineWidth()),e.fill(t,f,this.fill,this.color),e.end(t,f)}}};return n.prototype.getSurfaceRenderElement=function(t,e){if(e.isSvg)return this.surfaceSvgElement||(this.surfaceSvgElement=document.createElementNS("http://www.w3.org/2000/svg","path"),this.surfaceSvgElement.setAttribute("stroke-linecap","round"),this.surfaceSvgElement.setAttribute("stroke-linejoin","round")),this.surfaceSvgElement},n.prototype.setSurfaceRenderPoint=function(t,e){this.surfacePathCommands[t].renderPoints[0].set(e)},n}),function(t,e){if("object"==typeof module&&module.exports)module.exports=e(require("./boilerplate"),require("./anchor"),require("./shape"),require("./rect"));else{var r=t.Zdog;r.Box=e(r,r.Anchor,r.Shape,r.Rect)}}(this,function(t,e,r,i){var o=i.subclass();o.prototype.copyGraph=function(){};var n=t.TAU,s=["frontFace","rearFace","leftFace","rightFace","topFace","bottomFace"],h=t.extend({},r.defaults);delete h.path,s.forEach(function(t){h[t]=!0}),t.extend(h,{width:1,height:1,depth:1,fill:!0});var a=e.subclass(h);a.prototype.create=function(t){e.prototype.create.call(this,t),this.updatePath(),this.fill=this.fill},a.prototype.updatePath=function(){s.forEach(function(t){this[t]=this[t]},this)},s.forEach(function(t){var e="_"+t;Object.defineProperty(a.prototype,t,{get:function(){return this[e]},set:function(r){this[e]=r,this.setFace(t,r)}})}),a.prototype.setFace=function(t,e){var r=t+"Rect",i=this[r];if(e){var n=this.getFaceOptions(t);n.color="string"==typeof e?e:this.color,i?i.setOptions(n):i=this[r]=new o(n),i.updatePath(),this.addChild(i)}else this.removeChild(i)},a.prototype.getFaceOptions=function(t){return{frontFace:{width:this.width,height:this.height,translate:{z:this.depth/2}},rearFace:{width:this.width,height:this.height,translate:{z:-this.depth/2},rotate:{y:n/2}},leftFace:{width:this.depth,height:this.height,translate:{x:-this.width/2},rotate:{y:-n/4}},rightFace:{width:this.depth,height:this.height,translate:{x:this.width/2},rotate:{y:n/4}},topFace:{width:this.width,height:this.depth,translate:{y:-this.height/2},rotate:{x:-n/4}},bottomFace:{width:this.width,height:this.depth,translate:{y:this.height/2},rotate:{x:n/4}}}[t]};return["color","stroke","fill","backface","front","visible"].forEach(function(t){var e="_"+t;Object.defineProperty(a.prototype,t,{get:function(){return this[e]},set:function(r){this[e]=r,s.forEach(function(e){var i=this[e+"Rect"],o="string"==typeof this[e];i&&!("color"==t&&o)&&(i[t]=r)},this)}})}),a}),function(t,e){"object"==typeof module&&module.exports?module.exports=function(t,e,r,i,o,n,s,h,a,p,u,d,c,l,f,y,m,g){return t.CanvasRenderer=e,t.SvgRenderer=r,t.Vector=i,t.Anchor=o,t.Dragger=n,t.Illustration=s,t.PathCommand=h,t.Shape=a,t.Group=p,t.Rect=u,t.RoundedRect=d,t.Ellipse=c,t.Polygon=l,t.Hemisphere=f,t.Cylinder=y,t.Cone=m,t.Box=g,t}(require("./boilerplate"),require("./canvas-renderer"),require("./svg-renderer"),require("./vector"),require("./anchor"),require("./dragger"),require("./illustration"),require("./path-command"),require("./shape"),require("./group"),require("./rect"),require("./rounded-rect"),require("./ellipse"),require("./polygon"),require("./hemisphere"),require("./cylinder"),require("./cone"),require("./box")):"function"==typeof define&&define.amd&&define("zdog",[],t.Zdog)}(this);

x=game.getContext`2d`;
state = 0; //0 is title screen, 1 is gameplay
level = 5; //0 and lower are states, everything higher are game levels
playerx = 0; playery = 0;
playermovex = 0; playermovey = 1;
horborder = 200; flipy = 9000; flipped = 1;
paused = false;
direction = 1; cameray = 0;
const TAU = Zdog.TAU
obstacle = [];
shakex = 0; shakey = 0; shakeduration = 0;
bgcolor = "#223e32";
const times = []; let fps;

create();
setInterval(e=>{ step(false) },15);
onkeydown=e=>{ input(e.key); }
let pageWidth = window.innerWidth || document.body.clientWidth;
let treshold = Math.max(1,Math.floor(0.01 * (pageWidth)));
let touchstartX = 0;
let touchstartY = 0;
let touchendX = 0;
let touchendY = 0;

const limit = Math.tan(45 * 1.5 / 180 * Math.PI);
const gestureZone = document.getElementById('game');

gestureZone.addEventListener('touchstart', function(event) {
    touchstartX = event.changedTouches[0].screenX;
    touchstartY = event.changedTouches[0].screenY;
}, false);

gestureZone.addEventListener('touchend', function(event) {
    touchendX = event.changedTouches[0].screenX;
    touchendY = event.changedTouches[0].screenY;
    handleGesture(event);
}, false);

//Taken from https://stackoverflow.com/a/19303725
var seed = 1;
function random() {
    var x = Math.sin(seed++) * 10000;
    return x - Math.floor(x);
}

function create() {

    // create illo
    illo = new Zdog.Illustration({
        element: '.zdog-canvas',
        dragRotate: true,
        zoom: 2,
        resize: true,
        rotate: {x: -(TAU/16), y: TAU/16},
        onPrerender: function(ctx) {
            ctx.beginPath();
            ctx.rect(-1080, -1080, 1080*2, 1080*2);
            ctx.fillStyle = bgcolor;
            ctx.fill();
        },
    });

    player = new Zdog.Group({
        addTo: illo,
        transform: {z: 25}
    });

    var body = new Zdog.Shape({
        addTo: player,
        stroke: 24,
        color: '#04bf00',
    });

    var eyes = new Zdog.Shape({
        addTo: player,
        stroke: 5,
        color: '#fff',
        translate: {z: 5},
        path: [
            { x: -6, y: -10 },          // start at top left
            { x: -6, y: 0 },          // line to top right
            { move: { x: 6, y: -10 } }, // move to bottom left
            { x: 6, y: 0 },          // line to bottom right
        ],
    });

    var legs = new Zdog.Shape({
        addTo: player,
        stroke: 5,
        color: '#04bf00',
        translate: {y: 16, z: 5},
        path: [
            { x: -6, y: -10 },          // left leg at body
            { x: -6, y: 0 },          // to knee
            { x: -10, y: 0 },          // to toes
            { move: { x: 6, y: -10 } }, // right leg
            { x: 6, y: 0 },          // to knee
            { x: 10, y: 0 },          // to toes
        ],
    });

    var border = new Zdog.Shape({
        addTo: illo,
        stroke: 8,
        color: "#9db800",
        path: [ //QQQ Don't make them so long but move with either player or camera
            { x: -horborder-10, y: -1000 },          // start at top left
            { x: -horborder-10, y: 1000 },          // line to top right
            { move: { x: horborder+10, y: -1000 } }, // move to bottom left
            { x: horborder+10, y: 1000 },          // line to bottom right
        ],
    });

    resizescreen();

    loadlevel(level);

    draw();
}

function loadlevel(lvlnumber) {
    //Clean up
    level = lvlnumber;

    if (state == 0) {player.visible = false;} //Demo mode for title screen
    else {player.visible = true;}

    seed = 1000*lvlnumber
    if (obstacle.length > 1)
    {
        for (var i = 0; i != obstacle.length; i++)
        {
            obstacle[i].remove();
            console.log("Obstacle removed");
        }
    }
    obstacle = []
    flipped = 1; bgcolor = "#223e32"; 
    playerx = 0; playery = 0; playermovex = 0; playermovey = 1;
    illo.rotate = {x: -(TAU/16), y: TAU/16};

    //Build new
    direction = 1;
    var amount = (lvlnumber*2) + 1

    for (var i = 0; i != amount; i++)
    {
        var obstaclex = random() * (horborder - -horborder) + -horborder;
        var obstacley = i*50-direction;
        var front = (random() >= 0.2);
        var clr = "#015d00"; if (front == true) {clr = "#b3dd52"}

        obstacle[i] = new Zdog.Box({
            addTo: illo,
            width: 32,
            height: 32*3,
            frontFace: false, backFace: false,
            depth: 8,
            stroke: 8,
            cornerRadius: 20,
            color: clr,
            translate: {x: obstaclex, y: obstacley, z: (front * 50) -25}
        });
        obstacle[i].colliding = false;
        console.log[i];
    }

    flipy = i*50-direction;

    console.log("Loaded level "+lvlnumber.toString())
}

function step(framestep) {

    const now = performance.now();
    while (times.length > 0 && times[0] <= now - 1000) {
        times.shift();
    }
    times.push(now);
    fps = times.length;
    document.getElementById("fps-display").innerHTML = fps.toString() + " fps";
    document.getElementById("seed-display").innerHTML = seed.toString() + " seed";
    document.getElementById("level-display").innerHTML = level.toString() + " level";
    document.getElementById("cam-display").innerHTML = illo.rotate.x.toString() + "x  " + illo.rotate.y.toString() + "y  " + illo.rotate.x.toString() + "z  " + TAU.toString() + "tau";

    if (paused && framestep == false) {return;}
    cameray -= direction;

    if (shakeduration > 0)
    {
        illo.translate = {x: 0 + shakex, y: cameray + shakey}; 
        shakeduration -= 1;
    } else {
        illo.translate = {x: 0, y: cameray}; 
    }

    if (flipped == -1) 
    {
        if (illo.rotate.x < (TAU/16)*7)
        {
            illo.rotate.x += (TAU/16);
            bgcolor = "#A7C06D";
        }
    } 

    if (playery > flipy)
    {
        playery = flipy;
        flipped = -1;
        sound([0,,0.0371,,0.3841,0.3887,,0.1299,,,,,,0.566,,0.4401,,,1,,,,,0.71])
        playermovey = -1;
    }

    for (var j = 0; j != 4; j += 1) //So we're doing most of the step loop four times for smoother movement! They did it in Super Mario 64, so can I!
    {
        playerx += playermovex/4;
        if (playerx > horborder) {playerx = horborder; playermovex = 0; playermovey = 1*flipped}
        if (playerx < -horborder) {playerx = -horborder; playermovex = 0; playermovey = 1*flipped}
        playery += playermovey/4;
        
        for (var i = 0; i != obstacle.length; i++)
        {
            xx = obstacle[i].translate.x; 
            yy = obstacle[i].translate.y;
            zz = obstacle[i].translate.z;
            w = obstacle[i].width-5; h = obstacle[i].height-20;

            if ( ((flipped == 1 && zz == 25) || (flipped == -1 && zz == -25)) && playerx > xx - w && playerx < xx + w && playery > yy - h && playery < yy + h)
            {
                if (obstacle[i].colliding == false)
                { //Collision enter
                    console.log("Collision detected with "+i.toString());
                    obstacle[i].colliding = true;
                    
                    if (playermovex > 0) {shakex = 5;} else if (playermovex < 0) {shakex = -5} else {shakex = 0}
                    playermovex = 0; playermovey = 1*flipped; shakeduration = 2;

                    sound([0,,0.035,,0.1449+(random()*0.5),0.4918,,-0.5252,,,,,,0.034,,,,,1,,,,,0.5+(random()*0.3)])
                }
            }
            else if (obstacle[i].colliding == true)
            { //Collision leave
                console.log("Collision ended with "+i.toString());
                obstacle[i].colliding = false;

                if (obstacle[i].translate.z == 25) //In foreground
                {
                    obstacle[i].translate.z = -25; obstacle[i].color = "#015d00";
                } else { //In background
                    obstacle[i].translate.z = 25; obstacle[i].color = "#b3dd52"  ;
                }
            }
        }
    }

    draw();
}

function handleGesture(e) { //Taken from https://gist.github.com/SleepWalker/da5636b1abcbaff48c4d#gistcomment-2577818
    let x = touchendX - touchstartX;
    let y = touchendY - touchstartY;
    let xy = Math.abs(x / y);
    let yx = Math.abs(y / x);
    if (Math.abs(x) > treshold || Math.abs(y) > treshold) {
        if (yx <= limit) {
            if (x < 0) {
                input("ArrowLeft");
            } else {
                input("ArrowRight");
            }
        }
        if (xy <= limit) {
            if (y < 0) {
                input("ArrowUp");
            } else {
                input("ArrowDown");
            }
        }
    } else {
        input(" ");
    }
}

function input(key) {
    console.log(key)

    if (state == 0) //Main menu
    {
        if (key == " ") {
            document.getElementById("l1").style.animation = "gamestart-top 1s ease-in";
            document.getElementById("l2").style.animation = "gamestart-bottom 1s ease-in";
            document.getElementById("l3").style.visibility = "hidden"; 
            document.getElementById("not").style.visibility = "hidden";
            state = 1;
            sound([1,,0.0806,,0.4981,0.2637,,0.4277,,,,,,,,0.6758,,,1,,,,,0.5]); //QQQ Move sound to whenever title screen loads
            loadlevel(5)
            setTimeout(function(){
                document.getElementById("l1").style.visibility = "hidden";
                document.getElementById("l2").style.visibility = "hidden";
            }, 990);
        }
    }
    else if (state == 1) //Gameplay
    {
        if (key == "Escape")
        {
            pause(-1)
        }
        
        if (paused) 
        {
            if (key == "f") //Frame skip QQQ
                {step(true);}
            if (key == " ")
            {
                draw() //Allow rotation QQQ
            }
            else
                {return;}
        }

        var delta = 0; 
        if (key == "ArrowLeft" || key == "a" || key == "q") {delta = -1}
        if (key == "ArrowRight" || key == "d") {delta = 1}
        
        if (delta != 0 && playermovex == 0) //Left or A or Q
        {
            playermovex = 8*delta;
            playermovey = 0;
            sound([1,,0.2159,0.2603,0.1064,0.4074+(random()*0.3),0.2062,-0.3031,-0.0065,0.0638,0.0206,-0.0114,,0.4332,0.1898,,-0.0074,-0.0091,1,-0.0456,,0.1791,0.0109,0.5])
            //QQQ If there's something you are colliding with it should end here
        }
        if ((key == "ArrowUp" || key == "w" || key == "z"))
        {
            playermovex = 0;
            playermovey = 0.5*flipped;
            sound([0,,0.0549,0.0019,0.1806,0.3751+(random()*0.3),0.0193,0.2378,0.0414,,0.0453,0.0003,,0.3062,0.0736,0.0563,0.014,0.0768,0.936,-0.0341,0.0175,0.1448,0.0321,0.5])
        }
        if ((key == "ArrowDown" || key == "s"))
        {
            playermovex = 0;
            playermovey = 3*flipped;
            sound([1,,0.2506,0.0144,0.0071,0.4263+(random()*0.2),0.2723,-0.252,,,,,,0.7952,-0.6573,,0.1965,-0.182,1,,,,,0.5])
        }
        if (key == " ")
        {
            pause(false)
        }
    }
}

function draw() {
    player.translate = {x: playerx, y: playery}
    var yoff = 0; if (flipped == -1) {yoff = -TAU/2}
    player.rotate = { y: -(playermovex)*0.08, x: -(playermovey*0.15*flipped)+yoff} //x and y swap here
    cameray = (-flipped*player.translate.y*0.935)-100; // 15/16 

    illo.updateRenderGraph();
}

//Utility functions
window.addEventListener("resize", function() {
    resizescreen();
});

function resizescreen() {
    var canvas = document.getElementById('game');
    if (window.innerWidth > 850 && window.innerHeight > 600) {illo.zoom = 2}
    else if (window.innerWidth > 600 && window.innerHeight > 400) {illo.zoom = 1.5}
    else if (window.innerWidth > 400 && window.innerHeight > 300) {illo.zoom = 1}
    else {illo.zoom = 0.9}
    draw();
}

function sound(settings) {
    var soundURL = jsfxr(settings); 
    var player = new Audio();
    player.src = soundURL;
    player.play();
}

document.addEventListener("visibilitychange", function() {
    pause(true)
    });

function pause(toggle) {
    if (state == 0) {return;}
    if (toggle == -1) {paused = !paused;}
    else if (paused != toggle) {paused = toggle} else {return;}

    var n = document.getElementById('not')
    if (paused) {
        n.style.visibility = "visible"; n.innerHTML = "PAUSED, [Space] or [Tap] to resume<br><br>How to play:<br>⬅➡ Flying kick<br>⬆⬇ Slow/fasten fall<br><br>Touched platforms move to<br>background and increase jackpot.<br>Reach bottom of level to claim<br>jackpot and flip to the backside!<br> You lose when time runs out...";
    }
    else {
        n.style.visibility = "hidden";
    }
}