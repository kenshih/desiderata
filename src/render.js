/* render.js 
	depends on canvas with id eco-canvas on page
*/

(function(eco) {
	var MAXX = 300;
	var MAXY = 300;
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
						shapes.circle(ctx, p, i, j);
					}
				}	
			}		
		}
	};

	var shapes = {
		circle : function(ctx, p, i, j) {
			var grid = p.grid();
			ctx.fillStyle = grid[i][j]==auto.A1.SEED?auto.A1.COLOR2:grid[i][j];
			var x = p.x() + WIDTH/2 + i*WIDTH;
			var y = p.y() + WIDTH/2 + j*WIDTH;
			ctx.beginPath();
			ctx.arc(x, y, WIDTH/2, 0, 2*Math.PI);
			ctx.fill();
		},
		rectangle : function(ctx, p, i, j) {
			var grid = p.grid();
			ctx.fillStyle = grid[i][j]==auto.A1.SEED?auto.A1.COLOR2:grid[i][j];
			var x = p.x() + i*WIDTH;
			var y = p.y() + j*WIDTH;
			ctx.fillRect( x, y,	WIDTH,	WIDTH);
		}
	};

	eco.render.ctx = {} //injected at runtime	

})(eco);

