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

	public function buildSearchList() {

		try {
			//echo '<br>check token: '.$sql = "SELECT * FROM tokens WHERE token = '$token'";
			$sql = "
				select * from facilities

				/*where ( gk_display = 'Y' or gk_department != '' or space_type in (1650,7701,7800) )*/
				where ( gk_display = 'Y' or gk_department != '' )

				and space_type not in (7500,7700,7600)

				and department not in ('CIRCULATION','INACTIVE','UNUSABLE')

				and room_name != ''
				and gk_display != 'N'
				and floor not like '%bsm%'
				and room_name not like '%ele%'
				and room_name not like '%class%'
				and room_name not like '%storage%'
				and room_name not like '%corr%'
				and room_name not like '%cl.%'
				and room_name not like '% cl%'
				and room_name not like '%mech%'
				and room_name not like '%inactive%'
				and room_name not like '%tele%'
				and room_name not like '%equip%'
				and room_name not like '%closet%'
				and room_name not like '%elec%'
				and room_name not like '%lobby%'
				and room_name not like '%shower%'
				and room_name not like '%switch%'
				and room_name not like '%janit%'
				and room_name not like '%server%'
				and room_name not like '%booth%'
				and room_name not like '%cubicle%'
				and room_name not like '%seat%'

				and room_name not like '%rest%'
				and room_name not like '%women%'
				and room_name not like '%men%'
				and room_name not like '%toilet%'

				and room_name not like '%inactive%'
				and department not like '%inactive%'
				and major_category not like '%inactive%'
				and functional_category not like '%inactive%'

				/*
				and room_name not like '%fac%'
				and room_name not like '%tech%'
				and room_name != 'office'
				*/

				";
			$stmt = $this->dbh->prepare($sql);
			$stmt->execute();
			$rows = $stmt->fetchAll();

			// 	echo '<pre>';
			// 	print_r($rows);
			// 	echo '</pre>';

			if ($rows[0]['id']) {

				foreach($rows as $field=>$record) {
					$imgUrl = 'images/pois/'.$record['id'].'.jpg';
					$rooms[] = '<li id="'.$record['id'].'" data-id="'.$record['id'].'"  data-building="'.$record['bldg_abbre'].'"  data-recordId="'.$record['id'].'"  class="list-group-item '.$imgUrl.'">';
					$rooms[] = '<div class="li-col li-label"><span>'.$record['room_name'].'</span></div>';
					$rooms[] = '<div class="li-col li-bldg"><span>'.$record['bldg_abbre'].'</span></div>';
					$rooms[] = '<div class="li-col li-room"><span>'.$record['new_room_no'].'</span></div></li>';
					$bldgs[$record['bldg_abbre']] = $record['bldg_name'];
				}

				natsort($bldgs);
				foreach($bldgs as $bldg_abbre=>$bldg_name){
					$bldgOpt[] = '<option value="'.$bldg_abbre.'">'.$bldg_name.'</option>';
					$bldgMnu[] = '<span data-cat="buildings">'.$bldg_name.'</span>';
				}

				$out['bldg_menu'] = implode('',$bldgMnu);
				$out['bldg_options'] = implode('',$bldgOpt);
				$out['room_list'] = implode('',$rooms);
				return $out;

			}

			return false;
		} catch(PDOException $e) {
			echo $sql . "<br>" . $e->getMessage();
		}

	}

}