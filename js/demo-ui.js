 var mainBldgID;
 var isFloorSelectorEnabled = false;
 var floors = {};
 var currentFloorId;
 //var MapLabels = {};

 window.rotation		= '0';
 window.rotationNew		= '0';
 window.rotationOld		= '0';
 window.rotationNeutral	= '0';
 window.currentLabelId	= '0';
 window.poiMap			= [];

 //window.rangePoi		= range(-1000,1000);
 //window.trackPoi		= [];
 window.mapIsParked		= true;
 window.allowFullView	= false;
 window.currentMapStatus = 'start';
 window.labelLoop		= 'Y';
 window.processProceed	= 'Y';
 window.allowFloorEvent = true;
 window.skipEventLegend = false;
 window.skipPointLoad	= false;
 window.processingPoints = false;
 window.fetchDelay		= 0;
 window.countZeros		= 0;
 window.explodeDelay	= 0;

 window.prattCopy		= [];
 window.legendDelay		= 2000;
 window.legendCopy		= '';

 window.youAreHereLat = '';
 window.youAreHereLon = '';

 window.buildingLabels = [];
 window.buildingHolder = {};

 window.timerSkipEventLegend = '';

 /// icampb15@pratt.edu
 /// 718.687.5762
 /// 347.904.6743

// $.urlParam = function(name){
// 	var results = new RegExp('[\?&]' + name + '=([^&#]*)').exec(window.location.href);
// 	return results[1] || 0;
// }

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

var resetMap = function() {

	try {
		var roomName = $('.roomName').html();
		if (roomName.length > 10) {
			destroyAllLabels();
		}
	} catch(err) {
	}

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
		clearMapLegend('demo 75');
		setTimeout(function(){
			fullMapView();
		},1000);
	} else {
		ambiarc.viewFloorSelector(mainBldgID,0);
	}

	ambiarc.menuAction = 'no';

};

var fullMapView = function() {

	ambiarc.focusOnLatLonAndZoomToHeight('', '', '40.689666', '-73.963883', '400');

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

	setTimeout(function(){
		doTourLoop();
	},parseInt(5*60*1000));

}

var showBuildingLabels = function() {

	var i = 1;

	$('.labelbuildings').each(function(){

		if ( $(this).closest('div').hasClass('accessibility') ) {
			return true;
		}

		var elm = this;
		var lLat = $(elm).attr('data-lat');
		var lLon = $(elm).attr('data-long');
		var lBld = $(elm).html();
		var lBldId = $(elm).attr('data-buildingid');
		var lFlrId = $(elm).attr('data-floorid');

		try {
			if ( typeof buildingHolder[lBld] != 'undefined') {
				ambiarc.showMapLabel(buildingHolder[lBld], true);
				return true;
			}
		} catch(err) {
			console.log(err);
		}

		i++;

		setTimeout(function() {

			console.log(lLat + ' ' + lLon + ' ' + lBld);

			var createObj = {};

			createObj.showTooltip 				= false;
			createObj.latitude 					= lLat
			createObj.longitude 				= lLon
			createObj.label 					= lBld
			createObj.showOnCreation 			= true
			createObj.location 					= 'URL'
			createObj.partialPath 				= 'images/icons/ic_building.png'
			createObj.collapsedIconLocation 	= 'URL'
			createObj.collapsedIconPartialPath 	= 'images/icons/ic_building.png'
			createObj.ignoreCollision 			= false

			//ambiarc.createMapLabel('IconWithText', createObj, (labelId) => {
			ambiarc.createMapLabel('Text', createObj, (labelId) => {

				console.log('????????????????????????????????????????????????');
				console.log(lBldId + ' ' + labelId);
				console.log('????????????????????????????????????????????????');

				buildingLabels[labelId] = {
					buildingId:		lBldId,
					buildingFloor:	lFlrId,
					buildingLat:	lLat,
					buildingLon:	lLon
				};

				buildingHolder[lBldId] = labelId;
				console.log(buildingHolder);

			});

		},parseInt(62*i));

	});


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
					///console.log(err);
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
	poiObject.ignoreCollision = true;
	ambiarc.updateMapLabel(labelId, ambiarc.mapLabel.IconWithText, poiObject);
}

