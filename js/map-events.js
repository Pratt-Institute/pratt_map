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

	ambiarc.registerForEvent(ambiarc.eventLabel.MapLabelSelected, mapLabelSelected);

	ambiarc.registerForEvent(ambiarc.eventLabel.MapLabelSelected, mapLabelClickHandler);

	runMapLoad();

};

var mapLabelSelected = function(e) {

	///console.log('mapLabelSelected');
	///console.log(e);
	///console.log(e.detail);

	adjustMapFocus($("#" + e.detail)[0], e.detail);

	currentLabelId = e.detail;

}

var mapLabelClickHandler = function(e) {

    console.log('mapLabelClickHandler');
	///console.log(e);
	///console.log(e.detail);
	///console.log(ambiarc.poiStuff[e.detail]);

	currentLabelId = e.detail;

	//resetMenus();
	hidePopMap();

// 	try {
// 		params = {};
// 		params.floor	= ambiarc.poiStuff[e.detail].floorId;
// 		params.recordId	= ambiarc.poiStuff[e.detail].recordId;
// 		params.action	= 'focusAfterDataLoad';
// 		ambiarc.recordId = ambiarc.poiStuff[e.detail].recordId;
// 		ambiarc.floorId = ambiarc.poiStuff[e.detail].floorId;
// 	} catch(err) {
// 		///console.log(err)
// 		params = false;
// 	}
//
// 	if (params) {
// 		clearMapLegend('events 62');
// 		ambiarc.menuAction = 'yes';
// 		fetchPoisFromApi(params);
// 	}

};

// capture right click event and do stuff
var onRightMouseDown = function(event) {

	///console.log('onRightMouseDown');

	//if(isFloorSelectorEnabled){
    //    return;
    //}

	//$(poiMenuSelector).css('top', $(window).height() - event.detail.pixelY + "px");
	//$(poiMenuSelector).css('left', event.detail.pixelX + "px");

    //if (currentLabelId){
     //   repositionLabel(currentLabelId);
     //   return;
    //}

    ambiarc.getMapPositionAtCursor(ambiarc.coordType.gps, (latlon) => {

    	console.log('lat and long ');
    	console.log(latlon);

    });

    //$('#bootstrap').trigger('contextmenu');
    //console.log("Ambiarc received a RightMouseDown event");

};

var runMapLoad = function() {

	var ambiarc = $("#ambiarcIframe")[0].contentWindow.Ambiarc;

    var full = location.protocol+'//'+location.hostname+(location.port ? ':'+location.port: '')+(window.location.pathname ? window.location.pathname.substring(0,window.location.pathname.lastIndexOf("/")) : '');
    ambiarc.setMapAssetBundleURL(full+'/ambiarc/');
    //ambiarc.loadMap("pratt");
    //var mapFolder = getMapName('map');
   // ambiarc.setMapAssetBundleURL('https://s3-us-west-1.amazonaws.com/gk-web-demo/ambiarc/');
    //ambiarc.loadMap(mapFolder);
    ambiarc.loadMap("pratt");

}

var mapStartedLoading = function() {

//	alert('mapStartedLoading');

// 	///console.log('mapStartedLoading');
// 	var mode = sessionStorage.getItem('mode');
// 	if (mode == 'dark') {
// 		ambiarc.setMapTheme(ambiarc.mapTheme.dark);
// 		//ambiarc.setEnvironmentLighting('#33333300', '#33333300', '#99000000');
// 		ambiarc.setSkyColor('#900', '#600');
// 		ambiarc.setLightColor('#ccc', '#666', '#900');
// 		setTimeout(function(){
// 			$('.mode-dark').addClass('show-mode-button');
// 		}, 500);
// 	} else {
// 		ambiarc.setMapTheme(ambiarc.mapTheme.light);
// 		setTimeout(function(){
// 			$('.mode-light').addClass('show-mode-button');
// 		}, 500);
// 	}

	//alert('custom theme');
	//ambiarc.setMapTheme(ambiarc.mapTheme.custom);
 	//ambiarc.setSkyColor('#FF0000', '#660000');
 	//ambiarc.setLightColor('#cccccc', '#666666', '#990000');

}

var mapFinishedLoading = function() {

	//currentMapStatus = 'mapFinishedLoading';

	loadUiFunctions();

	//alert('mapFinishedLoading?');

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
		ambiarc.setMapTheme(ambiarc.mapTheme.custom);
		ambiarc.setSkyColor('#0090d0', '#00567c');
		setTimeout(function(){
			$('.mode-light').addClass('show-mode-button');
		}, 1);
		$('.legend').css({'color':'#333'});
	}
	///console.log('mapFinishedLoading');
	createCampusLabels();
	$('#bootstrap').removeAttr('hidden');

	$('#back-button').hide();
	$('.reset-map').removeClass('reset-show');

	//ambiarc.setEnvironmentLighting('#333333', '#333333', '#990000');

	params = {};
	params.fetch = 'first'
	params.bldg = '0019';
	fetchPoisFromApi(params);

	// reactivate reset button after a pause
	setTimeout(function(){
		fullMapView()
	}, 250);

	$('.menu-open').show();
	$('.veil').show();

}

