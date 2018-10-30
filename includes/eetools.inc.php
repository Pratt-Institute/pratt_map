<?php

include_once('includes/sitevars.inc.php');

	ini_set('error_reporting', E_ERROR);
	ini_set('display_errors', true);
	ini_set('log_errors', 1);
	ini_set('memory_limit', -1);

class EeTools {

	private $dbhost = EE_HOST;///
	private $dbuser = EE_USER;
	private $dbpass = EE_PASS;
	private $dbname = EE_NAME;///

	private $dbh;
	private $stmt;
	private $error;

	public $setMode;

	public function __construct() {

		//echo '<br>'.$dsn = 'mysql:host=' . $this->dbhost . ';dbname=' . $this->dbname;
		echo '<p>'.$dsn = 'mysql:host=' . $this->dbhost . ';dbname=' . $this->dbname;
		$options = array(
			PDO::ATTR_PERSISTENT => true,
			PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION
		);

		try {
			$this->dbh = new PDO($dsn, $this->dbuser, $this->dbpass, $options);
		} catch(PDOException $e){
			$this->error = $e->getMessage();
		}
	}

	public function fetchFromExpressionEngine() {

		try {
			echo '<p>'.$sql = "

				SELECT *

				FROM exp_channel_titles T LEFT JOIN exp_channel_data D ON D.channel_id = T.channel_id

				/*WHERE T.title = 'The Bachelor of Architecture Program is a professional program accredited'*/

				WHERE T.title = 'undergraduate architecture'

				ORDER BY T.entry_id ASC, D.entry_id ASC

				";
			$stmt = $this->dbh->prepare($sql);
			$stmt->execute();
			$rows = $stmt->fetchAll(PDO::FETCH_ASSOC);

			foreach($rows as $field=>$record) {

				$out[$record['entry_id']] = $record;
				//$out[$record['title']] = $record;

			}

			foreach($out as $key=>$value) {

				echo '<p>#################################################################';
				echo '<pre>';
				print_r($value);
				echo '</pre>';

			}


				//echo json_encode($map);

			return false;
		} catch(PDOException $e) {
			echo $sql . "<br>" . $e->getMessage();
		}


	}

}