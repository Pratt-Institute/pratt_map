 var mainBldgID;
 var isFloorSelectorEnabled = false;
 var floors = {};
 var currentFloorId;
 var MapLabels = {};

 window.rotation		= '0';
 window.rotationNew		= '0';
 window.rotationOld		= '0';
 window.rotationNeutral	= '0';
 window.currentLabelId	= '0';
 window.poiMap			= [];
 window.prattCopy		= [];
 window.legendDelay		= 2000;
 window.rangePoi		= range(-1000,1000);
 window.trackPoi		= [];
 window.mapIsParked		= true;
 window.allowFullView	= false;
 window.currentMapStatus = 'start';
 window.labelLoop		= 'Y';
 window.processProceed	= 'Y';
 window.allowFloorEvent = true;

 /// icampb15@pratt.edu
 /// 718.687.5762
 /// 347.904.6743

function range(start, edge, step=1) {
	// If only 1 number passed make it the edge and 0 the start
	if (arguments.length === 1) {
		edge = start;
		start = 0;
	}

	// Validate edge/start
	edge = edge || 0;
	step = step || 1;

	// Create array of numbers, stopping before the edge
	let arr = [];
	for (arr; (edge - start) * step > 0; start += step) {
		arr.push(start);
	}
	return arr;
}

//User clicked the floor selector
var resetMap = function() {

	var ambiarc = $("#ambiarcIframe")[0].contentWindow.Ambiarc;
	var zoom = ambiarc.getCurrentNormalizedZoomLevel(function(ret){
		//console.log(ret);
	});
	//var world = ambiarc.getCanvasPositionAtWorldPosition();

	if (mapIsParked == true) {
		return true;
	}

	if ($('.reset-map-vert').hasClass('disabled')) {
		//unDisableReset();
		return true;
	}
	$('.reset-map-vert').addClass('disabled');

	//ambiarc.ExitOverheadCamera();

	//console.log('isFloorSelectorEnabled ' + isFloorSelectorEnabled);

	if (isFloorSelectorEnabled) {
		ambiarc.exitBuilding();
		setTimeout(function(){
			fullMapView();
		},1000);
	} else {
		ambiarc.viewFloorSelector(mainBldgID,0);
	}

	clearMapLegend();
	ambiarc.menuAction = 'no';

};

var fullMapView = function() {
	//console.log('fullMapView');
	//ambiarc.ExitOverheadCamera();
	//$('.reset-map').removeAttr('disabled');
	ambiarc.focusOnLatLonAndZoomToHeight('', '', '40.689666', '-73.963883', '400');
	// 	if (rotationOld != '0') {
	// 		if (rotationOld != rotation) {
	// 			var rotationNeutral = -1 * Number(rotationOld);
	// 			ambiarc.rotateCamera(rotationNeutral, 0);
	// 			var delay = 1500;
	// 		}
	// 		rotationOld = '0';
	// 	}
	ambiarc.setCameraRotation(45, 0);
	mapIsParked = true;
	$('.reset-map-vert').addClass('disabled');
}

var justZoomOut = function() {
	//console.log('justZoomOut');
	//ambiarc.ExitOverheadCamera();
	$('.reset-map').removeAttr('disabled');
	ambiarc.focusOnLatLonAndZoomToHeight('', '', winLat, winLat, '400');
}

//This method is called when the iframe loads, it subscribes onAmbiarcLoaded so we know when the map loads
var iframeLoaded = function() {
	$("#ambiarcIframe")[0].contentWindow.document.addEventListener('AmbiarcAppInitialized', function() {
		onAmbiarcLoaded();
	});

	var startLat;
	var startLon;
	var startFloor;
	var startBLG;

	var endLat;
	var endLon;
	var endFloor;
	var endBLG;

	$("#ambiarcIframe")[0].contentWindow.addEventListener("keypress", function(event) {
		// s key
		if (event.keyCode == 115) {
			ambiarc.getMapPositionAtCursor(ambiarc.coordType.gps, (latlon) => {
				startFloor	= currentFloorId;
				startBLG	= currentBldgID;
				startLat	= latlon.lat
				startLon	= latlon.lon
			});
		}
		// e key
		if (event.keyCode == 101) {

			ambiarc.getMapPositionAtCursor(ambiarc.coordType.gps, (latlon) => {
				endFloor	= currentFloorId;
				endBLG		= currentBldgID;
				endLat		= latlon.lat
				endLon		= latlon.lon;
			});

		}
		// d key
		if (event.keyCode == 100) {
			ambiarc.getDirections(startBLG, startFloor, startLat, startLon, endBLG, endFloor, endLat, endLon, (directions) => {})
		}

		// c key
		if (event.keyCode == 99) {
			ambiarc.clearDirections()
		}

	});

}

