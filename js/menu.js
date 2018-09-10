
	$(document).ready(function(){

		$.extend($.expr[':'], {
		  'containsi': function(elem, i, match, array) {
			return (elem.textContent || elem.innerText || '').toLowerCase()
				.indexOf((match[3] || "").toLowerCase()) >= 0;
		  }
		});

		$(document).on("click", "li.list-group-item", function(e){

			params = {};
			params.bldg = $(this).attr('data-building');
			params.recordId = $(this).attr('data-recordid');
			params.ambiarcId = poiMap[$(this).attr('data-recordid')];
			params.action = 'focusAfterDataLoad';
			params.label = 'Hello World';

			console.log(params);
			//return true;

			if (fetchPoisFromApi(params)) {
				console.log('did it work?');
			}

		});

		$(document).on('click', '.search-btn', function() {
			$('.nav-menu').fadeOut();
			$('.showpopmap').removeClass('showpopmap');
			$('.points').addClass('reveal-vert');
			$('.menu-open').addClass('fade-out');
			$('.reveal-horz').removeClass('reveal-horz');
			$('body').append('<div class="click-capture"></div>');
			isFloorSelectorEnabled = false;
			var ambiarc = $("#ambiarcIframe")[0].contentWindow.Ambiarc;
			ambiarc.viewFloorSelector('0001');
			ambiarc.viewFloorSelector('0001');
		});

		$(document).on('click', '.menu-open', function() {
			$('.showpopmap').removeClass('showpopmap');
			$('.menu-open').addClass('fade-out');
			$('.cat-wrap').removeClass('fade-out');
			$('body').append('<div class="click-capture"></div>');
			isFloorSelectorEnabled = false;
			var ambiarc = $("#ambiarcIframe")[0].contentWindow.Ambiarc;

			ambiarc.viewFloorSelector('0001');
			setTimeout(function(){
				ambiarc.viewFloorSelector('0001');
			}, 750);
		});

		$(document).on('click', '.pratt-logo', function() {
			//collapseMenus();
			$('.showpopmap').removeClass('showpopmap');
			resetMenus();
		});

		$(document).on('click', '.cat-box', function() {
			$('.reveal-horz').removeClass('reveal-horz');
			var pos = $(this).closest('div').position();
			var type = $(this).attr('data-type');
			$('div.'+type).css({left:pos.left});
			$('div.'+type).addClass('reveal-horz');
			$("style:not('#position')").remove();
			var getStyle = $("style[data-type='"+type+"']");
			if (getStyle.length < 1) {
				var style = document.createElement('style');
				style.id = 'position';
				style.type = 'text/css';
				style.setAttribute('data-type', type);
				style.innerHTML = '.'+type+'{left:'+pos.left+'}';
				document.getElementsByTagName('head')[0].appendChild(style);
			}
		});

		$(document).on('click', '.click-capture', function() {
			//collapseMenus();
			$('.showpopmap').removeClass('showpopmap');
			resetMenus();
		});

		$('.flyout').mouseleave(function() {
			var close = true;
			$('.subfly').each(function(){
				if ($(this).css('opacity') > 0) {
					close = false;
				}
			});
			if (close == true) {
				var hi = $(this).height();
				$('.flyout').css({height: hi});
				setTimeout(function(){
					$('.flyout').animate({width: '0px', opacity: 0}).promise().then(function(){
						$('.flyout').removeClass('reveal-horz').promise().then(function(){
							setTimeout(function(){ $('.flyout').removeAttr('style'); }, 125);
						});
					});
				}, 125);
			}
		});

		$('.subfly').mouseleave(function(e) {
			var hi = $(this).height();
			$('.subfly').css({height: hi});
			setTimeout(function(){
				$('.subfly').animate({width: '0px', opacity: 0}).promise().then(function(){
					$('.subfly').removeClass('reveal-horz').promise().then(function(){
						setTimeout(function(){ $('.subfly').removeAttr('style'); }, 125);
					});
				});
			}, 125);
		});

		$(document).keyup(function(e) {
			if (e.keyCode === 27) {
				$('.showpopmap').removeClass('showpopmap');
				resetMenus();
				//hideAllPoints();
				isFloorSelectorEnabled = false;
				var ambiarc = $("#ambiarcIframe")[0].contentWindow.Ambiarc;
				ambiarc.viewFloorSelector('0001');
				ambiarc.viewFloorSelector('0001');
			}
		});

		$(document).on('click', '*', function(e) {
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
			//alert(this.value);
			searchFunction();

			// TODO building focus trigger here

			params = {};
			params.bldg = $(this).val();
			//params.recordId = $(this).attr('data-recordid');
			//params.action = 'focusAfterDataLoad';
			if (fetchPoisFromApi(params)) {
				console.log('2did it work?');
			}

		});

		$(document).on('click', '.fly-box', function(e) {

			ambiarc = $("#ambiarcIframe")[0].contentWindow.Ambiarc;

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
				//params.bldg = $(this).attr('data-bldg');
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
				} else {
					//params.bldg = deptMap[params.dept].name
				}

				if ($(this).attr('data-cat') == 'office') {
					params.label = params.office;
					//params.bldg = $(this).attr('data-bldg');
					params.recordId = $(this).attr('data-recordid');
					params.action = 'focusAfterDataLoad';
				}

				if (params.cat == 'facility') {
					params.label = params.facility;
					params.bldg = document.deptMap[params.facility].bldgAbbr;
					params.recordId = document.deptMap[params.facility].recordId;
					params.action = 'focusAfterDataLoad';
				}

				//console.log(params);
				//console.log(document.deptMap);
				//console.log(document.deptMap[params.office]);
				//alert(params.facility);

				if (fetchPoisFromApi(params)) {
					console.log('did it work?');
					collapseMenus();
				}

			}

		});

		$(document).on("click", "div.subfly>span", function(e){

			alert('subfly span');

			window.bldg = $(this).attr('data-bldg');

			params = {};
			params.currentTarget = e.currentTarget;
			params.bldg = $(this).attr('data-bldg');

			if (params.bldg == 'FLSH' || params.bldg == 'CRR' || params.bldg == 'W14') {
				doPopupMap(params.bldg);
				return true;
			}

			params.dept = $(this).attr('data-dept');
			params.schl = $(this).closest('div').attr('data-type');
			params.action = 'focusAfterDataLoad';

			params.label = params.dept;
			params.recordId = document.deptMap[params.dept].recordId;



			if (fetchPoisFromApi(params)) {
				console.log('did it work?');
				collapseMenus();
			}

		});

		/// department map is trusted
		setTimeout(function(){
			//deptMap = eval("(" + deptMap + ")");
		}, 1000);

		/// weird style injection coming from somewhere
		$("style:not('#position')").remove();

		deptMap = eval("(" + deptMap + ")");
		//console.log(deptMap);
		//console.log(deptMap['Library']);
		//alert('deptMap');

	});

	//////////////////////////////////////////////////////////////////////////////////////

	// 	function doFocusAfterFetch(params) {
	//
	// 		console.log('doFocusAfterFetch');
	// 		console.log(params);
	//
	// 		if (params.bldg == 'FLSH' || params.bldg == 'CRR') {
	// 			doPopupMap(params.bldg);
	// 			return true;
	// 		}
	//
	// 		var ambiarc = $("#ambiarcIframe")[0].contentWindow.Ambiarc;
	//
	// 		for(var item in ambiarc.poiStuff) {
	// 			if (ambiarc.poiStuff[item].gkDepartment == '') {
	// 				continue;
	// 			}
	// 			console.log('doFocusAfterFetch loop');
	// 			if (ambiarc.poiStuff[item].bldgAbbr == params.bldg) {
	// 				if (ambiarc.poiStuff[item].gkDepartment.indexOf(params.dept) != -1) {
	// 					var ambiarcId = ambiarc.poiStuff[item].ambiarcId;
	//
	// 					//ambiarc.setGPSCoordinatesOrigin(ambiarc.poiStuff[item].latitude, ambiarc.poiStuff[item].longitude);
	// 					//break;
	//
	// 					adjustMapFocus(params.currentTarget, ambiarcId);
	// 					collapseMenus();
	// 					break;
	// 				}
	// 			}
	// 		}
	//
	// 	}

	function loadKeyboard() {

		///alert(navigator.appVersion + ' -- ' + navigator.userAgent);

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
	}

	function doPoiImage(id) {
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

	function searchPropertiesGkDept(find){
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

	function setupMenuAcademics() {

		$(document.acad.academics).each(function(key, record){
			window.schoolList = Object.keys(record);
		});
		var schoolString = '';
		var subFly;
		$(schoolList).each(function(key0, level0){

			console.log('setupMenuAcademics loop');

			schoolString += '<span class="fly-box" data-cat="school" data-school="'+level0+'" >'+level0+'</span>';
			subFly = '<div class="subfly" data-type="'+level0+'" >';
			$(document.acad.academics[level0]).each(function(key1, level1){
				for(var item in level1) {

					var menuHightlight = 'warn';
					if (searchPropertiesGkDept(item)) {
						menuHightlight = '';
					}

					subFly += '<span class="'+menuHightlight+'" data-bldg="'+level1[item][0]+'" data-cat="dept" data-dept="'+item+'">'+item+'</span>';
				}
			});
			subFly += '</div>';
			$('body').append(subFly);
		});
		$('div.academics').append(schoolString);

	}

	function setupMenuOffices() {

		return false;

		var offString = '';
		$(document.off).each(function(key, office){

			console.log('setupMenuOffices loop');
			var menuHightlight = 'warn';
			if (searchPropertiesGkDept(office)) {
				menuHightlight = '';
			}
			offString += '<span class="fly-box '+menuHightlight+'" data-cat="office"  data-office="'+office+'" >'+office+'</span>';
		});
		$('div.offices').append(offString);
	}

	function setupMenuFacilities() {
		var facString = '';
		$(document.fac).each(function(key, facility){

			console.log('setupMenuFacilities loop');

			var menuHightlight = 'warn';
			if (searchPropertiesGkDept(facility)) {
				menuHightlight = '';
			}
			facString += '<span class="fly-box '+menuHightlight+'" data-cat="facility"  data-facility="'+facility+'" >'+facility+'</span>';
		});
		$('div.facilities').append(facString);
	}

	// Tells Ambiarc to focus on a map label id
	function adjustMapFocus(target, mapLabelId, callback) {

		console.log('adjustMapFocus');

		console.log(target);
		console.log(mapLabelId);
		var i, tablinks;
		var ambiarc = $("#ambiarcIframe")[0].contentWindow.Ambiarc;
		ambiarc.focusOnMapLabel(mapLabelId, 200);

		if (callback && typeof(callback) === "function") {
			callback();
		}

	}

