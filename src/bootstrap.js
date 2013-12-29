/* bootstrap.js 
	not the framework, the action
*/
var boot = {};

//setup ui elements
$(function(){
	var player ;

	boot.initializePlayers = function() {
		player = auto.instance(100, auto.rule.neighbor1 , 1, 1, 511) 
		eco.whiteboard.tryDraw(player);
	}

	boot.changePattern = function() {
		eco.system.stop();

		var pattern = $(".select").val();
		console.log(pattern);
		eco.whiteboard.removePlayer(player);
		player = auto.instance(100, auto.rule.neighbor1 , 1, 1, pattern);
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
	boot.initializeSelect();
	eco.system.go();
	$(".btn-stop").click(eco.system.stop);
	$(".btn-go").click(eco.system.go);
	$(".select").change(boot.changePattern);
});

boot.initializeSelect = function() {
	var html = "";
	for(var i=511; i >= 0; --i) {
		html += "<option value='" + i + "'>" + i + "</option>";
	}
	$(".select").html(html);
};


// aesthetic variables : speed, color
// affecting variables: (neighbor model)
//	 size of image (odd/even)
//	 seed placement(s)
//	 neighor mask
//challange, make it smoother

//neighbor categories: cool (254, 511), short-lived cool (33, 253, 510), stable (65,512)