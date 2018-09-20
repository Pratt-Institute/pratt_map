 var mainBldgID;
 var isFloorSelectorEnabled = false;
 var floors = {};
 var currentFloorId;
 var MapLabels = {};

//User clicked the floor selector
var dropdownClicked = function() {
	if (isFloorSelectorEnabled) {
		ambiarc.exitBuilding();
	} else {
		ambiarc.viewFloorSelector(mainBldgID,0);
	}
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

    ambiarc.setMapAssetBundleURL(full+'/ambiarc/');
    ambiarc.loadMap("pratt");

};//-------------

var mapStartedLoading = function() {

}

var mapFinishedLoading = function() {

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
	$('#back-button').hide();
	ambiarc.setMapTheme(ambiarc.mapTheme.light);

	params = {};
	params.fetch = 'first'
	params.bldg = '0024';
	fetchPoisFromApi(params);

}//++++++++++++++++++

var fetchPoisFromApi = function(params) {

	console.log('fetchPoisFromApi');

	ambiarc = $("#ambiarcIframe")[0].contentWindow.Ambiarc;
	//ambiarc.mapStuff = null;

	if (typeof poiMap != 'undefined') {

		// 	$.each(poiMap, function(k,v){
		// 		if (typeof v != 'undefined') {
		// 			console.log('destroy '+v);
		// 			//ambiarc.hideMapLabel(v,true);
		// 			ambiarc.destroyMapLabel(v);
		// 		}
		// 	});

		var list = [];
		for (var i = -1001; i <= 1001; i++) {
			list.push(i);
		}

		$.each(list, function(k,v){
			ambiarc.destroyMapLabel(v);
			ambiarc.hideMapLabel(v,true);
			//console.log('destroy '+v);
		});

	}

	if (typeof ambiarc.poiStuff == 'undefined') {
		ambiarc.poiStuff = {};
	} else {
		//console.log(ambiarc.mapStuff.length);
		//alert('length');
		//return true;
	}

// 	if (typeof ambiarc.currentBuilding != 'undefined') {
// 		if (ambiarc.currentBuilding == params.bldg && params.bldg != 'SG') {
// 			console.log('skipping--mapstuff is already set');
// 			if (params.action == 'focusAfterDataLoad') {
// 				var itemId = poiMap[params.recordId]
// 				focusAfterDataLoad(itemId);
// 			}
// 			return true;
// 		}
// 	}

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

	//var url = "http://localhost/~iancampbell/PrattSDK-mod/points_sample.json";

	ambiarc.loadRemoteMapLabels(url).then((out) => {

		/// show labels if building exploded
		ambiarc.EnableAutoShowPOIsOnFloorEnter();

		if (params.fetch == 'all') {
			return true;
		}

		console.log(out);

		if (out[0].user_properties.recordId.length < '1') {
			console.log(out);
			return true;
		}

		ambiarc.poiStuff = null;
		ambiarc.poiStuff = [];
		ambiarc.labelObj = {};
		window.poiMap = {};
		window.deptMap = {};

		$.each(out, function(k,v){

			// 	console.log('out each '+k);
			// 	if (typeof v.user_properties.ambiarcId == 'undefined') {
			// 		console.log(v);
			// 	}

			poiMap[v.user_properties.recordId] = v.user_properties.ambiarcId;
			var s = {};
			s['ambiarcId']		= v.user_properties.ambiarcId;
			s['recordId']		= v.user_properties.recordId;
			s['accessible']		= v.user_properties.accessible;
			s['bldgName']		= v.user_properties.bldgName;
			s['bldgAbbr']		= v.user_properties.bldgAbbr;
			s['gkDisplay']		= v.user_properties.gkDisplay;
			s['gkDepartment']	= v.user_properties.gkDepartment;
			s['latitude']		= v.geometry.coordinates[1];
			s['longitude']		= v.geometry.coordinates[0];
			//ambiarc.poiStuff.push(s);
			ambiarc.poiStuff[v.user_properties.ambiarcId] = s;
		});

		//console.log(ambiarc.currentBuilding + ' -- ' + params.bldg);
		//console.log(ambiarc.poiStuff);
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
			//console.log('set label '+params.label);

			var itemId = poiMap[params.recordId];
			ambiarc.selectedPoiId = itemId;

			//alert(itemId + ' -- ' + params.label);

			if (typeof itemId != 'undefined' && typeof params.label != 'undefined') {

				if (params.label.length > 3) {
					var obj = {};
					obj.label = params.label;
					obj.clear = 'hide';
					ambiarc.updateMapLabel(itemId, ambiarc.mapLabel.IconWithText, obj);
					ambiarc.labelObj = obj;
				}

			} else {
				console.log(params);
				alert('itemId is undefined');
			}

			// 	console.log('++++++++++++++++++++++++++');
			// 	console.log(ambiarc.poiList);
			// 	console.log(itemId + ' -- ' + params.recordId);
			// 	console.log(params);
			// 	console.log(poiMap);
			// 	console.log(ambiarc.poiStuff[itemId]);
			// 	console.log('++++++++++++++++++++++++++');
		}

		if (params.action == 'focusAfterDataLoad') {
			var itemId = poiMap[params.recordId]
			if (focusAfterDataLoad(itemId)) {
				return true;
			}
		}

	});

	return false;
}

