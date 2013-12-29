/* automata 1 */

var auto = {};

auto.A1 = function(){};

auto.instance = function(W, algo, x, y, cfg) {
	var i = new auto.A1();
	i.W = W;
	i.tickRule = algo;
	i.xCoord = x;
	i.yCoord = y;
	i.initGrid(cfg);
	i.cfg = cfg;
	return i;
};

// some rules to play with
auto.rule = {};
auto.rule.simple1 = function() {
	var G = this.g;
	var W = this.W;
	for(var i = 0; i < W; i++) {
		for(var j = 0; j < W; j++) {
			if(G[i][j] == auto.A1.COLOR2) G[i][j] = auto.A1.COLOR1;
			else G[i][j] = auto.A1.COLOR2;
		}
	}	
};

/// end play rules

//color systems
auto.A1.COLOR1 = '#00878F'
auto.A1.COLOR2 = '#62AEB2';

//set play rule
auto.A1.prototype.tickRule = auto.rule.neighbor1;

auto.A1.prototype.W = 6;

auto.A1.prototype.destroy = function() {
	for(o in this) {
		delete o;
	}
}

auto.A1.prototype.initGrid = function(cfg) {
	this.g = [];
	var G = this.g;
	var W = this.W;
	var count = 0;
	for(var i = 0; i < W; i++) {
		G[i]=[];
		for(var j = 0; j < W; j++) {
				G[i][j]=auto.A1.COLOR1;
		}
	}
	G[0][1]=auto.A1.COLOR2;
	console.log("init once per trial");
}
auto.A1.prototype.grid = function() { return this.g; }
auto.A1.prototype.setCoord = function(x, y) {
	this.xCoord = x;
	this.yCoord = y;
}
auto.A1.prototype.x = function() { return this.xCoord; }
auto.A1.prototype.y = function() { return this.yCoord; }
auto.A1.prototype.width = function() { return this.W; }
auto.A1.prototype.height = function() { return this.W; }

auto.A1.prototype.handleEvent = function(evt) {
	switch(evt.type) {
		case 'tick':
			this.tickRule(this.cfg);
			//console.log('player: auto1 tick received');
			break;
		case 'out-of-bounds':
			console.log('player: auto1 out-of-bounds received');
			break;
		default:
			; //do nothing
	}
}