var doTourLoop = function() {
	return;
	var i = 1;
	$('.buildings.oncamp').each(function(){
		if ( $(this).closest('div').hasClass('accessibility') ) {
			return true;
		}
		i++;
		var elm = this;
		var tourLoopTimeout = setTimeout(function() {
			if (!pauseTour) {
				$(elm).trigger("click");
				setTimeout(function(){
					//justZoomOut();
					//ambiarc.exitBuilding();
				},5000);
			}
		},parseInt(i * 7000));
	});

	// 	setTimeout(function(){
	// 		doTourLoop();
	// 	},parseInt(15*60*1000));
}

var createCampusLabels = function() {
	// creating objecct where we will store all our points property values
	ambiarc = $("#ambiarcIframe")[0].contentWindow.Ambiarc;
	ambiarc.hideLoadingScreen();
	ambiarc.getAllBuildings(function(buildingsArray){

		//console.log(buildingsArray);

		ambiarc.bldgIdsList = [];
		buildingsArray.forEach(function(bldgID, i){

			//console.log(i);

			ambiarc.getBuildingLabelID(bldgID, function(id){

				//console.log(bldgID + ' -- ' + id);

				ambiarc.bldgIdsList[bldgID] = id;
				try {
					var str = id.toString();
					if (str.indexOf(',') != -1) {
						alert(id);
						var bldgList = str.split(',');
						return true;
					} else {
					}
				} catch(err) {
				}
				try {
					/// TODO deal with this later
					buildingLabelUpdate(bldgID, id);
				} catch(err) {
					console.log(err);
				}
			});
		});
	});
}

var buildingLableLoop = function() {
	return true;
	ambiarc = $("#ambiarcIframe")[0].contentWindow.Ambiarc;
	$.each(ambiarc.bldgIdsList, function(bldgId, labelId) {
		buildingLabelUpdate(bldgId, labelId);
	});
}

var buildingLabelUpdate = function(bldgId, labelId) {

	//alert('buildingLabelUpdate ' + bldgId + ' ' + labelId)

	var poiObject = {};
	//poiObject.label = "Building Name Here";
	//poiObject.label = hallMap[bldgId].bldg_name;
	poiObject.label = '  ';
	//poiObject.type = "IconWithText"
	poiObject.type = 'Text'
	poiObject.location = 'URL'
	poiObject.partialPath = 'css/icons/ic_building.pngZ'
	poiObject.collapsedIconPartialPath = '/css/icons/ic_building.pngZ'
	poiObject.collapsedIconLocation = 'URL'
	poiObject.ignoreCollision = false;
	ambiarc.updateMapLabel(labelId, ambiarc.mapLabel.IconWithText, poiObject);
}

