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
 window.poiMap			= {};
 window.prattCopy		= [];
 window.legendDelay		= 2000;
 window.rangePoi		= range(-1000,1000);
 window.trackPoi		= [];
 window.mapIsParked		= true;
 window.allowFullView	= false;


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
		console.log(ret);
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

	console.log('resetMap');

	//ambiarc.ExitOverheadCamera();

	console.log('isFloorSelectorEnabled ' + isFloorSelectorEnabled);

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
	console.log('fullMapView');
	//ambiarc.ExitOverheadCamera();
	//$('.reset-map').removeAttr('disabled');
	var lat = 40.689666;
	var lon = -73.963883;
	ambiarc.focusOnLatLonAndZoomToHeight('', '', lat, lon, '400');
	if (rotationOld != '0') {
		if (rotationOld != rotation) {
			var rotationNeutral = -1 * Number(rotationOld);
			ambiarc.rotateCamera(rotationNeutral, 0);
			var delay = 1500;
		}
		rotationOld = '0';
	}
	mapIsParked = true;
	$('.reset-map-vert').addClass('disabled');
}

var justZoomOut = function() {
	console.log('justZoomOut');
	//ambiarc.ExitOverheadCamera();
	$('.reset-map').removeAttr('disabled');
	ambiarc.focusOnLatLonAndZoomToHeight('', '', lat, lon, '400');
}