//Event callback handlers
// var onRightMouseDown = function(event) {
// 	console.log("Ambiarc received a RightMouseDown event");
// }

var BuildingExitCompleted = function(event) {
	$('#back-button').hide();
}

var onFloorSelected = function(event) {

	console.log('onFloorSelected');
	console.log(event.detail);

	var floorInfo = event.detail;
	currentFloorId = floorInfo.floorId;

	if (doFloorSelected) {

		$('#back-button').show();
		isFloorSelectorEnabled = false;

		mainBldgID = floorInfo.buildingId;

		params = {};
		params.bldg = floorInfo.buildingId;
		params.floor = floorInfo.floorId;
		params.select = 'floor';
		//params.action = 'focusAfterDataLoad';

		console.log(params);

		if (fetchPoisFromApi(params)) {
			alert('floor selected');
		}

	}

}

var onEnteredFloorSelector = function(event) {
	var buildingId = event.detail;
	currentFloorId = undefined;
	$('#back-button').show();
	isFloorSelectorEnabled = true;

	console.log("Ambiarc received a FloorSelectorEnabled event with a building of " + buildingId);
}

var onExitedFloorSelector = function(event) {

	console.log('onExitedFloorSelector');
	console.log(event.detail);

	var buildingId = event.detail;
	currentFloorId = undefined;

	isFloorSelectorEnabled = false;
}