var fetchPoisFromApi = function(params) {

	destroyAllLabels();

	//createYouAreHere();

	if (params.action == 'doAccessibilityThing') {
		processAndRun(params);
		return;
	}

	if (skipPointLoad) {
		return;
	}

	var ambiarc = $("#ambiarcIframe")[0].contentWindow.Ambiarc;
	if (typeof ambiarc.poiStuff == 'undefined') {
		ambiarc.poiStuff = [];
	}

	//ambiarc.clearDirections();

	//for (var i = -999; i <= 999; i++) {
		//console.log(i);
	//	ambiarc.hideMapLabel(i,true);
	//}

	//alert('delete 0');

	// 	if (params.action == 'doAccessibilityThing') {
	// 		ambiarc.EnterOverheadCamera();
	// 	} else {
	// 		ambiarc.ExitOverheadCamera();
	// 	}

	//alert(ambiarc.floorId);

	//if (ambiarc.floorId != '') {
	//if (ambiarc.menuAction == 'yes') {
	//	allowFloorEvent = false;
	//}

	var hash = Math.random().toString(36).substr(2, 5);
	if (typeof params == 'undefined') {
		alert('Error, fetch params not defined.');
		return true;
	}

	if (params.action == 'showFloorInfo' && params.floor =='') {
		url = '';
		alert('stop');
	}

	params.host = window.location.hostname;
	params.token		= $.cookie('token');
	params.hash			= hash;
	params.countzeros	= countZeros;

	var pObj = {}
	for (var prop in params) {
		if (prop == 'currentTarget' || typeof params[prop] == 'undefined' || params[prop] == '') {
			continue;
		}
		pObj[prop] = params[prop];
	}

	console.log(pObj);

	url = "https://map.pratt.edu/facilities/web/facilities/pull";
	var options = { method: 'POST', headers: { 'Accept': 'application/json', 'Content-Type': 'application/x-www-form-urlencoded; charset=utf-8' }, body: JSON.stringify(pObj) };

	console.log('url '+url);

	ambiarc.loadRemoteMapLabels(url,options).then((out) => {

		//allowFloorEvent = false;

		setTimeout(function(){

			/// show labels if building exploded
			//ambiarc.EnableAutoShowPOIsOnFloorEnter();

			console.log(params);
			console.log(' fetch points out demo ');
			console.log(out);

			if (params.fetch == 'all') {
				return true;
			}

			if (typeof out == 'undefined') {
				alert('load from api failed...');
				return true;
			}

			window.keepId = '';

			labelLoop = 'N';
			var processDelay = 30;
			var j = 0;
			for (i = 1; i < 12; i++) {

				j++;
				processDelay = parseInt(j * 30);

				for (pnt in out) {

					if ( typeof out[pnt].user_properties.ambiarcId === 'undefined' ||
						 Number.isInteger(out[pnt].user_properties.ambiarcId) === false ||
						 out[pnt].user_properties.ambiarcId === 0 ||
						 out[pnt].user_properties.ambiarcId === '0' ||
						 Math.round(out[pnt].user_properties.ambiarcId) != out[pnt].user_properties.ambiarcId ) {

						labelLoop = 'Y';

						out.splice(pnt, 1);

					} else {
						labelLoop = 'N';
					}

				}

				if (labelLoop == 'N') {
					break;
				}

			}

			setTimeout(function(){

				if (typeof out[0] == 'undefined') {
					///console.log('no out info');
					///console.log(params);
				}

				processProceed = 'Y';

				var cntRcrds = 0;

				$.each(out, function(k,v){

					if (typeof v.user_properties.ambiarcId == 'undefined') {
						processProceed = 'N';
					} else {

						if (v.user_properties.ambiarcId === 0) {
							countZeros++;
						} else {

							cntRcrds++;

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
							s['floorId']		= v.properties.floorId;
							s['roomName']		= v.properties.label;
							s['latitude']		= v.geometry.coordinates[1];
							s['longitude']		= v.geometry.coordinates[0];

							ambiarc.poiStuff[v.user_properties.ambiarcId] = s;

							if (keepId == '') {
								keepId = v.user_properties.ambiarcId;
							}

							legendCopy			= v.user_properties.legendCopy;

						}
					}
				});

				if (cntRcrds < 1 && params.action != 'focusOutdoorPoint') {
					//location.reload();
					alert('no records found');
				}

				console.log('processProceed = ' + processProceed)

				if (processProceed == 'Y') {
					processAndRun(params);
				}

			},processDelay);

		},125);

	});
	return false;
}

