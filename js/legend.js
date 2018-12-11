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

		//alert(floorId + '  ' + src);

		document.scheduleLegend = setTimeout(function(){

			var now = Date.now();

			try {
				$('img.access').remove();
				var imgBldg = '<img src="images/buildings/'+bldgMap[floorId].buildingId+'.jpg">'
				var imgAccs = '<img class="access" src="images/buildings/'+bldgMap[floorId].buildingId+'.png">'
				$('.legend-building').html(imgBldg);
				$('.legend-copy').prepend(imgAccs);
			} catch(err) {
				console.log(err)
				$('div.legend-img-building').html('');
			}

			try {
				if (recordId > '1' && hasImage == 'Y') {
					var imgSclp = '<img src="images/pois/'+recordId+'.jpg?time='+now+'">'
					$('.legend-building').html(imgSclp);
					$('.legend-access').html('');
				}
			} catch(err) {
				console.log(err)
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
				}
			} catch(err) { console.log(err) }

			try {
				$('.floorNo').html(ambiarc.poiStuff[ambiarcId].floorNo + ' floor');
			} catch(err) { console.log(err) }

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
				$('.legend-building').html(imgBldg);
				$('.bldgName').html(sculptureName);
				$('.roomName').html(roomName);
				$('.floorNo').html('');
			}

			try {
				if (person != '') {

					var floorIdPerson = hallMap[building].floorId
					var imgBldg = '<img src="images/buildings/'+building+'.jpg">'
					$('.legend-building').html(imgBldg);

					$('.bldgName').html(hallMap[building].bldg_name);
					$('.roomName').html(person + '<br>' + title + '<br>' + dept + '<br>' + office);

					createPointLabel(building,floorIdPerson);
				}
			} catch(err) { console.log(err) }

			if (legendType == 'offCampusPoint') {
				var imgBldg = '<img src="images/buildings/'+floorId+'.jpg">'
				$('.legend-building').html(imgBldg);
				$('.bldgName').html(buildingId);
			}

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
							$('.legend-copy').prepend(imgAccs);

						}
					} catch(err) { console.log(err) }

				}

			},100);

			setTimeout(function(){
				var isLegendFilled = $('.bldgName').html();
				if (isLegendFilled.length > '1') {
					$('.legend').addClass('showlegend');
				} else {
					$('.legend').removeClass('showlegend');
				}
			},200);

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