var fetchPoisFromApi = function(params) {

	clearMapLegend();
	hideAllLabels();
	deleteAllLabels();

	// 	if (params.action == 'doAccessibilityThing') {
	// 		ambiarc.EnterOverheadCamera();
	// 	} else {
	// 		ambiarc.ExitOverheadCamera();
	// 	}

	var ambiarc = $("#ambiarcIframe")[0].contentWindow.Ambiarc;
	if (typeof ambiarc.poiStuff == 'undefined') {
		ambiarc.poiStuff = [];
	}

	var token = $.cookie('token');
	var hash = Math.random().toString(36).substr(2, 5);
	if (typeof params == 'undefined') {
		alert('Error, fetch params not defined.');
		return true;
	}
	params.host = window.location.hostname;
	var str = '';
	for (var prop in params) {
		if (prop == 'currentTarget' || typeof params[prop] == 'undefined') {
			continue;
		}
		str += "&"+prop+"="+params[prop];
	}
	str = encodeURI(str);
	var url = "https://map.pratt.edu/facilities/web/facilities/get?token="+token+"&hash="+hash+str;
	console.log('url '+url);
	//alert(url);
	//var url = "http://localhost/~iancampbell/PrattSDK-mod/points_sample.json";

	if (params.action == 'showFloorInfo' && params.floor =='') {
		console.log(params);
		url = '';
		alert('stop');
	}

	ambiarc.loadRemoteMapLabels(url).then((out) => {

		/// show labels if building exploded
		//ambiarc.EnableAutoShowPOIsOnFloorEnter();

		//console.log(' out out out out out out out out ');
		//console.log(out);
		//console.log(' out out out out out out out out ');

		if (params.fetch == 'all') {
			return true;
		}

		if (typeof out == 'undefined') {
			console.log('load from api failed...');
			return true;
		}

		window.keepId = '';

		labelLoop = 'N';
		var processDelay = 125;
		for (i = 0; i < 50; i++) {
			$.each(out, function(k,v){
				if (typeof v.user_properties.ambiarcId == 'undefined') {
					/// if createMapLabel failed we'll try again.
					console.log('delayMapLabel delayMapLabel delayMapLabel delayMapLabel delayMapLabel ' + i);
					//console.log(v);
					ambiarc.createMapLabel('IconWithText', v.properties, (labelId) => {
						out[k].user_properties.ambiarcId = labelId;
					});
					labelLoop = 'Y';
				}
			});
			if (labelLoop == 'N') {
				processDelay = parseInt(i * 125);
				break;
			}
		}

		processProceed = 'Y';

		//setTimeout(function(){

			$.each(out, function(k,v){
				if (typeof v.user_properties.ambiarcId == 'undefined') {
					/// createMapLabel failed
					alert('createMapLabel failed');
					console.log(v);
					processProceed = 'N';
				} else {
					if (typeof v.user_properties.recordId != 'undefined') {
						poiMap[v.user_properties.recordId] = v.user_properties.ambiarcId;
						var s = {};
						s['ambiarcId']		= v.user_properties.ambiarcId;
						s['recordId']		= v.user_properties.recordId;
						s['accessible']		= v.user_properties.accessible;
						s['bldgName']		= v.user_properties.bldgName;
						s['bldgAbbr']		= v.user_properties.bldgAbbr;
						s['floorNo']		= v.user_properties.floorNo;
						s['roomNo']			= v.user_properties.roomNo;
						s['gkDisplay']		= v.user_properties.gkDisplay;
						s['gkDepartment']	= v.user_properties.gkDepartment;
						s['roomName']		= v.properties.label;
						s['latitude']		= v.geometry.coordinates[1];
						s['longitude']		= v.geometry.coordinates[0];
						//ambiarc.poiStuff.push(s);

						//console.log(' s s s s s s s s begin');
						//console.log(s);
						//console.log(' s s s s s s s s end');

						ambiarc.poiStuff[v.user_properties.ambiarcId] = s;

						if (keepId == '') {
							keepId = v.user_properties.ambiarcId;
						}
					}
				}
			});

			if (processProceed == 'Y') {
				processAndRun(params);
			}

		//},125);

	});
	return false;
}

var hideAllLabels = function() {

	if (typeof poiMap != 'undefined') {
		$.each(poiMap, function(k, v) {
			if (typeof v != 'undefined') {
				//ambiarc.destroyMapLabel(v);
				ambiarc.hideMapLabel(v,true);
			}
		});
	}

}

var deleteAllLabels = function() {

	if (typeof poiMap != 'undefined') {
		$.each(poiMap, function(k, v) {
			if (typeof v != 'undefined') {
				ambiarc.destroyMapLabel(v);
				//ambiarc.hideMapLabel(v,true);
			}
		});
	}

}

