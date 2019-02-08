var popMapLegend2 = function(legendDelay=1000,delayReveal=1500,timeoutVars=5000,src='line') {

	console.log('popMapLegend2');

	var ambiarc = $("#ambiarcIframe")[0].contentWindow.Ambiarc;

	var pointLable	= ambiarc.pointLable;
	var legendType	= ambiarc.legendType;
	var ambiarcId	= ambiarc.ambiarcId;
	var buildingId	= ambiarc.buildingId;
	var floorId		= ambiarc.floorId;
	var roomName	= ambiarc.roomName;
	var hasImage	= ambiarc.hasImage;
	//var lat			= ambiarc.lat;
	//var lon			= ambiarc.lon;

	var person		= ambiarc.person;
	var building	= ambiarc.building;
	var dept		= ambiarc.dept;
	var title		= ambiarc.title;
	var phone		= ambiarc.phone;
	var office		= ambiarc.office;
	var email		= ambiarc.email;

	var recordId		= ambiarc.recordId;
	var sculptureName	= ambiarc.sculptureName;
	var sculptureArtist	= ambiarc.sculptureArtist;

	console.log(ambiarc);

	var hasFloor = false;

	if (floorId != '') {
		hasFloor = false;
	} else {
		hasFloor = true;
	}

	var now = Date.now();

	if (floorId != '') {
		hasFloor = false;
	} else {
		hasFloor = true;
		//ambiarc.buildingId = bldgMap[ambiarc.floorId].buildingId;
		//buildingId = bldgMap[ambiarc.floorId].buildingId;
		if (ambiarc.floorId.length > '1') {
			ambiarc.buildingId = bldgMap[floorId].buildingId;
		}
		//buildingId = '';
	}

	try {
		if (typeof ambiarc.floorId != 'undefined' && $.isNumeric(ambiarc.floorId)) {
			if (ambiarc.floorId.length > '1') {
				ambiarc.buildingId = bldgMap[floorId].buildingId;
				buildingId = bldgMap[floorId].buildingId;
			}
		}
	} catch(err) {
		console.log(err);
	}

	///console.log('popMapLegend buildingId: ' + buildingId);
	///console.log('popMapLegend floorid: ' + floorId);

	if (hasFloor && $.isNumeric(ambiarc.floorId)) {
		try {
			$('img.access').remove();
			var imgBldg = '<img class="floor-is-int" src="images/buildings/'+bldgMap[floorId].buildingId+'.jpg">'
			var imgAccs = '<img class="access" src="images/buildings/'+bldgMap[floorId].buildingId+'.png">'
			$('.legend-building').html(imgBldg);
			$('.legend-copy').prepend(imgAccs);
		} catch(err) {
			///console.log(err)
			$('div.legend-img-building').html('');
		}
	}

	try {
		if (recordId.length > '1' && hasImage == 'Y') {
			//var imgSclp = '<img src="images/pois/'+recordId+'.jpg?time='+now+'">'
			var imgSclp = '<img src="images/pois/'+recordId+'.jpg">'
			$('.legend-building').html(imgSclp);
			$('.legend-access').html('');
		}
	} catch(err) {
		///console.log(err)
	}

	try {
		var bldgName = bldgMap[floorId].bldg_name;

		if (bldgName == 'Information Science Center') {
			bldgName = 'ISC';
		}

		if (bldgName == 'Steuben Hall/Pratt Studios') {
			bldgName = 'Steuben Hall &<br>Pratt Studios';
		}

		if (bldgName.length > '1') {
			$('.bldgName').html(bldgName);
		}
	} catch(err) {
		//console.log(err)
	}

	try {
		var bldgName = ambiarc.poiStuff[ambiarcId].bldgName;

		if (bldgName == 'Information Science Center') {
			bldgName = 'ISC';
		}

		if (bldgName == 'Steuben Hall/Pratt Studios') {
			bldgName = 'Steuben Hall &<br>Pratt Studios';
		}

		if (bldgName.length > '1') {
			$('.bldgName').html(bldgName);
		}
	} catch(err) {
		//console.log(err)
	}

	try {
		if (legendType != 'menuBuilding') {
			$('.floorNo').html(bldgMap[floorId].floor + ' floor');
		} else {
			//alert(legendType);
		}
	} catch(err) {
		//console.log(err)
	}

	try {
		$('.floorNo').html(ambiarc.poiStuff[ambiarcId].floorNo + ' floor');
	} catch(err) {
		//console.log(err)
	}

	try {
		if (legendType != 'menuBuilding') {
			$('.floorNo').html(bldgMap[floorId].floor + ' floor');
		}
	} catch(err) {
		//console.log(err)
	}

	try {
		$('.roomName').html(ambiarc.poiStuff[ambiarcId].roomName);
	} catch(err) {
		//console.log(err)
	}

	try {
		if (roomName.length > '1') {
			$('.roomName').html(roomName);
		}
	} catch(err) {
		//console.log(err)
	}

	try {
		if (roomName.roomNo > '1') {
			$('.roomNo').html('Room '+ambiarc.poiStuff[ambiarcId].roomNo);
		}
	} catch(err) {
		//console.log(err)
	}

	try {

		if (floorId != '') {
			var bId = bldgMap[floorId].buildingId;
		} else {
			var bId = buildingId;
		}

		var copyArr = prattCopy[bId].split(' ');
		$.each(copyArr, function(k, v) {
			if (v.indexOf(':') != -1) {
				copyArr[k] = '<br><span class="copy-bold">'+v+'</span>';
			}
		});
		var newCopy = copyArr.join(' ');

		$('.history').html(newCopy);
	} catch(err) { $('.history').html(''); }

	try {
		if (sculptureName != '') {
			$('.bldgName').html(sculptureName);
			$('.floorNo').html(sculptureArtist);
			$('.history').html('');
		}
	} catch(err) {
		//console.log(err)
	}

	if (pointLable == 'PPS' || pointLable == 'GATE') {
		var imgBldg = '<img src="images/buildings/'+pointLable+'.png">'
		$('.legend-building').html(imgBldg);
		$('.bldgName').html(sculptureName);
		$('.roomName').html(roomName);
		$('.floorNo').html('');
	}

	if (pointLable == 'PPS') {
		$('.history').html(prattCopy['pps']);
	}

	try {
		if (person != '') {

			var floorIdPerson = hallMap[building].floorId
			var imgBldg = '<img src="images/buildings/'+building+'.jpg">'
			$('.legend-building').html(imgBldg);

			$('.bldgName').html(hallMap[building].bldg_name);
			$('.roomName').html(person + '<br>' + title + '<br>' + dept + '<br>' + office);

			createPointLabel(building,floorIdPerson);
		}
	} catch(err) {
		//console.log(err)
	}

	if (legendType == 'offCampusPoint') {
		setTimeout(function(){
			var imgBldg = '<img class="off-campus" src="images/buildings/'+floorId+'.jpg">'
			$('.legend-building').html(imgBldg);
			$('.bldgName').html(buildingId);
		},60);
	}

	var isLegendFilled = $('.bldgName').html();

	try {
		if (!hasFloor && legendType != 'offCampusPoint') {

			///console.log(' -- ' + buildingId + ' -- ' + floorId + ' -- ');

			if (buildingId == '' && floorId != '') {
				///console.log('set building id if missing');
				buildingId = bldgMap[floorId].buildingId;
			} else {
				///console.log('set building test failed');

			}

			///console.log('popMapLegend floorId: ' + floorId);
			///console.log('popMapLegend buildingId: ' + buildingId);
			///console.log('popMapLegend bldgMap: ' + bldgMap);
			///console.log(bldgMap[floorId]);
			///console.log(bldgMap[floorId].buildingId);

			///try { console.log('popMapLegend isLegendFilled: ' + isLegendFilled.length); } catch(err) {}
			///try { console.log('popMapLegend bldg_name: ' + hallMap[buildingId].bldg_name); } catch(err) {}

			$('img.access').remove();

			var imgBldg = '<img src="images/buildings/'+buildingId+'.jpg">'
			var imgAccs = '<img class="access" src="images/buildings/'+buildingId+'.png">'

			try { var bldgName = hallMap[buildingId].bldg_name; } catch(err) {}

			if (bldgName == 'Steuben Hall/Pratt Studios') {
				bldgName = 'Steuben Hall &<br>Pratt Studios';
			}

			$('.bldgName').html(bldgName);

			var imgBldg = '<img class="last-try" src="images/buildings/'+buildingId+'.jpg">'
			var imgAccs = '<img class="access" src="images/buildings/'+buildingId+'.png">'
			$('.legend-building').html(imgBldg);
			$('.legend-copy').prepend(imgAccs);
		}

	} catch(err) {
		//console.log(err)
	}

	revealLegend(delayReveal);

	setTimeout(function(){
		clearLegendVariables();
	},timeoutVars);

}

