 var mainBldgID;
 var isFloorSelectorEnabled = false;
 var floors = {};
 var currentFloorId;
 var MapLabels = {};

//User clicked the floor selector
//var resetMap = function() {

//	var ambiarc = $("#ambiarcIframe")[0].contentWindow.Ambiarc;
//	ambiarc.loadMap("pratt");

	// 	if (isFloorSelectorEnabled) {
	// 		ambiarc.exitBuilding();
	// 	} else {
	// 		ambiarc.viewFloorSelector(mainBldgID,0);
	// 	}

//};

//This method is called when the iframe loads, it subscribes onAmbiarcLoaded so we know when the map loads
var iframeLoaded = function() {
 $("#ambiarcIframe")[0].contentWindow.document.addEventListener('AmbiarcAppInitialized', function() {
   onAmbiarcLoaded();
 });
}

// once Ambiarc is loaded, we can use the ambiarc object to call SDK functions
var onAmbiarcLoaded = function() {

	//alert('onAmbiarcLoaded');

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
	console.log('mapStartedLoading');

	//$("p").off("click");
}

var mapFinishedLoading = function() {

	console.log('mapFinishedLoading');

	// creating objecct where we will store all our points property values
	ambiarc = $("#ambiarcIframe")[0].contentWindow.Ambiarc;

	ambiarc.hideLoadingScreen();

	ambiarc.getAllBuildings(function(buildingsArray){

		console.log('&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&');
		console.log(buildingsArray);
		console.log('&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&');

		////$.each(out, function(k,v){

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
	ambiarc.setMapTheme(ambiarc.mapTheme.light);

	params = {};
	params.fetch = 'first'
	params.bldg = '0024';
	fetchPoisFromApi(params);

	// reactivate reset button after a pause
	setTimeout(function(){
		$('.reset-map').removeAttr('disabled');
	}, 1500);

}//++++++++++++++++++

var fetchPoisFromApi = function(params) {

	$('.showlegend').removeClass('showlegend');

	console.log('fetchPoisFromApi');

	ambiarc = $("#ambiarcIframe")[0].contentWindow.Ambiarc;

	if (typeof poiMap != 'undefined') {
		var list = [];
		for (var i = -1001; i <= 1001; i++) {
			list.push(i);
		}
	}

	if (typeof ambiarc.poiStuff == 'undefined') {
		ambiarc.poiStuff = {};
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

			var itemId = poiMap[params.recordId];
			ambiarc.selectedPoiId = itemId;

			if (typeof itemId != 'undefined' && typeof params.label != 'undefined') {

				if (params.label.length > 3) {
					var obj = {};
					obj.label = params.label;
					obj.clear = 'hide';
					ambiarc.updateMapLabel(itemId, ambiarc.mapLabel.IconWithText, obj);
					ambiarc.labelObj = obj;

					popMapLegend(itemId,true);

				}

			} else {
				console.log(params);
				alert('itemId is undefined');
			}

		} else {
			if (params.fetch != 'first') {
				for(var ambiarcId in ambiarc.poiStuff) {
					popMapLegend(ambiarcId,false);
					break;
				}
			}
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

	console.log('BuildingExitCompleted');
	console.log(event);

	//$('#back-button').hide();
	//clearMapLegend();

}

var onFloorSelected = function(event) {

	console.log('onFloorSelected');
	console.log(event.detail);

	var floorInfo = event.detail;
	currentFloorId = floorInfo.floorId;

	if (doFloorSelected) {

		//$('#back-button').show();
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

	console.log('onEnteredFloorSelector');
	console.log(event);

	var buildingId = event.detail;
	currentFloorId = undefined;
	//$('#back-button').show();
	isFloorSelectorEnabled = true;

	//console.log("Ambiarc received a FloorSelectorEnabled event with a building of " + buildingId);
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

	popMapLegend('',false,event.detail.newFloodId);

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

var clearMapLegend = function() {

	console.log('clearMapLegend');

	$('.bldgName').html('');
	$('.floorNo').html('');
	$('.roomName').html('');

	$('.showlegend').removeClass('showlegend');

}

var popMapLegend = function(ambiarcId='',showRoom=false,floorId='') {

	console.log('popMapLegend');
	console.log( ambiarcId + ' - ' + showRoom + ' - ' + floorId );

	if (ambiarcId != '') {

		console.log(ambiarc.poiStuff[ambiarcId]);

		$('.bldgName').html(ambiarc.poiStuff[ambiarcId].bldgName);
		$('.floorNo').html(ambiarc.poiStuff[ambiarcId].floorNo + ' floor');

		if (showRoom==true) {
			$('.roomName').html(ambiarc.poiStuff[ambiarcId].roomName);
		}

	}

	if (floorId != '') {

		console.log(bldgMap[floorId]);

		$('.bldgName').html(bldgMap[floorId].bldg_name);
		$('.floorNo').html(bldgMap[floorId].floor + ' floor');

	}

	$('.legend').addClass('showlegend');

}

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
	// do stuff when map motion finishes

	clearTimeout(document.launchDestroyer);

	if (event.detail.indexOf('UNTRACKED') != -1) {
		return false;
	}

	destroyOldPoints();

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

var destroyOldPoints = function() {

	document.launchDestroyer = setTimeout(function(){

		return true;

		window.haltLoops = false;

		var ambiarc = $("#ambiarcIframe")[0].contentWindow.Ambiarc;

		console.log('cameraCompletedHandler');
		console.log(event);
		window.doFloorSelected = true;

		var list = [];
		for (var i = -1001; i <= 1001; i++) {
			list.push(i);
		}

		$.each(poiMap, function(k,v){
			var i = list.indexOf(v);
			list.splice(i, 1);
		});

		$.each(list, function(k,v){
			if (haltLoops) {
				return false;
			}
			ambiarc.destroyMapLabel(v);
			ambiarc.hideMapLabel(v,true);
			//console.log('destroy '+v);
		});

	}, 1000);
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