// var hideAllLabels = function() {
//
// 	if (typeof poiMap != 'undefined') {
// 		$.each(poiMap, function(k, v) {
// 			if (typeof v != 'undefined') {
// 				ambiarc.hideMapLabel(v,true);
// 			}
// 		});
// 	}
// }

var destroyAllLabels = function() {

	skipPointLoad = false;
	clearLegendVariables('demo 543');
	clearMapLegend();

	//console.log('destroyAllLabels destroyAllLabels destroyAllLabels destroyAllLabels destroyAllLabels destroyAllLabels destroyAllLabels ');

	var ambiarc = $("#ambiarcIframe")[0].contentWindow.Ambiarc;

	for (var i = -1100; i <= 1100; i++) {
		//console.log('destroyAllLabels '+i);
		ambiarc.destroyMapLabel(i);
	}

	buildingLabels = {};
	buildingHolder = {};

	console.log('destroyAllLabels destroyAllLabels destroyAllLabels destroyAllLabels destroyAllLabels destroyAllLabels destroyAllLabels ');

}

var processAndRun = function(params) {

	if (params.action == 'displayProvisions') {

		if (isFloorSelectorEnabled) {
			ambiarc.exitBuilding();
			clearMapLegend('demo 462');
			//setTimeout(function(){
			//	fullMapView();
			//},1000);
		}

		return;
	}

	if (ambiarc.floorId > '1') {
		ambiarc.buildingId = bldgMap[ambiarc.floorId].buildingId;
	}

 	///console.log('========================================== begin');
 	///try { console.log('params');console.log(params); } catch(err) { console.log(err) }
 	///try { console.log('poiMap');console.log(poiMap); } catch(err) { console.log(err) }
 	///try { console.log('bldgMap');console.log(bldgMap); } catch(err) { console.log(err) }
 	///try { console.log('hallMap');console.log(hallMap); } catch(err) { console.log(err) }
 	///try { console.log('ambiarc.poiStuff');console.log(ambiarc.poiStuff); } catch(err) { console.log(err) }
 	///console.log('========================================== end');

	if (params.fetch == 'first') {
		//setupMenuAcademics();
		loadKeyboard();
	} else {
		ambiarc.currentBuilding = params.bldg;
	}

	var itemId = poiMap[params.recordId];

	if (params.action == 'focusAfterDataLoad') {

		//var legendType	= ambiarc.legendType;
		//var ambiarcId	= ambiarc.ambiarcId;
		//var buildingId	= ambiarc.buildingId;
		//var floorId		= ambiarc.floorId;
		var roomName	= ambiarc.roomName;

		/// testing heatmap stuff
	 	pLat = ambiarc.poiStuff[itemId].latitude;
	 	pLon = ambiarc.poiStuff[itemId].longitude;
		// 	var arr = [lat,lon,0.5,1];
		// 	ambiarc.createHeatmap(arr);
		/// testing heatmap stuff

		//showBuildingLabels();

		//ambiarc.focusOnLatLonAndZoomToHeight('', '', pLat, pLon, 75, 'focus_after_data_load');
		ambiarc.focusOnLatLonAndZoomToHeight('', '', pLat, pLon, 125);

		if (typeof currentFloorId != 'undefined') {
			explodeDelay = 5000;
		} else {
			explodeDelay = 3000;
		}

		setTimeout(function(){
			try {
				if (itemId !== '' && roomName != '') {
					var obj = {};
					obj.label = roomName;
					try {
						ambiarc.updateMapLabel(itemId, 'IconWithText', obj);
					} catch(err) { console.log(err) }
				}
				if (itemId !== '') {
					focusAfterDataLoad(itemId);
				}
			} catch(err) { console.log(err) }
		},parseInt(explodeDelay));

		setTimeout(function(){
			try {
				if (itemId !== '' && roomName != '') {
					var obj = {};
					obj.label = roomName;
					try {
						ambiarc.updateMapLabel(itemId, 'IconWithText', obj);
					} catch(err) { console.log(err) }
				}
			} catch(err) { console.log(err) }
		},500);
	}

	if (params.action == 'focusOutdoorPoint') {

		setTimeout(function(){

			ambiarc.focusOnLatLonAndZoomToHeight('', '', winLat, winLon, 75);

			setTimeout(function(){

				ambiarc.showMapLabel(itemId, true);

				controlEventLegend();

				console.log(' demo 672 ----------------- ' + ambiarc.sculptureName + ' ----------------- ');

				if (ambiarc.sculptureName == '') {
					ambiarc.recordId			= params.recordId;
					ambiarc.sculptureName		= params.sculptureName;
					ambiarc.sculptureArtist		= params.sculptureArtist;
				}

				popMapLegend2(1000,1500,5000,'demo 668');

				setTimeout(function(){
					ambiarc.setCameraRotation(45, 0);
				},1500);

			},1500);

		},125);

	}

	if (params.action == 'showFloorInfo') {
		console.log(params);
		ambiarc.action = params.action;
		ambiarc.buildingId = params.bldg;
		//ambiarc.floorId = params.floor;
		popMapLegend2(1000,1500,5000,'demo 580');
	}

	if (params.action == 'doAccessibilityThing') {

		var delay = 1500;
		if (isFloorSelectorEnabled) {
			delay = 3500;
		}

		// 	if (params.overhead == 'Y') {
		// 		ambiarc.EnterOverheadCamera();
		// 		overhead = true;
		// 	} else {
		// 		ambiarc.ExitOverheadCamera();
		// 		overhead = false;
		// 	}

		var accesspoint = params.accesspoint.split(',');
		console.log(accesspoint);

		var elevator = params.elevator.split(',');
		console.log(elevator);

		var destination = params.destination.split(',');
		console.log(destination);

		if (params.accesspoint.length > 8) {
			var createObj = {};
			createObj.latitude =					accesspoint[2]
			createObj.longitude =					accesspoint[3]
			createObj.label =						'Entrance'
			createObj.showOnCreation =				true
			createObj.type =						'IconWithText'
			createObj.location =					'URL'
			createObj.partialPath =					'images/icons/accessible.png'
			createObj.collapsedIconLocation =		'URL'
			createObj.collapsedIconPartialPath =	'images/icons/accessible.png'
			createObj.ignoreCollision =				true
			createTextIcon(createObj);
		}

		legendCopy = params.legendCopy;

		ambiarc.UpdateHandicapLevel('Full');

		setTimeout(function(){

			ambiarc.focusOnLatLonAndZoomToHeight('', '', accesspoint[2], accesspoint[3], params.zoom);

			setTimeout(function(){

				legendCopy = params.legendCopy;
				popMapLegend2(1000,1500,5000,'demo 701');

				ambiarc.setCameraRotation(params.rotation, 0);

				setTimeout(function(){

					if (typeof youAreHereLat != 'undefined' && youAreHereLat.length > 0) {
						ambiarc.getDirections('', '', youAreHereLat, youAreHereLon, accesspoint[0], accesspoint[1], accesspoint[2], accesspoint[3], function(res){
							console.log('dynamic dynamic dynamic dynamic dynamic dynamic dynamic dynamic dynamic dynamic dynamic dynamic dynamic dynamic dynamic ');
							console.log(res);
						});
					} else {
						ambiarc.getDirections('', '', 40.690354, -73.964872, accesspoint[0], accesspoint[1], accesspoint[2], accesspoint[3], function(res){
							console.log('static static static static static static static static static static static static static static static static static ');
							console.log(res);
						});
					}

					if (params.destination.length > 8) {
						var createObj = {};
						createObj.latitude =					destination[2]
						createObj.longitude =					destination[3]
						createObj.label =						destination[4]
						createObj.showOnCreation =				true
						createObj.type =						'IconWithText'
						createObj.location =					'URL'
						createObj.partialPath =					'images/icons/ic_building.png'
						createObj.collapsedIconLocation =		'URL'
						createObj.collapsedIconPartialPath =	'images/icons/ic_building.png'
						createObj.ignoreCollision =				true
						createTextIcon(createObj);
						console.log('show building point');
					}

					if (params.elevator.length > 8) {
						var createObj = {};
						createObj.latitude =					elevator[2]
						createObj.longitude =					elevator[3]
						createObj.label =						'Elevator'
						createObj.showOnCreation =				true
						createObj.type =						'IconWithText'
						createObj.location =					'URL'
						createObj.partialPath =					'images/icons/ic_admin_elevator_v1.png'
						createObj.collapsedIconLocation =		'URL'
						createObj.collapsedIconPartialPath =	'images/icons/ic_admin_elevator_v1.png'
						createObj.ignoreCollision =				true
						createTextIcon(createObj);
						console.log('show elevator point');
					}

					setTimeout(function(){
						legendCopy = params.legendCopy;
						popMapLegend2(1000,1500,5000,'demo 701');
						ambiarc.focusOnLatLonAndZoomToHeight('', '', destination[2], destination[3], params.zoom);
					},1500);

				},1500);

			},delay);

		},250);

	}

	if (params.action == 'doProhThing') {

		if (typeof currentBldgID == 'undefined') {
			var wait = 1;
		} else {
			fullMapView();
			var wait = 2000;
		}

		//ambiarc.exitBuilding();

		//skipPointLoad = true;

		allowFloorEvent = false;

		setTimeout(function(){

			ambiarc.getDirections('0017', '0073', youAreHereLat, youAreHereLon, params.bldg, params.floor, params.lat, params.lon, function(res){

				console.log('proh proh proh proh proh proh proh proh proh proh proh proh proh proh proh proh proh proh proh proh proh proh ');
				console.log(res);

				setTimeout(function(){

					allowFloorEvent = false;

					ambiarc.focusOnLatLonAndZoomToHeight('', '', params.lat, params.lon, 125);

					setTimeout(function(){

						allowFloorEvent = false;

						//ambiarc.getDirections(startBLG, startFloor, startLat, startLon, endBLG, endFloor, endLat, endLon, (directions) => {})
						//	console.log('proh2 proh2 proh2 proh2 proh2 proh2 proh2 proh2 proh2 proh2 proh2 proh2 proh2 proh2 proh2 proh2 ');
						//	console.log(res);
						//})

						ambiarc.viewFloorSelector(params.bldg, 200);

						setTimeout(function(){

							allowFloorEvent = false;

							ambiarc.focusOnFloor(params.bldg, params.floor, 200, true, false);

							setTimeout(function(){

								allowFloorEvent = false;

								ambiarc.focusOnMapLabel(itemId, 200);

								//setTimeout(function(){
								//	skipPointLoad = false;
								//},1500);

							},1500);

						},1500);

					},3000);

				},1000);

			});

		},wait);

	}
}

