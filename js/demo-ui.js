 var mainBldgID;
 var isFloorSelectorEnabled = false;
 var floors = {};
 var currentFloorId;
 var MapLabels = {};

//User clicked the floor selector
var resetMap = function() {

	if (isFloorSelectorEnabled) {
		ambiarc.exitBuilding();
	} else {
		ambiarc.viewFloorSelector(mainBldgID,0);
	}

	$('.showlegend').removeClass('showlegend');

	// reactivate reset button after a pause
	setTimeout(function(){
		$('.reset-map').removeAttr('disabled');
		//$('.showlegend').removeClass('showlegend');
	}, 1500);

};

//This method is called when the iframe loads, it subscribes onAmbiarcLoaded so we know when the map loads
var iframeLoaded = function() {
	$("#ambiarcIframe")[0].contentWindow.document.addEventListener('AmbiarcAppInitialized', function() {
		onAmbiarcLoaded();
	});
}

// once Ambiarc is loaded, we can use the ambiarc object to call SDK functions
var onAmbiarcLoaded = function() {

	ambiarc = $("#ambiarcIframe")[0].contentWindow.Ambiarc;

    // Subscribe to various events needed for this application
    ambiarc.registerForEvent(ambiarc.eventLabel.RightMouseDown, onRightMouseDown);
    ambiarc.registerForEvent(ambiarc.eventLabel.FloorSelected, onFloorSelected);
    ambiarc.registerForEvent(ambiarc.eventLabel.FloorSelectorEnabled, onEnteredFloorSelector);
    ambiarc.registerForEvent(ambiarc.eventLabel.FloorSelectorDisabled, onExitedFloorSelector);
    ambiarc.registerForEvent(ambiarc.eventLabel.FloorSelectorFloorFocusChanged, onFloorSelectorFocusChanged);
    ambiarc.registerForEvent(ambiarc.eventLabel.BuildingExitCompleted, BuildingExitCompleted);

    ambiarc.registerForEvent(ambiarc.eventLabel.CameraMotionCompleted, cameraCompletedHandler);
    ambiarc.registerForEvent(ambiarc.eventLabel.CameraMotionStarted, cameraStartedHandler);

    ambiarc.registerForEvent(ambiarc.eventLabel.StartedLoadingMap, mapStartedLoading);
    ambiarc.registerForEvent(ambiarc.eventLabel.FinishedLoadingMap, mapFinishedLoading);

	/// ??? need this ?
	ambiarc.registerForEvent(ambiarc.eventLabel.MapLabelSelected, (event) => {
		adjustMapFocus($("#" + event.detail)[0], event.detail)
	});

    var full = location.protocol+'//'+location.hostname+(location.port ? ':'+location.port: '')+(window.location.pathname ? window.location.pathname.substring(0,window.location.pathname.lastIndexOf("/")) : '');

    //ambiarc.setMapAssetBundleURL(full+'/ambiarc/');
    //ambiarc.loadMap("pratt");

    //var mapFolder = getMapName('map');
    ambiarc.setMapAssetBundleURL('https://s3-us-west-1.amazonaws.com/gk-web-demo/ambiarc/');
    //ambiarc.loadMap(mapFolder);
    ambiarc.loadMap("pratt");

};//-------------

var mapStartedLoading = function() {

	console.log('mapStartedLoading');

	var mode = sessionStorage.getItem('mode');
	if (mode == 'dark') {

		ambiarc.setMapTheme(ambiarc.mapTheme.dark);
		//ambiarc.setEnvironmentLighting('#33333300', '#33333300', '#99000000');
		ambiarc.setSkyColor('#900', '#600');
		ambiarc.setLightColor('#ccc', '#666', '#900');
		setTimeout(function(){
			$('.mode-dark').addClass('show-mode-button');
		}, 500);

	} else {

		ambiarc.setMapTheme(ambiarc.mapTheme.light);
		setTimeout(function(){
			$('.mode-light').addClass('show-mode-button');
		}, 500);

	}

}