var onFloorSelectorFocusChanged = function(event) {

	console.log('onFloorSelectorFocusChanged');
	console.log(event.detail);

	// 	params = {};
	// 	params.bldg = event.detail.buildingId;
	// 	//params.floor = event.detail.newFloorId;
	// 	params.floor = event.detail.newFloodId; /// TODO keep an eye on this typo
	// 	//params.action = 'focusAfterDataLoad';
	//
	// 	console.log(params);
	//
	// 	if (fetchPoisFromApi(params)) {
	// 		alert('floor focus changed');
	// 	}

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

// capture right click event and do stuff
var onRightMouseDown = function(event) {

// 	console.log('onRightMouseDown');
// 	console.log(event);
//
// 	var ambiarc = $("#ambiarcIframe")[0].contentWindow.Ambiarc;
// 	ambiarc.getMapPositionAtCursor(ambiarc.coordType.gps,function(res){
//
// 		console.log(res);
// 		alert('getMapPositionAtCursor');
//
// 	});

	//     if(isFloorSelectorEnabled){
	//         return;
	//     }
	//
	//     $(poiMenuSelector).css('top', $(window).height() - event.detail.pixelY + "px");
	//     $(poiMenuSelector).css('left', event.detail.pixelX + "px");
	//
	//     if(currentLabelId){
	//         repositionLabel();
	//         return;
	//     }
	//
	//     $('#bootstrap').trigger('contextmenu');
	//     console.log("Ambiarc received a RightMouseDown event");
};

var cameraStartedHandler = function(event){
	// do stuff when map motion begins
	//ambiarc.showMapLabel(ambiarc.selectedPoiId, true);
	//window.doShowHidePoints = true;

	clearTimeout(document.startShowHide);

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
	// do stuff when map motion finishes

	clearTimeout(document.startShowHide);

	if (event.detail.indexOf('UNTRACKED') != -1) {
		return false;
	}

	if (typeof ambiarc.labelObj != 'undefined' && typeof ambiarc.selectedPoiId != 'undefined') {
		doShowHidePoints();
	}

	//     if(currentFloorId == null){
	//         $('#bldg-floor-select').val('Exterior');
	//     }
	//     else {
	//         $('#bldg-floor-select').val(currentBuildingId+'::'+currentFloorId);
	//     }
	//
	//     if(event.detail == -1) {
	//         return;
	//     }
	//
	//     // listening for exterior camera movement
	//     if(event.detail == 1000){
	//         ambiarc.focusOnFloor(mainBldgID, null, 300);
	//         currentFloorId = null;
	//         $('#bldg-floor-select').val('Exterior');
	//         visibilityHandler();
	//         return;
	//     }
	//
	//     //listening for focusing on exterior point camera movement
	//     else if(event.detail == 100){
	//         $('#bldg-floor-select').val('Exterior');
	//         showPoiDetails();
	//         visibilityHandler();
	//     }
	//
	//     //focus on maplabel completed!!
	//     else if(event.detail == 200){
	//         showPoiDetails();
	//         visibilityHandler();
	//     }

};

var doShowHidePoints = function() {

	document.startShowHide = setTimeout(function(){

		var ambiarc = $("#ambiarcIframe")[0].contentWindow.Ambiarc;

		if (typeof ambiarc.labelObj != 'undefined' && typeof ambiarc.selectedPoiId != 'undefined') {

			if (ambiarc.labelObj.clear == 'hide') {

				console.log('cameraCompletedHandler');
				console.log(event);

				for(var item in ambiarc.poiStuff) {
					console.log('cameraCompletedHandler loop');
					var id = ambiarc.poiStuff[item].ambiarcId;

					if (typeof ambiarc.selectedPoiId == 'undefined') {
						break;
					}

					if (ambiarc.selectedPoiId != id) {
						//alert('hide  ' + ambiarc.selectedPoiId + ' -- ' + id);
						ambiarc.hideMapLabel(id, true);
					} else {
						//alert('show  ' + ambiarc.selectedPoiId + ' -- ' + id);
						//ambiarc.showMapLabel(id, false);
					}
				}

				console.log(ambiarc.selectedPoiId + ' -- ' + ambiarc.labelObj.label)
				//ambiarc.updateMapLabel(ambiarc.selectedPoiId, ambiarc.mapLabel.IconWithText, ambiarc.labelObj);
				setTimeout(function(){
					console.log(ambiarc.selectedPoiId + ' -- ' + ambiarc.labelObj.label)
					//ambiarc.updateMapLabel(ambiarc.selectedPoiId, ambiarc.mapLabel.IconWithText, ambiarc.labelObj);
					ambiarc.showMapLabel(ambiarc.selectedPoiId, true);

					window.doFloorSelected = true;

				}, 250);

			}
		} else {
			console.log('id or label is not set');
		}

	}, 250);

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

var destroyAllLabels = function(){

	console.log('destroyAllLabels');
	return true;

	// 	var ambiarc = $("#ambiarcIframe")[0].contentWindow.Ambiarc;
	//
	// 	//$.each(ambiarc.poiList, function(MapLabelID, a){
	// 	$.each(ambiarc.poiStuff, function(MapLabelID, a){
	//
	// 		console.log('destroyAllLabels');
	//
	// 		console.log(MapLabelID);
	// 		console.log(a);
	// 		ambiarc.destroyMapLabel(parseInt(MapLabelID));
	// 	});
	//
	// 	return true;
};

var hideInactivePoints = function(immediate=true, currentLabelId) {

	console.log('hideInactivePoints');
	return true;

	// 	var ambiarc = $("#ambiarcIframe")[0].contentWindow.Ambiarc;
	//
	// 	if(!immediate) {
	// 		var immediate = false;
	// 	}
	//
	// 	$.each(ambiarc.poiStuff, function(id, obj){
	//
	// 		console.log('hideInactivePoints loop');
	//
	//         if (obj.ambiarcId != currentLabelId) {
	//         	//console.log('hide this label');
	//         	//console.log(mapStuff[id]);
	//             ambiarc.hideMapLabel(obj.ambiarcId, immediate);
	//         } else {
	//            // if(obj.floorId == currentFloorId){
	//                 ambiarc.showMapLabel(obj.ambiarcId, immediate)
	//            // }
	//         }
	// 	});
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
	}
}

