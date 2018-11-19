<?php

	require('ldaptools.inc.php');

	$obj = new LdapTools;

	//$obj->lookfor = 'icampb15';
	$obj->lookfor = addslashes($_POST['filter']);

	$obj->fetchLdapMatches();

?>