var mapFinishedLoading = function() {

	var mode = sessionStorage.getItem('mode');
	if (mode == 'dark') {
		ambiarc.setMapTheme(ambiarc.mapTheme.dark);
		//ambiarc.setEnvironmentLighting('#33333300', '#33333300', '#99000000');
		ambiarc.setSkyColor('#900', '#600');
		ambiarc.setLightColor('#ccc', '#666', '#900');
		setTimeout(function(){
			$('.mode-dark').addClass('show-mode-button');
		}, 1);
		$('.legend').css({'color':'#000'});
	} else {
		ambiarc.setMapTheme(ambiarc.mapTheme.light);
		//ambiarc.setSkyColor('#fff', '#00f');
		setTimeout(function(){
			$('.mode-light').addClass('show-mode-button');
		}, 1);
		$('.legend').css({'color':'#333'});
	}

	console.log('mapFinishedLoading');

	// creating objecct where we will store all our points property values
	ambiarc = $("#ambiarcIframe")[0].contentWindow.Ambiarc;

	ambiarc.hideLoadingScreen();

	ambiarc.getAllBuildings(function(buildingsArray){

		buildingsArray.forEach(function(bldgID, i){
			ambiarc.getBuildingLabelID(bldgID, function(id){
				var poiObject = {};
				poiObject.label = "test";
				poiObject.type = "Icon"
				poiObject.location = "URL"
				poiObject.partialPath = "/icons/ic_expand.png"
				poiObject.collapsedIconPartialPath = "/icons/ic_expand.png"
				poiObject.collapsedIconLocation = "URL"
				poiObject.ignoreCollision = false;
				ambiarc.updateMapLabel(id, ambiarc.mapLabel.Icon, poiObject);
			});
		});
	});

	$('#bootstrap').removeAttr('hidden');
	//$('#back-button').hide();
	//ambiarc.setEnvironmentLighting('#333333', '#333333', '#990000');

	params = {};
	params.fetch = 'first'
	params.bldg = '0019';
	fetchPoisFromApi(params);

	// reactivate reset button after a pause
	setTimeout(function(){
		$('.reset-map').removeAttr('disabled');
	}, 1500);

}