var processAndRun = function(params) {

	//hideAllLabels();

 	console.log('========================================== begin');
 	try { console.log('params');console.log(params); } catch(err) { console.log(err) }
 	try { console.log('poiMap');console.log(poiMap); } catch(err) { console.log(err) }
// 	try { console.log('bldgMap');console.log(bldgMap); } catch(err) { console.log(err) }
 	try { console.log('hallMap');console.log(hallMap); } catch(err) { console.log(err) }
 	try { console.log('ambiarc.poiStuff');console.log(ambiarc.poiStuff); } catch(err) { console.log(err) }
 	console.log('========================================== end');

	if (params.fetch == 'first') {
		//setupMenuAcademics();
		loadKeyboard();
	} else {
		ambiarc.currentBuilding = params.bldg;
		//console.log('set currentBuilding here: ' + ambiarc.currentBuilding);
	}

	//alert(params.recordId);

	var itemId = poiMap[params.recordId];

	if (params.action == 'focusAfterDataLoad') {

		console.log(' itemId itemId itemId itemId itemId itemId itemId itemId itemId itemId ' + itemId);

		if (typeof itemId == 'undefined' || itemId == '') {
			//itemId = poiMap[ambiarc.recordId];
			console.log('processAndRun ' + itemId);
		}

		var legendType	= ambiarc.legendType;
		var ambiarcId	= ambiarc.ambiarcId;
		var buildingId	= ambiarc.buildingId;
		var floorId		= ambiarc.floorId;
		var roomName	= ambiarc.roomName;

		/// testing heatmap stuff
// 		if (lat == '') {
// 			lat = ambiarc.poiStuff[itemId].latitude;
// 			lon = ambiarc.poiStuff[itemId].longitude;
// 		}
// 		var arr = [lat,lon,0.5,1];
// 		ambiarc.createHeatmap(arr);
		/// testing heatmap stuff

		//setTimeout(function(){
			try {
				if (itemId != '' && roomName != '') {
					var obj = {};
					obj.label = roomName;
					//obj.showOnCreation = true;
					//alert('1 '+itemId);
					try {
						ambiarc.updateMapLabel(itemId, 'IconWithText', obj);
					} catch(err) { console.log(err) }
				}
				if (itemId != '') {
					//alert('2 '+itemId);
					//alert(' - - - - - ' + params.recordId + ' - - - - - ' + itemId + ' - ' + roomName + ' - - - - - ');
					focusAfterDataLoad(itemId);
				}
			} catch(err) { console.log(err) }
		//},125);
	}

	if (params.action == 'focusOutdoorPoint') {
		ambiarc.showMapLabel(itemId, true);
		popMapLegend(2000,'demo.js 434');
	}

	if (params.action == 'showFloorInfo') {
		setTimeout(function(){
			popMapLegend();
		},1);
	}

	if (params.action == 'doAccessibilityThing') {

		try {
			if (keepId) {
				var buildLat = ambiarc.poiStuff[keepId].latitude;
				var buildLon = ambiarc.poiStuff[keepId].longitude;
				var bldg_name = ambiarc.poiStuff[keepId].bldgName;
			}
		} catch(err) { console.log(err) }




// 		var createObj = {};
// 		createObj.latitude =					buildLat
// 		createObj.longitude =					buildLon
// 		createObj.label =						bldg_name
// 		createObj.showOnCreation =				true
// 		createObj.type =						'IconWithText'
// 		createObj.location =					'URL'
// 		createObj.partialPath =					'images/icons/ic_building.png'
// 		createObj.collapsedIconLocation =		'URL'
// 		createObj.collapsedIconPartialPath =	'images/icons/ic_building.png'
// 		createObj.ignoreCollision =				true
//
// 		createTextIcon(createObj);

		var createObj = {};
		createObj.latitude =					params.bldgLat
		createObj.longitude =					params.bldgLon
		createObj.label =						bldg_name
		createObj.showOnCreation =				true
		createObj.type =						'IconWithText'
		createObj.location =					'URL'
		createObj.partialPath =					'images/icons/ic_building.png'
		createObj.collapsedIconLocation =		'URL'
		createObj.collapsedIconPartialPath =	'images/icons/ic_building.png'
		createObj.ignoreCollision =				true

		createTextIcon(createObj);



		ambiarc.focusOnLatLonAndZoomToHeight('', '', params.accessLat, params.accessLon, params.heightAboveFloor);

		var obj = {};
		obj.label = 'Accessible Entrance';
		obj.showOnCreation = true;
		obj.ignoreCollision = true;
		ambiarc.updateMapLabel(keepId, 'IconWithText', obj);


		setTimeout(function(){

			ambiarc.showMapLabel(keepId, true);
			popMapLegend(2000,'demo.js 491');

			setTimeout(function(){

				ambiarc.setCameraRotation(rotation, 0);

				ambiarc.UpdateHandicapLevel('None');

				if (ambiarc.buildingId == '0024') {
					// don't do the path
				} else {

					setTimeout(function(){

						allowFloorEvent = false;
						console.log(' getDirections getDirections getDirections getDirections getDirections getDirections getDirections ');
						console.log(keepId + ' - ' + params.bldg + ' - ' + params.floor);
						ambiarc.getDirections('', '', 40.690354, -73.964872, '', '', params.accessLat, params.accessLon, function(res){
						//ambiarc.getDirections('', '', 40.691163, -73.963597, params.bldg, params.floor, '', '', function(res){
						//ambiarc.getDirections('0007', '0033', '', '', params.bldg, params.floor, '', '', function(res){
							console.log(res);
						});
						console.log(' getDirections getDirections getDirections getDirections getDirections getDirections getDirections ');

					},1000);
				}

			},1000);

		},1000);

	}
}

