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

	console.log('mapLabelSelected');
	console.log(e);
	console.log(e.detail);

	adjustMapFocus($("#" + e.detail)[0], e.detail);

	currentLabelId = e.detail;

}

var mapLabelClickHandler = function(e) {

    console.log('mapLabelClickHandler');
	console.log(e);
	console.log(e.detail);
	console.log(ambiarc.poiStuff[e.detail]);

	currentLabelId = e.detail;

};

// capture right click event and do stuff
var onRightMouseDown = function(event) {

	console.log('onRightMouseDown');

	//if(isFloorSelectorEnabled){
    //    return;
    //}

	//$(poiMenuSelector).css('top', $(window).height() - event.detail.pixelY + "px");
	//$(poiMenuSelector).css('left', event.detail.pixelX + "px");

    if (currentLabelId){
        repositionLabel(currentLabelId);
        return;
    }

    //$('#bootstrap').trigger('contextmenu');
    //console.log("Ambiarc received a RightMouseDown event");

};

var runMapLoad = function() {

	var ambiarc = $("#ambiarcIframe")[0].contentWindow.Ambiarc;

    var full = location.protocol+'//'+location.hostname+(location.port ? ':'+location.port: '')+(window.location.pathname ? window.location.pathname.substring(0,window.location.pathname.lastIndexOf("/")) : '');
    ambiarc.setMapAssetBundleURL(full+'/ambiarc/');
    //ambiarc.loadMap("pratt");
    //var mapFolder = getMapName('map');
//    ambiarc.setMapAssetBundleURL('https://s3-us-west-1.amazonaws.com/gk-web-demo/ambiarc/');
    //ambiarc.loadMap(mapFolder);
    ambiarc.loadMap("pratt");

}

var mapStartedLoading = function() {

//	alert('mapStartedLoading');

// 	console.log('mapStartedLoading');
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

	ambiarc.setMapTheme(ambiarc.mapTheme.light);

}

var mapFinishedLoading = function() {

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
		ambiarc.setMapTheme(ambiarc.mapTheme.light);
		//ambiarc.setSkyColor('#fff', '#00f');
		setTimeout(function(){
			$('.mode-light').addClass('show-mode-button');
		}, 1);
		$('.legend').css({'color':'#333'});
	}
	console.log('mapFinishedLoading');
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

	//alert('BuildingExitCompleted'); // auto

	//console.log('BuildingExitCompleted');
	//console.log(event);

	$('#back-button').hide();
	$('.reset-map').removeClass('reset-show');

}

var onFloorSelected = function(event) {

	$('#back-button').show();
	$('.reset-map').addClass('reset-show');

	doPauseTour();

	//alert('onFloorSelected');

	console.log('onFloorSelected');
	console.log(event);
	var floorInfo = event.detail;
	currentFloorId = floorInfo.floorId;

	if (event.type == 'FloorSelected') {

		ambiarc = $("#ambiarcIframe")[0].contentWindow.Ambiarc;
		ambiarc.buildingId = event.detail.buildingId;
		ambiarc.floorId = event.detail.floorId;

		//window.legendInfo.buildingId = event.detail.buildingId;
		//window.legendInfo.floorId = event.detail.floorId;
	}

	isFloorSelectorEnabled = false;
	mainBldgID = floorInfo.buildingId;

}

var onEnteredFloorSelector = function(event) {

	//clearMapLegend();

	$('#back-button').show();
	$('.reset-map').addClass('reset-show');

	doPauseTour();

	//alert('onEnteredFloorSelector');

	//alert('onEnteredFloorSelector');
	console.log('onEnteredFloorSelector');
	console.log(event);
	var buildingId = event.detail;
	currentFloorId = undefined;
	//$('#back-button').show();
	isFloorSelectorEnabled = true;
	//alert('true');
}

var onExitedFloorSelector = function(event) {

	doPauseTour();

	//alert('onExitedFloorSelector');

	console.log('onExitedFloorSelector');
	console.log(event.detail);
	var buildingId = event.detail;
	currentFloorId = undefined;
	isFloorSelectorEnabled = false;
}

var onFloorSelectorFocusChanged = function(event) {

	doPauseTour();

	//alert('onFloorSelectorFocusChanged');

	//clearMapLegend();
	//alert('onFloorSelectorFocusChanged');
	console.log('onFloorSelectorFocusChanged');
	console.log(event.detail);
	//window.legendInfo.ambiarcId = '';
	//window.legendInfo.showRoom = false;
	//window.legendInfo.floorId = event.detail.newFloodId;
	//popMapLegend();
}

var cameraStartedHandler = function(event){

	//alert('cameraStartedHandler'); // auto

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

	//console.log('cameraCompletedHandler'); // auto

	var ambiarc = $("#ambiarcIframe")[0].contentWindow.Ambiarc;

	if (event.detail == 'UNTRACKED_AMBIARC_EVENT_FocusOnIsolatedFloor') {

		if (typeof ambiarc.legendType == 'undefined' || ambiarc.legendType == '') {
			if (isFloorSelectorEnabled == false && mainBldgID > 0 ) {

				params = {};
				//params.bldg = floorInfo.buildingId;
				//params.floor = floorInfo.floorId;
				params.bldg = ambiarc.buildingId;
				params.floor = ambiarc.floorId;
				params.action = 'showFloorInfo';
				params.select = 'floor';

				if (params.action == 'showFloorInfo' && params.floor != '') {
					console.log('do fetch from cameraCompletedHandler');
					console.log('cameraCompletedHandler');
					console.log(event);
					console.log(event.detail + ' --- ' + doFloorSelected + ' --- ' + ambiarc.menuAction);
					fetchPoisFromApi(params);
				} else {
					console.log('`````````````````````````````````````````````````````````````````');
					console.log(params);
					console.log('`````````````````````````````````````````````````````````````````');
				}
			}
		}
	}

};