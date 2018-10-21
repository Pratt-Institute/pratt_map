	function loadUiFunctions() {

		$(document).ready(function(){

			ambiarc = $("#ambiarcIframe")[0].contentWindow.Ambiarc;

			console.log('loadUiFunctions');

			window.doFloorSelected	= true;
			window.tourIsRunning	= false;
			window.pauseTour		= false;
			window.overhead			= false;

			new materialTouch('.md-ripple', {
				classes: {
				  rippleContainer: 'md-ripple-wrapper',
				  ripple: 'md-ripple-effect'
				},
				transition: {
				  easing: 'easeOutExpo',
				  delay: 0,
				  duration: 600
				},
				opacity: 0.25,
				size: 0.75,
				center: false
			});

			$.extend($.expr[':'], {
			  'containsi': function(elem, i, match, array) {
				return (elem.textContent || elem.innerText || '').toLowerCase()
					.indexOf((match[3] || "").toLowerCase()) >= 0;
			  }
			});

			$(document).on("click", "guide-kick-background", function(e){

			});

			$(document).mousemove(function(e) {
				window.haltLoops = true;
			});

			$(document).on("click", "li.list-group-item", function(e){

				clearMapLegend();

				//resetMap();
				ambiarc = $("#ambiarcIframe")[0].contentWindow.Ambiarc;
				ambiarc.menuAction = 'yes';
				//alert('list-item');

				window.doFloorSelected = false;

				params = {};
				params.bldg = $(this).attr('data-building');
				params.floor = $(this).attr('data-floorid');
				params.recordId = $(this).attr('data-recordid');
				params.action = 'focusAfterDataLoad';

				//window.legendInfo.recordId = $(this).attr('data-recordid');
				//window.legendInfo.buildingId = $(this).attr('data-building');
				//window.legendInfo.floorId = $(this).attr('data-floor');
				//window.legendInfo.roomName = '';

				// 	if ($(this).hasClass('hasImg')) {
				// 		doPoiImage(params.recordId);
				// 	} else {
				// 		$('.poi-box').remove();
				// 	}

				//ambiarc.EnterOverheadCamera();
				//ambiarc.ExitOverheadCamera();

				if ($(this).attr('data-building') == 'SG' || $(this).attr('data-building') == 'PPS') {

					var lat		= $(this).attr('data-lat');
					var lon		= $(this).attr('data-long');
					var heightAboveFloor = '50';

					//alert(lat + ' ' + lon);

					ambiarc.focusOnLatLonAndZoomToHeight('', '', lat, lon, heightAboveFloor);

					//window.legendInfo.ambiarcId = '';
					//window.legendInfo.buildingId = '';
					//window.legendInfo.floorId = '';
					//window.legendInfo.roomName = '';

					//window.doFloorSelected = true;

					params.action = 'focusOutdoorPoint';

					if ($(this).attr('data-building') == 'SG') {

						var sculpture = $(this).find('span').html();
						var split = sculpture.split(' :: ');

						ambiarc.recordId = $(this).attr('data-recordid');
						ambiarc.sculptureName = split[0];
						ambiarc.sculptureArtist = split[1];

						//alert(ambiarc.sculptureName);
					}
					//return true;
				}
				//popMapLegend();
				fetchPoisFromApi(params);

			});

			$(document).on('click', '.search-btn', function() {

				resetMap();

				///ambiarc = $("#ambiarcIframe")[0].contentWindow.Ambiarc;
				///ambiarc.menuAction = 'yes';
				///alert('search-btn');

				$('.nav-menu').fadeOut();
				$('.showpopmap').removeClass('showpopmap');
				$('.points').addClass('reveal-vert');
				$('.menu-open').addClass('fade-out');
				$('.reveal-horz').removeClass('reveal-horz');
				//$('body').append('<div class="click-capture"></div>');
				$('<div class="click-capture"></div>').insertBefore('.tap-to-start');

			});

			$(document).on('click', '.menu-open', function() {

				//clearMapLegend();
				//ambiarc = $("#ambiarcIframe")[0].contentWindow.Ambiarc;
				//ambiarc.menuAction = 'yes';
				//alert('menu-open');

				$('.showpopmap').removeClass('showpopmap');
				$('.menu-open').addClass('fade-out');
				$('.cat-wrap').removeClass('fade-out');
				//$('body').append('<div class="click-capture"></div>');
				$('<div class="click-capture"></div>').insertBefore('.tap-to-start');
				//isFloorSelectorEnabled = false;
				//var ambiarc = $("#ambiarcIframe")[0].contentWindow.Ambiarc;
				//ambiarc.loadMap("pratt");

				// 	ambiarc.viewFloorSelector('0001');
				// 	clearMapLegend();
				// 	setTimeout(function(){
				// 		ambiarc.viewFloorSelector('0001');
				// 		clearMapLegend();
				// 	}, 750);
			});

			$(document).on('click', '.pratt-logo', function() {
				//collapseMenus();
				//$('.showpopmap').removeClass('showpopmap');
				//resetMenus();
				//var ambiarc = $("#ambiarcIframe")[0].contentWindow.Ambiarc;
				//ambiarc.loadMap("pratt");
				location.reload();
				//alert('logo click detected');
				//setModeTheme();
			});

			$(document).on('click', '.cat-box', function() {

				if ($(this).html() == 'accessibility') {
					resetMap();
				}

				$('.reveal-horz').removeClass('reveal-horz');
				var pos = $(this).closest('div').position();
				var maxHei = parseInt($(window).height()-90);
				var type = $(this).attr('data-type');
				$('div.'+type).css({'left':pos.left,'maxHeight':maxHei});
				$('div.'+type).addClass('reveal-horz');
				$("style:not('#position')").remove();
				var getStyle = $("style[data-type='"+type+"']");
				if (getStyle.length < 1) {
					var style = document.createElement('style');
					style.id = 'position';
					style.type = 'text/css';
					style.setAttribute('data-type', type);
					style.innerHTML = '.'+type+'{left:'+pos.left+';max-height:'+maxHei+';}';
					document.getElementsByTagName('head')[0].appendChild(style);
				}
			});

			$(document).on('click', '.click-capture', function() {
				//collapseMenus();
				///ambiarc = $("#ambiarcIframe")[0].contentWindow.Ambiarc;
				ambiarc.menuAction = 'no';
				$('.showpopmap').removeClass('showpopmap');
				resetMenus();
			});

			$('.flyout').mouseleave(function() {
				var elem = this;
				var close = true;
				$('.subfly').each(function(){
					if ($(this).css('opacity') > 0) {
						close = false;
					}
				});
				if (close == true) {
					var hi = $(this).height();
					$(elem).css({height: hi});
					document.close_flyout = setTimeout(function(){
						$(elem).animate({width: '0px', opacity: 0}).promise().then(function(){
							$(elem).removeClass('reveal-horz').promise().then(function(){
								setTimeout(function(){ $(elem).removeAttr('style'); }, 125);
							});
						});
					}, 500);
				}
			}).on('mouseenter', function(){
				clearTimeout(document.close_flyout);
			});

			$('.subfly').mouseleave(function(e) {
				alert('one');
				var hi = $(this).height();
				$('.subfly').css({height: hi});
				document.close_subfly = setTimeout(function(){
					$('.subfly').animate({width: '0px', opacity: 0}).promise().then(function(){
						$('.subfly').removeClass('reveal-horz').promise().then(function(){
							setTimeout(function(){ $('.subfly').removeAttr('style'); }, 125);
						});
					});
				}, 500);
			}).on('mouseenter', function(){
				clearTimeout(document.close_subfly);
			});

			$(document).keyup(function(e) {
				if (e.keyCode === 27) {
					$('.showpopmap').removeClass('showpopmap');
					resetMenus();
					//hideAllPoints();
					//isFloorSelectorEnabled = false;
					//var ambiarc = $("#ambiarcIframe")[0].contentWindow.Ambiarc;
					//ambiarc.viewFloorSelector('0001');
					//ambiarc.viewFloorSelector('0001');
					//ambiarc.loadMap("pratt");
				}
			});

			$(document).on('click', '*', function(e) {

				$('.veil').hide();

				//console.log(e.target.nodeName);
				if (e.target.nodeName=='BODY' || e.target.nodeName=='HTML') {
					$('.showpopmap').removeClass('showpopmap');
					resetMenus();
				}
			});

			$(document).on("keyup", "input.filter", function(e){
				//alert(this.value);
				searchFunction();
			});

			$(document).on("change", "select.menu-buildings", function(e){

				clearMapLegend();

				//resetMap();
				///ambiarc = $("#ambiarcIframe")[0].contentWindow.Ambiarc;
				ambiarc.menuAction = 'yes';
				//alert('select.menu-buildings');

				//ambiarc = $("#ambiarcIframe")[0].contentWindow.Ambiarc;
				//ambiarc.exitBuilding();
				//alert(this.value);
				searchFunction();

				// TODO building focus trigger here

				// 	params = {};
				// 	params.bldg = $(this).val();
				// 	params.floor = $(this).attr('data-floor');
				// 	//params.recordId = $(this).attr('data-recordid');
				// 	//params.action = 'focusAfterDataLoad';
				// 	if (fetchPoisFromApi(params)) {
				// 		alert('focus failed');
				// 	}

			});

			$(document).on('click', '.fly-box', function(e) {

				//ambiarc.exitBuilding();

				clearMapLegend();

				var ambiarc = $("#ambiarcIframe")[0].contentWindow.Ambiarc;
				ambiarc.menuAction = 'yes';
				//alert('fly-box');

				window.doFloorSelected = false;

				$('.subfly').removeClass('reveal-horz');
				var pos = $(this).closest('div').position();
				var wid = $(this).closest('div').width();
				var left = parseInt(pos.left + wid);
				//alert(wid + ' -- ' + left);

				var cat = $(this).attr('data-cat');
				var type = $(this).attr('data-'+cat);

				if (cat == 'school') {

					$("[data-type='"+type+"']").css({left:left});
					$("[data-type='"+type+"']").addClass('reveal-horz');

				} else {

					params = {};
					params.currentTarget = e.currentTarget;
					params.type = type;
					params.bldg = $(this).attr('data-bldg');
					params.floor = $(this).attr('data-floorid');
					params.dept = $(this).attr('data-dept');
					params.office = $(this).attr('data-office');
					params.facility = $(this).attr('data-facility');
					//params.schl = $(this).closest('div').attr('data-type');

					if ($(this).attr('data-cat')) {
						params.cat = $(this).attr('data-cat');
					}
					if ($(this).attr('data-lat')) {
						params.lat = $(this).attr('data-lat');
					}
					if ($(this).attr('data-long')) {
						params.long = $(this).attr('data-long');
					}
					if ($(this).attr('data-bldg')) {
						params.bldg = $(this).attr('data-bldg');
					}

					window.bldg = $(this).attr('data-bldg');

					if (params.bldg == 'FLSH' || params.bldg == 'CRR' || params.bldg == 'W14') {
						doPopupMap(params.bldg);
						return true;
					}

					if ($(this).attr('data-cat') == 'office' || $(this).attr('data-cat') == 'facility' || $(this).attr('data-cat') == 'dept') {

						params.label = $(this).attr('data-dept');
						params.bldg = $(this).attr('data-bldg');
						params.recordId = $(this).attr('data-recordid');
						params.action = 'focusAfterDataLoad';
					}

					if ($(this).attr('data-cat') == 'buildings') {

						var buildingId	= $(this).attr('data-bldgid');
						var floorId	= $(this).attr('data-floorid');
						var lat		= $(this).attr('data-lat');
						var lon		= $(this).attr('data-long');
						var heightAboveFloor = '125';

						// 	if ($(this).attr('data-building') == 'SG' || $(this).attr('data-building') == 'PPS') {
						//
						// 		var lat		= $(this).attr('data-lat');
						// 		var lon		= $(this).attr('data-long');
						// 		var heightAboveFloor = '50';
						//
						// 		ambiarc.focusOnLatLonAndZoomToHeight('', '', lat, lon, heightAboveFloor);
						//
						// 		params.action = 'focusOutdoorPoint';
						//
						// 		if (fetchPoisFromApi(params)) {
						// 			alert('focus failed');
						// 		}
						//
						// 		return true;
						// 	}

						ambiarc.legendType = 'menuBuilding';
						ambiarc.ambiarcId = '';
						ambiarc.buildingId = buildingId;
						ambiarc.floorId = floorId;
						ambiarc.roomName = '';
						ambiarc.roomNo = '';
						ambiarc.lat = lat;
						ambiarc.lon = lon;

						if ($(this).closest('div').hasClass('accessibility')) {

							// 	ACTIVITY RES CTR	21	Y	Y
							// 	DEKALB HALL			3	Y	Y
							// 	EAST HALL			9	Y	Y
							// 	FILM VIDEO			19	Y	Y
							// 	HIGGINS HALL		4	Y	Y
							// 	INFORMATION SCIENCE CENTER	1	Y	Y
							// 	LIBRARY				2	Y	Y
							// 	MACHINERY			16	Y	Y
							// 	MYRTLE HALL			24	Y	Y
							// 	PANTAS HALL			13	Y	Y
							// 	PRATT STUDIOS		18	Y	Y
							// 	STABILE HALL		22	Y	Y
							// 	STUDENT UNION		7	Y	Y
							// 	THRIFT HALL			12	Y	Y
							// 	WILLOUGHBY HALL		14	Y	Y

							rotation = [];
							rotation['0021'] = '45'; // Activity Res Ctr
							rotation['0003'] = '180'; // Dekalb Hall
							rotation['0009'] = '270'; // East Hall
							rotation['0019'] = '45'; // Film Video
							rotation['0004'] = '45'; // Higgins Hall
							rotation['0001'] = '0'; // Information Science Center
							rotation['0002'] = '0'; // Library
							rotation['0016'] = '90'; // Machinery
							rotation['0024'] = '0'; // Myrtle Hall
							rotation['0013'] = '135'; // Pantas Hall
							rotation['0018'] = '135'; // Pratt Studios
							rotation['0022'] = '0'; // Stabile Hall
							rotation['0007'] = '270'; // Student Union
							rotation['0012'] = '45'; // Thrift Hall
							rotation['0014'] = '270'; // Willoughby Hall
							rotation = rotation[buildingId];

							zoom = [];
							zoom['0021'] = '50'; // Activity Res Ctr
							zoom['0003'] = '50'; // Dekalb Hall
							zoom['0009'] = '25'; // East Hall
							zoom['0019'] = '50'; // Film Video
							zoom['0004'] = '50'; // Higgins Hall
							zoom['0001'] = '50'; // Information Science Center
							zoom['0002'] = '50'; // Library
							zoom['0016'] = '25'; // Machinery
							zoom['0024'] = '50'; // Myrtle Hall
							zoom['0013'] = '50'; // Pantas Hall
							zoom['0018'] = '50'; // Pratt Studios
							zoom['0022'] = '50'; // Stabile Hall
							zoom['0007'] = '50'; // Student Union
							zoom['0012'] = '15'; // Thrift Hall
							zoom['0014'] = '50'; // Willoughby Hall
							zoom = zoom[buildingId];

							//ambiarc.rotateCamera(rot, 0.2);

							params.accessible	= 'Y';
							params.bldg			= buildingId;
							params.action		= 'doAccessibilityThing';
							params.lat			= lat;
							params.lon			= lon;
							params.heightAboveFloor = zoom;
							params.rotation		= rotation;
							delete params.floor	;

							fetchPoisFromApi(params);

						} else {

							window.lat = lat;
							window.lon = lon;

							ambiarc.focusOnLatLonAndZoomToHeight(buildingId, '', lat, lon, heightAboveFloor);

							popMapLegend();

						}

						//window.doFloorSelected = true;

						//ambiarc.getDirections('0024', '0093', '40.693454', '-73.963549', '0002', '0006', '40.690872', '-73.964982', function(res){
						//ambiarc.getDirections(startingBuilding, startingLevel, startingLatitude, startingLongitude, endingBuilding, endingLevel, endingLatitude, endingLongitude, function(res){
						//	console.log(res);
						//	alert('Sorry, menu not active yet.');
						//});

						return true;
					}

					//console.log(params);
					//console.log(document.deptMap);
					//console.log(document.deptMap[params.office]);
					//alert(params.facility);

					ambiarc.legendType = 'menuOther';
					ambiarc.ambiarcId = '';
					ambiarc.buildingId = '';
					ambiarc.floorId = $(this).attr('data-floorid');
					ambiarc.roomName = $(this).html();
					ambiarc.roomNo = $(this).attr('data-roomno');
					ambiarc.lat = '';
					ambiarc.lon = '';

					if (fetchPoisFromApi(params)) {
						alert('focus failed');
						//console.log('did it work?');
						//collapseMenus();
					}
				}
			});

			$(document).on('click', '.reset-map', function() {
				$(this).attr('disabled','disabled');
				//clearMapLegend();
				$('.click-capture').remove();
				//clearMapLegend();
				resetMap();
			});

			//$(document).on("click", "div.subfly>span", function(e){
			// 	$(document).on("click", "div.academics>span", function(e){
			//
			// 		//clearMapLegend();
			//
			// 		window.doFloorSelected = false;
			// 		//alert('subfly span');
			//
			// 		window.bldg = $(this).attr('data-bldg');
			//
			// 		params = {};
			// 		params.currentTarget = e.currentTarget;
			// 		params.bldg = $(this).attr('data-bldg');
			//
			// 		if (params.bldg == 'FLSH' || params.bldg == 'CRR' || params.bldg == 'W14' || params.bldg == 'W18') {
			// 			doPopupMap(params.bldg);
			// 			return true;
			// 		}
			//
			// 		params.dept = $(this).attr('data-dept');
			// 		params.schl = $(this).closest('div').attr('data-type');
			// 		params.action = 'focusAfterDataLoad';
			//
			// 		console.log('**********************************');
			// 		console.log(params);
			// 		console.log(document.deptMap);
			// 		console.log('**********************************');
			//
			// 		params.label = params.dept;
			// 		params.recordId = document.deptMap[params.dept].recordId;
			//
			//
			// 		ambiarc.legendType = 'menuOther';
			// 		ambiarc.ambiarcId = '';
			// 		ambiarc.buildingId = '';
			// 		ambiarc.floorId = '';
			// 		ambiarc.roomName = '';
			// 		ambiarc.lat = '';
			// 		ambiarc.lon = '';
			//
			//
			// 		if (params.recordId > '1') {
			//
			// 			if (fetchPoisFromApi(params)) {
			// 				console.log('did it work?');
			// 				collapseMenus();
			// 			}
			//
			// 		} else {
			//
			// 			console.log('**********************************');
			// 			console.log(params);
			// 			console.log(document.deptMap);
			// 			console.log('**********************************');
			//
			// 			alert('no record id');
			//
			// 		}
			//
			// 	});

			window.intRefresh = setTimeout(function(){
				//deptMap = eval("(" + deptMap + ")");
				location.href = location.href;
			//}, parseInt(50*60*1000));
			}, parseInt(10*60*1000)); // 10 minutes

			window.showVeil = setTimeout(function(){
				$('.veil').show();
			//}, parseInt(5*60*1000)); // 5 minutes
			}, parseInt(5000)); // 5 minutes

			$(document).on('mousemove keypress click', function() {
				$('.veil').hide();
				clearTimeout(intRefresh);
				clearTimeout(showVeil);
				intRefresh;
			});

			$(document).on('mousemove keypress', function() {
				doPauseTour();
			});

			/// weird style injection coming from somewhere
			$("style:not('#position')").remove();

			deptMap = eval("(" + deptMap + ")");
			bldgMap = eval("(" + bldgMap + ")");
			hallMap = eval("(" + hallMap + ")");

			console.log(hallMap);

			doTourLoop();

			//window.onerror = function() {
			//	location.reload();
			//}

			//window.addEventListener("error", function(){
			//	location.reload();
			//});

		});

	}

	//////////////////////////////////////////////////////////////////////////////////////

	function doPauseTour() {

		try {
			clearTimeout(unsetPause);
		} catch(err) { console.log(err) }

		console.log('pause tour');

		//clearInterval(intTour);
		//setTourInterval();

		pauseTour = true;

		window.unsetPause = setTimeout(function(){
			pauseTour = false;
		},parseInt(5*60*1000));

	}

	function setModeTheme() {

		alert('setModeTheme');

	}

	function loadKeyboard() {

		if (typeof keyboardIsLoaded != 'undefined') {
			if (keyboardIsLoaded == true) {
				return true;
			}
		}

		var isMobile = {
			Android: function() {
				return navigator.userAgent.match(/Android/i);
			},
			BlackBerry: function() {
				return navigator.userAgent.match(/BlackBerry/i);
			},
			iOS: function() {
				return navigator.userAgent.match(/iPhone|iPad|iPod/i);
			},
			Opera: function() {
				return navigator.userAgent.match(/Opera Mini/i);
			},
			Windows: function() {
				return navigator.userAgent.match(/IEMobile/i);
			},
			any: function() {
				return (isMobile.Android() || isMobile.BlackBerry() || isMobile.iOS() || isMobile.Opera() || isMobile.Windows());
			}
		};

		if (isMobile.any()) {
			// don't show the keyboard
		} else {
			$('input.filter').keyboard({
				theme: 'default',
				//is_hidden: false,
				close_speed: 1000,
				enabled: true,
				layout: 'en_US',
			});
			var pWid = $(window).width();
			var kLeft = parseInt( (pWid - 776) / 2 );
			$('div#keyboard').css({'left':kLeft+'px'});
		}

		window.keyboardIsLoaded = true;

	}

	function doPoiImage(id) {

		return true;

		$('.poi-box').remove();
		$('body').append('<div class="poi-box"><img src="images/pois/'+id+'.jpg"></div>').promise().then(function(){
			$('.poi-box').animate({
				'width': '25%',
				'opacity': '1'
			},500);
		});
	}

	function doPopupMap() {
		$('.poi-box').remove();
		$('.showpopmap').removeClass('showpopmap').promise().then(function(){
			//console.log(bldg);

			var wid = $(window).width(); // New width
			var hei = $(window).height(); // New height

			wid = parseInt(wid * .8);
			hei = parseInt(hei * .8);

			if (wid > 800) {
				wid = 800;
			}
			if (hei > 800) {
				hei = 800;
			}

			$('div.mapouter').attr('width',parseInt(wid+50));
			$('div.mapouter').attr('height',parseInt(hei+50));

			$('div.mapouter').find('iframe').attr('width',wid);
			$('div.mapouter').find('iframe').attr('height',hei);

			// 	if (bldg=='CRR') {
			// 		window.bmap = 'https://www.bing.com/maps/embed?h='+hei+'&w='+wid+'&cp=40.692685644753745~-73.96787007753449&lvl=15&typ=d&sty=r&src=SHELL&FORM=MBEDV8';
			// 		//window.bmap = 'includes/filterframes.php';
			// 		$('div.mapouter').find('iframe').attr('src',bmap);
			// 	}

			if (bldg=='W14') {
				window.bmap = 'https://maps.google.com/maps?q=144%20West%2014th%20Street&t=&z=15&ie=UTF8&iwloc=&output=embed';
				//window.bmap = 'includes/filterframes.php';
				$('div.mapouter').find('iframe').attr('src',bmap);
			}

			if (bldg=='FLSH') {
				window.bmap = 'https://maps.google.com/maps?q=Brooklyn%20Fashion%20%2B%20Design%20Accelerator&t=&z=15&ie=UTF8&iwloc=&output=embed';
				//window.bmap = 'includes/filterframes.php';
				$('div.mapouter').find('iframe').attr('src',bmap);
			}

			if (bldg=='CRR') {
				window.bmap = 'https://maps.google.com/maps?q=40.698393%2C%20-73.972519&t=&z=15&ie=UTF8&iwloc=&output=embed';
				//window.bmap = 'includes/filterframes.php';
				$('div.mapouter').find('iframe').attr('src',bmap);
			}

			$('div.map-'+bldg).addClass('showpopmap');
		});
		collapseMenus();
	}

	function hideAllPoints() {
		console.log('hideAllPoints');
		// 	var ambiarc = $("#ambiarcIframe")[0].contentWindow.Ambiarc;
		// 	$(mapStuff).each(function(){
		// 		console.log(this.properties.mapLabelId);
		// 		ambiarc.hideMapLabel(this.properties.mapLabelId, true);
		// 	});
	}

	function resetMenus() {
		console.log('resetMenus');
		$('.nav-menu').removeAttr('style');
		$('.poi-box').remove();
		$('.menu-open').removeClass('fade-out');
		$('.cat-wrap').addClass('fade-out');
		$('.reveal-horz').removeClass('reveal-horz');
		$('.reveal-vert').removeClass('reveal-vert');
		if ($('.showpopmap').css('opacity') > 0) {
			return true;
		}
		$('body').css({'pointer-events':'none'});
		$('.click-capture').remove();
	}

	function collapseMenus() {
		console.log('collapseMenus');
		setTimeout(function(){
			$('.subfly').animate({width: '0px', opacity: 0}).promise().then(function(){
				$('.subfly').removeClass('reveal-horz').promise().then(function(){
					setTimeout(function(){ $('.subfly').removeAttr('style'); }, 1);
					$('.flyout').animate({width: '0px', opacity: 0}).promise().then(function(){
						setTimeout(function(){
							$('.flyout').removeAttr('style');
							$('.flyout').removeClass('reveal-horz');
						}, 125);
						$('.nav-menu').animate({width: '0px', opacity: 0}).promise().then(function(){
							setTimeout(function(){
								$('.nav-menu').removeAttr('style');
								$('.nav-menu').removeClass('reveal-horz');
								resetMenus();
							}, 125);
						});
					});
				});
			});
		}, 125);
	}

	function searchFunction() {
		console.log('searchFunction');
		var filter = $("input.filter").val();
		$(".list-group-item").not(":containsi('" + filter + "')").addClass("hidden");
		$(".list-group-item:containsi('" + filter + "')").removeClass("hidden");
		var building = $("select.menu-buildings").val();
		if(building != "") {
			$(".list-group-item[data-building!='"+building+"']").addClass("hidden");
		}
	}

	/// delete this
	function searchPropertiesGkDept(find){

		return true;

		console.log('searchPropertiesGkDept');
		var ambiarc = $("#ambiarcIframe")[0].contentWindow.Ambiarc;
		for(var item in ambiarc.mapStuff) {
			if (ambiarc.mapStuff[item].user_properties.gkDepartment == '') {
				continue;
			}
			if (typeof ambiarc.mapStuff[item].user_properties.gkDepartment != 'undefined' ) {
				if (ambiarc.mapStuff[item].user_properties.gkDepartment.indexOf(find) != -1) {
					//console.log(mapStuff[item]);
					return true;
					break;
				}
			}
		}
		//console.log(find + ' +++ ' + (mapStuff[item].user_properties.gkDepartment));
		return false;
	}

	function checkImage(imgUrl) {

		console.log('checkImage');
		///return 'noImg';

		var imgExt = 'noImg';

		var http = new XMLHttpRequest();
		http.open('HEAD', imgUrl, false);
		http.send();

		//console.log(http.status);

		if (http.status == 404) {
			return 'noImg';
		} else {
			return 'hasImg';
		}

	}

	/// delete this
	function setupMenuAcademics() {

		return true;

		if (typeof academicsMenuIsLoaded != 'undefined') {
			if (academicsMenuIsLoaded == true) {
				return true;
			}
		}

		console.log('setupMenuAcademics');

		$(document.acad.academics).each(function(key, record){
			window.schoolList = Object.keys(record);
		});

		console.log(schoolList);

		var schoolArr = [];
		var schoolString = '';
		var subFly;
		$(schoolList).each(function(key0, level0){

			//console.log('setupMenuAcademics loop');

			schoolArr[key0] = '<span class="fly-box" data-cat="school" data-school="'+level0+'" >'+level0+'</span>';
			//schoolString += '<span class="fly-box" data-cat="school" data-school="'+level0+'" >'+level0+'</span>';
			subFly = '<div class="subfly" data-type="'+level0+'" >';
			$(document.acad.academics[level0]).each(function(key1, level1){
				for(var item in level1) {

					var menuHightlight = 'warn';
					if (searchPropertiesGkDept(item)) {
						menuHightlight = '';
					}

					//console.log(level1[item][0]);

					if (level1[item][0] == 'W14' || level1[item][0] == 'W18' || level1[item][0] == 'FLSH' || level1[item][0] == 'CRR') {
						var campLoc = 'offcamp';
					} else {
						var campLoc = 'oncamp';
					}

					subFly += '<span class="'+menuHightlight+' '+campLoc+'" data-bldg="'+level1[item][0]+'" data-cat="dept" data-dept="'+item+'">'+item+'</span>';
				}
			});
			subFly += '</div>';
			$('body').append(subFly);
		});

		console.log(schoolArr);

		schoolString = schoolArr.join('');

		$('div.academics').append(schoolString);

		window.academicsMenuIsLoaded = true;

	}

	// Tells Ambiarc to focus on a map label id
	function adjustMapFocus(target, mapLabelId, callback) {

		//alert('adjustMapFocus');

		console.log(target);
		console.log(mapLabelId);
		var i, tablinks;
		///var ambiarc = $("#ambiarcIframe")[0].contentWindow.Ambiarc;
		ambiarc.focusOnMapLabel(mapLabelId, 200);

		if (callback && typeof(callback) === "function") {
			callback();
		}

	}

