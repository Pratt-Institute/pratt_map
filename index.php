<?php

	date_default_timezone_set('America/New_York');

	ini_set('error_reporting', E_ALL);
	ini_set('display_errors', true);
	ini_set('log_errors', 1);
	ini_set('error_log', 'php-error.log');
	error_log( ' - - - - - - - - - - - - - - - - ' );

	session_start();

	include_once('includes/dbtools.inc.php');
	$obj = new DbTools;
	if (!@$_SESSION['token']) {
		if($obj->createToken()) {
			//echo '<br>token created';
		} else {
			echo '<br>error, token not created';
		}
	} else {
		if ($obj->checkToken($_SESSION['token'])) {
			//echo '<br>token is good';
		} else {
			echo '<br>error, no token found';
		}
	}

	$slists = $obj->buildSearchList();

	if (@$_POST['mode']) {
		$obj->setMode = addslashes($_POST['mode']);
	}

	$obj->kioskId = addslashes($_GET['kiosk']);
	$kiosk_location = $obj->getKioskLocation();

	//die();

?>

<html>

<head>
  <title>Ambiarc</title>
  <meta charset="UTF-8">

  <link rel="stylesheet" media="all" href="css/zmaster.css?nc=<?php echo time(); ?>" />

  <link rel="stylesheet" media="all" href="css/bootstrap/bootstrap.css?nc=<?php echo time(); ?>" />
  <link rel="stylesheet" media="all" href="css/ambiarc.css?nc=<?php echo time(); ?>" />
  <link rel="stylesheet" media="all" href="css/tab_style.css?nc=<?php echo time(); ?>" />
  <link rel="stylesheet" media="all" href="css/menu.css?nc=<?php echo time(); ?>" />
  <link rel="stylesheet" media="all" href="css/pop_maps.css?nc=<?php echo time(); ?>" />
  <link rel="stylesheet" media="all" href="css/jquery.virtual_keyboard.css?nc=<?php echo time(); ?>" />
  <link rel="stylesheet" media="all" href="css/scroll.css?nc=<?php echo time(); ?>" />
  <link rel="stylesheet" media="all" href="css/guides.css?nc=<?php echo time(); ?>" />

  	<script>
		var mode = '<?php echo $obj->fetchThemeMode() ?>';
		sessionStorage.setItem('mode',mode);
	</script>

  <script src="js/map-events.js?nc=<?php echo time(); ?>"></script>
  <script src="js/demo-ui.js?nc=<?php echo time(); ?>"></script>
  <script src="js/legend2.js?nc=<?php echo time(); ?>"></script>

  <script src="TemplateData/js/jquery-2.2.4.min.js?nc=<?php echo time(); ?>"></script>
  <script src="TemplateData/js/bootstrap.min.js?nc=<?php echo time(); ?>"></script>
  <script src="js/menu.js?nc=<?php echo time(); ?>"></script>
  <script src="js/jquery.cookie.js?nc=<?php echo time(); ?>"></script>

  <script src="js/jquery.virtual_keyboard.js?nc=<?php echo time(); ?>" type="text/javascript"></script>

  <script src="js/ripple.js"></script>

  <link href="https://fonts.googleapis.com/icon?family=Material+Icons" rel="stylesheet">
  <link rel="stylesheet" href="https://use.fontawesome.com/releases/v5.4.1/css/all.css" integrity="sha384-5sAR7xN1Nv6T6+dT2mhtzEpVJvfS3NScPQTrOxhwjIuvcA67KV2R5Jz6kr4abQsz" crossorigin="anonymous">

  <link href="https://fonts.googleapis.com/css?family=Exo:900|Sarpanch:700" rel="stylesheet">

    <script>

		window.alert = function() {
			location.reload();
		};

    	var kioskLocation = '<?php echo $kiosk_location ?>';

		if (typeof kioskLocation != 'undefined' && kioskLocation.length > 0) {
			var splitLoc = kioskLocation.split(',');
			window.youAreHereId		= splitLoc[0];
			window.youAreHereName	= splitLoc[1];
			window.youAreHereLat	= splitLoc[2];
			window.youAreHereLon	= splitLoc[3];
			console.log('Kiosk Location: ' + youAreHereLat + ' - ' + youAreHereLon);
		}

		$.cookie('token', "<?php echo $_SESSION['token'] ?>", { expires: 1, secure: false });

		var bldgMap =  '<?php $obj->createBuildingMap() ?>';
		document.bldgMap = JSON.parse(bldgMap);

		var hallMap =  '<?php $obj->createHallMap() ?>';
		document.hallMap = JSON.parse(hallMap);

	</script>

<style></style>

</head>

