	function loadUiFunctions() {

		$(document).ready(function(){

			ambiarc = $("#ambiarcIframe")[0].contentWindow.Ambiarc;

			ambiarc.legendType	= '';
			ambiarc.ambiarcId	= '';
			ambiarc.recordId	= '';
			ambiarc.buildingId	= '';
			ambiarc.floorId		= ''; // alert('menu 11');
			ambiarc.roomName	= '';
			ambiarc.hasImage	= '';
			ambiarc.lat			= '';
			ambiarc.lon			= '';
			ambiarc.sculptureName	= '';
			ambiarc.sculptureArtist	= '';

			///console.log('loadUiFunctions');

			//window.doFloorSelected	= true;
			window.tourIsRunning	= false;
			window.pauseTour		= false;
			window.overhead			= false;
			window.keypadVisible	= false;

			window.timeoutVariables = '';

			window.winLat = '';
			window.winLon = '';

			//	alert(kioskLocation);

			// 	if (typeof kioskLocation != 'undefined' && kioskLocation.length > 0) {
			// 		var splitLoc = kioskLocation.split(',');
			// 		youAreHereLat = splitLoc[2];
			// 		youAreHereLon = splitLoc[3];
			// 		console.log('Kiosk Location: ' + youAreHereLat + ' - ' + youAreHereLon);
			// 	}

			// 	var x = document.getElementById("show_geoloc");
			// 	function getLocation() {
			// 		if (navigator.geolocation) {
			// 			navigator.geolocation.getCurrentPosition(showPosition);
			// 		} else {
			// 			x.innerHTML = "Geolocation is not supported by this browser.";
			// 		}
			// 	}
			// 	function showPosition(position) {
			// 		//x.innerHTML = "Latitude: " + position.coords.latitude + "<br>Longitude: " + position.coords.longitude;
			// 		x.innerHTML = '';
			//
			// 		youAreHereLat = position.coords.latitude;
			// 		youAreHereLon = position.coords.longitude;
			// 	}
			//
			// 	setInterval(getLocation, 5000);

			$.getJSON('https://json.geoiplookup.io/api?callback=?', function(data) {
				console.log(JSON.stringify(data, null, 2));
			});

			var pollMapStatus = setInterval(function(){

				//$('div.debug').html(currentMapStatus);

				ambiarc.getCameraRotation(function(rot){
					//$('div.debug').html(rot);
					//console.log(rot);

					$('.compass').css({
						//'transform': 'rotate('+ ((parseInt(rot)-10) * -1) +'deg)'
						'transform': 'rotate('+ (parseInt(rot) * -1) +'deg)'
					});
				});
			},125);

			// 	var pollSearchVisible = setInterval(function(){
			//
			// 		$('input.filter').keyboard({
			// 			is_hidden: true,
			// 		});
			//
			// 	},250);

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

			$(document).on('click', '.compass', function(e) {
				///console.log('compass click');
				///console.log(e);
				///console.log(overhead);
				if (overhead) {
					ambiarc.ExitOverheadCamera();
					overhead = false;
				} else {
					ambiarc.EnterOverheadCamera();
					setTimeout(function(){
						ambiarc.setCameraRotation(0, 0);
					},500);
					overhead = true;
				}
			});

			$(document).on("click", "li.list-group-item, span.fly-sculp, .cat-box, .fly-box", function(e){
				$('div.proh').fadeOut();
				clearLegendVariables('menu 133');
				allowFloorEvent = false;
			});

			$(document).on("click", ".reset", function(e){
				location.reload();
			});

			$(document).on("click", "img.provisions", function(e){

				params.provision = $(this).attr('data-provision');
				params.action	= 'displayProvisions';
				fetchPoisFromApi(params);

			});

			$(document).on("click", "li.list-group-item, span.fly-sculp", function(e){

				$('div.proh').fadeOut();

				clearMapLegend('menu 151');
				ambiarc = $("#ambiarcIframe")[0].contentWindow.Ambiarc;
				ambiarc.menuAction = 'yes';

				//window.doFloorSelected = false;

				var personAttr = $(this).attr('data-person');
				var professorAttr = $(this).attr('data-professor');

				if (typeof personAttr != 'undefined' || typeof professorAttr != 'undefined') {

					ambiarc.person = $(this).attr('data-person');
					ambiarc.building = $(this).attr('data-building');
					ambiarc.buildingId = $(this).attr('data-building');
					ambiarc.dept = $(this).attr('data-dept');
					ambiarc.title = $(this).attr('data-title');
					ambiarc.phone = $(this).attr('data-phone');
					ambiarc.office = $(this).attr('data-office');
					ambiarc.email = $(this).attr('data-email');
					ambiarc.lat = $(this).attr('data-lat');
					ambiarc.lon = $(this).attr('data-long');

					ambiarc.professor = $(this).attr('data-professor');
					ambiarc.course = $(this).attr('data-course');
					ambiarc.roomName = $(this).attr('data-room');
					ambiarc.times = $(this).attr('data-times');

					window.winLat = $(this).attr('data-lat');
					window.winLon = $(this).attr('data-long');

					if ($(this).attr('data-building') != '') {

						if ($(this).attr('data-building') == 'PFZR' || $(this).attr('data-building') == 'FLSH' || $(this).attr('data-building') == 'CRR' || $(this).attr('data-building') == 'W14') {
							window.bldg = $(this).attr('data-building');
							doPopupMap($(this).attr('data-building'));
							return true;
						} else {
							ambiarc.focusOnLatLonAndZoomToHeight(ambiarc.building, '', ambiarc.lat, ambiarc.lon, '75');
						}

					}

					popMapLegend2();

					return true;

				}

				params = {};
				params.bldg		= $(this).attr('data-building');
				params.floor	= $(this).attr('data-floorid');
				params.recordId	= $(this).attr('data-recordid');
				params.action	= 'focusAfterDataLoad';

				ambiarc.recordId = $(this).attr('data-recordid');
				//ambiarc.recordIdKeep = $(this).attr('data-recordid');
				ambiarc.hasImage = $(this).attr('data-hasimage');
				ambiarc.floorId = $(this).attr('data-floorid'); // alert('menu 132');

				/* TODO find better way to id outdoor points */
				if ($(this).attr('data-building') == 'SG' || $(this).attr('data-building') == 'PPS' || $(this).attr('data-building') == 'GATE') {

					//alert($(this).attr('data-building'));

					//ambiarc.buildingId = $(this).attr('data-building');
					ambiarc.pointLable = $(this).attr('data-building');
					ambiarc.roomName = $(this).attr('data-keywords');

					if ($(this).attr('data-building') == 'PPS') {
						ambiarc.sculptureName = 'Pratt Public Safety';
					}

					if ($(this).attr('data-building') == 'GATE') {
						ambiarc.sculptureName = 'Campus Gate';
					}

					winLat		= $(this).attr('data-lat');
					winLon		= $(this).attr('data-long');
					var heightAboveFloor = '50';

					/// focusing on a point is hard?

					params.action = 'focusOutdoorPoint';

					if ($(this).attr('data-building') == 'SG') {
						//alert('here');
						//ambiarc.setCameraRotation(45, 0);

						var sculpture = $(this).attr('data-value');
						var split = sculpture.split(' :: ');

						ambiarc.legendType		= 'menuBuilding';
						ambiarc.sculptureName	= split[0];
						ambiarc.sculptureArtist	= split[1];

					}

				}

				fetchPoisFromApi(params);

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

			// pass click event down to the span
			//$(document).on('click', '.menu-category', function(){
			//	$(this).find('span.cat-box:first').trigger('click');
			//	return false;
			//});

			$('.menu-category').mousedown(function(){
				if ($(this).find('span.cat-box:first').hasClass('cat-box-search') ) {
					// do not tigger
				} else {
					$(this).find('span.cat-box:first').trigger('click');
				}
			});

			$(document).on('click', 'img.proh', function() {
				$('.reveal-horz').removeClass('reveal-horz');
				$('div.proh').fadeIn();
			});

			$(document).on('click', '.cat-box', function() {

				$('div.proh').fadeOut();

				if ($(this).hasClass('cat-box-search') && $('div.search-box').css('opacity') > 0) {
					return false;
				}

				//var ambiarc = $("#ambiarcIframe")[0].contentWindow.Ambiarc;
				//ambiarc.clearDirections();

				deleteAllLabels();

				$('.reveal-horz').removeClass('reveal-horz');
				var pos = $(this).closest('div').position();
				//var maxHei = parseInt($(window).height());
				var maxHei = parseInt($(document).height());
				var type = $(this).attr('data-type');

				$('div.'+type).css({'maxHeight':maxHei});
				$('div.'+type).addClass('reveal-horz');
				$("style:not('#position')").remove();
				var getStyle = $("style[data-type='"+type+"']");
				if (getStyle.length < 1) {
					var style = document.createElement('style');
					style.id = 'position';
					style.type = 'text/css';
					style.setAttribute('data-type', type);
					//style.innerHTML = '.'+type+'{left:'+pos.left+';max-height:'+maxHei+';}';
					style.innerHTML = '.'+type+'{max-height:'+maxHei+';}';
					document.getElementsByTagName('head')[0].appendChild(style);
				}

				if (type == 'search-box') {
					$('input.filter').focus();
				}

			});

			$(document).on('click touch touchstart touchend', '.click-capture', function() {
				ambiarc.menuAction = 'no';
				$('.showpopmap').removeClass('showpopmap');
				///console.log('~~collapseMenus~~');
				collapseMenus();
			});

			$('.flyout').on('mouseleave touchend', function(e){
				//alert(e.offsetX + ' -- ' + e.offsetY);
				if (typeof e.offsetX == 'undefined') {
					return true;
				}
				var elem = this;
				var close = true;
				//$('.subfly').each(function(){
				$('.flyout').each(function(){
					if ($(this).css('opacity') < 1) {
						close = false;
					}
				});
				if (close == true && keypadVisible == false) {
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
			}).on('mouseenter touchstart', function(){
				clearTimeout(document.close_flyout);
			});

			$(document).keyup(function(e) {
				if (e.keyCode === 27) {
					$('.showpopmap').removeClass('showpopmap');
					resetMenus();
				}
			});

			$(document).on('click', '*', function(e) {
				///console.log('dom click event '+e);

				var ambiarc = $("#ambiarcIframe")[0].contentWindow.Ambiarc;
				ambiarc.clearDirections();

				$('.veil').hide();
				$('.capture').hide();
				hidePopMap();
				//console.log(e.target.nodeName);
				if (e.target.nodeName=='BODY' || e.target.nodeName=='HTML') {
					$('.flyout').each(function(){
						if ($(this).css('opacity') < 1) {
							return true;
						}
					});
					resetMenus();
				}
			});

			$(document).on("keyup", "input.filter", function(e){
				//alert(this.value);
				searchFunction();
			});

			$(document).on('click', '.fly-box', function(e) {

				//var ambiarc = $("#ambiarcIframe")[0].contentWindow.Ambiarc;
				//ambiarc.clearDirections();

				skipPointLoad = false;

				$('img.access').remove();

				params = {};

				$('<div class="click-capture"></div>').insertBefore('div.veil-box');

				if ($(this).attr('data-cat') == 'sculptures') {
					return false;
				}

				clearMapLegend('menu 405');

				var ambiarc = $("#ambiarcIframe")[0].contentWindow.Ambiarc;
				ambiarc.menuAction = 'yes';

				if ($(this).attr('data-lat')) {
					winLat = $(this).attr('data-lat');
					winLon = $(this).attr('data-long');
				}

				//window.doFloorSelected = false;

				$('.subfly').removeClass('reveal-horz');
				var pos = $(this).closest('div').position();
				var wid = $(this).closest('div').width();
				var left = parseInt(pos.left + wid);
				//alert(wid + ' -- ' + left);

				var cat = $(this).attr('data-cat');
				var type = $(this).attr('data-'+cat);

				//ambiarc.legendType = 'menuOther';

				if (cat == 'school') {

					$("[data-type='"+type+"']").css({left:left});
					$("[data-type='"+type+"']").addClass('reveal-horz');

				} else {

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

					if ($(this).attr('data-bldg') == 'FLSH' || $(this).attr('data-bldg') == 'CRR' || $(this).attr('data-bldg') == 'W14') {
						doPopupMap($(this).attr('data-bldg'));
						return true;
					}

					if ($(this).attr('data-cat') == 'office' || $(this).attr('data-cat') == 'facility' || $(this).attr('data-cat') == 'dept') {

						ambiarc.recordId = $(this).attr('data-recordid');

						params.recordId = $(this).attr('data-recordid');
						params.label = $(this).attr('data-dept');
						params.bldg = $(this).attr('data-bldg');
						params.action = 'focusAfterDataLoad';

					}

					if ( $(this).attr('data-cat') == 'buildings' || $(this).attr('data-cat') == 'proh' ) {

						ambiarc.legendType		= 'menuBuilding';
						ambiarc.ambiarcId		= '';
						ambiarc.buildingId		= $(this).attr('data-buildingid');
						ambiarc.floorId			= $(this).attr('data-floorid'); // alert('menu 382');
						ambiarc.roomName		= $(this).attr('data-roomname');
						ambiarc.roomNo			= $(this).attr('data-roomno');
						ambiarc.lat				= $(this).attr('data-lat');
						ambiarc.lon				= $(this).attr('data-long');

						if ( $(this).closest('div').hasClass('accessibility') ) {

							ambiarc.legendType = 'menuBuildingAccessibility';
							//ambiarc.buildingId		= $(this).attr('data-buildingid');
							//ambiarc.floorId			= ''; // alert('menu 382');

							rotation = [];
							rotation['0021'] = '45'; // Activity Res Ctr
							rotation['0003'] = '145'; // Dekalb Hall
							rotation['0009'] = '290'; // East Hall
							rotation['0019'] = '45'; // Film Video
							rotation['0004'] = '45'; // Higgins Hall
							rotation['0001'] = '0'; // Information Science Center
							rotation['0002'] = '0'; // Library
							rotation['0016'] = '130'; // Machinery
							rotation['0015'] = '130'; // Chemistry
							rotation['0017'] = '130'; // Engineering
							rotation['0024'] = '0'; // Myrtle Hall
							rotation['0013'] = '135'; // Pantas Hall
							rotation['0018'] = '135'; // Pratt Studios
							rotation['0022'] = '0'; // Stabile Hall
							rotation['0006'] = '270'; // Memorial Hall through SU
							rotation['0007'] = '270'; // Student Union
							rotation['0008'] = '270'; // Main Bldg through SU
							rotation['0012'] = '45'; // Thrift Hall
							rotation['0014'] = '270'; // Willoughby Hall
							rotation = rotation[ambiarc.buildingId];

							zoom = [];
							zoom['0021'] = '100'; // Activity Res Ctr
							zoom['0003'] = '100'; // Dekalb Hall
							zoom['0009'] = '100'; // East Hall
							zoom['0019'] = '100'; // Film Video
							zoom['0004'] = '100'; // Higgins Hall
							zoom['0001'] = '100'; // Information Science Center
							zoom['0002'] = '100'; // Library
							zoom['0016'] = '100'; // Machinery
							zoom['0015'] = '100'; // Chemistry
							zoom['0017'] = '100'; // Engineering
							zoom['0024'] = '100'; // Myrtle Hall
							zoom['0013'] = '100'; // Pantas Hall
							zoom['0018'] = '100'; // Pratt Studios
							zoom['0022'] = '100'; // Stabile Hall
							zoom['0006'] = '100'; // Memorial Hall through SU
							zoom['0007'] = '100'; // Student Union
							zoom['0008'] = '100'; // Main Bldg through SU
							zoom['0012'] = '100'; // Thrift Hall
							zoom['0014'] = '100'; // Willoughby Hall
							zoom = zoom[ambiarc.buildingId];

							//ambiarc.rotateCamera(rot, 0.2);

							params.accessible		= 'Y';
							params.bldg				= ambiarc.buildingId;
							params.floor			= $(this).attr('data-floorid');
							params.action			= 'doAccessibilityThing';
							params.lat					= $(this).attr('data-lat');
							params.lon					= $(this).attr('data-long');

							params.accessLat			= $(this).attr('data-acclat');
							params.accessLon			= $(this).attr('data-acclong');

							///console.log('this this this this this this this this this this this this this this this this ');
							///console.log(this);
							///console.log('this this this this this this this this this this this this this this this this ');

							params.bldgLat			= $(this).attr('data-bldglat');
							params.bldgLon			= $(this).attr('data-bldglong');

							params.heightAboveFloor = zoom;
							params.rotation			= rotation;

							fetchPoisFromApi(params);

							return true;

						} else {

							if ( $(this).attr('data-cat') == 'proh' ) {

								ambiarc.legendType		= 'proh';

								params.accessible		= 'N';
								params.recordId			= $(this).attr('data-recordid');
								params.bldg				= $(this).attr('data-buildingid');
								params.floor			= $(this).attr('data-floorid');
								params.roomno			= $(this).attr('data-roomno');
								params.action			= 'doProhThing';

								params.lat				= $(this).attr('data-lat');
								params.lon				= $(this).attr('data-long');

								fetchPoisFromApi(params);

								return true;

							} else {

								popMapLegend2(1000,500,7000);
								ambiarc.focusOnLatLonAndZoomToHeight(ambiarc.buildingId, '', winLat, winLon, '125');

							}

						}

						createPointLabel(ambiarc.buildingId,ambiarc.floorId);
						return true;
					}

					ambiarc.legendType = 'menuOther';
					ambiarc.ambiarcId = '';
					ambiarc.buildingId = '';
					ambiarc.floorId = $(this).attr('data-floorid'); // alert('menu 482');
					ambiarc.roomName = $(this).html();
					ambiarc.roomNo = $(this).attr('data-roomno');
					ambiarc.lat = $(this).attr('data-lat');
					ambiarc.lon = $(this).attr('data-long');

					if ($(this).attr('data-label') != '') {
						ambiarc.roomName = $(this).attr('data-label');
					}

					if ( $(this).attr('data-bldg') == 'PPS' || $(this).attr('data-bldg') == 'GATE' ) {

						ambiarc.pointLable = $(this).attr('data-bldg');
						ambiarc.roomName = $(this).attr('data-keywords');
						ambiarc.floorId = ''; // alert('menu 492');

						if ($(this).attr('data-bldg') == 'PPS') {
							ambiarc.sculptureName = 'Pratt Public Safety';
						}

						if ($(this).attr('data-bldg') == 'GATE') {
							ambiarc.sculptureName = 'Campus Gate';
						}

						window.winLat = ambiarc.lat;
						window.winLon = ambiarc.lon;

						ambiarc.focusOnLatLonAndZoomToHeight('', '', ambiarc.lat, ambiarc.lon, '50');
					}

					fetchPoisFromApi(params);
				}
			});

			$(document).on('click', '.reset-map', function() {
				$(this).attr('disabled','disabled');
				$('.click-capture').remove();
				resetMap();
			});

			$(document).on('click', '.reset-map-vert', function() {
				$('.click-capture').remove();
				resetMap();
			});

			window.intRefresh = setTimeout(function(){
				location.href = location.href;
			}, parseInt(10*60*1000)); // 10 minutes

			window.showVeil = setTimeout(function(){
				$('.veil').show();
			//}, parseInt(5*60*1000)); // 5 minutes
			}, parseInt(5000)); // 5 minutes

			$(document).on('mousemove keypress click', function() {
				$('.veil').hide();
				$('.capture').hide();
				clearTimeout(intRefresh);
				clearTimeout(showVeil);
				intRefresh;
			});

			$(document).on('mousemove keypress', function() {
				doPauseTour();
			});

			/// weird style injection coming from somewhere
			$("style:not('#position')").remove();

			//deptMap = eval("(" + deptMap + ")");
			bldgMap = eval("(" + bldgMap + ")");
			hallMap = eval("(" + hallMap + ")");

			doTourLoop();

		});

//		prattCopy['0001'] = '<span class="copy-bold">Information Science Center <br>(ISC Building)</span> <br>1954-55. Renovated 1973 <br>Architects: Firm of McKim, Mead and White <br><br>Built as a dormitory for women at the same time DeKalb Hall was built for men. By the 1960s after the acquisition of Willoughby Hall, both buildings were being used for offices and classrooms. They had been built during the extensive PrattArea Urban Renewal under the direction of Robert Moses. The renovation made extensive changes for the Graduate School of Information and Library Science as well as for a large computer laboratory.';

// 		prattCopy['0002'] = '<span class="copy-bold">Library</span> <br>1896. Renovated 1982 <br>Architect: William B. Tubby, <br>Interiors by Tiffany firm. <br>Renovation by Cavaglieri and Gran. <br><br>There was a small library in the Main building when the school began in 1887. The splendid Victorian Renaissance revival structure was built as a public as well as a college library. There was emphasis on service to local children. In 1912, a copy of a Romanesque porch was added to the children\'s entrance. This was relocated near the ARC building during the renovation of 1982. The north porch was added in 1936 by John Mead Howells, and is now an office. Pratt\'s library was the first free Library in New York City. However, as the Institute grew and the public library system expanded, it ceased being a public library in 1941. The elegant interiors, originally designed by the Louis Tiffany firm have a magnificent marble and brass central staircase. The mosaic and glass floors are also noteworthy. The renovation in 1982 enhanced the building and brought an elevator as well as a below-ground wing. The building was designated a New York City Landmark in 1986.';
//
// 		prattCopy['0003'] = '<span class="copy-bold">DeKalb Hall</span> <br>1954-55 <br>Architects: Firm of McKim, Mead and White <br><br>Originally a men\'s dormitory designed by the same firm which built theInformation Science Building and North Hall during the urban renewal projectwhich radically reshaped the campus. This is now a building which has classrooms and several offices, including Financial Aid and the Bursar.';
//
// 		prattCopy['0004'] = '<span class="copy-bold">Higgins Hall</span> <br>1868-1890 <br>Architects: Mundell and Teckritz, Ebenezer L. Roberts, <br>Charles C. Haight and William B. Tubby. <br><br>This was Adelphi Academy, a private school which has evolved into Adelphi University in Garden City, and Adelphi Academy in Bay Ridge, Brooklyn. The original academic building was by Mundell and Teckritz, built in 1868. Pratt acquired the building in the l960s and it houses much of the School of Architecture.';
//
// 		prattCopy['0005'] = '<span class="copy-bold">North Hall</span> <br>1958 <br>Architects: Firm of McKim, Mead and White <br><br>Built a little later than DeKalb Hall and the ISC Building by the same architects. Although this firm retained the name of one of America\'s most important firms, it was long after the demise of the famous Charles Follen McKim (1847-1909) and Stanford White (1853-1906). This was originally called the College Union, and currently houses the cafeteria, Security headquarters, a bank and classrooms.';
//
// 		prattCopy['0006'] = '<span class="copy-bold">Memorial Hall</span> <br>1926-7 <br>Architect: John Mead Howells <br>Sculptor: Rene Chambellan <br><br>A large auditorium/theater built by the Pratt family in memory of Mary Richardson Pratt, the wife of the founder, Charles Pratt. Originally, it was a lecture hall with a cafeteria below. Currently in need of restoration, it is infrequently used.';
//
// 		prattCopy['0007'] = '<span class="copy-bold">Student Union</span> <br>1887 <br>Architect: William B. Tubby <br><br>Built originally as the Trade School Building with a handsome wood truss roof,this was used for courses on brick laying, plumbing and sign painting before it became the old gymnasium. There is a small swimming pool (actually called a\"swimming tank\" and the first to admit women in Brooklyn) still located under thestaging area on the east side of the building. In 1982, this building was remodeled for use as a student union.';
//
// 		prattCopy['0008'] = '<span class="copy-bold">Main Building</span> <br>1887 <br>Architects: Hugo Lamb and Charles A. Rich <br><br>Lamb and Rich was a noted architectural firm in the late 19th century, and here it reflected the influence of H. H. Richardson. This is the original Pratt Institute building constructed of brick in the Romanesque revival style. The porch was added in 1895. It has always housed both offices and classrooms. Today it includes offices of the President as well as the Provost, Dean of Students and the Dean of the School of Art and Design.';
//
// 		prattCopy['0009'] = '<span class="copy-bold">East Building</span> <br>1887 <br>Architect: William Windrim <br><br>Although this is part of the original building complex and is connected to the Main Building, it had a different architect. It is an \"L\" shaped structure andthe fifth floor or the north/south section was a later addition. The building wraps around an attractive courtyard and the first floor houses Pratt\'s Power Generating Plant, a National Historic Mechanical Engineering Landmark. There is a viewing area for the power plant, and also on the first floor are the offices of Career Services, Student Activities, International Student Affairs and the Chapel. This was originally called the Mechanical Arts Building. Upper floors contain classrooms and some offices.';
//
// 		prattCopy['0010'] = '<span class="copy-bold">South Hall</span> <br>1889-92 <br>Architect: William B. Tubby <br><br>Designed by the same architect as the Library, this was originally the Pratt High School, a three-year coed program. When that was discontinued, this became the Household Science and then the Costume Design Building. It now has offices for the Fine Arts Department and classrooms for art and design.';
//
// 		prattCopy['0011'] = '<span class="copy-bold">Esther Lloyd Jones Hall</span> <br>1921 <br>Architect: unknown <br><br>A private apartment building which had the address of 243 Ryerson Street. It was purchased by Pratt Institute in 1964 and became a residence hall.';
//
// 		prattCopy['0012'] = '<span class="copy-bold">Thrift Hall</span> <br>1916-17 <br>Architects: Shampan and Shampan <br><br>This was a savings bank which had been founded on the campus by Charles Pratt in 1889, meant to teach students and others the value of thrift. Today it houses various offices, including that of the Registrar.';
//
// 		prattCopy['0013'] = '<span class="copy-bold">Leo J. Pantas Hall</span> <br>1986-87 <br>Architects: Skidmore, Owings and Merrill <br><br>A contemporary residence for students, situated on DeKalb Avenue between Thrift Hall and the Studio Building. The attractive brick structure fits well into the campus, and the clock tower echoes the clock on the Main Building.';
//
// 		prattCopy['0014'] = '<span class="copy-bold">Willoughby Hall</span> <br>1957 <br>Architect: S. J. Kessler <br><br>Built as a private apartment building during the urban renewal project under Robert Moses. The building was acquired as the main residence hall for Pratt Institute in the early 1960s. There are apartments on the top (17th) floor for faculty and staff.';
//
// 		prattCopy['0015'] = '<span class="copy-bold">Chemistry Building</span> <br>1904-05 <br>Architects: Howells and Stokes <br><br>John Mead Howells (1868-1959) and I.N. Phelps Stokes (1867-1944) were each noted architects earlier in the twentieth century. Working together, they built this as the first of the three buildings which have been known as the Engineering complex. Despite its name, this building is no longer used for the study of chemistry. The first floor houses the Rubelle and Norman Schaffler Gallery, a major exhibition space. The lower level is occupied by the Printmaking area and there are art and design studios on the upper floors. The building was extensively remodeled in 1985-86.';
//
// 		prattCopy['0016'] = '<span class="copy-bold">Machinery Building</span> <br>1914 <br>Architects: Howells and Stokes <br><br>The architects who had, a decade before, designed the Chemistry Building built this as the Manual Training Building. Connected to the Chemistry and Engineering buildings, for many years it was filled with heavy industrial machinery for student use. Today the building is used by the School of Art and Design and there are sculpture and ceramic studios in it.';
//
// 		prattCopy['0017'] = '<span class="copy-bold">Engineering Building</span> <br>1928-29. Extended in 1935. <br>Architect: John Mead Howells <br><br>The most recent of the three buildings in this group. It connects to the Machinery and Chemistry buildings and houses classrooms for various programs.';
//
// 		prattCopy['0018'] = '<span class="copy-bold">Steuben Hall</span> <br>Date: unknown <br>Architect: unknown <br><br>Previously, this was the United Metals factory, which manufactured small metal items. Acquired by Pratt in the early 1970s, the first floor has offices for Campus Management and mail services. PICCED occupies attractively renovated space on the second floor. Most of the rest of the building is used for storage and awaits remodeling. <br><br><span class="copy-bold">Pratt Studio Building</span> <br>Date: unknown <br>Architect: unknown <br>Former industrial building acquired by Pratt in 1962, and converted for use asart and design studios.';
//
// 		prattCopy['0019'] = 'Pratt Institute recently opened a new home for the Film/Video Department in the former Prattstore building at 550 Myrtle Avenue on the Brooklyn campus. The 15,000-square-foot facility was designed by WASA/Studio A with lead architect and Pratt alumnus Jack Esterson. The project was recognized with a citation award in the 2015 American Institute of Architects New York State Design Awards.';
//
// 		prattCopy['0020'] = '--';
//
// 		prattCopy['0021'] = '<span class="copy-bold">Activities Resource Center <br>(ARC Building)</span> <br>1974-75 <br>Architects: Ezra Ehrenkranz (lower level), Daniel Tully (upper level) <br><br>This large building was built to serve many functions. The upper level is a huge gymnasium, while the lower level has classrooms and laboratories. There are facilities for film, photography and computers. The concrete exterior has no windows and displays a fanciful tent-like roofing system.';
//
// 		prattCopy['0022'] = '<span class="copy-bold">Vincent A. Stabile Hall</span> opened in the Fall of 1999. Named for the donor and graduate of the Engineering School, Stabile Hall was designed to house new undergraduate students. It houses 224 freshman students in four-person suites. Each suite consists of two double rooms with a shared bath. Suites are single sex, but floors are coed. With few exceptions, the room dimensions, not including the small entry foyer, are 12\' x 12\'. Each suite is responsible for the healthy upkeep of the common bathroom area. There are kitchenettes located on each floor. The award-winning design of the building boasts a large common lounge with smaller work and lounge spaces on each floor, all of which contribute to a vital living and working environment. All rooms are air conditioned. Stabile Hall hosts the Healthy Choices and Global Learning communities.';
//
// 		prattCopy['0023'] = '<span class="copy-bold">Cannoneer Court</span> <br>1986-87 <br>Architects: Skidmore, Owings and Merrill <br><br>A rather stark-looking residence hall on the most eastern part of the campus on an area which had been an athletic field. It is connected to the ARC building and was built from pre-fabricated units.';
//
// 		prattCopy['0024'] = 'The building, which is located at 536 Myrtle Avenue between Grand Avenue and Steuben Street, was designed by multi-disciplinary architectural firm WASA/Studio A under the leadership of principal Jack Esterson, who received a bachelor\'s degree in architecture from Pratt in 1975. <br>Myrtle Hall recently met the United States Green Building Council standards for LEED (Leadership in Energy and Environmental Design) Gold certification based on its eco-features that include exterior sun shades; a green roof that absorbs rainwater, reflects heat, and sequesters greenhouse gasses; and solar photo-voltaic panels that generate on-site electricity. It is the first higher education building project in Brooklyn to receive any LEED certification and the first academic building to receive a LEED-gold certification in Brooklyn.';
//
// 		prattCopy['pps'] = 'The Pratt Institute Department of Public Safety provides 24&#8209;hour protection to the campus. Public Safety Officers are charged with the enforcement of Pratt Institute rules and regulations. They are staff employees and are responsible for a full range of services, including preparation of crime and condition reports, response to emergencies, conducting fire drills, and any other situation requiring security assistance. Contact us at security@pratt.edu or at 718.636.3540.';

		prattCopy['0001'] = '<span class="copy-bold">Information Science Center <br>(ISC Building)</span> <br>1954-55. Renovated 1973 <br>Architects: Firm of McKim, Mead and White <br><br>Built as a dormitory for women at the same time DeKalb Hall was built for men. By the 1960s after the acquisition of Willoughby Hall, both buildings were being used for offices and classrooms. They had been built during the extensive Pratt Area Urban Renewal under the direction of Robert Moses.';

		prattCopy['0002'] = '<span class="copy-bold">Library</span> <br>1896. Renovated 1982 <br>Architect: William B. Tubby, <br>Interiors by Tiffany firm. <br>Renovation by Cavaglieri and Gran. <br><br>The splendid Victorian Renaissance revival structure was built as a public as well as a college library. There was emphasis on service to local children. In 1912, a copy of a Romanesque porch was added to the children\'s entrance. This was relocated near the ARC building during the renovation of 1982. The north porch was added in 1936 by John Mead Howells. Pratt\'s library was the first free Library in New York City. However, as the Institute grew and the public library system expanded, it ceased being a public library in 1941. The elegant interiors, originally designed by the Louis Tiffany firm have a magnificent marble and brass central staircase. The mosaic and glass floors are also noteworthy. The renovation in 1982 enhanced the building and brought an elevator as well as a below-ground wing. The building was designated a New York City Landmark in 1986.';

		prattCopy['0003'] = '<span class="copy-bold">DeKalb Hall</span> <br>1954-55 <br>Architects: Firm of McKim, Mead and White <br><br>Originally a men\'s dormitory designed by the same firm which built the Information Science Building and North Hall during the urban renewal project which radically reshaped the campus.';

		prattCopy['0004'] = '<span class="copy-bold">Higgins Hall</span> <br>1868-1890 <br>Architects: Mundell and Teckritz, Ebenezer L. Roberts, <br>Charles C. Haight and William B. Tubby. <br><br>This was Adelphi Academy, a private school which has evolved into Adelphi University in Garden City, and Adelphi Academy in Bay Ridge, Brooklyn. The original academic building was by Mundell and Teckritz, built in 1868. Pratt acquired the building in the l960s and it houses much of the School of Architecture.';

		prattCopy['0005'] = '<span class="copy-bold">North Hall</span> <br>1958 <br>Architects: Firm of McKim, Mead and White <br><br>Built a little later than DeKalb Hall and the ISC Building by the same architects. Although this firm retained the name of one of America\'s most important firms, it was long after the demise of the famous Charles Follen McKim (1847-1909) and Stanford White (1853-1906).';

		prattCopy['0006'] = '<span class="copy-bold">Memorial Hall</span> <br>1926-7 <br>Architect: John Mead Howells <br>Sculptor: Rene Chambellan <br><br>A large auditorium/theater built by the Pratt family in memory of Mary Richardson Pratt, the wife of the founder, Charles Pratt.';

		prattCopy['0007'] = '<span class="copy-bold">Student Union</span> <br>1887 <br>Architect: William B. Tubby <br><br>Built originally as the Trade School Building with a handsome wood truss roof,this was used for courses on bricklaying, plumbing and sign painting before it became the old gymnasium. There was a small swimming pool (actually called a\"swimming tank\" and the first to admit women in Brooklyn) located under the staging area on the east side of the building.';

		prattCopy['0008'] = '<span class="copy-bold">Main Building</span> <br>1887 <br>Architects: Hugo Lamb and Charles A. Rich <br><br>Lamb and Rich was a noted architectural firm in the late 19th century, and here it reflected the influence of H. H. Richardson. This is the original Pratt Institute building constructed of brick in the Romanesque revival style. The porch was added in 1895.';

		prattCopy['0009'] = '<span class="copy-bold">East Building</span> <br>1887 <br>Architect: William Windrim <br><br>Although this is part of the original building complex and is connected to the Main Building, it had a different architect. It is an \"L\" shaped structure and the fifth floor or the north/south section was a later addition. The building wraps around an attractive courtyard and the first floor houses Pratt\'s Power Generating Plant, a National Historic Mechanical Engineering Landmark.';

		prattCopy['0010'] = '<span class="copy-bold">South Hall</span> <br>1889-92 <br>Architect: William B. Tubby <br><br>Designed by the same architect as the Library, this was originally the Pratt High School, a three-year coed program. When that was discontinued, this became the Household Science and then the Costume Design Building.';

		prattCopy['0011'] = '<span class="copy-bold">Esther Lloyd Jones Hall</span> <br>1921 <br>Architect: unknown <br><br>A private apartment building which had the address of 243 Ryerson Street. It was purchased by Pratt Institute in 1964 and became a residence hall.';

		prattCopy['0012'] = '<span class="copy-bold">Thrift Hall</span> <br>1916-17 <br>Architects: Shampan and Shampan <br><br>This was a savings bank which had been founded on the campus by Charles Pratt in 1889, meant to teach students and others the value of thrift.';

		prattCopy['0013'] = '<span class="copy-bold">Leo J. Pantas Hall</span> <br>1986-87 <br>Architects: Skidmore, Owings and Merrill <br><br>A contemporary residence for students, situated on DeKalb Avenue between Thrift Hall and the Studio Building. The attractive brick structure fits well into the campus, and the clock tower echoes the clock on the Main Building.';

		prattCopy['0014'] = '<span class="copy-bold">Willoughby Hall</span> <br>1957 <br>Architect: S. J. Kessler <br><br>Built as a private apartment building during the urban renewal project under Robert Moses. The building was acquired as the main residence hall for Pratt Institute in the early 1960s.';

		prattCopy['0015'] = '<span class="copy-bold">Chemistry Building</span> <br>1904-05 <br>Architects: Howells and Stokes <br><br>John Mead Howells (1868-1959) and I.N. Phelps Stokes (1867-1944) were each noted architects earlier in the twentieth century. Working together, they built this as the first of the three buildings which have been known as the Engineering complex. Despite its name, this building is no longer used for the study of chemistry. The building was extensively remodeled in 1985-86.';

		prattCopy['0016'] = '<span class="copy-bold">Machinery Building</span> <br>1914 <br>Architects: Howells and Stokes <br><br>The architects who had, a decade before, designed the Chemistry Building built this as the Manual Training Building. Connected to the Chemistry and Engineering buildings, for many years it was filled with heavy industrial machinery for student use.';

		prattCopy['0017'] = '<span class="copy-bold">Engineering Building</span> <br>1928-29. Extended in 1935. <br>Architect: John Mead Howells <br><br>The most recent of the three buildings in this group. It connects to the Machinery and Chemistry buildings.';

		prattCopy['0018'] = '<span class="copy-bold">Steuben Hall</span> <br>Date: unknown <br>Architect: unknown <br><br>Previously, this was the United Metals factory, which manufactured small metal items and was acquired by Pratt in the early 1970s. <br><br><span class="copy-bold">Pratt Studio Building</span> <br>Date: unknown <br>Architect: unknown <br><br>Former industrial building acquired by Pratt in 1962, and converted for use as art and design studios.';

		prattCopy['0019'] = '<span class="copy-bold">Film/Video Building</span> <br>Date: 2015 <br>Architect: WASA/Studio, Jack Esterson<br>lead architect and Pratt alumnus  <br><br>Pratt Institute recently opened a new home for the Film/Video Department in the former Prattstore building at 550 Myrtle Avenue on the Brooklyn campus. The 15,000-square-foot facility was designed by WASA/Studio A with lead architect and Pratt alumnus Jack Esterson. The project was recognized with a citation award in the 2015 American Institute of Architects New York State Design Awards.';

		prattCopy['0020'] = '--';

		prattCopy['0021'] = '<span class="copy-bold">Activities Resource Center <br>(ARC Building)</span> <br>1974-75 <br>Architects: Ezra Ehrenkranz (lower level), Daniel Tully (upper level) <br><br>This large building was built to serve many functions. The upper level is a huge gymnasium, while the lower level has classrooms and laboratories. The concrete exterior has no windows and displays a fanciful tent-like roofing system.';

		prattCopy['0022'] = '<span class="copy-bold">Vincent A. Stabile Hall</span> opened in the Fall of 1999. Named for the donor and graduate of the Engineering School, Stabile Hall was designed to house new undergraduate students. The award-winning design of the building boasts a large common lounge with smaller work and lounge spaces on each floor, all of which contribute to a vital living and working environment.';

		prattCopy['0023'] = '<span class="copy-bold">Cannoneer Court</span> <br>1986-87 <br>Architects: Skidmore, Owings and Merrill <br><br>A rather stark-looking residence hall on the most eastern part of the campus on an area which had been an athletic field. It is connected to the ARC building and was built from prefabricated units.';

		//prattCopy['0024'] = '<span class="copy-bold">Myrtle Hall</span> <br>Date: -- <br>Architect: WASA/Studio, Jack Esterson<br>lead architect and Pratt alumnus <br><br>The building, which is located at 536 Myrtle Avenue between Grand Avenue and Steuben Street, was designed by multi-disciplinary architectural firm WASA/Studio A under the leadership of principal Jack Esterson, who received a bachelor\'s degree in architecture from Pratt in 1975. <br>Myrtle Hall recently met the United States Green Building Council standards for LEED (Leadership in Energy and Environmental Design) Gold certification based on its eco-features that include exterior sun shades; a green roof that absorbs rainwater, reflects heat, and sequesters greenhouse gasses; and solar photo-voltaic panels that generate on-site electricity. It is the first higher education building project in Brooklyn to receive any LEED certification and the first academic building to receive a LEED-gold certification in Brooklyn.';
		prattCopy['0024'] = '<span class="copy-bold">Myrtle Hall</span> <br>Architect: WASA/Studio, Jack Esterson<br>lead architect and Pratt alumnus <br><br>The building, which is located at 536 Myrtle Avenue between Grand Avenue and Steuben Street, was designed by multi-disciplinary architectural firm WASA/Studio A under the leadership of principal Jack Esterson, who received a bachelor\'s degree in architecture from Pratt in 1975. <br>Myrtle Hall recently met the United States Green Building Council standards for LEED (Leadership in Energy and Environmental Design) Gold certification based on its eco-features that include exterior sun shades; a green roof that absorbs rainwater, reflects heat, and sequesters greenhouse gasses; and solar photo-voltaic panels that generate on-site electricity. It is the first higher education building project in Brooklyn to receive any LEED certification and the first academic building to receive a LEED-gold certification in Brooklyn.';

 		prattCopy['pps'] = 'The Pratt Institute Department of Public Safety provides 24&#8209;hour protection to the campus. Public Safety Officers are charged with the enforcement of Pratt Institute rules and regulations. They are staff employees and are responsible for a full range of services, including preparation of crime and condition reports, response to emergencies, conducting fire drills, and any other situation requiring security assistance. Contact us at security@pratt.edu or at 718.636.3540.';

	}

	//////////////////////////////////////////////////////////////////////////////////////

	function hidePopMap() {
		var popOp = $('.showpopmap').css('opacity');
		if (typeof popOp != 'undefined') {
			//alert(popOp);
			if (popOp == 1) {
				$('.showpopmap').removeClass('showpopmap');
			}
		}
	}

	function doPauseTour() {

		//return true;

		try {
			clearTimeout(unsetPause);
		} catch(err) { console.log(err) }
		///console.log('pause tour');
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

			$('<div class="click-capture"></div>').insertBefore('div.veil-box');

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

			ambiarc.legendType = 'offCampusPoint';

			$('img.access').remove();

			if (bldg=='W14') {
				//window.bmap = 'https://maps.google.com/maps?q=144%20West%2014th%20Street&t=&z=15&ie=UTF8&iwloc=&output=embed';
				//$('div.mapouter').find('iframe').attr('src',bmap);
				$('div.mapouter').css({'background-image':'url("images/w14.png")'});
				$('div.mapouter').addClass('showpopmap');
				ambiarc.buildingId = 'Pratt Manhattan';
				ambiarc.floorId = 'W14';
				ambiarc.roomName = '144 W 14th St<br>New York, NY 10011';
			}

			if (bldg=='PFZR') {
				$('div.mapouter').css({'background-image':'url("images/flsh.png")'});
				$('div.mapouter').addClass('showpopmap');
				ambiarc.buildingId = 'Pfizer Building';
				ambiarc.floorId = 'PFZR';
				ambiarc.roomName = '630 Flushing Ave #704<br>Brooklyn, NY 11206';
			}

			if (bldg=='FLSH') {
				//window.bmap = 'https://maps.google.com/maps?q=Brooklyn%20Fashion%20%2B%20Design%20Accelerator&t=&z=15&ie=UTF8&iwloc=&output=embed';
				//$('div.mapouter').find('iframe').attr('src',bmap);
				$('div.mapouter').css({'background-image':'url("images/flsh.png")'});
				$('div.mapouter').addClass('showpopmap');
				ambiarc.buildingId = 'Brooklyn Fashion<br>Design Accelerator';
				ambiarc.floorId = 'BFDA';
				ambiarc.roomName = '630 Flushing Ave #704<br>Brooklyn, NY 11206';
			}

			if (bldg=='CRR') {
				//window.bmap = 'https://maps.google.com/maps?q=40.698393%2C%20-73.972519&t=&z=15&ie=UTF8&iwloc=&output=embed';
				//$('div.mapouter').find('iframe').attr('src',bmap);
				$('div.mapouter').css({'background-image':'url("images/crr.png")'});
				$('div.mapouter').addClass('showpopmap');
				ambiarc.buildingId = 'The Consortium for Research & Robotics';
				ambiarc.floorId = 'CRR';
				ambiarc.roomName = '63 Flushing Ave<br>bldg. 280 ste. 515<br>Brooklyn, NY 11205';
			}

			//alert(ambiarc.buildingId)

			popMapLegend2();

			$('div.map-'+bldg).addClass('showpopmap');
		});
		///console.log('~~collapseMenus~~');
		collapseMenus();
	}

	function hideAllPoints() {
		///console.log('hideAllPoints');
		// 	var ambiarc = $("#ambiarcIframe")[0].contentWindow.Ambiarc;
		// 	$(mapStuff).each(function(){
		// 		///console.log(this.properties.mapLabelId);
		// 		ambiarc.hideMapLabel(this.properties.mapLabelId, true);
		// 	});
	}

	function resetMenus() {
		///console.log('resetMenus');
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

		$("input.filter").val('');
		$(".list-group-item").addClass("hidden");

		setTimeout(function(){
			//$('.subfly').animate({width: '0px', opacity: 0}).promise().then(function(){
				//$('.subfly').removeClass('reveal-horz').promise().then(function(){
					//setTimeout(function(){ $('.subfly').removeAttr('style'); }, 1);
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
				//});
			//});
		}, 125);
	}

	function searchFunction() {

		$('li.ldap-item').remove();

		var filter = $("input.filter").val();

		$(".list-group-item").not(":containsi('" + filter + "')").closest('li').addClass("hidden");

		$(".list-group-item:containsi('" + filter + "')").closest('li').removeClass("hidden");

		if (filter.length == '0') {
			$(".list-group-item").addClass("hidden");
		}

		$('div.search-list').css({
			'max-height':parseInt($(window).height()-80),
		});

		//if (filter.length > '3') {
		//	appendFromApi(filter);
		//}

		if (filter.length > '3') {
			lookupClasses(filter);
		}

	}

	function appendFromApi(filter) {

		$('li.ldap-item').remove();

		var host = window.location.hostname;

		if (host == 'localhost') {
			host = 'http://localhost/~iancampbell/maps/PrattSDK-post';
		} else {
			host = 'https://map.pratt.edu/live';
		}

		$.ajax({
			url: host+"/includes/lookup.php",
			data: {
				filter: filter,
			},
			type: "POST",
			//beforeSend: function(xhr){xhr.setRequestHeader('X-Test-Header', 'test-value');},
			success: function(ret) {
				try {
					//console.log(ret);
					$('li.ldap-item').remove();
					$('ul.list-group').append(ret);
				} catch(e) {
					///console.log(e);
					alert('ldap search failed');
					return;
				}
			}
		});

	}

	function lookupClasses(filter) {

		$('li.ldap-item').remove();

		var host = window.location.hostname;

		if (host == 'localhost') {
			host = 'http://localhost/~iancampbell/maps/PrattSDK-demo';
		} else {
			host = 'https://map.pratt.edu/demo';
		}

		$.ajax({
			url: 'https://map.pratt.edu/facilities/web/sections/lookup',
			data: {
				filter: filter,
			},
			type: "POST",
			//beforeSend: function(xhr){xhr.setRequestHeader('X-Test-Header', 'test-value');},
			success: function(ret) {
				try {
					//console.log(ret);
					$('li.class-item').remove();
					$('ul.list-group').append(ret);

					setTimeout(function(){
						appendFromApi(filter);
					},125);

				} catch(e) {
					///console.log(e);
					alert('ldap search failed');
					return;
				}
			}
		});

	}

	/// delete this
	function searchPropertiesGkDept(find){

		return true;

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

		return false;
	}

	function checkImage(imgUrl) {

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
	// 	function setupMenuAcademics() {
	//
	// 		return true;
	//
	// 		if (typeof academicsMenuIsLoaded != 'undefined') {
	// 			if (academicsMenuIsLoaded == true) {
	// 				return true;
	// 			}
	// 		}
	//
	// 		///console.log('setupMenuAcademics');
	//
	// 		$(document.acad.academics).each(function(key, record){
	// 			window.schoolList = Object.keys(record);
	// 		});
	//
	// 		///console.log(schoolList);
	//
	// 		var schoolArr = [];
	// 		var schoolString = '';
	// 		var subFly;
	// 		$(schoolList).each(function(key0, level0){
	//
	// 			//console.log('setupMenuAcademics loop');
	//
	// 			schoolArr[key0] = '<span class="fly-box" data-cat="school" data-school="'+level0+'" >'+level0+'</span>';
	// 			//schoolString += '<span class="fly-box" data-cat="school" data-school="'+level0+'" >'+level0+'</span>';
	// 			subFly = '<div class="subfly" data-type="'+level0+'" >';
	// 			$(document.acad.academics[level0]).each(function(key1, level1){
	// 				for(var item in level1) {
	//
	// 					var menuHightlight = 'warn';
	// 					if (searchPropertiesGkDept(item)) {
	// 						menuHightlight = '';
	// 					}
	//
	// 					//console.log(level1[item][0]);
	//
	// 					if (level1[item][0] == 'W14' || level1[item][0] == 'W18' || level1[item][0] == 'FLSH' || level1[item][0] == 'CRR') {
	// 						var campLoc = 'offcamp';
	// 					} else {
	// 						var campLoc = 'oncamp';
	// 					}
	//
	// 					subFly += '<span class="'+menuHightlight+' '+campLoc+'" data-bldg="'+level1[item][0]+'" data-cat="dept" data-dept="'+item+'">'+item+'</span>';
	// 				}
	// 			});
	// 			subFly += '</div>';
	// 			$('body').append(subFly);
	// 		});
	//
	// 		///console.log(schoolArr);
	//
	// 		schoolString = schoolArr.join('');
	//
	// 		$('div.academics').append(schoolString);
	//
	// 		window.academicsMenuIsLoaded = true;
	//
	// 	}

	// Tells Ambiarc to focus on a map label id
	function adjustMapFocus(target, mapLabelId, callback) {

		var i, tablinks;

		ambiarc.focusOnMapLabel(mapLabelId, 200);

		setTimeout(function(){
			ambiarc.ShowTooltipForMapLabel(mapLabelId);
		},1500);

		if (callback && typeof(callback) === "function") {
			callback();
		}

	}

