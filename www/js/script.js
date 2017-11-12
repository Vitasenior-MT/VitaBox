
var socket = io();

$(document).ready(function(){

	$(".btn-menu").click(function(){
		$(".btn-menu").removeClass("btn-info").addClass("btn-success");
		$(this).removeClass("btn-success").addClass("btn-info");		
	});
		
	// $("body").keypress(function(e){			
	// 	socket.emit('keypress', e.which);		
	// });
	
	// socket.on('keypress', function(key){
	// 	console.log("received: ", key);
		
		// if(key === 97) {
		// 	var SelElent = checkIndexSelk();			
		// 	if(SelElent.index === 0){
		// 		$(SelElent.elements[SelElent.size]).click();
		// 	} else {
		// 		$(SelElent.elements[SelElent.index - 1]).click();			
		// 	}			
		// }		
		// if(key === 115) {
		// 	var SelElent = checkIndexSelk();			
		// 	if(SelElent.index === SelElent.size){
		// 		$(SelElent.elements[0]).click();
		// 	} else {
		// 		$(SelElent.elements[SelElent.index + 1]).click();			
		// 	}						
		// }
		
		// if(key >= 49 && key <= 53){
		// 	 $("#btn-menu-" + (key - 48)).click();
		// }
	// });

	socket.on("ready", function(data){
		console.log("ready", data);
	});

	socket.on("status", function(data){
		console.log("status", data);
	});

	socket.on("datakey", function(data){
		console.log("datakey", data)

		var key = data.code;

		if(key === 3) {
			var SelElent = checkIndexSelk();			
			if(SelElent.index === 0){
				$(SelElent.elements[SelElent.size]).click();
			} else {
				$(SelElent.elements[SelElent.index - 1]).click();			
			}			
		}		
		if(key === 4) {
			var SelElent = checkIndexSelk();			
			if(SelElent.index === SelElent.size){
				$(SelElent.elements[0]).click();
			} else {
				$(SelElent.elements[SelElent.index + 1]).click();			
			}						
		}
		
		if(key >= 1 && key <= 5){
			 $("#btn-menu-" + (key)).click();
		}

	});

	socket.on("error", function(data){
		console.log("error", data);
	});
});

var checkIndexSelk = function(){
	var allbtn = $(".btn-menu");
	var indexSel = {
		elements: allbtn,
		size: allbtn.length - 1,
		index: 0
	};		
	for(var i = 0; i <= indexSel.size; i++){
		if($(allbtn[i]).hasClass("btn-info")){
			indexSel.index = i;
			break;
		}
	}
	return indexSel;
}