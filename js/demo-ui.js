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
	params.bldg = 'MH';
	fetchPoisFromApi(params);

}//++++++++++++++++++

var fetchPoisFromApi = function(params) {

	console.log('fetchPoisFromApi');

	ambiarc = $("#ambiarcIframe")[0].contentWindow.Ambiarc;
	//ambiarc.mapStuff = null;

	if (typeof ambiarc.poiStuff == 'undefined') {
		ambiarc.poiStuff = {};
	} else {
		//console.log(ambiarc.mapStuff.length);
		//alert('length');
		//return true;
	}

	if (typeof ambiarc.currentBuilding != 'undefined') {
		if (ambiarc.currentBuilding == params.bldg) {
			console.log('skipping--mapstuff is already set');
			if (params.action == 'focusAfterDataLoad') {
				var itemId = poiMap[params.recordId]
				focusAfterDataLoad(itemId);
			}
			return true;
		}
	}

	var token = $.cookie('token');
	var hash = Math.random().toString(36).substr(2, 5);

	if (typeof params == 'undefined') {
		alert('Error, fetch params not defined.');
		return true;
	}

	var str = '';
	for (var prop in params) {
		str += "&"+prop+"="+params[prop];
	}

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

		if (out[0].user_properties.ambiarcId.length < '1') {
			console.log(out);
			return true;
		}

		ambiarc.poiStuff = null;
		ambiarc.poiStuff = [];
		window.poiMap = {};
		window.deptMap = {};

		$.each(out, function(k,v){

			console.log('out each '+k);

			poiMap[v.user_properties.recordId] = v.user_properties.ambiarcId;
			var s = {};
			s['ambiarcId']		= v.user_properties.ambiarcId;
			s['recordId']		= v.user_properties.recordId;
			s['accessible']		= v.user_properties.accessible;
			s['bldgName']		= v.user_properties.bldgName;
			s['bldgAbbr']		= v.user_properties.bldgAbbr;
			s['gkDisplay']		= v.user_properties.gkDisplay;
			s['gkDepartment']	= v.user_properties.gkDepartment;
			s['latitude']		= v.user_properties.latitude;
			s['longitude']		= v.user_properties.longitude;
			//ambiarc.poiStuff.push(s);
			ambiarc.poiStuff[v.user_properties.ambiarcId] = s;
		});

		console.log(ambiarc.currentBuilding + ' -- ' + params.bldg);
		//console.log(ambiarc.poiStuff);
		//return true;

		if (params.fetch == 'first') {
			//alert('load menus');
			//setupMenuBuildings(out);
			setupMenuAcademics();
			//setupMenuOffices();
			setupMenuFacilities();
			loadKeyboard();
			//window.mapStuff = null;
			//console.log('clear mapStuff');
		} else {
			ambiarc.currentBuilding = params.bldg;
			console.log('set currentBuilding here: ' + ambiarc.currentBuilding);
		}

		if (params.label) {

			console.log('set label '+params.label);

			var itemId = poiMap[params.recordId]

			if (typeof itemId != 'undefined' && typeof params.label != 'undefined') {

				var obj = {};
				obj.label = params.label;

				ambiarc.updateMapLabel(itemId, ambiarc.mapLabel.IconWithText, obj);
				//ambiarc.labelObj = obj;
			} else {
				alert('itemId is undefined');
			}

			console.log('++++++++++++++++++++++++++');
			console.log(ambiarc.poiList);
			console.log(itemId + ' -- ' + params.recordId);
			console.log(params);
			console.log(poiMap);
			console.log(ambiarc.poiStuff[itemId]);
			console.log('++++++++++++++++++++++++++');
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
var onRightMouseDown = function(event) {
	console.log("Ambiarc received a RightMouseDown event");
}

var BuildingExitCompleted = function(event) {
	$('#back-button').hide();
}

var onFloorSelected = function(event) {
 var floorInfo = event.detail;
 currentFloorId = floorInfo.floorId;

   $('#back-button').show();
   isFloorSelectorEnabled = false;

 mainBldgID = floorInfo.buildingId;
 console.log("Ambiarc received a FloorSelected event with a buildingId of " + floorInfo.buildingId + " and a floorId of " + floorInfo.floorId);
}

var onEnteredFloorSelector = function(event) {
 var buildingId = event.detail;
 currentFloorId = undefined;
 $('#back-button').show();
  isFloorSelectorEnabled = true;

 console.log("Ambiarc received a FloorSelectorEnabled event with a building of " + buildingId);
}

var onExitedFloorSelector = function(event) {
 var buildingId = event.detail;
 currentFloorId = undefined;

   isFloorSelectorEnabled = false;
 console.log("Ambiarc received a FloorSelectorEnabled event with a building of " + buildingId);
}

var onFloorSelectorFocusChanged = function(event) {
	console.log("Ambiarc received a FloorSelectorFocusChanged event with a building id of: " + event.detail.buildingId +
	" and a new floorId of " + event.detail.newFloorId + " coming from a floor with the id of " + event.detail.oldFloorId);
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

var cameraStartedHandler = function(){
	// do stuff when map motion begins
};

var cameraCompletedHandler = function(event){
	// do stuff when map motion finishes
	console.log('cameraCompletedHandler');
	console.log(event);

	try {
		var ambiarc = $("#ambiarcIframe")[0].contentWindow.Ambiarc;
		setTimeout(function(){
			for(var item in ambiarc.poiStuff) {
				console.log('cameraCompletedHandler loop');
				var id = ambiarc.poiStuff[item].ambiarcId;
				if (ambiarc.selectedPoiId != id ) {
					ambiarc.hideMapLabel(id, true);
				} else {
					ambiarc.showMapLabel(id, true);
				}
			}

			// 	if (typeof ambiarc.labelObj != 'undefined' ) {
			// 		ambiarc.updateMapLabel(ambiarc.selectedPoiId, ambiarc.mapLabel.IconWithText, ambiarc.labelObj);
			// 	}

		}, 125);
	} catch(err) {
		console.log(err);
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

