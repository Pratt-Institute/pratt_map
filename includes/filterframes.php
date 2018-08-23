<?php

	//ini_set('error_reporting', E_ERROR & ~E_WARNING);
	ini_set('error_reporting', E_ALL);
	ini_set('display_errors', true);
	ini_set('log_errors', 1);
	ini_set('error_log', 'php-error.log');
	error_log( ' - - - - - - - - - - - - - - - - ' );

	//40.698687, -73.975462

	// 	<div class="mapouter map-bfdaz map-flshz">
	// 		<div class="gmap_canvas">
	// 			<iframe id="gmap_canvas" src="https://maps.google.com/maps?q=Brooklyn%20Fashion%20%2B%20Design%20Accelerator&t=&z=13&ie=UTF8&iwloc=&output=embed" frameborder="0" scrolling="no" marginheight="0" marginwidth="0"></iframe>
	// 		</div>
	// 	</div>
	//
	//
	// 	<div class="mapouter map-crrz " sandbox>
	// 		<div class="gmap_canvas">
	// 			<iframe frameborder="0" src="https://www.bing.com/maps/embed?h=400&w=500&cp=40.69239999999999~-73.96180000000001&lvl=11&typ=d&sty=r&src=SHELL&FORM=MBEDV8" scrolling="no">
	// 		</iframe>
	// 		</div>
	// 	</div>

	//echo $fget = file_get_contents('https://maps.google.com/maps?q=40.698706%2C%20-73.975386&t=&z=13&ie=UTF8&iwloc=false&output=embed');
	//echo $fget = file_get_contents('https://www.bing.com/maps/embed?h=780&w=800&cp=40.692685644753745~-73.96787007753449&lvl=15&typ=d&sty=r&src=SHELL&FORM=MBEDV8');

// 	$url = "http://maps.google.com/maps/api/geocode/json?address=baner+pune&sensor=false";
//
// 	$ch = curl_init();
// 	curl_setopt($ch, CURLOPT_URL, $url);
// 	curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);
// 	curl_setopt($ch, CURLOPT_PROXYPORT, 3128);
// 	curl_setopt($ch, CURLOPT_SSL_VERIFYHOST, 0);
// 	curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, 0);
// 	$response = curl_exec($ch);
// 	curl_close($ch);
//
// 	$response = json_decode($response);
//
// 	$lat = $response->results[0]->geometry->location->lat;
// 	$long = $response->results[0]->geometry->location->lng;

?>

<!DOCTYPE html>
<html>
<head>
<title>Map Example</title>
<meta name="viewport" content="initial-scale=1.0, user-scalable=no" />
<style type="text/css">
#map_canvas { height: 330px; width: 550px; }
</style>
<script type="text/javascript"
src="http://maps.googleapis.com/maps/api/js?sensor=false">
</script>
<script type="text/javascript">
function initialize() {
	var latlng = new google.maps.LatLng(40.698706, -73.975386);
	var addressMarker = new google.maps.LatLng(40.698706, -73.975386);
	var myOptions = {
		zoom: 15,
		center: latlng,
		mapTypeId: google.maps.MapTypeId.ROADMAP
	};
	var map = new google.maps.Map(document.getElementById("map_canvas"),
	myOptions);

	marker = new google.maps.Marker({ map:map, position: addressMarker });
}

</script>
</head>
<body onload="initialize()">
<h2>Map Example</h2>
<div id="map_canvas"></div>
</body>
</html>