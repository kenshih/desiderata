/* neighbor algorithm */

//considers avg of neighbors
//disableMask allows you to disable consideration of any combination of neighbors
function determineNeighborAvg(W, G, i, j, disableMask) {
	var mask = disableMask;
	if(!disableMask) mask = 511;
	var colCount = [];
	if(i>0 && j>0) { //upper left
		color = G[i-1][j-1];
		if (mask & 1) colCount[color] ? colCount[color]++ : colCount[color]=1; 
	}
	if(j>0) { //upper
		color = G[i][j-1];
		if (mask & 2) colCount[color] ? colCount[color]++ : colCount[color]=1; 
	}
	if(i<W-1 && j>0) { //upper right
		color = G[i+1][j-1];
		if (mask & 4) colCount[color] ? colCount[color]++ : colCount[color]=1; 
	}
	if(i>0) { //mid left
		color = G[i-1][j];
		if (mask & 8) colCount[color] ? colCount[color]++ : colCount[color]=1; 
	}
	//self
	color = G[i][j];
	if (mask & 16) colCount[color] ? colCount[color]++ : colCount[color]=1; 
	
	if(i<W-1) { //right
		color = G[i+1][j];
		if (mask & 32) colCount[color] ? colCount[color]++ : colCount[color]=1; 
	}
	if(i>0 && j<W-1) { //lower left
		color = G[i-1][j+1];
		if (mask & 64) colCount[color] ? colCount[color]++ : colCount[color]=1; 
	}
	if(j<W-1) { //lower
		color = G[i][j+1];
		if (mask & 128) colCount[color] ? colCount[color]++ : colCount[color]=1; 
	}
	if(i<W-1 && j<W-1) { //lower right
		color = G[i+1][j+1];
		if (mask & 256) colCount[color] ? colCount[color]++ : colCount[color]=1; 
	}
	var c = auto.A1.COLOR2;
	if(!colCount[auto.A1.COLOR2] && !colCount[auto.A1.COLOR1]) c = auto.A1.COLOR2; //arbitrary
	if(colCount[auto.A1.COLOR2] && !colCount[auto.A1.COLOR1]) c = auto.A1.COLOR2;
	if(colCount[auto.A1.COLOR1] && !colCount[auto.A1.COLOR2]) c = auto.A1.COLOR1;
	if(colCount[auto.A1.COLOR1] > colCount[auto.A1.COLOR2]) c = auto.A1.COLOR1;
	return c;
}

var ccCount=0;
$(function(){
	auto.rule.neighbor1 = function(cfg) {
		var G = this.g;
		var W = this.W;
		for(var i = 0; i < W; i++) {
			for(var j = 0; j < W; j++) {
				var condition =determineNeighborAvg(W, G, i, j, cfg);
				if(condition == auto.A1.COLOR2) G[i][j] = auto.A1.COLOR1;
				else G[i][j] = auto.A1.COLOR2;
			}
		}	
		//console.log("cfg: " + cfg+  " ccCount: " + ccCount++);
	};
});