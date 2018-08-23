<?php

include_once('includes/sitevars.inc.php');

class DbTools {

	private $dbhost = DB_HOST;
	private $dbuser = DB_USER;
	private $dbpass = DB_PASS;
	private $dbname = DB_NAME;

	private $dbh;
	private $stmt;
	private $error;

	public function __construct() {

		//echo '<br>'.$dsn = 'mysql:host=' . $this->dbhost . ';dbname=' . $this->dbname;
		$dsn = 'mysql:host=' . $this->dbhost . ';dbname=' . $this->dbname;
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

	public function createToken() {

		try {
			$token = bin2hex(random_bytes(15));
			//echo '<br>insert token: '.$sql = "INSERT INTO `tokens` (`id`, `token`, `create_date`) VALUES (NULL, '".$token."', CURRENT_TIMESTAMP)";
			$sql = "INSERT INTO `tokens` (`id`, `token`, `create_date`) VALUES (NULL, '".$token."', CURRENT_TIMESTAMP)";
			$this->dbh->exec($sql);
			//echo 'setting token : '.$_SESSION['token'] = $token;
			$_SESSION['token'] = $token;
		} catch(PDOException $e) {
			echo $sql . "<br>" . $e->getMessage();
			return false;
		}

		return true;
	}

	public function checkToken($token) {

		try {
			//echo '<br>check token: '.$sql = "SELECT * FROM tokens WHERE token = '$token'";
			$sql = "SELECT * FROM tokens WHERE token = '$token'";
			$stmt = $this->dbh->prepare($sql);
			$stmt->execute();
			$rows = $stmt->fetch();

			//echo '<br>';
			//print_r($rows);

			if ($rows['token']) {
				return true;
			}
			return false;
		} catch(PDOException $e) {
			echo $sql . "<br>" . $e->getMessage();
		}
	}

	public function fetchAcademicsArray() {
		include_once('includes/academics.inc.php');
		echo json_encode($arr);
	}

	public function fetchOfficesArray() {
		include_once('includes/offices.inc.php');
		echo json_encode($arr);
	}

	public function fetchFacilitiesArray() {
		include_once('includes/facilities.inc.php');
		echo json_encode($arr);
	}

}