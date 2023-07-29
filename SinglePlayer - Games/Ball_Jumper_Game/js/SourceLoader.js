/**
 * @author jaliborc / http://jaliborc.com/
 */

THREE.SourceLoader = function(manager) {
	this.manager = (manager !== undefined) ? manager : THREE.DefaultLoadingManager;
};

THREE.SourceLoader.prototype = {
	constructor: THREE.SourceLoader,

	load: function(urls, onLoad) {
		this.urls = urls
		this.results = {}
		this.loadFile(0)
		this.onLoad = onLoad
	},

	loadFile: function(i) {
		if (i == this.urls.length)
    		return this.onLoad(this.results)

    	var scope = this
    	var url = this.urls[i]
		var loader = new THREE.XHRLoader(this.manager);
		loader.setCrossOrigin(this.crossOrigin);
		loader.load(url, function(text) {
			scope.results[url] = text
	    	scope.loadFile(i+1)
	  	})
	}
}