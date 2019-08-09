<?php

	error_reporting(E_ALL);
	ini_set('display_errors', 0);

	//$_GET['file'] = '3292.jpg';
	//$_GET['type'] = 'sculpture';
	//$_GET['size'] = 'thumb';

	foreach($_REQUEST as $key=>$val) {
		$_REQUEST[$key] = addslashes($val);
	}

	$file = addslashes($_GET['file']);
	$type = addslashes($_GET['type']);
	$size = addslashes($_GET['size']);

	$filename = dirname(__FILE__).'/../images/pois/'.$file;

	// Content type
	header('Content-Type: image/jpeg');

	// Get new dimensions
	list($width, $height) = getimagesize($filename);

	if ($size=='thumb') {
		$new_width	= 40;
		$new_height	= 40;
		$s_width	= 40;
		$s_height	= 40;
	}

	$origin_width	= 0;
	$origin_height	= 0;

	if ($width > $height) {
		$scale = ($new_height / $height);
		$s_width = ($width * $scale);
		$origin_width = (($width - $height) / 2);
	} else {
		$scale = ($new_width / $width);
		$s_height = ($height * $scale);
		$origin_height = (($height - $width) / 2);
	}

	// Resample
	$image_p = imagecreatetruecolor($new_width, $new_height);
	$image = imagecreatefromjpeg($filename);
	imagecopyresampled($image_p, $image, 0, 0, $origin_width, $origin_height, $s_width, $s_height, $width, $height);

	// Output
	imagejpeg($image_p, null, 100);

?>