var fetchPoisFromApi = function(params) {

	//$('.showlegend').removeClass('showlegend');

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

	ambiarc.loadRemoteMapLabels(url).then((out) => {

		/// show labels if building exploded
		//ambiarc.EnableAutoShowPOIsOnFloorEnter();

		if (params.fetch == 'all') {
			return true;
		}

		//console.log(out);

		if (out[0].user_properties.recordId.length < '1') {
			console.log(out);
			alert('load from api failed...');
			return true;
		}







		if (typeof ambiarc.poiStuff != 'undefined') {
			$.each(ambiarc.poiStuff, function(k, v) {
				if (typeof v != 'undefined') {
					var aId = v['ambiarcId'];
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
		window.legendInfo = {};

		$.each(out, function(k,v){

			if (typeof v.user_properties.ambiarcId == 'undefined') {



				console.log('undefined undefined undefined undefined undefined');
				console.log(k);
				console.log(v);
				console.log('undefined undefined undefined undefined undefined');
				//alert('id is undefined');
				v.user_properties.ambiarcId = v.properties.mapLabelId;

				// Add the map label to the map
				/*
					ambiarc.createMapLabel(v.properties.type, v.properties, (labelId) => {

						// Callback triggered once the label is added
						//mapLabelCreatedCallback(labelId, mapLabelInfo.label, mapLabelInfo);

						poiMap[v.user_properties.recordId] = v.user_properties.labelId;
						var s = {};
						s['ambiarcId']		= v.user_properties.labelId;
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
						ambiarc.poiStuff[v.user_properties.labelId] = s;

						alert(v.user_properties.recordId + ' - ' + labelId);

					});
				 */


			} else {

				// 	console.log('defined defined defined defined defined');
				// 	console.log(k);
				// 	console.log(v);
				// 	console.log('defined defined defined defined defined');

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

			}
		});

		console.log(poiMap);
		console.log(ambiarc.poiStuff);
		console.log('^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^');
		//return true;

		if (params.fetch == 'first') {
			setupMenuAcademics();
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

				if (params.label.length > 3 && poiMap.length > 1) {
					var obj = {};
					obj.label = params.label;
					obj.clear = 'hide';
					ambiarc.updateMapLabel(itemId, ambiarc.mapLabel.IconWithText, obj);
					ambiarc.labelObj = obj;

					window.legendInfo.ambiarcId = itemId;
					//legendInfo.showRoom = true;
					window.legendInfo.floorId = '';

					//popMapLegend();

				}

			} else {
				console.log(params);
				alert('itemId is undefined');
			}

		} else {
			if (params.fetch != 'first') {
				for(var ambiarcId in ambiarc.poiStuff) {

					window.legendInfo.ambiarcId = ambiarcId;
					//legendInfo.showRoom = false;
					window.legendInfo.floorId = '';

					//popMapLegend();
					break;
				}
			}
		}

		var itemId = poiMap[params.recordId]
		window.legendInfo.ambiarcId = itemId;
		//legendInfo.showRoom = false;
		window.legendInfo.floorId = '';

		console.log('==========================================');
		console.log(params);
		console.log(poiMap);
		console.log(ambiarc.poiStuff);
		console.log('==========================================');
		//alert(itemId);

		if (params.action == 'focusAfterDataLoad') {
			if (focusAfterDataLoad(itemId)) {
				return true;
			}
		}

		if (params.action == 'focusOutdoorPoint') {
			if (ambiarc.showMapLabel(itemId, true)) {
				return true;
			}
		}

	});

	return false;
}

var BuildingExitCompleted = function(event) {

	console.log('BuildingExitCompleted');
	console.log(event);

}

var onFloorSelected = function(event) {

	var floorInfo = event.detail;
	currentFloorId = floorInfo.floorId;

	popMapLegend();

	if (doFloorSelected) {

		isFloorSelectorEnabled = false;

		mainBldgID = floorInfo.buildingId;

		params = {};
		params.bldg = floorInfo.buildingId;
		params.floor = floorInfo.floorId;
		params.select = 'floor';

		if (fetchPoisFromApi(params)) {
			alert('floor selected');
		}
	}
}

var onEnteredFloorSelector = function(event) {

	//alert('onEnteredFloorSelector');
	console.log('onEnteredFloorSelector');
	console.log(event);

	var buildingId = event.detail;
	currentFloorId = undefined;
	//$('#back-button').show();
	isFloorSelectorEnabled = true;

}

var onExitedFloorSelector = function(event) {

	console.log('onExitedFloorSelector');
	console.log(event.detail);

	var buildingId = event.detail;
	currentFloorId = undefined;

	isFloorSelectorEnabled = false;

}

var onFloorSelectorFocusChanged = function(event) {

	//alert('onFloorSelectorFocusChanged');
	console.log('onFloorSelectorFocusChanged');
	console.log(event.detail);

	window.legendInfo.ambiarcId = '';
	//window.legendInfo.showRoom = false;
	window.legendInfo.floorId = event.detail.newFloodId;

	popMapLegend();

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

	$('.bldgName').html('');
	$('.floorNo').html('');
	$('.roomName').html('');

	$('.showlegend').removeClass('showlegend');

}

var popMapLegend = function() {

	var ambiarcId = window.legendInfo.ambiarcId;
	var floorId = window.legendInfo.floorId;

	console.log('popMapLegend');
	console.log( ambiarcId + ' -- ' + floorId );

	try{
		if (ambiarcId != '') {
			$('.bldgName').html(ambiarc.poiStuff[ambiarcId].bldgName);
			$('.floorNo').html(ambiarc.poiStuff[ambiarcId].floorNo + ' floor');
			$('.roomName').html(ambiarc.poiStuff[ambiarcId].roomName);
			$('.legend').addClass('showlegend');
			return true;
		}
	} catch(err) {
		console.log(err);
	}

	try{
		if (ambiarcId == '' && typeof floorId != 'undefined') {
			$('.bldgName').html(bldgMap[floorId].bldg_name);
			$('.legend').addClass('showlegend');
			return true;
		}
	} catch(err) {
		console.log(err);
	}

	try{
		if (floorId != '' && typeof bldgMap[floorId] != 'undefined') {
			$('.bldgName').html(bldgMap[floorId].bldg_name);
			$('.floorNo').html(bldgMap[floorId].floor + ' floor');
			$('.legend').addClass('showlegend');
			return true;
		}
	} catch(err) {
		console.log(err);
	}

}

// capture right click event and do stuff
var onRightMouseDown = function(event) {

	alert('onRightMouseDown');

};

var cameraStartedHandler = function(event){
	// do stuff when map motion begins
	//ambiarc.showMapLabel(ambiarc.selectedPoiId, true);
	//window.doShowHidePoints = true;

	clearTimeout(document.launchDestroyer);

	if (event.detail.indexOf('UNTRACKED') != -1) {
		return false;
	}

	var ambiarc = $("#ambiarcIframe")[0].contentWindow.Ambiarc;
	if (typeof ambiarc.labelObj != 'undefined' && typeof ambiarc.selectedPoiId != 'undefined') {
		console.log('cameraStartedHandler');
		console.log(event);
	}

};

var cameraCompletedHandler = function(event){

	console.log('cameraCompletedHandler');
	console.log(event);

	clearTimeout(document.launchDestroyer);

	if (event.detail.indexOf('UNTRACKED') != -1) {
		return false;
	}

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
	//alert('focusAfterDataLoad '+itemId);
	if (itemId) {
		try {
			var ambiarc = $("#ambiarcIframe")[0].contentWindow.Ambiarc;
			ambiarc.selectedPoiId = itemId;
			ambiarc.focusOnMapLabel(itemId, 200);
		} catch(err) {
			console.log(err);
		}
		setTimeout(function(){
			window.doFloorSelected = true;
		}, 4000);
	}
}

