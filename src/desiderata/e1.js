/* ecosystem1

	depends on util.js loading first

	depends on a Player (implemented in a1.js) that has a handleEvent(evt)
*/
var eco={};

eco.Evt = function(type, msg) {
	this.type = type;
	this.msg = msg;	
};

var timer;

(function(eco) {
	var players = []; //maps objects to positions
	var time = 0;
	var tickRate = 100;
	
	
	//where move request are posted
	eco.whiteboard = {		
		tryDraw : function(p) {
			if(!players.contains(p)) {
				players.push(p);
			}
			return p;
		},
		removePlayer : function(p) {
			if(players.contains(p)) {
				var idx = players.indexOf(p);
				players.splice(idx, 1);
			}
		},
		whereAmI : function(p) {
			return p;
		}
	};

	//system makes time pass
	//checks whiteboards for draw attempts
	//and optionally affects the draw event
	eco.system = {
		go: function() {
			stop();
			timer=setInterval(systemTick, tickRate);			
		},
		stop: function() {
			clearInterval(timer);	
		}
	};

	// check for requested actions
	// & either take action or apply limiting rules of system
	function systemTick() {
		time++; 
		
		//console.log("tick"); 
		for(var i = 0; i < players.length; i++) {
			//message players
			p = players[i];
			p.handleEvent(new eco.Evt("tick", "do not ask for whom the bell tolls"));

			//adjust players, if necessary

			//render players
			eco.render.drawSystem(players);
		}
	}

	
})(eco);
