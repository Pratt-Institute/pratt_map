var popMapLegend = function(legendDelay=1000,src='line') {

	setTimeout(function(){

		clearTimeout(document.scheduleLegend);

		console.log('popMapLegend ' + legendDelay + ' ' + src);

		var ambiarc = $("#ambiarcIframe")[0].contentWindow.Ambiarc;

		var pointLable	= ambiarc.pointLable;
		var legendType	= ambiarc.legendType;
		var ambiarcId	= ambiarc.ambiarcId;
		var buildingId	= ambiarc.buildingId;
		var floorId		= ambiarc.floorId;
		var roomName	= ambiarc.roomName;
		var hasImage	= ambiarc.hasImage;
		//var lat			= ambiarc.lat;
		//var lon			= ambiarc.lon;

		var person		= ambiarc.person;
		var building	= ambiarc.building;
		var dept		= ambiarc.dept;
		var title		= ambiarc.title;
		var phone		= ambiarc.phone;
		var office		= ambiarc.office;
		var email		= ambiarc.email;

		var recordId		= ambiarc.recordId;
		var sculptureName	= ambiarc.sculptureName;
		var sculptureArtist	= ambiarc.sculptureArtist;

		// 	var bldgName1 = '';
		// 	var bldgName2 = '';
		//
		// 	try {
		// 		bldgName1 = bldgMap[floorId].bldg_name;
		// 	} catch(err) { console.log(err) }
		// 	try {
		// 		bldgName2 = ambiarc.poiStuff[ambiarcId].bldgName;
		// 	} catch(err) { console.log(err) }
		//
		// 	if (bldgName1 == '' && bldgName2 == '' && sculptureName == '') {
		// 		return true;
		// 	}

		//alert('one ' + floorId);

		document.scheduleLegend = setTimeout(function(){

			//alert('two ' + floorId);

			var now = Date.now();

			/* TODO floorId getting unset somewhere */
			// 	if (typeof floorId == 'undefined' && typeof ambiarc.floorIdExtra != 'undefined') {
			// 		floorId = ambiarc.floorIdExtra;
			// 	}

			// 	console.log('$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$');
			// 	console.log('pointLable ' + pointLable);
			// 	console.log('ambiarcId ' + ambiarcId);
			// 	console.log('buildingId ' + buildingId);
			// 	console.log('floorId ' + floorId);
			// 	console.log('doFloorSelected ' + doFloorSelected);
			// 	console.log('legendType ' + legendType);
			// 	console.log('isFloorSelectorEnabled ' + isFloorSelectorEnabled);
			// 	console.log(bldgMap);
			// 	console.log('$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$');

			//alert('hello');

			try {
				$('img.access').remove();
				//var imgBldg = '<img src="images/buildings/'+bldgMap[floorId].buildingId+'.jpg?time='+now+'">'
				//var imgAccs = '<img class="access" src="images/buildings/'+bldgMap[floorId].buildingId+'.png?time='+now+'">'
				var imgBldg = '<img src="images/buildings/'+bldgMap[floorId].buildingId+'.jpg">'
				var imgAccs = '<img class="access" src="images/buildings/'+bldgMap[floorId].buildingId+'.png">'
				$('.legend-building').html(imgBldg);
				//$('.legend-access').html(imgAccs);
				$('.legend-copy').prepend(imgAccs);
			} catch(err) {
				console.log(err)
				$('div.legend-img-building').html('');
			}

			// 	try {
			// 		var bldgId = '';
			// 		if (typeof buildingId != 'undefined' && buildingId > '0') {
			// 			var bldgId = buildingId;
			// 		}
			// 		if (typeof floorId != 'undefined' && floorId > '0') {
			// 			var bldgId = bldgMap[floorId].buildingId;
			// 		}
			// 		sprt = [];
			// 		sprt['0001'] = '-200px -1106px';
			// 		sprt['0002'] = '-165px -1476px';
			// 		sprt['0003'] = '-191px -1848px';
			// 		sprt['0004'] = '-189px -2236px';
			// 		sprt['0005'] = '-511px -1086px';
			// 		sprt['0006'] = '-520px -1274px';
			// 		sprt['0007'] = '-520px -1274px';
			// 		sprt['0008'] = '-520px -1274px';
			// 		sprt['0009'] = '-573px -1362px';
			// 		sprt['0010'] = '-451px -1420px';
			// 		sprt['0011'] = '-441px -1756px';
			// 		sprt['0012'] = '-411px -1850px';
			// 		sprt['0013'] = '-511px -1858px';
			// 		sprt['0014'] = '-849px -738px';
			// 		sprt['0015'] = '-851px -1278px';
			// 		sprt['0016'] = '-851px -1278px';
			// 		sprt['0017'] = '-851px -1278px';
			// 		sprt['0018'] = '-871px -1788px';
			// 		sprt['0019'] = '-1245px -432px';
			// 		sprt['0021'] = '-1171px -1528px';
			// 		sprt['0022'] = '-1467px -1292px';
			// 		sprt['0023'] = '-1477px -1588px';
			// 		sprt['0024'] = '-853px -384px';
			// 		if (sprt[bldgId] == '') {
			// 			$('div.legend-img-accessibility').hide();
			// 		} else {
			// 			$('div.legend-img-accessibility').show();
			// 			$('div.legend-img-accessibility').css({'background-position': sprt[bldgId] });
			// 		}
			// 	} catch(err) {
			// 		console.log(err)
			// 	}

			try {
				if (recordId > '1' && hasImage == 'Y') {
					var imgSclp = '<img src="images/pois/'+recordId+'.jpg?time='+now+'">'
					$('.legend-building').html(imgSclp);
					$('.legend-access').html('');
				}
			} catch(err) {
				console.log(err)
				//$('div.legend-img-sculpture').html('');
			}

			try {
				var bldgName = bldgMap[floorId].bldg_name;

				if (bldgName == 'Information Science Center') {
					bldgName = 'ISC';
				}

				if (bldgName == 'Steuben Hall/Pratt Studios') {
					bldgName = 'Steuben Hall &<br>Pratt Studios';
				}

				if (bldgName.length > '1') {
					$('.bldgName').html(bldgName);
				}
			} catch(err) { console.log(err) }

			try {
				var bldgName = ambiarc.poiStuff[ambiarcId].bldgName;

				if (bldgName == 'Information Science Center') {
					bldgName = 'ISC';
				}

				if (bldgName == 'Steuben Hall/Pratt Studios') {
					bldgName = 'Steuben Hall &<br>Pratt Studios';
				}

				if (bldgName.length > '1') {
					$('.bldgName').html(bldgName);
				}
			} catch(err) { console.log(err) }

			try {
				if (legendType != 'menuBuilding') {
					$('.floorNo').html(bldgMap[floorId].floor + ' floor');
				} else {

					//alert(legendType);
					//console.log(ambiarc);
					//createPointLabel(buildingId,floorId);

				}
			} catch(err) { console.log(err) }

			try {
				$('.floorNo').html(ambiarc.poiStuff[ambiarcId].floorNo + ' floor');
			} catch(err) { console.log(err) }

			//console.log('floorId '+floorId + ' -- ambiarcId ' + ambiarcId + ' -- recordId ' + recordId);

			try {
				if (legendType != 'menuBuilding') {
					$('.floorNo').html(bldgMap[floorId].floor + ' floor');
				}
			} catch(err) { console.log(err) }

			try {
				$('.roomName').html(ambiarc.poiStuff[ambiarcId].roomName);
			} catch(err) { console.log(err) }


			try {
				if (roomName.length > '1') {
					$('.roomName').html(roomName);
				}
			} catch(err) { console.log(err) }


			try {
				if (roomName.roomNo > '1') {
					$('.roomNo').html('Room '+ambiarc.poiStuff[ambiarcId].roomNo);
				}
			} catch(err) { console.log(err) }

			try {

				if (floorId != '') {
					var bId = bldgMap[floorId].buildingId;
				} else {
					var bId = buildingId;
				}

				var copyArr = prattCopy[bId].split(' ');
				//console.log(copyArr);
				$.each(copyArr, function(k, v) {
					if (v.indexOf(':') != -1) {
						copyArr[k] = '<br><span class="copy-bold">'+v+'</span>';
					}
				});
				var newCopy = copyArr.join(' ');

				$('.history').html(newCopy);
			} catch(err) { $('.history').html(''); }

			try {
				if (sculptureName != '') {
					$('.bldgName').html(sculptureName);
					$('.floorNo').html(sculptureArtist);
				}
			} catch(err) { console.log(err) }

			if (pointLable == 'PPS' || pointLable == 'GATE') {
				var imgBldg = '<img src="images/buildings/'+pointLable+'.png">'
				//var imgAccs = '<img class="access" src="images/buildings/'+bldgMap[floorId].buildingId+'.png">'
				$('.legend-building').html(imgBldg);
				//$('.legend-copy').prepend(imgAccs);
				$('.bldgName').html(sculptureName);
				$('.roomName').html(roomName);
				$('.floorNo').html('');
			}

			try {
				if (person != '') {

					var floorIdPerson = hallMap[building].floorId
					//alert('three '+floorId);

					//console.log(hallMap[building]);

					//alert(hallMap[building].floor);

					// 	ambiarc.building = $(this).attr('data-building');
					// 	ambiarc.dept = $(this).attr('data-dept');
					// 	ambiarc.title = $(this).attr('data-title');
					// 	ambiarc.phone = $(this).attr('data-phone');
					// 	ambiarc.office = $(this).attr('data-office');
					// 	ambiarc.email = $(this).attr('data-email');

					var imgBldg = '<img src="images/buildings/'+building+'.jpg">'
					$('.legend-building').html(imgBldg);

					//alert(building + ' - ' + hallMap[building].bldg_name);

					$('.bldgName').html(hallMap[building].bldg_name);
					$('.roomName').html(person + '<br>' + title + '<br>' + dept + '<br>' + office);

					createPointLabel(building,floorIdPerson);
				}
			} catch(err) { console.log(err) }

			//if ($('.bldgName').html() == '' && buildingId != '') {
			if (legendType == 'offCampusPoint') {
				var imgBldg = '<img src="images/buildings/'+floorId+'.jpg">'
				//var imgAccs = '<img class="access" src="images/buildings/'+bldgMap[floorId].buildingId+'.png">'
				$('.legend-building').html(imgBldg);
				//$('.legend-copy').prepend(imgAccs);
				$('.bldgName').html(buildingId);
			}

			//alert('popMapLegend ' + recordId);

			/// last chance fill the legend with generic building info
			setTimeout(function(){
				var isLegendFilled = $('.bldgName').html();

				if (isLegendFilled.length < '1') {

					try {
						var bldgName = hallMap[buildingId].bldg_name;

						if (bldgName == 'Steuben Hall/Pratt Studios') {
							bldgName = 'Steuben Hall &<br>Pratt Studios';
						}

						if (bldgName.length > '1') {
							$('.bldgName').html(bldgName);

							var imgBldg = '<img src="images/buildings/'+buildingId+'.jpg">'
							var imgAccs = '<img class="access" src="images/buildings/'+buildingId+'.png">'
							$('.legend-building').html(imgBldg);
							//$('.legend-access').html(imgAccs);
							$('.legend-copy').prepend(imgAccs);

						}
					} catch(err) { console.log(err) }

				}

			},100);

			setTimeout(function(){
				var isLegendFilled = $('.bldgName').html();
				//console.log(isLegendFilled.length + ' %% ' + isLegendFilled.length + ' %% ' + isLegendFilled.length + ' %% ' + isLegendFilled.length + ' %% ' + isLegendFilled.length + ' %% ' + isLegendFilled.length + ' %% ' + isLegendFilled.length + ' %% ' + isLegendFilled.length + ' %% ' + isLegendFilled.length + ' %% ' + isLegendFilled.length + ' %% ' + isLegendFilled.length + ' %% ' + isLegendFilled.length + ' %% ' + isLegendFilled.length + ' %% ' + isLegendFilled.length + ' %% ' + isLegendFilled.length + ' %% ' + isLegendFilled.length + ' %% ' )
				if (isLegendFilled.length > '1') {
					$('.legend').addClass('showlegend');
				} else {
					$('.legend').removeClass('showlegend');
				}
			},200);

			//ambiarc.keepFloorId = ambiarc.floorId;

			setTimeout(function(){

				//alert('clear ambiarc vars');

				ambiarc.pointLable	= '';
				ambiarc.legendType	= '';
				ambiarc.ambiarcId	= '';
				ambiarc.buildingId	= '';
				ambiarc.floorId		= '';
				//ambiarc.floorIdExtra = 'z';
				ambiarc.roomName	= '';
				ambiarc.hasImage	= '';
				ambiarc.lat			= '';
				ambiarc.lon			= '';
				ambiarc.recordId	= '';
				ambiarc.sculptureName	= '';
				ambiarc.sculptureArtist	= '';

				ambiarc.person		= '';
				ambiarc.building	= '';
				ambiarc.dept		= '';
				ambiarc.title		= '';
				ambiarc.phone		= '';
				ambiarc.office		= '';
				ambiarc.email		= '';

			},750);

		},legendDelay);

	},250);
}