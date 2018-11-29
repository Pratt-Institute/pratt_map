<?php

	date_default_timezone_set('America/New_York');

	//echo phpversion();
	//phpinfo();
	//die();

	//ini_set('error_reporting', E_ERROR & ~E_WARNING);
	ini_set('error_reporting', E_ALL);
	ini_set('display_errors', true);
	ini_set('log_errors', 1);
	ini_set('error_log', 'php-error.log');
	error_log( ' - - - - - - - - - - - - - - - - ' );

	session_start();

	//unset($_SESSION['token']);
	//echo '<br>';
	//print_r($_SESSION);

	//echo __DIR__;

	//include_once('includes/eetools.inc.php');
	//$ee = new EeTools;
	//$ee->fetchFromExpressionEngine();
	//die();

	include_once('includes/dbtools.inc.php');
	$obj = new DbTools;
	if (!@$_SESSION['token']) {
		if($obj->createToken()) {
			//echo '<br>token created';
		} else {
			//echo '<br>error, token not created';
		}
	} else {
		if ($obj->checkToken($_SESSION['token'])) {
			//is okay
		} else {
			//echo '<br>error, no token found';
		}
	}
	//die();

	// echo $obj->firstAidMenu();
	// die();

	$slists = $obj->buildSearchList();

	// 	echo '<pre>';
	// 	print_r($slists);
	// 	echo '</pre>';
	//
	// 	die();

	if (@$_POST['mode']) {
		$obj->setMode = addslashes($_POST['mode']);
	}

	//$obj->makeSearchMenu();
	//die();

	//include_once('includes/lookup.php');
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
  <script src="js/legend.js?nc=<?php echo time(); ?>"></script>

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

		$.cookie('token', "<?php echo $_SESSION['token'] ?>", { expires: 1, secure: false });

		//var deptMap =  '<?php $obj->buildDepartmentMap() ?>';
		//document.deptMap = JSON.parse(deptMap);

		var bldgMap =  '<?php $obj->createBuildingMap() ?>';
		document.bldgMap = JSON.parse(bldgMap);

		var hallMap =  '<?php $obj->createHallMap() ?>';
		document.hallMap = JSON.parse(hallMap);

	</script>

<style></style>

</head>

<body style="pointer-events: none">

	<form id="myform" action="<?php echo $_SERVER['PHP_SELF']; ?>" method="post">

		<button class="mode-button mode-dark" type="submit" name="mode" value="light">
			<img src="images/tactical.png">
		</button>

		<button class="mode-button mode-light pratt-logo" type="submit" name="mode" value="dark">
			<img src="images/Pratt_Logo_Black.png"  style="height:30px;opacity:1;">
		</button>

	</form>

	<div id="bootstrap" hidden>

		<!--<img  class="reset-map" src="images/arrow_left.png">-->

		<!--<div id="controls-section" style="pointer-events: all; z-index:9999;">
			<ul>
				<li class="" onclick="zoomInHandler()">
					<span class="controls-btn ctrl-zoom-in"  aria-hidden="true"></span>
				</li>
				<li class="">
					<i id="rotate_left" class=" controls-btn ctrl-rotate-left"  onclick="rotateLeft()" aria-hidden="true"></i>
					 <i id="rotate_right" class="controls-btn ctrl-rotate-right"  onclick="rotateRight()" aria-hidden="true"></i>
				</li>
				<li class="">
					<span class=" controls-btn ctrl-zoom-out" onclick="zoomOutHandler()" aria-hidden="true"></span>
				</li>
			</ul>
		</div>-->

	</div>
	<iframe src="./map.php?nc=<?php echo time(); ?>" id="ambiarcIframe" style="width:100%; height:100%; border:none; top:
	0; z-index:-1; position:fixed; pointer-events: all;">
		Your browser doesn't support iframes
	</iframe>

	<div class="nav-menu-new">
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
				<td style="background-color:#fff" class="menu-category">
					<!--<span class="cat-box" data-type="accessibility">accessibility</span>-->
					<span class="cat-box nav-icon" data-type="firstaid"><img src="images/firstaid.png"></span>
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

	<!--<div class="debug"></div>-->

</body>

<script>
	$('.menu-open').hide();
</script>

</html>
