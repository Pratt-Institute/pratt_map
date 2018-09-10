<?php

include_once('includes/sitevars.inc.php');

	ini_set('error_reporting', E_ALL);
	ini_set('display_errors', true);
	ini_set('log_errors', 1);

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

	// 	public function fetchOfficesArray() {
	// 		include_once('includes/offices.inc.php');
	// 		echo json_encode($arr);
	// 	}

	public function fetchOfficesMenu() {

		try {
			$sql = "
				select
					id,
					bldg_abbre,
					bldg_name,
					gk_bldg_id,
					gk_department
					from facilities
					where gk_department != ''
					order by bldg_name asc";

			$stmt = $this->dbh->prepare($sql);
			$stmt->execute();
			$rows = $stmt->fetchAll();

			if ($rows[0]['id']) {

				foreach($rows as $field=>$record) {
					$dept_exp = explode(',',$record['gk_department']);
					foreach($dept_exp as $dept) {
						$dept = trim($dept);
						if ($dept != '') {
							// 	$out[$dept]['recordid']	= $record['id'];
							// 	$out[$dept]['dept']	= $dept;
							// 	$out[$dept]['bldg']	= trim($record['bldg_abbre']);
							$out[] = "<span class=\"fly-box\" data-cat=\"office\"  data-office=\"$dept\" >$dept</span>";
						}
					}
				}

				//ksort($out);

				// 	echo '<pre>';
				// 	print_r($out);
				// 	echo '</pre>';
				// 	die();

				return implode('',$out);

				//return true;
			}
			return false;
		} catch(PDOException $e) {
			echo $sql . "<br>" . $e->getMessage();
		}
	}

	public function fetchFacilitiesArray() {
		include_once('includes/facilities.inc.php');
		echo json_encode($arr);
	}

	public function poiHasImage() {

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

				order by bldg_name asc, room_no asc

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
					$bldgs[$record['bldg_abbre']]['name'] = $record['bldg_name'];
					$bldgs[$record['bldg_abbre']]['latitude'] = $record['latitude'];
					$bldgs[$record['bldg_abbre']]['longitude'] = $record['longitude'];
					@$bldg_map[$record['bldg_abbre']] = $record['gk_bldg_id'];

					if (trim($record['gk_department'])!='') {
						$dept_exp = explode(',',$record['gk_department']);
						foreach($dept_exp as $dept) {
							$dept = trim($dept);
							if ($dept != '') {
								$offs[$dept] = "<span  class=\"fly-box\"  data-recordid=\"".$record['id']."\"  data-bldg=\"".$record['bldg_abbre']."\"  data-cat=\"office\"  data-dept=\"$dept\"  data-office=\"$dept\" >$dept</span>";
							}
						}
					}
				}

				@natsort($bldgs);
				foreach($bldgs as $bldg_abbre=>$bldg_stuff){
					$bldgOpt[] = '<option value="'.$bldg_abbre.'">'.$bldg_stuff['name'].'</option>';
					$bldgMnu[] = '<span class="fly-box dbtools" data data-cat="buildings" data-buildingId="'.$bldg_map[$bldg_abbre].'" data-buildingAbrev="'.$bldg_abbre.'" data-lat="'.$bldg_stuff['latitude'].'" data-long="'.$bldg_stuff['longitude'].'">'.$bldg_stuff['name'].'</span>';
				}

				ksort($offs);

				$out['bldg_menu']		= implode('',$bldgMnu);
				$out['bldg_options']	= implode('',$bldgOpt);
				$out['room_list']		= implode('',$rooms);
				$out['off_menu']		= implode('',$offs);
				return $out;
			}

			return false;
		} catch(PDOException $e) {
			echo $sql . "<br>" . $e->getMessage();
		}

	}

	public function buildDepartmentMap() {

		try {
			$sql = "
				select * from facilities
				where gk_department != ''
				order by bldg_name asc, room_no asc
				";
			$stmt = $this->dbh->prepare($sql);
			$stmt->execute();
			$rows = $stmt->fetchAll();

			if ($rows[0]['id']) {

				foreach($rows as $field=>$record) {

					$exp = explode(',',$record['gk_department']);

					$i=0;
					foreach($exp as $dept) {
						$dept = trim($dept);
						//$map[$dept]['bldgAbbr'] = $record['bldg_abbre'];
						//$map[$dept]['roomName'] = str_replace("'","",trim($record['room_name']));
						//$map[$i][$dept]['bldgAbbr'] = $record['bldg_abbre'];
						//$map[$i][$dept]['roomName'] = str_replace("'","",trim($record['room_name']));
						$map[$dept]['recordId'] = $record['id'];
						$map[$dept]['bldgAbbr'] = $record['bldg_abbre'];
						$map[$dept]['roomName'] = str_replace("'","",trim($record['room_name']));
						$i++;
					}
				}

				echo json_encode($map);
			}

			return false;
		} catch(PDOException $e) {
			echo $sql . "<br>" . $e->getMessage();
		}

	}

}