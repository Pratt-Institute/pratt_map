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

  <link rel="stylesheet" media="all" href="TemplateData/css/bootstrap.css?nc=<?php echo time(); ?>" />
  <link rel="stylesheet" media="all" href="css/demo-ui.css?nc=<?php echo time(); ?>" />

  <link rel="stylesheet" media="all" href="css/tab_style.css?nc=<?php echo time(); ?>" />
  <link rel="stylesheet" media="all" href="css/menu.css?nc=<?php echo time(); ?>" />
  <link rel="stylesheet" media="all" href="css/pop_maps.css?nc=<?php echo time(); ?>" />

  <link href="css/jquery.virtual_keyboard.css?nc=<?php echo time(); ?>" rel="stylesheet" type="text/css"/>
  <link href="css/scroll.css" rel="stylesheet" type="text/css"/>

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

	<div class="nav-menu-new" style="">
		<table class="nav-menu-new">
			<tr class="row-btn">
				<td style="background-color:#fff" class="menu-category">
					<span class="nav-icon"><img class="reset-map-vert disabled" src="images/back-arrow2.png"></span>
				</td>
			</tr>
			<tr class="row-menu">
				<td style="background-color:#dde2e2" class="menu-category">
					<span class="cat-box" data-type="buildings">buildings</span>
				</td>
			</tr>
			<tr class="row-menu">
				<td style="background-color:#d6cecd" class="menu-category">
					<span class="cat-box" data-type="academics">academics</span>
				</td>
			</tr>
			<tr class="row-menu">
				<td style="background-color:#9a8e88" class="menu-category">
					<span class="cat-box" data-type="offices">offices</span>
				</td>
			</tr>
			<tr class="row-menu">
				<td style="background-color:#52869f" class="menu-category">
					<span class="cat-box" data-type="facilities">make/do</span>
				</td>
			</tr>
			<tr class="row-menu">
				<td style="background-color:#f4581e" class="menu-category">
					<span class="cat-box" data-type="sculptures">sculptures</span>
				</td>
			</tr>
			<tr class="row-menu">
				<td style="background-color:#ed1b2e" class="menu-category">
					<!--<span class="cat-box" data-type="accessibility">accessibility</span>-->
					<span class="cat-box nav-icon" data-type="firstaid"><img src="images/firstaid2.png"></span>
				</td>
			</tr>
			<tr class="row-menu">
				<td style="background-color:#3cf" class="menu-category">
					<!--<span class="cat-box" data-type="accessibility">accessibility</span>-->
					<span class="cat-box nav-icon" data-type="accessibility"><img src="images/accessible.png"></span>
				</td>
			</tr>
			<tr class="row-btn">
				<td style="background-color:#fff" class="menu-category">
					<span class="cat-box cat-box-search nav-icon" data-type="search-box"><img class="search-btn" src="images/view.png"></span>
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
					<span class="bldgName"></span><br>
					<span class="floorNo"></span><br>
					<span class="roomName"></span><br>
					<span class="roomNo"></span><br><br>
					<span class="history"></span>
				</td>
			</tr>
		</table>

	</div>

	<div class="md-ripple myRipple tap-to-start"></div>

	<div class="veil veil-box"></div>
	<div class="veil veil-text">⋮⋮⋮ TAP TO BEGIN ⋮⋮⋮</div>

	<div class="track"></div>

	<div class="debug"></div>

	<img class="compass" src="images/compass.png">

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

	<div id="show_geoloc"></div>


	<!--<button class="ripple"></button>-->

</body>

</html>
