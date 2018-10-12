 var mainBldgID;
 var isFloorSelectorEnabled = false;
 var floors = {};
 var currentFloorId;
 var MapLabels = {};

//User clicked the floor selector
var resetMap = function() {
	ambiarc = $("#ambiarcIframe")[0].contentWindow.Ambiarc;
	//ambiarc.exitBuilding();
	if (isFloorSelectorEnabled) {
		ambiarc.exitBuilding();
		buildingLableLoop();
	} else {
		ambiarc.viewFloorSelector(mainBldgID,0);
	}
	clearMapLegend();
	ambiarc.menuAction = 'no';
	// reactivate reset button after a pause
	setTimeout(function(){
		$('.reset-map').removeAttr('disabled');
	}, 1500);
};

//This method is called when the iframe loads, it subscribes onAmbiarcLoaded so we know when the map loads
var iframeLoaded = function() {
	$("#ambiarcIframe")[0].contentWindow.document.addEventListener('AmbiarcAppInitialized', function() {
		onAmbiarcLoaded();
	});
}

var doTourLoop = function() {

//	return true;

// 	if (tourIsRunning == true) {
// 		return true;
// 	}
// 	tourIsRunning = true;
	var i = 1;
	$('.buildings.oncamp').each(function(){

		i++;
		var elm = this;
		var tourLoopTimeout = setTimeout(function() {
			if (!pauseTour) {
				$(elm).trigger("click");
			}
		},i * 7000);

	});
	setTimeout(function(){
		//alert('tour is done');
		//tourIsRunning = false;
//		doTourLoop();
	},parseInt(180*1000));
}

//var setTourInterval = function(){
	// 	try {
	// 		clearInterval(intTour);
	// 	} catch(err) { console.log(err) }
	//window.intTour = setInterval(function(){
// 		if (tourIsRunning == false) {
// 			doTourLoop();
// 		}
	//}, parseInt(127*1000));
//}

