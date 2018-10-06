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

var createCampusLabels = function() {
	// creating objecct where we will store all our points property values
	ambiarc = $("#ambiarcIframe")[0].contentWindow.Ambiarc;
	ambiarc.hideLoadingScreen();
	ambiarc.getAllBuildings(function(buildingsArray){
		console.log('=========================================================================================');
		ambiarc.bldgIdsList = [];
		buildingsArray.forEach(function(bldgID, i){
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
				}
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

		if (params.action == 'showFloorInfo') {
			setTimeout(function(){
				popMapLegend();
			},500);
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

	var ambiarcId = ambiarc.ambiarcId;
	var buildingId = ambiarc.buildingId;
	var floorId = ambiarc.floorId;

	console.log('popMapLegend 1');
	console.log(legendInfo);
	console.log(bldgMap);
	console.log( ambiarcId + ' -- ' + floorId );
	console.log('popMapLegend 2');

	if (typeof ambiarcId == 'undefined' && isFloorSelectorEnabled == false) {
		//alert(poiMap[ambiarcId]);

		$('.bldgName').html(bldgMap[floorId].bldg_name + ' 1');
		$('.floorNo').html(bldgMap[floorId].floor + ' floor');
		$('.legend').addClass('showlegend');
		return true;

		// 	if (poiMap[ambiarcId] != '') {
		// 		return true;
		// 	}
	}

	// 	if (ambiarcId != '') {
	// 		if (typeof ambiarc.poiStuff[ambiarcId].bldgName == 'undefined') {
	// 			//alert(ambiarcId);
	// 			return true;
	// 		}
	// 	}

	document.scheduleLegend = setTimeout(function(){

		if (isFloorSelectorEnabled == false) {
			$('.bldgName').html(bldgMap[floorId].bldg_name + ' 1');
			$('.floorNo').html(bldgMap[floorId].floor + ' floor');
			$('.legend').addClass('showlegend');
			return true;
		}

		if (ambiarcId == '') {
			//try{
				if (typeof bldgMap[floorId] != 'undefined' && floorId != '') {
				//if (ambiarcId == '' && floorId != '' && typeof ) {

				}
			//} catch(err) {
			//	console.log(err);
			//}
			//try{
				if (typeof bldgMap[floorId] != 'undefined' && floorId != '') {
					$('.bldgName').html(bldgMap[floorId].bldg_name + ' 2');
					$('.floorNo').html(bldgMap[floorId].floor + ' floor');
					$('.legend').addClass('showlegend');
					return true;
				}
			//} catch(err) {
			//	console.log(err);
			//}
		}

		console.log(ambiarcId);
		console.log(ambiarc.poiStuff[ambiarcId]);

		//try{
			if (ambiarcId != '') {
				$('.bldgName').html(ambiarc.poiStuff[ambiarcId].bldgName + ' 3');
				$('.floorNo').html(ambiarc.poiStuff[ambiarcId].floorNo + ' floor');
				$('.roomName').html(ambiarc.poiStuff[ambiarcId].roomName);
				$('.legend').addClass('showlegend');
				return true;
			}
		//} catch(err) {
		//	console.log(err);
		//}
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
			popMapLegend();
		},1);
		setTimeout(function(){
			window.doFloorSelected = true;
		}, 4000);
	}
}