var BuildingExitCompleted = function(event) {

	//currentMapStatus = 'BuildingExitCompleted';

	allowFullView = true;
	//unDisableReset();

	//clearMapLegend('events 187');

	//alert('BuildingExitCompleted'); // auto

	console.log('BuildingExitCompleted');
	console.log(event);

	//clearMapLegend('event 196');

	currentFloorId = undefined;
	currentBldgID = undefined;

	$('#back-button').hide();
	$('.reset-map').removeClass('reset-show');

	//allowFloorEvent = true

}

var onFloorSelected = function(event) {

	clearTimeout(timeoutVariables);

	//currentMapStatus = 'onFloorSelected';

	$('.reset-map-vert').removeClass('disabled');

	doPauseTour();

	///console.log('onFloorSelected');

	//console.log('onFloorSelected');
	///console.log(event);
	var floorInfo = event.detail;
	currentFloorId = floorInfo.floorId;
	currentBldgID = floorInfo.buildingId;

	if (allowFloorEvent) {
		if (currentFloorId.length > '1') {
			ambiarc.floorId = event.detail.floorId;
		}
		if (currentBldgID.length > '1') {
			ambiarc.buildingId = event.detail.buildingId;
		}
	}

	if (event.type == 'FloorSelected') {

		//alert(event.type);
		//alert('onFloorSelected');

//		ambiarc = $("#ambiarcIframe")[0].contentWindow.Ambiarc;
		//alert('228 '+ambiarc.menuAction);
		if (ambiarc.menuAction != 'yes') {
//			ambiarc.buildingId = event.detail.buildingId;
//			ambiarc.floorId = event.detail.floorId; //alert('onFloorSelected events 229');
			//alert(ambiarc.floorId);
		}

		//window.legendInfo.buildingId = event.detail.buildingId;
		//window.legendInfo.floorId = event.detail.floorId;
	}

	isFloorSelectorEnabled = false;

	currentMapStatus = 'isFloorSelectorEnabled = false';

	mainBldgID = floorInfo.buildingId;

}

var onEnteredFloorSelector = function(event) {

	clearRoomInfo();

	//clearTimeout(timeoutVariables);

	//currentMapStatus = 'onEnteredFloorSelector';

	$('.reset-map-vert').removeClass('disabled');

	doPauseTour();

	console.log('onEnteredFloorSelector');
	console.log(event);

	var buildingId = event.detail;
	currentFloorId = undefined;
	currentBldgID = buildingId;
	//$('#back-button').show();
	isFloorSelectorEnabled = true;

	currentMapStatus = 'isFloorSelectorEnabled = true';

	///console.log('onEnteredFloorSelector 267 '+ambiarc.menuAction);

	if (allowFloorEvent) {
		ambiarc.buildingId = buildingId;
		//ambiarc.floorId = '';
		popMapLegend2();
	}

//	if (ambiarc.menuAction != 'yes') {
//		ambiarc.floorId = ''; //alert('onEnteredFloorSelector events 267');
//		///console.log(ambiarc.floorId);
//	}
	//try { clearTimeout(document.scheduleLegend) } catch(err) { }

	///console.log('popMapLegend legendtype: ' + ambiarc.legendType);

	if (ambiarc.legendType == 'menuBuildingAccessibility') {
		return;
	}
	if (ambiarc.legendType == 'menuOther') {
		return;
	}
	if (ambiarc.action == 'showFloorInfo') {

	}

}

var onExitedFloorSelector = function(event) {

	doPauseTour();

	console.log('onExitedFloorSelector');
	console.log(event.detail);

	var buildingId = event.detail;
	currentFloorId = undefined;
	buildingId = undefined; /// from the new SDK looks wrong but we'll try it

	isFloorSelectorEnabled = false;

}

