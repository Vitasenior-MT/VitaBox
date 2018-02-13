var intrbalSensor = null,
	sensorlocal = ['Quarto01', 'Quarto02', 'Cozinha', 'Casa De Banho01', 'Casa De Banho02', 'Sala', 'WC'];

$(document).ready(function () {
	$("#btn-menu-1").click(function () {
		var data = function () {
			var allrows = $("#sensores-val .row");
			var datasensor = [];
			for (var i = 0; i < allrows.length; i++) {
				//console.log(i, $("#sensor-type-" + (i + 1)).val().trim(), $("#sensor-val-" + (i + 1)).val().trim());
				if ($("#sensor-type-" + (i + 1)).val().trim() !== "" && $("#sensor-val-" + (i + 1)).val().trim() !== "") {
					datasensor.push({
						sensortype: $("#sensor-type-" + (i + 1)).val().trim(),
						sensorvalue: $("#sensor-val-" + (i + 1)).val().trim()
					});
				}
			}
			return datasensor;
		}();
		postValuesSensor($("#example-text-input-1").val().trim(), $("#example-text-input-2").val().trim(), data);
	});

	$("#btn-menu-2").click(function () {
		console.log("Start Interval");
		startInterval();
	});

	$("#btn-menu-3").click(function () {
		console.log("Stop Interval");
		stopInterval();
	});

	$("#btn-new-row").click(function () {
		var allrows = $("#sensores-val .row");
		$("#sensores-val").append('<div id="row-' + (allrows.length + 1) + '" class="form-group row">' +
			'<label for="sensor-val-' + (allrows + 1) + '" class="col-1 col-form-label">Item</label>' +
			'<div class="col-1">' +
			'<input class="form-control" type="text" value="" id="sensor-type-' + (allrows.length + 1) + '">' +
			'</div>' +
			':<div class="col-1">' +
			'<input class="form-control" type="text" value="" id="sensor-val-' + (allrows.length + 1) + '">' +
			'</div>,' +
			'</div>');
	});

	$("#btn-rem-row").click(function () {
		var allrows = $("#sensores-val .row");
		if (allrows.length > 1) {
			$("#row-" + allrows.length).remove();
		}
	});

});

var startInterval = function () {
	intrbalSensor = setInterval(function () {
		var data;
		switch (randomIntFromInterval(1, 9)) {
			case 1:
				data = [
					{sensortype:"temp", sensorvalue: randomIntFromInterval(10, 30)},
					{sensortype:"humi", sensorvalue: randomIntFromInterval(50, 90)},
					{sensortype:"co2", sensorvalue: randomIntFromInterval(20, 50)},
					{sensortype:"monoxido", sensorvalue: randomIntFromInterval(50, 60)}
				];
				break;
			case 2:
				data = [
					{sensortype:"temp", sensorvalue: randomIntFromInterval(10, 30)},
					{sensortype:"co2", sensorvalue: randomIntFromInterval(20, 50)},
					{sensortype:"monoxido", sensorvalue: randomIntFromInterval(50, 60)}
				];
				break;
			case 3:
				data = [
					{sensortype:"co2", sensorvalue: randomIntFromInterval(20, 50)},
					{sensortype:"monoxido", sensorvalue: randomIntFromInterval(50, 60)}
				];
				break;
			case 4:
				data = [
					{sensortype:"temp", sensorvalue: randomIntFromInterval(10, 30)},
					{sensortype:"monoxido", sensorvalue: randomIntFromInterval(50, 60)}
				];
				break;
			case 5:
				data = [
					{sensortype:"humi", sensorvalue: randomIntFromInterval(50, 90)},
					{sensortype:"co2", sensorvalue: randomIntFromInterval(20, 50)}
				];
				break;
			case 6:
				data = [
					{sensortype:"temp", sensorvalue: randomIntFromInterval(10, 30)}
				];
				break;
			case 7:
				data = [
					{sensortype:"humi", sensorvalue: randomIntFromInterval(50, 90)}
				];
				break;
			case 8:
				data = [
					{sensortype:"co2", sensorvalue: randomIntFromInterval(20, 50)}
				];
				break;
			default:
				data = [
					{sensortype:"temp", sensorvalue: randomIntFromInterval(10, 30)},
					{sensortype:"humi", sensorvalue: randomIntFromInterval(50, 90)},
					{sensortype:"co2", sensorvalue: randomIntFromInterval(520, 50)},
					{sensortype:"monoxido", sensorvalue: randomIntFromInterval(50, 60)}
				];

		}

		var rand = randomIntFromInterval(0, sensorlocal.length - 1);
		postValuesSensor(rand, sensorlocal[rand], data);
	}, 3000);
};

var stopInterval = function () {
	clearInterval(intrbalSensor);
};

var randomIntFromInterval = function (min, max) {
	return Math.floor(Math.random() * (max - min + 1) + min);
}

var postValuesSensor = (id, local, sensores) => {
	modem('POST', "/app/sensor",
					function (data) {
						console.log(data);
					},
					function (xhr, ajaxOptions, thrownError) {
						var json = JSON.parse(xhr.responseText);
						console.log(json.message);
					}, {
					id : id,
					local: local,
					"sensores" : sensores
	});
};

window.modem = function (type, url, sucess, error, data) {
  $.ajax({
    async: true,
    cache: false,
    type: type || 'GET',
    url: url,
    dataType: 'json',
    data: data,
    success: sucess,
    error: error
  });
};
