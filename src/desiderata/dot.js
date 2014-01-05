

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
		if(this.start === undefined) this.start = {x: 5, y: 5};
		if(this.lastMove === undefined) this.lastMove = N;
		var start = this.start;

		var next;
		switch(moveRule(start, cfg)) {
			case N:
				next = north(start);
				break;
			case S:
				next = south(start);
				break;
			case E:
				next = east(start);
				break;
			case W:
				next = west(start);
				break;
			case NO_MOVE:
				next = start;
				console.log("no move");
				return;
			default:
				throw Error("volation in auto.rule.dot(). No move rule determined.");
		}
		placeDot(next);
		if(!colorLeaveRule(start, cfg)) {
			removeDot(start);
		}
		//moveDot(start, next);

		// set start for next iteration
		this.start = next;
		//console.log(this.start);			

		// end of (main)

		//Rules: 1 - 6
		function moveRule(from, cfg) {
			var mask = cfg.disableMask;
			var d = NO_MOVE;
			if(mask & 1) d = directionRule(color(east(from)), color(west(from)));
			if(mask & 2) {
				d = d == NO_MOVE ? directionRule(color(east(from)), color(north(from))) : rotate(d);
			}
			if(mask & 4) {
				d = d == NO_MOVE ? directionRule(color(east(from)), color(south(from))) : rotate(d);
			}
			if(mask & 8) {
				d = d == NO_MOVE ? directionRule(color(west(from)), color(north(from))) : rotate(d);
			}
			if(mask & 16) {
				d = d == NO_MOVE ? directionRule(color(west(from)), color(south(from))) : rotate(d);
			}
			if(mask & 32) {
				d = d == NO_MOVE ? directionRule(color(north(from)), color(south(from))) : rotate(d);
			}
			return d;
		}

		function colorLeaveRule(dot, cfg) {
			var mask = cfg.disableMask;
			if( mask & 64 && east(dot) ) return true;
			if( mask & 128 && west(dot) ) return true;
			if( mask & 256 && north(dot) ) return true;
			if( mask & 512 && south(dot) ) return true;
			return false;
		}
	
		function color(dot) {
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
		//return coordinate of item right of dot; wrap-around
		function east(dot) {
			if(dot.x ==  WIDTH - 1) return {x: 0, y: dot.y}				
			return {x: dot.x + 1, y: dot.y};
		}
		//return coordinate of item left of dot; wrap-around
		function west(dot) {
			if(dot.x > 0) return {x: dot.x - 1, y: dot.y};
			return {x: WIDTH - 1, y: dot.y};
		}
		//return coordinate of item above dot; wrap-around
		function north(dot) {
			if(dot.y > 0) return {x: dot.x, y: dot.y - 1};
			return {x: dot.x, y: WIDTH - 1};
		}
		//return coordinate of item below dot; wrap-around
		function south(dot) {
			if(dot.y == WIDTH - 1) return {x: dot.x, y: 0};
			return {x: dot.x, y: dot.y + 1};
		}
		//for troubleshooting
		function logDot(dot, msg) {
			if(msg === undefined ) msg = "dot"
			console.log(msg + " ("+ dot.x +","+dot.y + ")" + " color = " + color(dot));
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