var controlEventLegend = function(time=8000) {

	clearTimeout(timerSkipEventLegend);

	skipEventLegend = true;
	console.log('skipEventLegend = true skipEventLegend = true skipEventLegend = true skipEventLegend = true skipEventLegend = true skipEventLegend = true skipEventLegend = true skipEventLegend = true ');

	timerSkipEventLegend = setTimeout(function(){
		skipEventLegend = false;
		console.log('skipEventLegend = false skipEventLegend = false skipEventLegend = false skipEventLegend = false skipEventLegend = false skipEventLegend = false skipEventLegend = false skipEventLegend = false ');
	},time);

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

var createPointLabel = function(buildingId,floorId) {

	///console.log('createPointLabel ' + buildingId + floorId);

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
		showToolTip: false,
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

	if (typeof itemId !== 'undefined' && itemId !== '') {

		try {
			ambiarc.selectedPoiId = itemId;
			ambiarc.focusOnMapLabel(itemId, 200);
		} catch(err) {
			///console.log(err);
		}

		try {
			ambiarc.legendType = 'menuOther';
			ambiarc.ambiarcId = itemId;
			popMapLegend2(1000,1500,5000,'demo 859');
		} catch(err) {
			///console.log(err);
		}

	} else {
		///console.log('focusAfterDataLoad ' + itemId);
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

var createYouAreHere = function() {

	var createObj = {};

	if (typeof youAreHereLat != 'undefined' && youAreHereLat.length > 0) {
		createObj.latitude		= youAreHereLat;
		createObj.longitude		= youAreHereLon;
	} else {
		createObj.latitude		= 40.690354;
		createObj.longitude		= -73.964872;
	}

	createObj.showTooltip 				= false;
	createObj.label 					= 'You Are Here';
	createObj.showOnCreation 			= true;
	createObj.location 					= 'URL';
	createObj.partialPath 				= 'images/icons/you-are-here.png';
	createObj.collapsedIconLocation 	= 'URL';
	createObj.collapsedIconPartialPath 	= 'images/icons/you-are-here.png';
	createObj.ignoreCollision 			= true;

	ambiarc = $("#ambiarcIframe")[0].contentWindow.Ambiarc;

	ambiarc.createMapLabel('IconWithText', createObj, (labelId) => {
		console.log('You Are Here ' + labelId);
	});

}

var repositionLabel = function(currentLabelId){

	console.log('currentLabelId ' + currentLabelId);

	console.log(ambiarc.poiStuff);

    ambiarc.getMapPositionAtCursor(ambiarc.coordType.gps, (latlon) => {
    	console.log(latlon);
    	var send = {};
		send.id = ambiarc.poiStuff[currentLabelId].recordId;
		send.latitude = parseFloat(latlon.lat);
		send.longitude = parseFloat(latlon.lon);
		postJsonToApi(send);
    });
};

var postJsonToApi = function(send) {

	// return true;

	$.ajax({
		type: "POST",
		//dataType: 'json',
		url: "https://map.pratt.edu/facilities/web/facilities/put",
		crossDomain : true,
		data: {
			id: send.id,
			info: send,
			message: 'hello from front end',
			token: $.cookie('token')
		}
	})
    .done(function( ret ) {

        console.log(ret);
        console.log('post end');

		// 	var poiObject = {
		// 		//buildingId: currentBuildingId,
		// 		//floorId: floorId,
		// 		latitude: send.latitude,
		// 		longitude: send.longitude,
		// 		label: 'Point Moved',
		// 		//fontSize: 26,
		// 		//category: 'Label',
		// 		showOnCreation: true,
		// 		type: 'IconWithText',
		// 		showToolTip: false,
		// 		//tooltipTitle: '',
		// 		//tooltipBody: '',
		// 		//base64: iconDefault,
		// 		location: 'URL',
		// 		partialPath: 'images/icons/ic_admin_info_v2.png',
		// 		collapsedIconLocation: 'URL',
		// 		collapsedIconPartialPath: 'images/icons/ic_admin_info_v2.png',
		// 		ignoreCollision: true,
		// 	};
		//
		// 	createTextIcon(poiObject);

    })
    .fail( function(xhr, textStatus, errorThrown) {
        console.log(xhr.responseText);
        console.log(textStatus);
        console.log(errorThrown);
    });

};

