/* bootstrap.js 
	not the framework, the action
*/
var boot = {};

//setup ui elements
$(function(){
	var GRAPH_SIZE=30;
	var player ;

	boot.initializePlayers = function() {
		var cfg = {};
		cfg.disableMask = 511; 
		cfg.algo = auto.rule.neighbor1;

		player = auto.instance(GRAPH_SIZE, 0, 0, cfg) 

		eco.whiteboard.tryDraw(player);
	}

	boot.changePattern = function() {
		eco.system.stop();

		var cfg = {};
		cfg.disableMask = $(".seed").val(); 
		
		//strategy 1
		switch ($(".strategy").val()) {
			case 'particle':
				cfg.algo = auto.rule.particle;
				var seedArr = [];
				//initialize env
				for(var i=0; i < GRAPH_SIZE; i++) 
					for(var j=0; j < GRAPH_SIZE; j++)
						if ((i*j + j) % 2 == 1) seedArr.push([i,j]);
				cfg.seed = seedArr;
				break;
			case 'dot':			
				cfg.algo = auto.rule.dot;	
				break;
			case 'neighbor':
			default:
				cfg.algo = auto.rule.neighbor1;	//defined in e1
		}
		
		eco.whiteboard.removePlayer(player);
		player = auto.instance(GRAPH_SIZE, 0, 0, cfg);
		eco.whiteboard.tryDraw(player);

		eco.system.go();
	};

	boot.initializeRender = function() {
		var c  = document.getElementById("eco-canvas");
		var ctx= c.getContext("2d");
		eco.render.ctx = ctx;
	}

	//main
	boot.initializePlayers(); //may move this out
	boot.initializeRender();
	//boot.initializeSelect();
	eco.system.go();
	$(".btn-stop").click(eco.system.stop);
	$(".btn-go").click(eco.system.go);
	$(".seed").change(boot.changePattern);
	$(".strategy").change(boot.changePattern);
});

boot.initializeSelect = function() {
	var html = "";
	for(var i=511; i >= 0; --i) {
		html += "<option value='" + i + "'>" + i + "</option>";
	}
	$(".seed").html(html);	
};


// aesthetic variables : speed, color
// affecting variables: (neighbor model)
//	 size of image (odd/even)
//	 seed placement(s)
//	 neighor mask
//challange, make it smoother

//neighbor categories:
// cool (251, 254, 510, 511)
// short-lived cool (33, 253, 510)
// stable (65,512)