//Rotate handlers
var rotateLeft = function(){
	var ambiarc = $("#ambiarcIframe")[0].contentWindow.Ambiarc;
	ambiarc.rotateCamera(-45, 0.2);
	$('#rotate_left').removeAttr('onclick');
	setTimeout(function(){ $('#rotate_left').attr('onclick', 'rotateLeft(this);');  }, 500);
};
var rotateRight = function(){
	var ambiarc = $("#ambiarcIframe")[0].contentWindow.Ambiarc;
	ambiarc.rotateCamera(45, 0.2);
	$('#rotate_right').removeAttr('onclick');
	setTimeout(function(){ $('#rotate_right').attr('onclick', 'rotateRight(this);'); }, 500);
};
var zoomOutHandler = function(){
	var ambiarc = $("#ambiarcIframe")[0].contentWindow.Ambiarc;
	ambiarc.zoomCamera(-0.5, 0.3);
};
var zoomInHandler = function(){
	var ambiarc = $("#ambiarcIframe")[0].contentWindow.Ambiarc;
	ambiarc.zoomCamera(0.5, 0.3);
};
/// added functions /////////////////////////////////////////////////////////////////////
var clearMapLegend = function() {
	console.log('clearMapLegend');
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

var createPointLabel = function(buildingId,floorId) {

	//hideAllLabels();

	console.log('createPointLabel ' + buildingId + floorId);

	currentBuildingId = buildingId;

	/// creat a label

	// 	var poiObject = {};
	// 	//poiObject.label = "Building Name Here";
	// 	//poiObject.label = hallMap[bldgId].bldg_name;
	// 	poiObject.label = bldgMap[floorId].bldg_name;
	// 	poiObject.type = "IconWithText"
	// 	//poiObject.type = 'Text'
	// 	poiObject.location = 'URL'
	// 	poiObject.partialPath = 'css/icons/ic_building.png'
	// 	poiObject.collapsedIconPartialPath = '/css/icons/ic_building.png'
	// 	poiObject.collapsedIconLocation = 'URL'
	// 	poiObject.ignoreCollision = false;

	//alert(floorId);

	var bldg_name = bldgMap[floorId].bldg_name;

	//console.log(bldgMap);

	var poiObject = {
		//buildingId: currentBuildingId,
		//floorId: floorId,
		latitude: winLat,
		longitude: winLon,
		label: bldg_name,
		//fontSize: 26,
		//category: 'Label',
		showOnCreation: true,
		type: 'IconWithText',
		//showToolTip: false,
		//tooltipTitle: '',
		//tooltipBody: '',
		//base64: iconDefault,
		location: 'URL',
		partialPath: 'images/icons/ic_building.png',
		collapsedIconLocation: 'URL',
		collapsedIconPartialPath: 'images/icons/ic_building.png',
		ignoreCollision: true,
	};

	//console.log(poiObject);

	createTextIcon(poiObject);

}

// Callback thats updates the UI after a POI is created
var mapLabelCreatedCallback = function(labelId, labelName, mapLabelInfo) {
	//console.log('mapLabelCreatedCallback');
    // push reference of POI to list
    poisInScene.push(labelId);
    mapLabelInfo.mapLabelId = labelId;
    ambiarc.poiList[labelId] = mapLabelInfo;
    addElementToPoiList(labelId, labelName, mapLabelInfo);
};

var focusAfterDataLoad = function(itemId) {

	if (typeof itemId != 'undefined' && itemId != '') {

		//console.log('focusAfterDataLoad '+itemId);
		//var ambiarc = $("#ambiarcIframe")[0].contentWindow.Ambiarc;
		//ambiarc.hideMapLabelGroup(poiMap, true);

		allowFloorEvent = false;

		try {
			ambiarc.selectedPoiId = itemId;
			ambiarc.focusOnMapLabel(itemId, 200);
		} catch(err) {
			console.log(err);
		}

		try {
			ambiarc.legendType = 'menuOther';
			ambiarc.ambiarcId = itemId;
			//ambiarc.buildingId = '';
			//ambiarc.floorId = '';
			//ambiarc.roomName = '';
			//alert('this one');
			popMapLegend(2500,'demo.js 634');
		} catch(err) {
			console.log(err);
		}

		try {
			setTimeout(function(){
				window.doFloorSelected = true;
			}, 3000);
		} catch(err) {
			console.log(err);
		}

	} else {

		console.log('focusAfterDataLoad ' + itemId);
	}

}

// Creates an Text + Icon on the map where the current mouse position is
var createTextIcon = function (mapLabelInfo) {

	ambiarc = $("#ambiarcIframe")[0].contentWindow.Ambiarc;

	if (typeof currentBuildingId == undefined){
		mapLabelInfo.outside = true;
	}

	ambiarc.createMapLabel('IconWithText', mapLabelInfo, (labelId) => {
		poiMap.push(labelId);
		//mapLabelCreatedCallback(labelId, mapLabelInfo.label, mapLabelInfo);
	});
};

// var repositionLabel = function(currentLabelId){
//
// 	currentLabelId = poiMap[ambiarc.recordIdKeep];
//
// 	alert(currentLabelId);
//
//     ambiarc.getMapPositionAtCursor(ambiarc.coordType.gps, (latlon) => {
//
//     	console.log('getMapPositionAtCursor');
//     	console.log(latlon);
//
//     	var send = {};
// 		send.id = ambiarc.recordIdKeep;
// 		send.latitude = parseFloat(latlon.lat);
// 		send.longitude = parseFloat(latlon.lon);
//
// 		postJsonToApi(send);
//     });
// };

var postJsonToApi = function(send) {

	return true;

	console.log('postJsonToApi');
	console.log(send);
	console.log($.cookie('token'));

	$.ajax({
		type: "POST",
		//dataType: 'json',
		//url: "http://local.facilities.com/facilities/put",
		url: "https://map.pratt.edu/facilities/web/facilities/put",
		crossDomain : true,
		//data: JSON.stringify(obj),
		data: {
			id: send.id,
			//info: ambiarc.poiList[currentLabelId],
			info: send,
			message: 'hello from front end',
			//token: document.token
			token: $.cookie('token')
		}
	})
    .done(function( ret ) {
		alert('post data to api');
    	console.log('post begin');
        console.log(ret);
        console.log('post end');
    })
    .fail( function(xhr, textStatus, errorThrown) {
        console.log(xhr.responseText);
        console.log(textStatus);
        console.log(errorThrown);
    });

};

