<?php

	require('ldaptools.inc.php');

	$obj = new LdapTools;

	//$obj->lookfor = 'pbarna@pratt.edu';
	$obj->lookfor = addslashes($_POST['filter']);

	$obj->fetchLdapMatches();

?>