var onFloorSelectorFocusChanged = function(event) {

	doPauseTour();

	var ambiarc = $("#ambiarcIframe")[0].contentWindow.Ambiarc;

	console.log('onFloorSelectorFocusChanged');
	console.log(event);

	///try { console.log('ambiarc.floorId ' + ambiarc.floorId + ' should be empty'); } catch(err) { console.log('ambiarc.floorId is empty'); }

	///try { console.log('ambiarc.recordId ' + ambiarc.recordId + ' should be empty'); } catch(err) { console.log('ambiarc.recordId is empty'); }

	///try { console.log('ambiarc.legendType ' + ambiarc.legendType + ' should be empty'); } catch(err) { console.log('ambiarc.legendType is empty'); }

	///try { console.log('ambiarc.ambiarcId ' + ambiarc.ambiarcId + ' should be empty'); } catch(err) { console.log('ambiarc.ambiarcId is empty'); }

	///try { console.log('allowFloorEvent ' + allowFloorEvent + ' should be true'); } catch(err) { }

	///console.log('onFloorSelectorFocusChanged @@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@');

	//alert(event.detail.newFloodId);
	//alert(event.detail.newFloodId.length);

	if (allowFloorEvent) {
		///console.log(event.detail.newFloodId.length)
		if (event.detail.newFloodId.length > '1') {
			ambiarc.floorId = event.detail.newFloodId;
			setFloorInfo();
		}
	}

// 	if (event.detail.newFloodId.length > '1' &&
// 		ambiarc.floorId == '' &&
// 		ambiarc.recordId == '' &&
// 		ambiarc.legendType == '' &&
// 		ambiarc.ambiarcId == '' &&
// 		allowFloorEvent) {
//
// 		///console.log('onFloorSelectorFocusChanged '+ ambiarc.recordId);
//
// 		///console.log('do pop legend from focus change ---------------------------------------');
//
// 		//alert('onFloorSelectorFocusChanged');
//
// 		//alert(ambiarc.floorId);
// 		ambiarc.floorId = event.detail.newFloodId;  console.log('onFloorSelectorFocusChanged events 348 '+event.detail.newFloodId);
// 		//try { clearTimeout(document.scheduleLegend) } catch(err) { }
//
// 	}

	//allowFloorEvent = true;

}

var cameraStartedHandler = function(event){

	//currentMapStatus = 'cameraStartedHandler';

	mapIsParked = false;
	allowFullView = false;

	collapseMenus();

	console.log('cameraStartedHandler'); // auto
	console.log(event);

	//clearTimeout(document.launchDestroyer);

	//clearTimeout(document.scheduleLegend);

	// 	if (event.detail.indexOf('UNTRACKED') != -1) {
	// 		return false;
	// 	}
	// 	var ambiarc = $("#ambiarcIframe")[0].contentWindow.Ambiarc;
	// 	if (typeof ambiarc.selectedPoiId != 'undefined') {
	// 		///console.log('cameraStartedHandler');
	// 		///console.log(event);
	// 	}
};

var cameraCompletedHandler = function(event){

	//clearTimeout(timeoutVariables);

	//currentMapStatus = 'cameraCompletedHandler';

	console.log('cameraCompletedHandler'); // auto
	//unDisableReset();

	var ambiarc = $("#ambiarcIframe")[0].contentWindow.Ambiarc;

	///console.log(event.detail);//			UNTRACKED_AMBIARC_EVENT_FocusOnIsolatedFloor
	console.log(event);//					UNTRACKED_AMBIARC_EVENT_FocusOnIsolatedFloor
	///console.log(allowFloorEvent);//			true
	///console.log(ambiarc.legendType);//		empty---
	///console.log(isFloorSelectorEnabled);//	false
	///console.log(mainBldgID);//				should be set
	///console.log(ambiarc.recordId);//		empty---
	///console.log(ambiarc.floorId);//			should be set

	// UNTRACKED_AMBIARC_EVENT_ZoomCamera
	// UNTRACKED_AMBIARC_EVENT_ViewFloorSelector
	// UNTRACKED_AMBIARC_EVENT_MoveAndRotateCameraToMatchValues
	// UNTRACKED_AMBIARC_EVENT_FocusOnIsolatedFloor

	if (event.detail == 'UNTRACKED_AMBIARC_EVENT_FocusOnIsolatedFloor' && allowFloorEvent && ambiarc.recordId == '') {
	//if ((event.detail == 'UNTRACKED_AMBIARC_EVENT_MoveAndRotateCameraToMatchValues' || event.detail == 'UNTRACKED_AMBIARC_EVENT_FocusOnIsolatedFloor') && allowFloorEvent) {

		//if (typeof ambiarc.legendType == 'undefined' || ambiarc.legendType == '') {

			//if (isFloorSelectorEnabled == false && mainBldgID > 0 && ambiarc.recordId == '') {

				params = {};
				params.bldg = ambiarc.buildingId;
				params.floor = ambiarc.floorId;
				params.action = 'showFloorInfo';
				params.select = 'floor';

				if (params.floor != '') {
					fetchPoisFromApi(params);
				}

			//}
		//}
	}

	if (allowFloorEvent == false) {
		if (event.detail == 'UNTRACKED_AMBIARC_EVENT_RotateCamera' ||  event.detail == 'UNTRACKED_AMBIARC_EVENT_ZoomCamera') {
			popMapLegend2();
		}
	}

	// 	if (ambiarc.floorId.length > '1' || ambiarc.buildingId.length > '1') {
	// 		popMapLegend2();
	// 	}

	setTimeout(function(){
		allowFloorEvent = true;
		ambiarc.menuAction = '';
	},5000);

};