var createCampusLabels = function() {
	// creating objecct where we will store all our points property values
	ambiarc = $("#ambiarcIframe")[0].contentWindow.Ambiarc;
	ambiarc.hideLoadingScreen();
	ambiarc.getAllBuildings(function(buildingsArray){
		console.log('=========================================================================================');

		console.log(buildingsArray);

		ambiarc.bldgIdsList = [];
		buildingsArray.forEach(function(bldgID, i){

			console.log(i);

			ambiarc.getBuildingLabelID(bldgID, function(id){
				console.log(bldgID + ' -- ' + id);
				console.log('=========================================================================================');
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

	console.log('fetchPoisFromApi');
	ambiarc = $("#ambiarcIframe")[0].contentWindow.Ambiarc;
	if (typeof ambiarc.poiStuff == 'undefined') {
		ambiarc.poiStuff = {};
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
		ambiarc.EnableAutoShowPOIsOnFloorEnter();

		if (params.fetch == 'all') {
			return true;
		}

		console.log(out);

		if (out[0].user_properties.recordId.length < '1') {
			console.log(out);
			alert('load from api failed...');
			return true;
		}

		if (typeof ambiarc.poiStuff != 'undefined') {
			$.each(ambiarc.poiStuff, function(k, v) {
				if (typeof v != 'undefined') {
					var aId = v['ambiarcId'];
					console.log(',,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,');
					console.log(aId);
					ambiarc.destroyMapLabel(aId);
				}
				delete ambiarc.poiStuff[k];
			});
		}

		// 	if (typeof poiMap != 'undefined') {
		// 		$.each(poiMap, function(k, v){
		// 			delete poiMap[k];
		// 		});
		// 	}

		if (typeof poiMap == 'undefined') {
			window.poiMap = {};
		}

		//ambiarc.poiStuff = null;
		ambiarc.poiStuff = [];
		ambiarc.labelObj = {};
		window.deptMap = {};
		//window.legendInfo = {};

		var keepId = '';

		$.each(out, function(k,v){
			if (typeof v.user_properties.ambiarcId == 'undefined') {

				console.log('undefined undefined undefined undefined undefined');
				console.log(k);
				console.log(v);
				///console.log('undefined undefined undefined undefined undefined');
				//alert('id is undefined');

				/* TODO what was this for? */
				///v.user_properties.ambiarcId = v.properties.mapLabelId;

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
					ambiarc.poiStuff[v.user_properties.ambiarcId] = s;

					if (keepId == '') {
						keepId = v.user_properties.ambiarcId;
					}
				}
			}
		});

		console.log(poiMap);
		console.log(ambiarc.poiStuff);
		console.log('^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^');
		//return true;

		if (params.fetch == 'first') {
			//setupMenuAcademics();
			loadKeyboard();
		} else {
			ambiarc.currentBuilding = params.bldg;
			//console.log('set currentBuilding here: ' + ambiarc.currentBuilding);
		}

		if (params.label) {

			console.log(poiMap);
			var itemId = poiMap[params.recordId];
			ambiarc.selectedPoiId = itemId;

			if (typeof itemId != 'undefined' && typeof params.label != 'undefined') {

				// 	if (params.label.length > 3 && poiMap.length > 1) {
				// 		var obj = {};
				// 		obj.label = params.label;
				// 		obj.clear = 'hide';
				// 		ambiarc.updateMapLabel(itemId, ambiarc.mapLabel.IconWithText, obj);
				// 		ambiarc.labelObj = obj;
				// 		//window.legendInfo.ambiarcId = itemId;
				// 		//legendInfo.showRoom = true;
				// 		//window.legendInfo.floorId = '';
				// 		//popMapLegend();
				// 	}

			} else {
				console.log(params);
				alert('itemId is undefined');
			}
		} else {
			if (params.fetch != 'first') {
				for(var ambiarcId in ambiarc.poiStuff) {
					//window.legendInfo.ambiarcId = ambiarcId;
					//legendInfo.showRoom = false;
					//window.legendInfo.floorId = '';
					//popMapLegend();
					break;
				}
			}
		}

		var itemId = poiMap[params.recordId]

		//window.legendInfo.ambiarcId = itemId;
		//legendInfo.showRoom = false;
		//window.legendInfo.floorId = '';

		console.log('==========================================');
		console.log(params);
		console.log(poiMap);
		console.log(ambiarc.poiStuff);
		console.log('==========================================');
		//alert(itemId);

		if (params.action == 'focusAfterDataLoad') {

			var legendType	= ambiarc.legendType;
			var ambiarcId	= ambiarc.ambiarcId;
			var buildingId	= ambiarc.buildingId;
			var floorId		= ambiarc.floorId;
			var roomName	= ambiarc.roomName;
			var lat = ambiarc.lat;
			var lon = ambiarc.lon;

			setTimeout(function(){

				try {
					//alert(roomName);
					if (itemId != '' && roomName != '') {
						var obj = {};
						obj.label = roomName;
						//obj.showOnCreation = true;
						ambiarc.updateMapLabel(itemId, 'IconWithText', obj);
					}
				} catch(err) { console.log(err) }

			},500);
		}

		// 	if (params.action == 'focusAfterDataLoad') {
		// 		if (focusAfterDataLoad(itemId)) {
		// 			return true;
		// 		}
		// 	}

		if (params.action == 'focusOutdoorPoint') {
			if (ambiarc.showMapLabel(itemId, true)) {
				return true;
			}
		}

		if (params.action == 'showFloorInfo') {
			setTimeout(function(){
				popMapLegend();
			},1);
		}

		if (params.action == 'doAccessibilityThing') {

			try {
				if (keepId) {
					params.lat = ambiarc.poiStuff[keepId].latitude;
					params.lon = ambiarc.poiStuff[keepId].longitude;
				}
			} catch(err) { console.log(err) }

			console.log(ambiarc.poiStuff[keepId]);
			console.log(params);
			alert('accessibility ' + keepId);

			//ambiarc.focusOnLatLonAndZoomToHeight(params.bldg, '', params.lat, params.lon, params.heightAboveFloor);
			ambiarc.focusOnLatLonAndZoomToHeight('', '', params.lat, params.lon, params.heightAboveFloor);

			//setTimeout(function(){

				//try {
					//alert(roomName);
					//if (itemId != '' && roomName != '') {
						var obj = {};
						obj.label = 'Entrance';
						obj.showOnCreation = true;
						ambiarc.updateMapLabel(keepId, 'IconWithText', obj);
					//}
				//} catch(err) { console.log(err) }

			//},500);

			setTimeout(function(){
				popMapLegend();
			},1);
		}

	});
	return false;
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
		},750);
	});
}

