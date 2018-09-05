 var mainBldgID;
 var isFloorSelectorEnabled = false;
 var floors = {};
 var currentFloorId;
 var MapLabels = {};

//User clicked the floor selector
var dropdownClicked = function() {
  if(isFloorSelectorEnabled)
  {

   ambiarc.exitBuilding();
   }else{

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

	if (typeof currentBuilding != 'undefined') {
		if (currentBuilding == params.bldg) {
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

	//var url = "http://localhost/~iancampbell/PrattSDK-mod/points_sample.json";

	ambiarc.loadRemoteMapLabels(url).then((out) => {

		/// show labels if building exploded
		ambiarc.EnableAutoShowPOIsOnFloorEnter();

		if (params.fetch == 'all') {
			return true;
		}

		ambiarc.poiStuff = null;

		console.log('new load')
		console.log(url)

		ambiarc.poiStuff = [];

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
			s['gkDisplay']		= v.user_properties.gkDisplay;
			s['gkDepartment']	= v.user_properties.gkDepartment;
			s['latitude']		= v.user_properties.latitude;
			s['longitude']		= v.user_properties.longitude;
			ambiarc.poiStuff.push(s);
		});

		if (params.fetch == 'first') {
			//setupMenuBuildings(out);
			setupMenuAcademics();
			setupMenuOffices();
			setupMenuFacilities();
			loadKeyboard();
			//window.mapStuff = null;
			//console.log('clear mapStuff');
		} else {
			console.log(params);
			window.currentBuilding = params.bldg;
		}

		if (params.action == 'focusAfterDataLoad') {
			var itemId = poiMap[params.recordId]
			focusAfterDataLoad(itemId);
		}

		if (params.action == 'doFocusAfterFetch') {
			doFocusAfterFetch(params);
		}

		if (params.action == 'lookupBuilding') {
			lookupBuilding(params);
		}

	});

	return true;
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
  ambiarc.zoomCamera(-0.2, 0.3);

};
var zoomInHandler = function(){

 var ambiarc = $("#ambiarcIframe")[0].contentWindow.Ambiarc;
 ambiarc.zoomCamera(0.2, 0.3);
};

 /// added functions /////////////////////////////////////////////////////////////////////

 var cameraCompletedHandler = function(event){

    console.log("camera completed handler!");
    console.log(event);

    try{
		var ambiarc = $("#ambiarcIframe")[0].contentWindow.Ambiarc;
		setTimeout(function(){
			for(var item in ambiarc.poiStuff) {
				var id = ambiarc.poiStuff[item].recordId;
				ambiarc.hideMapLabel(id, true);
			}
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
    // push reference of POI to list
    poisInScene.push(labelId);
    mapLabelInfo.mapLabelId = labelId;
    ambiarc.poiList[labelId] = mapLabelInfo;
    addElementToPoiList(labelId, labelName, mapLabelInfo);
};

var destroyAllLabels = function(){

	console.log('destroyAllLabels');

	var ambiarc = $("#ambiarcIframe")[0].contentWindow.Ambiarc;

	//$.each(ambiarc.poiList, function(MapLabelID, a){
	$.each(ambiarc.mapStuff, function(MapLabelID, a){
		console.log(MapLabelID);
		console.log(a);
		ambiarc.destroyMapLabel(parseInt(MapLabelID));
	});

	return true;
};

var hideInactivePoints = function(immediate=true, currentLabelId) {

	var ambiarc = $("#ambiarcIframe")[0].contentWindow.Ambiarc;

	if(!immediate) {
		var immediate = false;
	}

	// 	console.log('one');
	// 	console.log(ambiarc.poiList);
	// 	console.log('two');
	//
	// 	ambiarc.poiList = mapStuff;
	//
	// 	console.log('three');
	// 	console.log(ambiarc.poiList);
	// 	console.log('four');
	//
	// 	$.each(ambiarc.poiList, function(id, obj){
	//         if(id != currentLabelId) {
	//             ambiarc.hideMapLabel(id, immediate);
	//         } else {
	//             if(obj.floorId == currentFloorId){
	//                 ambiarc.showMapLabel(id, immediate)
	//             }
	//         }
	// 	});
	//
	//     if(ambiarc.poiList[currentLabelId].floorId !== currentFloorId){
	//         ambiarc.hideMapLabel(currentLabelId);
	//     } else {
	//         ambiarc.showMapLabel(currentLabelId);
	//     }

// 	$.each(mapStuff, function(id, obj){
//         if(id != currentLabelId) {
//
//         	//console.log('hide this label');
//         	//console.log(mapStuff[id]);
//
//             ambiarc.hideMapLabel(id, immediate);
//         } else {
//             if(obj.floorId == currentFloorId){
//                 ambiarc.showMapLabel(id, immediate)
//             }
//         }
// 	});

	console.log(currentLabelId);

};

var focusAfterDataLoad = function(itemId) {

		console.log('focusAfterDataLoad '+itemId);

		if (itemId) {

			try {

				var ambiarc = $("#ambiarcIframe")[0].contentWindow.Ambiarc;
				ambiarc.focusOnMapLabel(itemId, 200);

// TODO need to handle sculpture paths

// 		if ($(this).hasClass('hasImg')) {
// 			doPoiImage(itemId);
// 		} else {
// 			$('.poi-box').remove();
// 		}
// 		$(this).addClass('seen').siblings().removeClass('active');

			} catch(err) {
				console.log(err);
			}
		}
	}

