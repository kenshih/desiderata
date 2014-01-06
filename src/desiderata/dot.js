

/* dot.js */
$(function(){
	var BLACK = auto.A1.COLOR2;
	var WHITE = auto.A1.COLOR1;
	var N = 'N'; //1
	var S = 'S';
	var E = 'E'; //1
	var W = 'W';
	var NO_MOVE = 'NO_MOVE';
	
	auto.rule.dot = function(cfg) {
		// (main)
		var G = this.g; //grid
		var WIDTH = this.W; //width of grid
		if(this.start === undefined) this.start = new Dot(WIDTH, 5, 5); //{x: 5, y: 5};
		if(this.lastMove === undefined) this.lastMove = N;
		var start = this.start;

		var next;
		switch(moveRule(start, cfg)) {
			case N:
				next = start.north();
				break;
			case S:
				next = start.south();
				break;
			case E:
				next = start.east();
				break;
			case W:
				next = start.west();
				break;
			case NO_MOVE:
				next = start;
				console.log("no move");
				return;
			default:
				throw Error("volation in auto.rule.dot(). No move rule determined.");
		}
		placeDot(next);
		// if(!colorLeaveRule(start, cfg)) {
		// 	removeDot(start);
		// }
		leavingInfluence(start, cfg);
		//moveDot(start, next);

		// set start for next iteration
		this.start = next;
		//console.log(this.start);			

		// end of (main)

		

		function leavingInfluence(start, cfg) {
			var mask = cfg.disableMask;
			if(mask & 1) flipColor(start.north());
			if(mask & 2) flipColor(start.north().east());
			if(mask & 4) flipColor(start.east());
			if(mask & 8) flipColor(start.south().east());
			if(mask & 16) flipColor(start.south());
			if(mask & 32) flipColor(start.south().west());
			if(mask & 64) flipColor(start.west());
			if(mask & 128) flipColor(start.north().west());
		}

		//Rules: 1 - 6
		function moveRule(from, cfg) {
			var mask = cfg.disableMask;
			var d = NO_MOVE;
			if(mask & 1) d = directionRule(color(from.east()), color(from.west()));
			if(mask & 2) {
				d = d == NO_MOVE ? directionRule(color(from.east()), color(from.north())) : rotate(d);
			}
			if(mask & 4) {
				d = d == NO_MOVE ? directionRule(color(from.east()), color(from.south())) : rotate(d);
			}
			if(mask & 8) {
				d = d == NO_MOVE ? directionRule(color(from.west()), color(from.north())) : rotate(d);
			}
			if(mask & 16) {
				d = d == NO_MOVE ? directionRule(color(from.west()), color(from.south())) : rotate(d);
			}
			if(mask & 32) {
				d = d == NO_MOVE ? directionRule(color(from.north()), color(from.south())) : rotate(d);
			}
			return d;
		}

		function colorLeaveRule(dot, cfg) {
			var mask = cfg.disableMask;
			if( mask & 64 && dot.east() ) return true;
			if( mask & 128 && dot.west() ) return true;
			if( mask & 256 && dot.north() ) return true;
			if( mask & 512 && dot.south() ) return true;
			return false;
		}
		function flipColor(dot) {
			if(G[dot.x][dot.y] == WHITE) G[dot.x][dot.y] = BLACK;
			if(G[dot.x][dot.y] == BLACK) G[dot.x][dot.y] = WHITE;
		}	
		function color(dot) {
			//console.log("coloring ("+ dot.x +","+dot.y + ")" );
			return G[dot.x][dot.y];
		}
		function moveDot(from, to) {
			removeDot(from);
			placeDot(to);			
		}
		function placeDot(dot) {
			G[dot.x][dot.y] = BLACK;
		}
		function removeDot(dot) {
			G[dot.x][dot.y] = WHITE;
		}
		//for troubleshooting
		function logDot(dot, msg) {
			if(msg === undefined ) msg = "dot"
			console.log(msg + " ("+ dot.x +","+dot.y + ")" + " color = " + color(dot));
		}
	} // eof dot    

	var Dot = function(WIDTH, x, y) {
		this.x = x;
		this.y = y;
		this.WIDTH = WIDTH;
		//return coordinate of item right of dot; wrap-around
		this.east = function() {
			if(this.x ==  WIDTH - 1) 
				return new Dot(WIDTH, 0,this.y);				
				return new Dot(WIDTH, this.x + 1, this.y);
		}
		//return coordinate of item left of dot; wrap-around
		this.west = function () {
			if(this.x > 0) 
				return new Dot(WIDTH, this.x - 1, this.y);
				return new Dot(WIDTH, WIDTH - 1, this.y);
		}
		//return coordinate of item above dot; wrap-around
		this.north = function () {
			if(this.y > 0)
				return new Dot(WIDTH, this.x,this.y - 1);
				return new Dot(WIDTH, this.x, WIDTH - 1);
		}
		//return coordinate of item below dot; wrap-around
		this.south = function () {
			if(this.y == WIDTH - 1)
				return new Dot(WIDTH, this.x, 0);
				return new Dot(WIDTH, this.x, this.y + 1);
		}
	};

	//assumes wrap-around
	function directionRule(left, right) {
		if(left == WHITE && right == WHITE) {
			return N;
		}
		if(left == BLACK && right == WHITE) {
			return S;
		}
		if(left == WHITE && right == BLACK) {
			return E;
		}
		if(left == BLACK && right == BLACK) {
			return W;
		}
		throw Error("violation in dot.js/directionRule(). colors expected to be passed in");
	}

	//right-hand rotation
	function rotate(direction) {
		switch(direction) {
			case N:
				return E;
			case S:
				return W;
			case E:
				return S;
			case W:
				return N;
			case NO_MOVE:				
			default:
				throw Error("volation in dot.js/rotate(). direction parameter expected");
		}
	}


});