<body style="pointer-events: none">

	<form id="myform" action="<?php echo $_SERVER['PHP_SELF']; ?>" method="post"></form>

	<iframe src="./map.php?nc=<?php echo time(); ?>" id="ambiarcIframe" style="width:100%; height:100%; border:none; top:
	0; z-index:-1; position:fixed; pointer-events: all;">
		Your browser doesn't support iframes
	</iframe>

	<div class="veil veil-box"></div>
	<div class="capture"></div>

	<div class="veil veil-text">
		TAP TO FIND PLACES,<BR>PATHWAYS, PEOPLE, AND COURSES.
	</div>

	<div class="nav-menu-new" style="">
		<table class="nav-menu-new accessible">
			<tr class="row-btn menu-top">
				<td style="background-color:#fff" class="menu-category">
					<!--<span class="nav-icon cancel-access-menu"><img class="cancel-access-menu" src="images/cancel.png"></span>-->
					<span class="nav-icon menu-refresh"><img class="cancel-access-menu menu-refresh" src="images/refresh.png"></span>
					<span class="nav-icon"><img class="youarehere-btn" src="images/here.png"></span>
					<span class="nav-icon"><img class="gesture-btn" src="images/gestures.png"></span>
					<span class="nav-icon"><img class="reset-map-vert disabled" src="images/back-arrow2.png"></span>
				</td>
			</tr>
			<tr class="row-menu">
				<td style="background-color:#dde2e2" class="menu-category">
					<span class="cat-box" data-type="buildings">buildings&nbsp;&nbsp;<img src="images/buildings2.png"></span>
				</td>
			</tr>
			<tr class="row-menu">
				<td style="background-color:#d6cecd" class="menu-category">
					<span class="cat-box" data-type="academics">academics&nbsp;&nbsp;<img src="images/academics.png"></span>
				</td>
			</tr>
			<tr class="row-menu ban1">
				<td style="background-color:#9a8e88" class="menu-category">
					<span class="cat-box" data-type="offices">administration&nbsp;&nbsp;<img src="images/admin2.png"></span>
				</td>
			</tr>
			<tr class="row-menu ban2">
				<td style="background-color:#52869f" class="menu-category">
					<span class="cat-box" data-type="facilities">labs/studios&nbsp;&nbsp;<img src="images/computer.png"></span>
				</td
			</tr>
			<tr class="row-menu">
				<td style="background-color:#f4581e" class="menu-category">
					<span class="cat-box" data-type="sculptures">sculptures&nbsp;&nbsp;<img src="images/artwork2.png"></span>
				</td>
			</tr>
			<tr class="row-menu">
				<td style="background-color:#ed1b2e" class="menu-category">
					<!--<span class="cat-box" data-type="accessibility">accessibility</span>-->
					<span class="cat-box nav-icon" data-type="firstaid">first aid&nbsp;&nbsp;<img src="images/firstaid2.png"></span>
				</td>
			</tr>
			<tr class="row-menu">
				<td style="background-color:#3cf" class="menu-category menu-accessibility">
					<!--<span class="cat-box" data-type="accessibility">accessibility</span>-->
					<span class="cat-box nav-icon" data-type="accessibility">accessibility&nbsp;&nbsp;<img src="images/accessible.png">&nbsp;</span>
				</td>
			</tr>
			<!--<tr class="row-menu">
				<td style="background-color:#dde2e2" class="menu-category">
					<span class="cat-box" data-type="gestures">gesture guide</span>
				</td>
			</tr>-->
			<tr class="row-btn">
				<td style="background-color:#fff" class="menu-category">
					<span class="cat-box cat-box-search nav-icon" data-type="search-box">search&nbsp;&nbsp;<img class="search-btn" src="images/view.png"></span>
				</td>
			</tr>
		</table>
	</div>

	<!--<div class="nav-menu menu-open">menu</div>-->

	<!--<div class="nav-menu cat-wrap fade-out">
		<div class="menu-category" style="background-color:#dde2e2"><span class="cat-box" data-type="buildings">buildings</span></div>
		<div class="menu-category" style="background-color:#d6cecd"><span class="cat-box" data-type="academics">academics</span></div>
		<div class="menu-category" style="background-color:#9a8e88"><span class="cat-box" data-type="offices">offices</span></div>
		<div class="menu-category" style="background-color:#52869f"><span class="cat-box" data-type="facilities">facilities</span></div>
		<div class="menu-category" style="background-color:#f4581e"><span class="cat-box" data-type="accessibility">accessibility</span></div>
		<div class="menu-category" style="background-color:#ffffff"><span class="cat-box" data-type="search"><img class="search-btn" data-type="search" src="images/view.png"></span></div>
	</div>-->

	<div class="flyout webkit-scroll buildings"><?php echo $slists['bldg_menu']; ?></div>
	<div class="flyout webkit-scroll academics"><?php echo $slists['acad_menu']; ?></div>
	<div class="flyout webkit-scroll offices"><?php $obj->fetchOfficesMenu(); ?></div>
	<div class="flyout webkit-scroll facilities"><?php $obj->fetchFacilitiesMenu(); ?></div>
	<div class="flyout webkit-scroll sculptures"><?php $obj->fetchSculptureMenu(); ?></div>
	<div class="flyout webkit-scroll firstaid"><?php $obj->firstAidMenu(); ?></div>
	<div class="flyout webkit-scroll accessibility"><?php $obj->fetchAccessibleMenu(); ?></div>

	<div class="flyout search-box reveal-keeps">
		<table class="tbl-search">
			<tr><td class="wedge"></td></tr>
			<tr><td class="search-list">
				<div class="search-list webkit-scroll">
					<ul class="list-group"><?php echo $obj->makeSearchMenu(); ?></ul>
				</div>
			</td></tr>
			<tr><td class="search-input">
					<div style="width:500px">
						<input type="text" class="filter" placeholder="tap here to search...">
						<button><i class="fa fa-search"></i></button>
					</div>
			</td></tr>
		</table>
	</div>

