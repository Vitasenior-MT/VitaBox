'use strict';
// Testing for browser support
var speechSynthesisSupported = 'speechSynthesis' in window;
var voicelist = responsiveVoice.getVoices();
// console.log(voicelist);
responsiveVoice.setDefaultVoice("Brazilian Portuguese Female");

var socket = io();
var sound = true;

$(document).ready(function(){

	$(".btn-menu").click(function(){
		$(".btn-menu").removeClass("btn-info").addClass("btn-success");
		$(this).removeClass("btn-success").addClass("btn-info");	
		$(".container-tab").removeClass("show").removeClass(" active").addClass("fade");
		var idComtainer = "#" + $(this).attr("id").replace("btn-menu", "container");
		$(idComtainer).addClass("show").addClass(" active");
		
		readText($(idComtainer).find(".text-read").text());
	});


	$('#swapArchived').on('click', function () {
		var $el = $(this);
		var urlimg = $el.find('img').attr("src"); 		
		$el.find('img').attr("src", urlimg.indexOf("off") >= 0 ? urlimg.replace("off", "on") : urlimg.replace("on", "off"));
		$el.find('img').attr("src").indexOf("on") >= 0 ? sound = true : sound = false;
	});

	$('#selectOpt').change(function(e){
		var optionSelected = $("option:selected", this);
    	var valueSelected = this.value;
    	console.log(optionSelected, valueSelected);
    	$("#selected-text-input").val(this.value);
	});

	$("#rumCommandCec").click(function(){
		if ($("#selected-text-input").val().trim() !== "") {
			var command = $("#selected-text-input").val().trim():
			console.log(command);
			socket.emit('execCommandCEC', command);			
		}
	});

		
	$("body").keypress(function(e){			
		socket.emit('keypress', e.which);		
	});
	
	socket.on('keypress', function(key){
		console.log("received: ", key);
		
		if(key === 97) {
			var SelElent = checkIndexSelk();			
			if(SelElent.index === 0){
				$(SelElent.elements[SelElent.size]).click();
			} else {
				$(SelElent.elements[SelElent.index - 1]).click();			
			}			
		}		
		if(key === 115) {
			var SelElent = checkIndexSelk();			
			if(SelElent.index === SelElent.size){
				$(SelElent.elements[0]).click();
			} else {
				$(SelElent.elements[SelElent.index + 1]).click();			
			}						
		}
		
		if(key >= 49 && key <= 53){
			 $("#btn-menu-" + (key - 48)).click();
		}
	});

	socket.on("ready", function(data){
		console.log("ready", data);
	});

	socket.on("status", function(data){
		console.log("status", data);
	});

	socket.on("datakey", function(data){
		console.log("datakey", data)

		var key = data.code;

		if(key === '3') {
			var SelElent = checkIndexSelk();			
			if(SelElent.index === 0){
				$(SelElent.elements[SelElent.size]).click();
			} else {
				$(SelElent.elements[SelElent.index - 1]).click();			
			}			
		}		
		if(key === '4') {
			var SelElent = checkIndexSelk();			
			if(SelElent.index === SelElent.size){
				$(SelElent.elements[0]).click();
			} else {
				$(SelElent.elements[SelElent.index + 1]).click();			
			}						
		}
		
		if((key * 1) >= 21 && (key * 1) <= 25){
			 $("#btn-menu-" + (key - 20)).click();
		}

	});

	socket.on("error", function(data){
		console.log("error", data);
	});

	if (speechSynthesisSupported) {
		loadVoices();

		// Chrome loads voices asynchronously.
		window.speechSynthesis.onvoiceschanged = () => {
			loadVoices();
		};
	}
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
};

var readText = function(text){
	responsiveVoice.cancel();
	speechSynthesis.cancel();

	if (sound === true) {
		switch(checkIndexSelk().index + 1){
			case 1:
			break;
			case 2:
				responsiveVoice.speak(text);;
			break;
			case 3:
				var msg = new SpeechSynthesisUtterance();
				var voices = speechSynthesis.getVoices();
				// console.log(voices);
				if (window.navigator.userAgent.indexOf("Edge") > -1) {
					msg.voice = voices[0];
				} else {
					msg.voice = speechSynthesis.getVoices().filter(function (voice) {
							return voice.name === "Google português do Brasil";
						})[0];
				}

				// msg.voiceURI = 'native';
				msg.volume = 1;
				msg.rate = 1;
				msg.pitch = 1;
				msg.text = text;
				msg.lang = 'en-US';

				msg.onstart = function(e) {
					console.log('Started speaking');
				};

				msg.onend = function(e) {
					console.log('Finished speaking');
				};

				window.speechSynthesis.speak(msg);

				// setTimeout(function() {
				// 	console.log("Time out", speechSynthesis);
				// 	speechSynthesis.pause();
				// 	speechSynthesis.resume();
				// 	speechSynthesis.cancel();
				// }, 5000);

			break;
			case 4:
				console.log("Teste 4")
				var Jarvis = new Artyom();
				Jarvis.say(text, {
	            lang:"pt-PT"
	        });
			break;
			case 5:
				VoiceRSS.speech({
		            key: 'ea77a80f6d854d97aa31a442760246fa',
		            src: text,
		            hl: 'pt-pt',
		            r: 0, 
		            c: 'mp3',
		            // f: '44khz_16bit_stereo',
		            f: 'ulaw_44khz_stereo',
		            ssml: false
		        });
			break;
		}
	}
};

var loadVoices = function () {
	var voices = speechSynthesis.getVoices();

	// voices.forEach((voice) => {
		// console.log(voice);
		// var option = document.createElement('option');
		// option.value = voice.name;
		// option.innerHTML = voice.name;
		// voiceSelect.appendChild(option);
	// });
};
