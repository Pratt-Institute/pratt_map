	function loadUiFunctions() {

		$(document).ready(function(){

			ambiarc = $("#ambiarcIframe")[0].contentWindow.Ambiarc;

			ambiarc.legendType	= '';
			ambiarc.ambiarcId	= '';
			ambiarc.recordId	= '';
			ambiarc.buildingId	= '';
			ambiarc.floorId		= '';
			ambiarc.roomName	= '';
			ambiarc.hasImage	= '';
			ambiarc.lat			= '';
			ambiarc.lon			= '';
			ambiarc.sculptureName	= '';
			ambiarc.sculptureArtist	= '';

			console.log('loadUiFunctions');

			window.doFloorSelected	= true;
			window.tourIsRunning	= false;
			window.pauseTour		= false;
			window.overhead			= false;
			window.keypadVisible	= false;

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

				ambiarc.recordId = $(this).attr('data-recordid');
				ambiarc.recordIdKeep = $(this).attr('data-recordid');
				ambiarc.hasImage = $(this).attr('data-hasimage');
				ambiarc.floorId = $(this).attr('data-floorid');

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

						ambiarc.sculptureName = split[0];
						ambiarc.sculptureArtist = split[1];

						//alert(ambiarc.sculptureName);
					}
					//return true;
				}
				//popMapLegend();
				fetchPoisFromApi(params);

			});

			// 	$(document).on('click', '.search-btn', function() {
			// 		//resetMap();
			// 		///ambiarc = $("#ambiarcIframe")[0].contentWindow.Ambiarc;
			// 		///ambiarc.menuAction = 'yes';
			// 		///alert('search-btn');
			// 		//$('.nav-menu').fadeOut();
			// 		$('.showpopmap').removeClass('showpopmap');
			// 		//$('.points').addClass('reveal-vert');
			// 		//$('.menu-open').addClass('fade-out');
			// 		$('.reveal-horz').removeClass('reveal-horz');
			// 		//$('body').append('<div class="click-capture"></div>');
			// 		$('<div class="click-capture"></div>').insertBefore('div.veil-box');
			// 	});

			// 	$(document).on('click', '.menu-open', function() {
			//
			// 		//ambiarc = $("#ambiarcIframe")[0].contentWindow.Ambiarc;
			// 		//ambiarc.menuAction = 'yes';
			// 		//alert('menu-open');
			//
			// 		$('.showpopmap').removeClass('showpopmap');
			// 		$('.menu-open').addClass('fade-out');
			// 		$('.cat-wrap').removeClass('fade-out');
			// 		//$('body').append('<div class="click-capture"></div>');
			// 		$('<div class="click-capture"></div>').insertBefore('div.veil-box');
			// 		//var ambiarc = $("#ambiarcIframe")[0].contentWindow.Ambiarc;
			// 		//ambiarc.loadMap("pratt");
			//
			// 		// 	ambiarc.viewFloorSelector('0001');
			// 		// 	setTimeout(function(){
			// 		// 		ambiarc.viewFloorSelector('0001');
			// 		// 	}, 750);
			// 	});

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

				//if ($(this).html() == 'accessibility') {
				//	resetMap();
				//}

				$('.reveal-horz').removeClass('reveal-horz');
				var pos = $(this).closest('div').position();
				//var maxHei = parseInt($(window).height()-90);
				var maxHei = parseInt($(window).height());
				var type = $(this).attr('data-type');

				//console.log(this);
				//alert(this);

				//$('div.'+type).css({'left':pos.left,'maxHeight':maxHei});
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
					//var ambiarc = $("#ambiarcIframe")[0].contentWindow.Ambiarc;
					//ambiarc.viewFloorSelector('0001');
					//ambiarc.viewFloorSelector('0001');
					//ambiarc.loadMap("pratt");
				}
			});

			$(document).on('click', '*', function(e) {
				console.log('dom click event '+e);
				$('.veil').hide();
				hidePopMap();
				//console.log(e.target.nodeName);
				if (e.target.nodeName=='BODY' || e.target.nodeName=='HTML') {
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

				/// clear old points here

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

					if ($(this).attr('data-bldg') == 'FLSH' || $(this).attr('data-bldg') == 'CRR' || $(this).attr('data-bldg') == 'W14') {
						doPopupMap($(this).attr('data-bldg'));
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
							rotation['0015'] = '90'; // Chemistry
							rotation['0017'] = '90'; // Engineering
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
							zoom['0015'] = '25'; // Chemistry
							zoom['0017'] = '25'; // Engineering
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

					fetchPoisFromApi(params);
				}
			});

			$(document).on('click', '.reset-map', function() {
				$(this).attr('disabled','disabled');
				$('.click-capture').remove();
				resetMap();
			});

			$(document).on('click', '.reset-map-vert', function() {
				$(this).attr('disabled','disabled');
				$('.click-capture').remove();
				resetMap();
			});

			//$(document).on("click", "div.subfly>span", function(e){
			// 	$(document).on("click", "div.academics>span", function(e){
			//
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

			//deptMap = eval("(" + deptMap + ")");
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


		prattCopy['0001'] = '<span class="copy-bold">Information Science Center <br>(ISC Building)</span> <br>1954-55. Renovated 1973 <br>Architects: Firm of McKim, Mead and White <br><br>Built as a dormitory for women at the same time DeKalb Hall was built for men. By the 1960s after the acquisition of Willoughby Hall, both buildings were being used for offices and classrooms. They had been built during the extensive PrattArea Urban Renewal under the direction of Robert Moses. The renovation made extensive changes for the Graduate School of Information and Library Science as well as for a large computer laboratory.';

		prattCopy['0002'] = '<span class="copy-bold">Library</span> <br>1896. Renovated 1982 <br>Architect: William B. Tubby, <br>Interiors by Tiffany firm. <br>Renovation by Cavaglieri and Gran. <br><br>There was a small library in the Main building when the school began in 1887. The splendid Victorian Renaissance revival structure was built as a public as well as a college library. There was emphasis on service to local children. In 1912, a copy of a Romanesque porch was added to the children\'s entrance. This was relocated near the ARC building during the renovation of 1982. The north porch was added in 1936 by John Mead Howells, and is now an office. Pratt\'s library was the first free Library in New York City. However, as the Institute grew and the public library system expanded, it ceased being a public library in 1941. The elegant interiors, originally designed by the Louis Tiffany firm have a magnificent marble and brass central staircase. The mosaic and glass floors are also noteworthy. The renovation in 1982 enhanced the building and brought an elevator as well as a below-ground wing. The building was designated a New York City Landmark in 1986.';

		prattCopy['0003'] = '<span class="copy-bold">DeKalb Hall</span> <br>1954-55 <br>Architects: Firm of McKim, Mead and White <br><br>Originally a men\'s dormitory designed by the same firm which built theInformation Science Building and North Hall during the urban renewal projectwhich radically reshaped the campus. This is now a building which has classrooms and several offices, including Financial Aid and the Bursar.';

		prattCopy['0004'] = '<span class="copy-bold">Higgins Hall</span> <br>1868-1890 <br>Architects: Mundell and Teckritz, Ebenezer L. Roberts, <br>Charles C. Haight and William B. Tubby. <br><br>This was Adelphi Academy, a private school which has evolved into Adelphi University in Garden City, and Adelphi Academy in Bay Ridge, Brooklyn. The original academic building was by Mundell and Teckritz, built in 1868. Pratt acquired the building in the l960s and it houses much of the School of Architecture.';

		prattCopy['0005'] = '<span class="copy-bold">North Hall</span> <br>1958 <br>Architects: Firm of McKim, Mead and White <br><br>Built a little later than DeKalb Hall and the ISC Building by the same architects. Although this firm retained the name of one of America\'s most important firms, it was long after the demise of the famous Charles Follen McKim (1847-1909) and Stanford White (1853-1906). This was originally called the College Union, and currently houses the cafeteria, Security headquarters, a bank and classrooms.';

		prattCopy['0006'] = '<span class="copy-bold">Memorial Hall</span> <br>1926-7 <br>Architect: John Mead Howells <br>Sculptor: Rene Chambellan <br><br>A large auditorium/theater built by the Pratt family in memory of Mary Richardson Pratt, the wife of the founder, Charles Pratt. Originally, it was a lecture hall with a cafeteria below. Currently in need of restoration, it is infrequently used.';

		prattCopy['0007'] = '<span class="copy-bold">Student Union</span> <br>1887 <br>Architect: William B. Tubby <br><br>Built originally as the Trade School Building with a handsome wood truss roof,this was used for courses on brick laying, plumbing and sign painting before it became the old gymnasium. There is a small swimming pool (actually called a\"swimming tank\" and the first to admit women in Brooklyn) still located under thestaging area on the east side of the building. In 1982, this building was remodeled for use as a student union.';

		prattCopy['0008'] = '<span class="copy-bold">Main Building</span> <br>1887 <br>Architects: Hugo Lamb and Charles A. Rich <br><br>Lamb and Rich was a noted architectural firm in the late 19th century, and here it reflected the influence of H. H. Richardson. This is the original Pratt Institute building constructed of brick in the Romanesque revival style. The porch was added in 1895. It has always housed both offices and classrooms. Today it includes offices of the President as well as the Provost, Dean of Students and the Dean of the School of Art and Design.';

		prattCopy['0009'] = '<span class="copy-bold">East Building</span> <br>1887 <br>Architect: William Windrim <br><br>Although this is part of the original building complex and is connected to the Main Building, it had a different architect. It is an \"L\" shaped structure andthe fifth floor or the north/south section was a later addition. The building wraps around an attractive courtyard and the first floor houses Pratt\'s Power Generating Plant, a National Historic Mechanical Engineering Landmark. There is a viewing area for the power plant, and also on the first floor are the offices of Career Services, Student Activities, International Student Affairs and the Chapel. This was originally called the Mechanical Arts Building. Upper floors contain classrooms and some offices.';

		prattCopy['0010'] = '<span class="copy-bold">South Hall</span> <br>1889-92 <br>Architect: William B. Tubby <br><br>Designed by the same architect as the Library, this was originally the Pratt High School, a three-year coed program. When that was discontinued, this became the Household Science and then the Costume Design Building. It now has offices for the Fine Arts Department and classrooms for art and design.';

		prattCopy['0011'] = '<span class="copy-bold">Esther Lloyd Jones Hall</span> <br>1921 <br>Architect: unknown <br><br>A private apartment building which had the address of 243 Ryerson Street. It was purchased by Pratt Institute in 1964 and became a residence hall.';

		prattCopy['0012'] = '<span class="copy-bold">Thrift Hall</span> <br>1916-17 <br>Architects: Shampan and Shampan <br><br>This was a savings bank which had been founded on the campus by Charles Pratt in 1889, meant to teach students and others the value of thrift. Today it houses various offices, including that of the Registrar.';

		prattCopy['0013'] = '<span class="copy-bold">Leo J. Pantas Hall</span> <br>1986-87 <br>Architects: Skidmore, Owings and Merrill <br><br>A contemporary residence for students, situated on DeKalb Avenue between Thrift Hall and the Studio Building. The attractive brick structure fits well into the campus, and the clock tower echoes the clock on the Main Building.';

		prattCopy['0014'] = '<span class="copy-bold">Willoughby Hall</span> <br>1957 <br>Architect: S. J. Kessler <br><br>Built as a private apartment building during the urban renewal project under Robert Moses. The building was acquired as the main residence hall for Pratt Institute in the early 1960s. There are apartments on the top (17th) floor for faculty and staff.';

		prattCopy['0015'] = '<span class="copy-bold">Chemistry Building</span> <br>1904-05 <br>Architects: Howells and Stokes <br><br>John Mead Howells (1868-1959) and I.N. Phelps Stokes (1867-1944) were each noted architects earlier in the twentieth century. Working together, they built this as the first of the three buildings which have been known as the Engineering complex. Despite its name, this building is no longer used for the study of chemistry. The first floor houses the Rubelle and Norman Schaffler Gallery, a major exhibition space. The lower level is occupied by the Printmaking area and there are art and design studios on the upper floors. The building was extensively remodeled in 1985-86.';

		prattCopy['0016'] = '<span class="copy-bold">Machinery Building</span> <br>1914 <br>Architects: Howells and Stokes <br><br>The architects who had, a decade before, designed the Chemistry Building built this as the Manual Training Building. Connected to the Chemistry and Engineering buildings, for many years it was filled with heavy industrial machinery for student use. Today the building is used by the School of Art and Design and there are sculpture and ceramic studios in it.';

		prattCopy['0017'] = '<span class="copy-bold">Engineering Building</span> <br>1928-29. Extended in 1935. <br>Architect: John Mead Howells <br><br>The most recent of the three buildings in this group. It connects to the Machinery and Chemistry buildings and houses classrooms for various programs.';

		prattCopy['0018'] = '<span class="copy-bold">Steuben Hall</span> <br>Date: unknown <br>Architect: unknown <br><br>Previously, this was the United Metals factory, which manufactured small metal items. Acquired by Pratt in the early 1970s, the first floor has offices for Campus Management and mail services. PICCED occupies attractively renovated space on the second floor. Most of the rest of the building is used for storage and awaits remodeling. <br><br><span class="copy-bold">Pratt Studio Building</span> <br>Date: unknown <br>Architect: unknown <br>Former industrial building acquired by Pratt in 1962, and converted for use asart and design studios.';

		prattCopy['0019'] = 'Pratt Institute recently opened a new home for the Film/Video Department in the former Prattstore building at 550 Myrtle Avenue on the Brooklyn campus. The 15,000-square-foot facility was designed by WASA/Studio A with lead architect and Pratt alumnus Jack Esterson. The project was recognized with a citation award in the 2015 American Institute of Architects New York State Design Awards.';

		prattCopy['0020'] = '--';

		prattCopy['0021'] = '<span class="copy-bold">Activities Resource Center <br>(ARC Building)</span> <br>1974-75 <br>Architects: Ezra Ehrenkranz (lower level), Daniel Tully (upper level) <br><br>This large building was built to serve many functions. The upper level is a huge gymnasium, while the lower level has classrooms and laboratories. There are facilities for film, photography and computers. The concrete exterior has no windows and displays a fanciful tent-like roofing system.';

		prattCopy['0022'] = '<span class="copy-bold">Vincent A. Stabile Hall</span> opened in the Fall of 1999. Named for the donor and graduate of the Engineering School, Stabile Hall was designed to house new undergraduate students. It houses 224 freshman students in four-person suites. Each suite consists of two double rooms with a shared bath. Suites are single sex, but floors are coed. With few exceptions, the room dimensions, not including the small entry foyer, are 12\' x 12\'. Each suite is responsible for the healthy upkeep of the common bathroom area. There are kitchenettes located on each floor. The award-winning design of the building boasts a large common lounge with smaller work and lounge spaces on each floor, all of which contribute to a vital living and working environment. All rooms are air conditioned. Stabile Hall hosts the Healthy Choices and Global Learning communities.';

		prattCopy['0023'] = '<span class="copy-bold">Cannoneer Court</span> <br>1986-87 <br>Architects: Skidmore, Owings and Merrill <br><br>A rather stark-looking residence hall on the most eastern part of the campus on an area which had been an athletic field. It is connected to the ARC building and was built from pre-fabricated units.';

		prattCopy['0024'] = 'The building, which is located at 536 Myrtle Avenue between Grand Avenue and Steuben Street, was designed by multi-disciplinary architectural firm WASA/Studio A under the leadership of principal Jack Esterson, who received a bachelor\'s degree in architecture from Pratt in 1975. <br>Myrtle Hall recently met the United States Green Building Council standards for LEED (Leadership in Energy and Environmental Design) Gold certification based on its eco-features that include exterior sun shades; a green roof that absorbs rainwater, reflects heat, and sequesters greenhouse gasses; and solar photo-voltaic panels that generate on-site electricity. It is the first higher education building project in Brooklyn to receive any LEED certification and the first academic building to receive a LEED-gold certification in Brooklyn.';

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
		try {
			clearTimeout(unsetPause);
		} catch(err) { console.log(err) }
		console.log('pause tour');
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

			if (bldg=='W14') {
				//window.bmap = 'https://maps.google.com/maps?q=144%20West%2014th%20Street&t=&z=15&ie=UTF8&iwloc=&output=embed';
				//$('div.mapouter').find('iframe').attr('src',bmap);
				$('div.mapouter').css({'background-image':'url("images/w14.png")'});
				$('div.mapouter').addClass('showpopmap');
			}

			if (bldg=='FLSH') {
				//window.bmap = 'https://maps.google.com/maps?q=Brooklyn%20Fashion%20%2B%20Design%20Accelerator&t=&z=15&ie=UTF8&iwloc=&output=embed';
				//$('div.mapouter').find('iframe').attr('src',bmap);
				$('div.mapouter').css({'background-image':'url("images/flsh.png")'});
				$('div.mapouter').addClass('showpopmap');
			}

			if (bldg=='CRR') {
				//window.bmap = 'https://maps.google.com/maps?q=40.698393%2C%20-73.972519&t=&z=15&ie=UTF8&iwloc=&output=embed';
				//$('div.mapouter').find('iframe').attr('src',bmap);
				$('div.mapouter').css({'background-image':'url("images/crr.png")'});
				$('div.mapouter').addClass('showpopmap');
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
		// 	var building = $("select.menu-buildings").val();
		// 	if(building != "") {
		// 		$(".list-group-item[data-building!='"+building+"']").addClass("hidden");
		// 	}
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

