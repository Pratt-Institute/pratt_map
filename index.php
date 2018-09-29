<?php

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

	$slists = $obj->buildSearchList();

	// 	echo '<pre>';
	// 	print_r($slists);
	// 	echo '</pre>';
	//
	// 	die();

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

  <link href="css/jquery.virtual_keyboard.css" rel="stylesheet" type="text/css"/>

  	<script>
		var mode = '<?php echo $obj->fetchThemeMode() ?>';
		sessionStorage.setItem('mode',mode);
	</script>

  <script src="js/demo-ui.js?nc=<?php echo time(); ?>"></script>

  <script src="TemplateData/js/jquery-2.2.4.min.js?nc=<?php echo time(); ?>"></script>
  <script src="TemplateData/js/bootstrap.min.js?nc=<?php echo time(); ?>"></script>
  <script src="js/menu.js?nc=<?php echo time(); ?>"></script>
  <script src="js/jquery.cookie.js?nc=<?php echo time(); ?>"></script>

  <script src="js/jquery.virtual_keyboard.js?nc=<?php echo time(); ?>" type="text/javascript"></script>

  <link href="https://fonts.googleapis.com/icon?family=Material+Icons" rel="stylesheet">

  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css" />

    <script>

		var acad = '<?php $obj->fetchAcademicsArray() ?>';
		document.acad = JSON.parse(acad);
		$.cookie('token', "<?php echo $_SESSION['token'] ?>", { expires: 1, secure: false });

		var deptMap =  '<?php $obj->buildDepartmentMap() ?>';
		document.deptMap = JSON.parse(deptMap);

		var bldgMap =  '<?php $obj->createBuildingMap() ?>';
		document.bldgMap = JSON.parse(bldgMap);

	</script>

</head>

<body style="pointer-events: none">

<div class="mode-banner">
	<img src="images/tactical.png">
</div>

<div id="bootstrap" hidden>

	<div class="container-fluid" style="z-index:100;">
		<div class="row">
			<div style="pointer-events: all">
				<div id="back-button" class="floor-selector">
					<button class="btn btn-default reset-map" type="button" aria-haspopup="true" aria-expanded="true" disabled="disabled">
						<img src="images/arrow_left.png">
					</button>
				</div>
			</div>
		</div>
	</div>

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

	<div class="nav-menu menu-open">menu</div>

	<div class="nav-menu cat-wrap fade-out">
		<div class="menu-category" style="background-color:#dde2e2"><span class="cat-box" data-type="buildings">buildings</span></div>
		<div class="menu-category" style="background-color:#d6cecd"><span class="cat-box" data-type="academics">academics</span></div>
		<div class="menu-category" style="background-color:#9a8e88"><span class="cat-box" data-type="offices">offices</span></div>
		<div class="menu-category" style="background-color:#52869f"><span class="cat-box" data-type="facilities">facilities</span></div>
		<div class="menu-category" style="background-color:#f4581e"><span class="cat-box">accessibility</span></div>
		<div class="menu-category" style="background-color:#fff"><span class="cat-box cat-box-search"><img class="search-btn" src="images/view.png"></span></div>
	</div>

	<div class="flyout buildings"><?php echo $slists['bldg_menu']; ?></div>
	<div class="flyout academics"></div>
	<div class="flyout offices"><?php echo $slists['off_menu']; ?></div>
	<div class="flyout facilities"><?php $obj->fetchFacilitiesMenu() ?></div>

	<div class="mapouter map-w14 ">
		<iframe width="" height="" frameborder="0" src="" scrolling="no" sandbox="allow-scripts"></iframe>
	</div>

	<div class="mapouter map-bfda map-flsh ">
		<iframe width="" height="" frameborder="0" src="" scrolling="no" sandbox="allow-scripts"></iframe>
	</div>

	<div class="mapouter map-crr ">
		<iframe width="" height="" frameborder="0" src="" scrolling="no" sandbox="allow-scripts"></iframe>
	</div>

	<img class="pratt-logo" src="images/Pratt_Logo_Black.png">

	<div class="tab points" style="">
		<div class="selectdiv ">
			<label>
				<select class="menu-buildings">
				<option value="">:: Select Building ::</option>
				<?php echo $slists['bldg_options']; ?>
				</select>
			</label>
		</div>
		<input type="text" class="filter" placeholder="">
		<button><i class="fa fa-search"></i></button>
		<br clear="all">
		<div class="contain-list">
			<ul class="list-group"><?php echo $slists['room_list']; ?></ul>
		</div>
	</div>

	<div class="legend">
		<span class="bldgName"></span>
		<br>
		<span class="floorNo"></span>
		<br>
		<span class="roomName"></span>
	</div>

</body>

</html>