//This method is called when the iframe loads, it subscribes onAmbiarcLoaded so we know when the map loads
var iframeLoaded = function() {
	$("#ambiarcIframe")[0].contentWindow.document.addEventListener('AmbiarcAppInitialized', function() {
		onAmbiarcLoaded();
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

	clearMapLegend();

	// 	if (params.action == 'doAccessibilityThing') {
	// 		ambiarc.EnterOverheadCamera();
	// 	} else {
	// 		ambiarc.ExitOverheadCamera();
	// 	}

	var ambiarc = $("#ambiarcIframe")[0].contentWindow.Ambiarc;

	if (typeof ambiarc.recordId != 'undefined') {
		if (ambiarc.recordId > '1') {
			params.recordId = ambiarc.recordId;
			ambiarc.legendType = 'menuOther';
		}
	}

	/// destroy old labels
	if (typeof ambiarc.poiStuff != 'undefined') {
		$.each(ambiarc.poiStuff, function(k, v) {
			if (typeof v != 'undefined') {
				var aId = v['ambiarcId'];
				ambiarc.destroyMapLabel(aId);
			}
			delete ambiarc.poiStuff[k];
		});
	}

	/// hide any that haven't been destoyed
	if (typeof poiMap != 'undefined') {
		//ambiarc.hideMapLabelGroup(poiMap, true);
		$.each(poiMap, function(k, v) {
			if (typeof v != 'undefined') {
				//ambiarc.hideMapLabel(v, true);
				ambiarc.destroyMapLabel(v);
			}
		});
	}

	console.log('fetchPoisFromApi');

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

	console.log('==========================================');
	try { console.log('params');console.log(params); } catch(err) { console.log(err) }
	try { console.log('poiMap');console.log(poiMap); } catch(err) { console.log(err) }
	//try { console.log(deptMap) } catch(err) { console.log(err) }
	try { console.log('bldgMap');console.log(bldgMap); } catch(err) { console.log(err) }
	try { console.log('hallMap');console.log(hallMap); } catch(err) { console.log(err) }
	try { console.log('ambiarc.poiStuff');console.log(ambiarc.poiStuff); } catch(err) { console.log(err) }
	console.log('==========================================');
	//alert(itemId);

	ambiarc.loadRemoteMapLabels(url).then((out) => {

		/// show labels if building exploded
		//ambiarc.EnableAutoShowPOIsOnFloorEnter();

		if (params.fetch == 'all') {
			return true;
		}

		if (typeof out == 'undefined') {
			console.log('load from api failed...');
			return true;
		}

		// 	if (typeof poiMap != 'undefined') {
		// 		$.each(poiMap, function(k, v){
		// 			delete poiMap[k];
		// 		});
		// 	}

		if (typeof poiMap == 'undefined') {

		}

		ambiarc.poiStuff = [];
		ambiarc.labelObj = {};
		//window.deptMap = {};

		window.keepId = '';

		$.each(out, function(k,v){
			if (typeof v.user_properties.ambiarcId == 'undefined') {
				///
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

		//var poiArr = Object.values(poiMap);
		//$('.track').html('POIs '+poiArr.join(','));

		processAndRun();

	});
	return false;
}

var processAndRun = function() {

	console.log('processAndRun');
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

	var itemId = poiMap[params.recordId];

	if (params.action == 'focusAfterDataLoad') {

		var legendType	= ambiarc.legendType;
		var ambiarcId	= ambiarc.ambiarcId;
		var buildingId	= ambiarc.buildingId;
		var floorId		= ambiarc.floorId;
		var roomName	= ambiarc.roomName;
		var lat = ambiarc.lat;
		var lon = ambiarc.lon;


		/// testing heatmap stuff
		if (lat == '') {
			lat = ambiarc.poiStuff[itemId].latitude;
			lon = ambiarc.poiStuff[itemId].longitude;
		}
		var arr = [lat,lon,0.5,1];
		ambiarc.createHeatmap(arr);
		/// testing heatmap stuff


		setTimeout(function(){

			try {
				//alert(roomName);
				if (itemId != '' && roomName != '') {
					var obj = {};
					obj.label = roomName;
					//obj.showOnCreation = true;
					//alert('1');
					try {
						ambiarc.updateMapLabel(itemId, 'IconWithText', obj);
					} catch(err) { console.log(err) }
				}
				if (itemId != '') {
					//alert('2');
					focusAfterDataLoad(itemId);
				}
			} catch(err) { console.log(err) }

		},125);
	}

	// 	if (params.action == 'focusAfterDataLoad') {
	// 		if (focusAfterDataLoad(itemId)) {
	// 			return true;
	// 		}
	// 	}

	if (params.action == 'focusOutdoorPoint') {
		ambiarc.showMapLabel(itemId, true);
		popMapLegend(2000,'demo.js 445');
	}

	if (params.action == 'showFloorInfo') {
		setTimeout(function(){
			popMapLegend();
		},1);
	}

	if (params.action == 'doAccessibilityThing') {

		//alert('doAccessibilityThing');

		//ambiarc.hideMapLabelGroup(poiMap, true);

		var delay = 500;

		if (rotationOld != '0') {
			if (rotationOld != rotation) {
				var rotationNeutral = -1 * Number(rotationOld);
				ambiarc.rotateCamera(rotationNeutral, 0);
				var delay = 1500;
			}
			//rotationOld = '0';
		}

		console.log('@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@');
		console.log('rotation ' + rotation);
		console.log('rotationOld ' + rotationOld);
		console.log('rotationNeutral ' + rotationNeutral);
		//console.log('rotationNew ' + rotationNew);
		console.log('@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@');

		setTimeout(function(){

			//resetMap();
			try {
				if (keepId) {
					params.lat = ambiarc.poiStuff[keepId].latitude;
					params.lon = ambiarc.poiStuff[keepId].longitude;
				}
			} catch(err) { console.log(err) }

			console.log(ambiarc.poiStuff[keepId]);
			console.log(params);
			console.log('accessibility ' + keepId);

			//ambiarc.focusOnLatLonAndZoomToHeight(params.bldg, '', params.lat, params.lon, params.heightAboveFloor);
			ambiarc.focusOnLatLonAndZoomToHeight('', '', params.lat, params.lon, params.heightAboveFloor);

			var obj = {};
			obj.label = 'Accessible Entrance';
			obj.showOnCreation = true;
			obj.ignoreCollision = true;
			ambiarc.updateMapLabel(keepId, 'IconWithText', obj);

			setTimeout(function(){
				ambiarc.showMapLabel(keepId, true);
				popMapLegend(2000,'demo.js 503');

				setTimeout(function(){
					if (rotationOld != rotation) {
						ambiarc.rotateCamera(rotation, 0);
						rotationOld = rotation;
					}
				},1000);

			},125);

		},delay);
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

	console.log(bldgMap);

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
	console.log('mapLabelCreatedCallback');
    // push reference of POI to list
    poisInScene.push(labelId);
    mapLabelInfo.mapLabelId = labelId;
    ambiarc.poiList[labelId] = mapLabelInfo;
    addElementToPoiList(labelId, labelName, mapLabelInfo);
};

var focusAfterDataLoad = function(itemId) {

	if (typeof itemId != 'undefined') {

		console.log('focusAfterDataLoad '+itemId);

		//var ambiarc = $("#ambiarcIframe")[0].contentWindow.Ambiarc;
		//ambiarc.hideMapLabelGroup(poiMap, true);

		if (itemId) {

			try {
				ambiarc.selectedPoiId = itemId;
				ambiarc.focusOnMapLabel(itemId, 200);
			} catch(err) {
				console.log(err);
			}

			try {
				//setTimeout(function(){
					ambiarc.legendType = 'menuOther';
					ambiarc.ambiarcId = itemId;
					//ambiarc.buildingId = '';
					//ambiarc.floorId = '';
					//ambiarc.roomName = '';
					//alert('this one');
					popMapLegend(2000,'demo.js 861');
				//},125);
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
		}
	}
}

// Creates an Text + Icon on the map where the current mouse position is
var createTextIcon = function (mapLabelInfo) {

	//alert('createTextIcon');

	console.log(mapLabelInfo);
	console.log('$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$');

	ambiarc = $("#ambiarcIframe")[0].contentWindow.Ambiarc;

	if(currentBuildingId == undefined){
		mapLabelInfo.outside = true;
	}

	ambiarc.createMapLabel('IconWithText', mapLabelInfo, (labelId) => {

		console.log("**** "+labelId);

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




