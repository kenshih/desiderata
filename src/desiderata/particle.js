//rule to determine what to turn on and off
//rule to determine what is the next seed
//rule to determine how to move


// a particle is a unit that has behavior in an x-by-y set of coordinates,
// even if those coordinates can not be displayed (off the edge of the ecology)
$(function(){
	var gCachedP;
	var gTopCorner = {i:0, j:0}; 
	var gSeed;
	var flip = true;
	var c=0;
	auto.rule.particle = function(cfg) {
		//console.log(cfg);
		var G = this.g; //grid
		var W = this.W; //width of grid
		var RADIUS = 4; //width of particle

		if(!gSeed) { gSeed = {i:2, j:1}; }
		
		var P = getCachedParticle(RADIUS);
		P = 	applyParticleSpaceRule(RADIUS, P, cfg);
		
		var direction = moveSeed(RADIUS, P, cfg);
		
		 switch(direction) {
		 	case 'N':
		 		if(gTopCorner.j > 0) gTopCorner.j--;
		 		else gTopCorner.j+=1;
		 		break;
		 	case 'S':
		 		if(gTopCorner.j < RADIUS-1) gTopCorner.j++;
		 		else gTopCorner.j-=1;
		 		break;
		 	case 'E':
		 		if(gTopCorner.i > 0) gTopCorner.i--;
		 		else gTopCorner.i+=1;
				break;
			case 'W':
				if(gTopCorner.i < RADIUS-1) gTopCorner.i++;
				else gTopCorner.i-=1;
				break;
			default:
				console.log('unexpected state in particle.js/moveSeed()');			
		}
		//write particle (taking into account previous state, if moving)
		for(var i = 0; i < RADIUS; i++) {
			for(var j = 0; j < RADIUS; j++) {
				G[gTopCorner.i + i][gTopCorner.j + j] = P[i][j];
			}				
		}
	};

	function moveSeed(RADIUS, P, cfg) {
		var colorCount={};
		for(var i = 0; i < RADIUS; i++) {
			for(var j = 0; j < RADIUS; j++) {
				colorCount[P[i][j]]++;
			}				
		}
		var winningColor = colorCount[auto.A1.COLOR1] > colorCount[auto.A1.COLOR2] ?
			auto.A1.COLOR1 : auto.A1.COLOR2;
		if(flip && c%3==0) {
			winningColor = winningColor == auto.A1.COLOR1 ? auto.A1.COLOR2 : auto.A1.COLOR1;
			flip = false;			
		} else {
			flip = true;
		}
		c++;
		var isWinnerSeed = (P[gSeed.i][gSeed.j] == winningColor);

		var direction;
		if(winningColor==auto.A1.COLOR1) {
			if(isWinnerSeed && c%4==0 ) {
				direction = 'N';
			} else {
				direction = 'S';
			}
		} else {
			if(isWinnerSeed && c%5==0) {
				direction = 'E';
			} else {
				direction = 'W';
			}
		}

		//console.log(direction);


		switch(direction) {
			case 'N':
				if(gSeed.j > 0) gSeed.j--;
				else gSeed.j+=1;
				break;
			case 'S':
				if(gSeed.j < RADIUS-1) gSeed.j++;
				else gSeed.j-=1;
				break;
			case 'E':
				if(gSeed.i > 0) gSeed.i--;
				else gSeed.i+=1;
				break;
			case 'W':
				if(gSeed.i < RADIUS-1) gSeed.i++;
				else gSeed.i-=1;
				break;
			default:
				console.log('unexpected state in particle.js/moveSeed()');			
		}
		P[gSeed.i][gSeed.j] = winningColor==auto.A1.COLOR1 ? auto.A1.COLOR2 : auto.A1.COLOR1;
		return direction;
	};

	function applyParticleSpaceRule(RADIUS, P, cfg) {
		//determine what to turn on and off
	 	var newP = [];
		for(var i = 0; i < RADIUS; i++) {
			newP[i] = [];
			for(var j = 0; j < RADIUS; j++) {
				if( !(i == gSeed.i && j == gSeed.j) ) {
					//try this by unioning the space
					var avg = determineNeighborAvg(RADIUS, P, i, j, cfg);
					newP[i][j] = (avg == auto.A1.COLOR2) ? auto.A1.COLOR1 : auto.A1.COLOR2;
				} else {
					newP[i][j] = auto.A1.COLOR2;
				}
			}				
		} 
		gCachedP = newP;
		return gCachedP;
	}

	// get cached particle
	// if this is 1st time, initialize and cache
	// this implements initial seeding rule
	function getCachedParticle(RADIUS, cfg) {
		var P = [];
		if(!gCachedP) {
			console.log("caching particle");
			for(var i = 0; i < RADIUS; i++) {
				P[i] = [];
				for(var j = 0; j < RADIUS; j++) {
					P[i][j] = (i+j) % 3 == 0 ? auto.A1.COLOR1 : auto.A1.COLOR2;
				}				
			}	
			gCachedP = P;
		}
		return gCachedP;
	}
});