<!--
	<div class="mapouter map-w14 ">
		<iframe width="" height="" frameborder="0" src="" scrolling="no" sandbox="allow-scripts"></iframe>
	</div>

	<div class="mapouter map-bfda map-flsh ">
		<iframe width="" height="" frameborder="0" src="" scrolling="no" sandbox="allow-scripts"></iframe>
	</div>

	<div class="mapouter map-crr ">
		<iframe width="" height="" frameborder="0" src="" scrolling="no" sandbox="allow-scripts"></iframe>
	</div>
 -->

 	<div class="mapouter"></div>

	<div class="legend">

		<table>
			<tr>
				<td class="legend-building"></td>
			</tr>
			<tr>
				<td class="legend-copy">
						<span class="bldgName block"></span>
						<span class="floorNo block"></span>
						<span class="title block"></span>
						<span class="course block"></span>
						<span class="professor block"></span>
						<span class="roomName block"></span>
						<span class="times block"></span>
						<span class="roomNo block"></span>
						<hr class="dotted">
						<span class="history"></span>
				</td>
			</tr>
			<tr>
				<td class="legend-access"></td>
			</tr>
		</table>

	</div>

	<div class="md-ripple myRipple tap-to-start"></div>

	<div class="track"></div>

	<div class="debug"></div>

	<img class="compass" src="images/compass.png">
	<img class="proh" src="images/proh.png">
	<div class="proh"><?php $obj->fetchProhMenu(); ?></div>

	<table class="icons">
		<tr>
			<td class="provisions hide" data-provision="narcan">
				<img src="images/narcan-color.png">
			</td>
			<td class="provisions hide" data-provision="defibrillator" >
				<img src="images/aed-color.png">
			</td>
			<td class="reset hide">
				<img src="images/reset.png">
			</td>
			<td class="reset">
				<img src="images/Pratt_Logo_Black.png">
			</td>
		</tr>
	</table>

	<!--<div class="reset">
		<img src="images/reset.png">
	</div>-->

	<div id="show_info"></div>

	<div class="guide-panel gestures">
		<img class="close-dialog" src="images/close-button.png"><br />
		<table border="0">
			<tr>
				<td class="icon"><img src="images/gesture-drag.png"></td>
				<td class="text">One finger ⋮ Touch and drag to move the map.</td>
			</tr>
			<tr>
				<td class="icon"><img src="images/gesture-zoom.png"></td>
				<td class="text">Two fingers ⋮ Pinch or stretch to zoom.</td>
			</tr>
			<tr>
				<td class="icon"><img src="images/gesture-spin.png"></td>
				<td class="text">Two fingers ⋮ Twist to rotate the map.</td>
			</tr>
		</table>
	</div>

	<!--<button class="ripple"></button>-->

	<script>
		$('div.proh').hide();
		$('.veil').hide();
		var pos1 = $('.ban1').offset();
		var hei = parseInt($('.ban1').height() + $('.ban2').height());
		//$('.veil').css({
		//	'top':pos1.top,
		//	'height':hei
		//});

		// 	var pos2 = $('img.proh').offset();
		// 	$('div.proh').css({
		// 		'top': parseInt(pos2.top + $('img.proh').height()),
		// 	});
		// 	console.log($(document).height() +' - '+ pos1.top);

		// 	var hei2 = parseInt($(document).height() - pos1.top);
		// 	console.log(hei2)
		// 	$('div.flyout').css({
		// 		'height':hei2,
		// 		'max-height':hei2
		// 	});

	</script>

</body>

</html>