var setFloorInfo = function() {
	console.log('setFloorInfo');
	$('.floorNo').html(bldgMap[ambiarc.floorId].floor + ' floor');
}

var clearRoomInfo = function() {
	$('.roomName').html('');
	$('.roomNo').html('');
}

var clearMapLegend = function(src) {
	///return;
	///console.log('clearMapLegend ' + src);
	$('.showlegend').removeClass('showlegend').promise().then(function(){
		setTimeout(function(){
			$('.bldgName').html('');
			$('.floorNo').html('');
			$('.roomName').html('');
			$('.roomNo').html('');
			$('.history').html('');
		},1);
	});
}

var revealLegend = function(delayReveal){

	setTimeout(function(){

		try {

			var isLegendFilled = $('.bldgName').html();
			if (isLegendFilled.length > '1') {
				$('.legend').addClass('showlegend');
			} else {
				$('.legend').removeClass('showlegend');
			}

		} catch(err) {
			//console.log(err)
		}

	},delayReveal);
}

var clearLegendVariables = function(src=''){

	console.log('clear ambiarc vars ' + src);

	//ambiarc.menuAction	= '';
	ambiarc.action		= '';
	ambiarc.pointLable	= '';
	ambiarc.legendType	= '';
	ambiarc.ambiarcId	= '';
	ambiarc.buildingId	= '';
	///ambiarc.floorId		= '';
	ambiarc.roomName	= '';
	ambiarc.hasImage	= '';
	ambiarc.lat			= '';
	ambiarc.lon			= '';
	ambiarc.recordId	= '';
	ambiarc.sculptureName	= '';
	ambiarc.sculptureArtist	= '';

	ambiarc.person		= '';
	ambiarc.building	= '';
	ambiarc.dept		= '';
	ambiarc.title		= '';
	ambiarc.phone		= '';
	ambiarc.office		= '';
	ambiarc.email		= '';

};