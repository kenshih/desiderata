//rule to determine what to turn on and off
//rule to determine what is the next seed
//rule to determine how to move


// a particle is a unit that has behavior in an x-by-y set of coordinates,
// even if those coordinates can not be displayed (off the edge of the ecology)
$(function(){
	var gCachedP;
	var gTopCorner = {i:0, j:0}; 
	var gSeed;
	var flip = false;
	var ewflip = false;
	var nsflip = false;
	var c=0;
	auto.rule.particle = function(cfg) {
		//console.log(cfg);
		var G = this.g; //grid
		var W = this.W; //width of grid
		var RADIUS = 3; //width of particle

		if(!gSeed) { gSeed = {i:2, j:1}; }
		
		var P = getCachedParticle(RADIUS);
		P = 	applyParticleSpaceRule(RADIUS, P, cfg);
		P =		applyBackgroundSpaceRule(RADIUS, P, G, W);
		var direction = moveSeed(RADIUS, P, cfg);
		direction	  =	applyNearbySpaceRule(direction, P, RADIUS, G, W);

//console.log(flip);
		if (ewflip) {
			switch(direction) {
		 	case 'N':
		 	case 'S':
		 		break;
		 	case 'E':
		 		direction = 'W';
		 		break;
			case 'W':
				direction = 'E'
				break;
			default:
				console.log('unexpected state in particle.js/moveSeed()/flip');	
			}
		}
		if (nsflip) {
			switch(direction) {
		 	case 'N':
		 		direction = 'S';
		 		break;
		 	case 'S':
		 		direction = 'N';
		 		break;
		 	case 'E':
		 	case 'W':
				break;
			default:
				console.log('unexpected state in particle.js/moveSeed()/flip');	
			}
		}
//console.log('post d: ' + direction);		
		
		//move cell
		 switch(direction) {
		 	case 'N':
		 		if(gTopCorner.j > 0) gTopCorner.j--;
		 		else nsflip = !nsflip; //gTopCorner.j+=1;
		 		break;
		 	case 'S':
		 		if(gTopCorner.j < RADIUS-1) gTopCorner.j++;
		 		else nsflip = !nsflip; //gTopCorner.j-=1;
		 		break;
		 	case 'E':
		 		if(gTopCorner.i > 0) gTopCorner.i--;
		 		else ewflip = !ewflip; //gTopCorner.i+=1;
				break;
			case 'W':
				if(gTopCorner.i < RADIUS-1) gTopCorner.i++;
				else ewflip = !ewflip; //gTopCorner.i-=1;
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

	function applyNearbySpaceRule(direction, P, RADIUS, G, W) {
		//get avg color of S, if same, rotate direction
		var newDirection = direction;
		var pColorCount={};
		for(var i = 0; i < RADIUS; i++) {
			for(var j = 0; j < RADIUS; j++) {
				pColorCount[P[i][j]]++;
			}				
		}
		var pWinningColor = pColorCount[auto.A1.COLOR1] > pColorCount[auto.A1.COLOR2] ?
			auto.A1.COLOR1 : auto.A1.COLOR2;
		var gColorCount={};
		var wColorCount={};
		var eColorCount={};
		var nColorCount={};
		var sColorCount={};
		for(var i = 0; i < W; i++) {
			for(var j = 0; j < W; j++) {
				gColorCount[G[i][j]]++;
				if(i < gTopCorner.i) wColorCount[G[i][j]]++;
				if(i > gTopCorner.i + RADIUS) eColorCount[G[i][j]]++;
				if(j < gTopCorner.j) nColorCount[G[i][j]]++;
				if(j > gTopCorner.j + RADIUS) sColorCount[G[i][j]]++;
			}				
		}
		var gWinningColor = gColorCount[auto.A1.COLOR1] > gColorCount[auto.A1.COLOR2] ?
			auto.A1.COLOR1 : auto.A1.COLOR2;
		if(gWinningColor != pWinningColor) { //rotate
			//move in direction of most influence
			var winCount = 0;
			if(wColorCount[gWinningColor] && wColorCount[gWinningColor] > winCount) {
				winCount = wColorCount[gWinningColor];
				newDirection = 'W';
			}
			if(eColorCount[gWinningColor] && eColorCount[gWinningColor] > winCount) {
				winCount = eColorCount[gWinningColor];
				newDirection = 'E';
			}
			if(nColorCount[gWinningColor] && nColorCount[gWinningColor] > winCount) {
				winCount = nColorCount[gWinningColor];
				newDirection = 'N';
			}
			if(sColorCount[gWinningColor] && sColorCount[gWinningColor] > winCount) {
				winCount = sColorCount[gWinningColor];
				newDirection = 'S';
			}

			//  switch(direction) {
			//  	case 'N':
			//  		newDirection = 'E';
			//  		break;
			//  	case 'S':
			//  		newDirection = 'W';
			//  		break;
			//  	case 'E':
			//  		newDirection = 'S';
			//  		break;
			// 	case 'W':
			// 		newDirection = 'N';
			// 		break;
			// 	default:
			// 	console.log('unexpected state in particle.js/applyNearbySpaceRule()');			
			// }
		}
		//console.log(newDirection);
		return newDirection;
	}

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
			if(isWinnerSeed  && c%5==0) {
				direction = 'E';
			} else {
				direction = 'W';
			}
		}


		//console.log(direction);
//return direction;

		switch(direction) {
			case 'N':
				if(gSeed.j > 0) gSeed.j--;
				//else gSeed.j+=1;
				break;
			case 'S':
				if(gSeed.j < RADIUS-1) gSeed.j++;
				//else gSeed.j-=1;
				break;
			case 'E':
				if(gSeed.i > 0) gSeed.i--;
				//else gSeed.i+=1;
				break;
			case 'W':
				if(gSeed.i < RADIUS-1) gSeed.i++;
				//else gSeed.i-=1;
				break;
			default:
				console.log('unexpected state in particle.js/moveSeed()');			
		}
		//P[gSeed.i][gSeed.j] = winningColor==auto.A1.COLOR1 ? auto.A1.COLOR2 : auto.A1.COLOR1;
		return direction;
	};

	function applyBackgroundSpaceRule(RADIUS, P, G, W) {
		var newP = [];
		for(var i = 0; i < RADIUS; i++) {
			newP[i] = [];
			for(var j = 0; j < RADIUS; j++) {
				newP[i][j] = P[i][j];
				//unless
				if(G[i + gTopCorner.i][j + gTopCorner.j] != P[i][j]) {
					newP[i][j] = (i*j + j)% 3 == 1 ? auto.A1.COLOR1 : auto.A1.COLOR2;
				}
			}
		}
		gCachedP = newP;
		return newP;
	}

	function applyParticleSpaceRule(RADIUS, P, cfg) {
		//determine what to turn on and off
	 	var newP = [];
		for(var i = 0; i < RADIUS; i++) {
			newP[i] = [];
			for(var j = 0; j < RADIUS; j++) {
				if( !(i == gSeed.i && j == gSeed.j) ) {
					//try this by unioning the space
					var avg = determineNeighborAvg(RADIUS, P, i, j, cfg);
					//newP[i][j] = (avg == auto.A1.COLOR2) ? auto.A1.COLOR2 : auto.A1.COLOR1;
					 newP[i][j] = (avg == P[i][j]) ? 
					 			(P[i][j] == auto.A1.COLOR1) ? auto.A1.COLOR1 : auto.A1.COLOR2
					 			: P[i][j];
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