<?php

	require('ldaptools.inc.php');

	$obj = new LdapTools;

	//$obj->lookfor = 'campbell';
	$obj->lookfor = addslashes($_POST['filter']);

	$obj->fetchLdapMatches();

?>