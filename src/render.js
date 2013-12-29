/* render.js 
	depends on canvas with id eco-canvas on page
*/

(function(eco) {
	var MAXX = 400;
	var MAXY = 400;
	var WIDTH= 5;
	eco.render = {
		drawSystem : function (collection) { // collection of type player is passed
			var ctx = eco.render.ctx;
			ctx.clearRect(0, 0, MAXX, MAXY);
			for(var c=0; c < collection.length; c++) {
				var p = collection[c];
				var grid = p.grid();
				var W = p.W;
				for(var i = 0; i < W; i++) {
					for(var j = 0; j < W; j++) {
						ctx.fillStyle = grid[i][j];
						var x = p.x() + i*WIDTH;
						var y = p.y() + j*WIDTH;
						ctx.fillRect( x, y,	WIDTH,	WIDTH);
					}
				}	
			}		
		}
	};
	eco.render.ctx = {} //injected at runtime	

})(eco);