var popMapLegend = function() {

	var ambiarc = $("#ambiarcIframe")[0].contentWindow.Ambiarc;

	var legendType	= ambiarc.legendType;
	var ambiarcId	= ambiarc.ambiarcId;
	var buildingId	= ambiarc.buildingId;
	var floorId		= ambiarc.floorId;
	var roomName	= ambiarc.roomName;
	var lat = ambiarc.lat;
	var lon = ambiarc.lon;

	// 	try {
	// 		if (ambiarcId != '' && roomName != '') {
	// 			var obj = {};
	// 			obj.label = roomName;
	// 			//obj.showOnCreation = true;
	// 			ambiarc.updateMapLabel(ambiarcId, 'IconWithText', obj);
	// 		}
	// 	} catch(err) { console.log(err) }

	setTimeout(function(){
		ambiarc.legendType = '';
		ambiarc.ambiarcId = '';
		ambiarc.buildingId = '';
		ambiarc.floorId = '';
		ambiarc.roomName = '';
		ambiarc.lat = '';
		ambiarc.lon = '';
	},4000);

	document.scheduleLegend = setTimeout(function(){

		console.log('$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$');
		console.log('ambiarcId ' + ambiarcId);
		console.log('buildingId ' + buildingId);
		console.log('floorId ' + floorId);
		console.log('doFloorSelected ' + doFloorSelected);
		console.log('legendType ' + legendType);
		console.log('isFloorSelectorEnabled ' + isFloorSelectorEnabled);
		console.log('$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$');

		try {
			$('.bldgName').html(bldgMap[floorId].bldg_name);
		} catch(err) { console.log(err) }

		try {
			if (legendType != 'menuBuilding') {
				$('.floorNo').html(bldgMap[floorId].floor + ' floor');
			} else {

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

				var bldg_name = bldgMap[floorId].bldg_name;

				var poiObject = {
					//buildingId: currentBuildingId,
					//floorId: floorId,
					latitude: lat,
					longitude: lon,
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
					partialPath: 'css/icons/ic_building.png',
					collapsedIconLocation: 'URL',
					collapsedIconPartialPath: '/css/icons/ic_building.png',
					ignoreCollision: true,
				};

				createTextIcon(poiObject);

			}
		} catch(err) { console.log(err) }

		try {
			$('.bldgName').html(ambiarc.poiStuff[ambiarcId].bldgName);
		} catch(err) { console.log(err) }

		try {
			$('.floorNo').html(ambiarc.poiStuff[ambiarcId].floorNo + ' floor');
		} catch(err) { console.log(err) }

		try {
			$('.roomName').html(ambiarc.poiStuff[ambiarcId].roomName);
		} catch(err) { console.log(err) }

		try {
			$('.roomName').html(ambiarc.poiStuff[ambiarcId].roomName);
		} catch(err) { console.log(err) }

		var isLegendFilled = $('.bldgName').html();

		//alert('legend = ' + isLegendFilled);

		if (isLegendFilled.length > '4') {
			$('.legend').addClass('showlegend');
		} else {
			$('.legend').removeClass('showlegend');
		}

		// 	ambiarc.legendType = '';
		// 	ambiarc.ambiarcId = '';
		// 	ambiarc.buildingId = '';
		// 	ambiarc.floorId = '';
		// 	ambiarc.roomName = '';
		// 	ambiarc.lat = '';
		// 	ambiarc.lon = '';

	},1000);
}

// capture right click event and do stuff
var onRightMouseDown = function(event) {
	alert('onRightMouseDown');
};

// Callback thats updates the UI after a POI is created
var mapLabelCreatedCallback = function(labelId, labelName, mapLabelInfo) {
	console.log('mapLabelCreatedCallback');
    // push reference of POI to list
    poisInScene.push(labelId);
    mapLabelInfo.mapLabelId = labelId;
    ambiarc.poiList[labelId] = mapLabelInfo;
    addElementToPoiList(labelId, labelName, mapLabelInfo);
};

var focusAfterDataLoad = function(itemId) {
	console.log('focusAfterDataLoad '+itemId);
	if (itemId) {

		try {
			var ambiarc = $("#ambiarcIframe")[0].contentWindow.Ambiarc;
			ambiarc.selectedPoiId = itemId;
			ambiarc.focusOnMapLabel(itemId, 200);
		} catch(err) {
			console.log(err);
		}

		setTimeout(function(){

			ambiarc.legendType = 'menuOther';
			ambiarc.ambiarcId = itemId;
			ambiarc.buildingId = '';
			ambiarc.floorId = '';
			ambiarc.roomName = '';

			popMapLegend();
		},125);

		setTimeout(function(){
			window.doFloorSelected = true;
		}, 3000);
	}
}

// Creates an Text + Icon on the map where the current mouse position is
var createTextIcon = function (mapLabelInfo) {

	console.log(mapLabelInfo);
	console.log('$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$');

	ambiarc = $("#ambiarcIframe")[0].contentWindow.Ambiarc;

// 	var mapLabelInfo = {
// 		buildingId: currentBuildingId,
// 		floorId: currentFloorId,
// 		latitude: parseFloat(latlon.lat),
// 		longitude: parseFloat(latlon.lon),
// 		label: 'Information',
// 		fontSize: 26,
// 		category: 'Label',
// 		location: 'Default',
// 		partialPath: 'Information',
// 		showOnCreation: true,
// 		type: ambiarc.mapLabel.IconWithText,
// 		showToolTip: false,
// 		tooltipTitle: '',
// 		tooltipBody: '',
// 		base64: iconDefault
// 	};

	if(currentBuildingId == undefined){
		mapLabelInfo.outside = true;
	}

	ambiarc.createMapLabel('IconWithText', mapLabelInfo, (labelId) => {
		console.log("****"+labelId)
		//mapLabelCreatedCallback(labelId, mapLabelInfo.label, mapLabelInfo);
	});

};
