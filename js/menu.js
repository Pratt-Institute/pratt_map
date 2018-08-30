
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
			params.action = 'focusAfterDataLoad';

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

				//console.log('fly '+cat + ' ' +type);

				for(var item in ambiarc.mapStuff) {

					if (ambiarc.mapStuff[item].user_properties.gkDepartment == '') {
						continue;
					}

					// TODO make a map of gkDept so we don't have to do this loop

					///console.log(type + ' +++ ' + (mapStuff[item].user_properties.gkDepartment));
					if (typeof ambiarc.mapStuff[item].user_properties.gkDepartment != 'undefined' ) {
						if (ambiarc.mapStuff[item].user_properties.gkDepartment.indexOf(type) != -1) {
							//console.log(mapStuff[item]);
							var mapLabelId = ambiarc.mapStuff[item].properties.mapLabelId;
							//var id = mapStuff[item].user_properties.itemId;
							//console.log(id);
							//adjustMapFocus(e.currentTarget, id, function(){ });
							adjustMapFocus(e.currentTarget, mapLabelId);
							collapseMenus();
							break;
						}
					}
				}
			}

		});

		$(document).on("click", "div.subfly>span", function(e){

			//data-bldg="FLSH"
			//hideAllPoints();

			var bldg = $(this).attr('data-bldg');
			window.bldg = bldg;

			if (bldg == 'FLSH' || bldg == 'CRR') {
				doPopupMap(bldg);
				return true;
			}

			var dept = $(this).attr('data-dept');
			var schl = $(this).closest('div').attr('data-type');
			//alert(bldg + ' - ' + dept + ' - ' + schl);

			var ambiarc = $("#ambiarcIframe")[0].contentWindow.Ambiarc;

			if (dept == '') {

			}

			for(var item in ambiarc.mapStuff) {
				if (ambiarc.mapStuff[item].user_properties.gkDepartment == '') {
					continue;
				}
				if (ambiarc.mapStuff[item].user_properties.bldgAbbr == bldg) {
					//console.log(dept + ' +++ ' + (mapStuff[item].user_properties.gkDepartment));
					if (ambiarc.mapStuff[item].user_properties.gkDepartment.indexOf(dept) != -1) {
						//console.log(mapStuff[item]);
						var mapLabelId = ambiarc.mapStuff[item].properties.mapLabelId;
						//var id = mapStuff[item].user_properties.recordId;
						//var id = mapStuff[item].user_properties.itemId;
						//ambiarc.showMapLabel(id, true);
						//adjustMapFocus(e.currentTarget, id, function(){ });
						adjustMapFocus(e.currentTarget, mapLabelId);
						collapseMenus();
						break;
					}
				}
			}
		});

		/// clean up the popup maps
		setTimeout(function(){

			//console.log('clean up pop map');
			//$(document).remove('.place-card');
			//$('#gmap_canvas').contents().find('.place-card').remove();
			//var iframe = document.getElementById("gmap_canvas");
			//var elmnt = iframe.contentWindow.document.findElementByAttribute("class", "place-card");
			//elmnt.style.display = "none";

		}, 2000);

		/// weird style injection coming from somewhere
		$("style:not('#position')").remove();

	});


	//////////////////////////////////////////////////////////////////////////////////////


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
		// 	var ambiarc = $("#ambiarcIframe")[0].contentWindow.Ambiarc;
		// 	$(mapStuff).each(function(){
		// 		console.log(this.properties.mapLabelId);
		// 		ambiarc.hideMapLabel(this.properties.mapLabelId, true);
		// 	});
	}

	function resetMenus() {
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
		var filter = $("input.filter").val();
		$(".list-group-item").not(":containsi('" + filter + "')").addClass("hidden");
		$(".list-group-item:containsi('" + filter + "')").removeClass("hidden");
		var building = $("select.menu-buildings").val();
		if(building != "") {
			$(".list-group-item[data-building!='"+building+"']").addClass("hidden");
		}
	}

	function searchPropertiesGkDept(find){
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

	function setupMenuBuildings(MapLabels){

		return true;

		console.log('setupMenuBuildings');
		//console.log('MapLabels');
		//alert('setupMenuBuildings');

		lButtons = '';
		lBldgs = {};
		$(MapLabels).each(function(key, record){

			var imgUrl = 'images/pois/'+record.properties.mapLabelId+'.jpg';

			var imgExt = checkImage(imgUrl);

			if (record.properties.label == 'Sculpture') {
				record.properties.label = record.user_properties.gkArtName;
			}

			lBldgs[record.user_properties.bldgAbbr] = record.user_properties.bldgName;

			lButtons += '<li id="'+record.properties.mapLabelId+'" data-id="'+record.properties.mapLabelId+'"  data-building="'+record.user_properties.bldgAbbr+'"  data-recordId="'+record.user_properties.recordId+'"  class="list-group-item '+imgExt+'">';
			lButtons += '<div class="li-col li-label"><span>'+record.properties.label+'</span></div>';
			lButtons += '<div class="li-col li-bldg"><span>'+record.user_properties.bldgAbbr+'</span></div>';
			lButtons += '<div class="li-col li-room"><span>'+record.user_properties.newRoomNo+'</span></div></li>';

		});

		$('ul.list-group').append(lButtons);
		lButtons = '';

		bOptions = {};
		catBuildings = {};
		for (var prop in lBldgs) {
			bOptions[prop] = '<option value="'+prop+'">'+lBldgs[prop]+'</option>';
			catBuildings[prop] = '<span data-cat="buildings">'+lBldgs[prop]+'</span>';
			lBldgs[prop] = null;
		}

		joined = $.map(bOptions, function(e){
			return e;
		}).join(' ');

		$('select.menu-buildings').append(joined);
		joined = $.map(catBuildings, function(e){
			return e;
		}).join('');

		$('div.buildings').append(joined);

		bOptions = '';
		catBuildings = '';
		joined = '';

		//hideAllPoints();
	}

	function setupMenuAcademics() {

		$(document.acad.academics).each(function(key, record){
			window.schoolList = Object.keys(record);
		});
		var schoolString = '';
		var subFly;
		$(schoolList).each(function(key0, level0){
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
		var offString = '';
		$(document.off).each(function(key, office){
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












