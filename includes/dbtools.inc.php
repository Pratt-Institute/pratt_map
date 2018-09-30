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

	public $setMode;

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

	public function fetchThemeMode() {

		//return 'dark';
		return 'light';
		//return $this->setMode;

	}

	public function createToken() {

		try {

			$pver = phpversion();
     		if (strpos('_'.$pver, '7.') !== false) {
     			$token = bin2hex(random_bytes(15));
     		} else {
				$token = bin2hex(mcrypt_create_iv(22, MCRYPT_DEV_URANDOM));
			}

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
			$rows = $stmt->fetchAll(PDO::FETCH_ASSOC);

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

	public function fetchFacilitiesMenu() {
		//include_once('includes/facilities.inc.php');
		//echo json_encode($arr);
		//return;

		$arr[] = 'Brooklyn Campus Library';/// -----
		$arr[] = 'Activity Resource Center';/// -----

		$arr[] = 'Computer Labs -- Activity Res Ctr';/// ARC d-03 -----
		$arr[] = 'Computer Labs -- DeKalb Hall';/// ARC d-03 -----
		$arr[] = 'Computer Labs -- East Hall';/// EAST 301 -----
		$arr[] = 'Computer Labs -- Engineering';/// Engineering Building, 2nd Floor -----
		$arr[] = 'Computer Labs -- Higgins Hall';/// Higgins Hall North, 2nd and 3rd Floors -----
		$arr[] = 'Computer Labs -- Machinery';/// Machinery Building, 1st Floor 115 -----
		$arr[] = 'Computer Labs -- Main Bldg';/// Main 330 -----

		$arr[] = 'Digital Output Center';/// Engineering Building, 2nd Floor -----
		$arr[] = '3D Printing Center';/// Engineering Building, 2nd Floor, Room 211 ----- Steuben Room 315
		$arr[] = 'Engineering Computer Lab (EDS)';/// Engineering Building, 2nd Floor -----
		$arr[] = 'Foundation Media Lab';/// Main Building, 3rd Floor 36? -----
		$arr[] = 'Language Resource Center';/// DeKalb Hall, 4th Floor -----

		$arr[] = 'CNC Lab';/// Engineering LL -----
		$arr[] = 'Industrial Design Shop';/// -----
		$arr[] = 'Form and Tech Lab';/// PS rm 48 -----
		$arr[] = 'Laser Cutting';/// Steuben 315 -----
		$arr[] = 'Metal Shop';/// chem 3rd fl 306 -----
		$arr[] = 'Photo Studio';/// Steuben Hall Room 305 -----
		$arr[] = 'Plaster Shop';/// PS 5th fl rm 54 -----
		$arr[] = 'Rapid Prototyping Room';/// ps 4th floor -----
		$arr[] = 'Wood Shop';/// Pratt Studios 57 -----

		$sql = " select
					id,
					bldg_abbre,
					gk_bldg_id,
					gk_floor_id,
					gk_department,
					latitude,
					longitude
					from facilities where gk_department != '' and ( ";
		foreach($arr as $facility) {
			$like[] = " gk_department like '%$facility%' ";
		}
		$sql .= implode (' or ', $like) . ' )';

		//echo '<p>'.$sql;

		$stmt = $this->dbh->prepare($sql);
		$stmt->execute();
		$rows = $stmt->fetchAll(PDO::FETCH_ASSOC);

		// 	echo '<pre>';
		// 	print_r($rows);
		// 	echo '</pre>';

		if ($rows[0]['id']) {
			foreach($rows as $field=>$record) {
				$exp = explode(',',$record['gk_department']);
				foreach($exp as $gk_dept) {
					$gk_dept = trim($gk_dept);
					$out[$gk_dept] = "<span
						class=\"fly-box\"
						data-recordid=\"".$record['id']."\"
						data-bldg=\"".$record['bldg_abbre']."\"
						data-floor=\"".$record['gk_floor_id']."\"
						data-cat=\"facility\"
						data-dept=\"$gk_dept\"
						data-facility=\"$gk_dept\"
					>$gk_dept</span>";
				}
			}
		}

		ksort($out);
		echo implode('',$out);
		//return $out;
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
			$rows = $stmt->fetchAll(PDO::FETCH_ASSOC);

			// 	echo '<pre>';
			// 	print_r($rows);
			// 	echo '</pre>';

			if ($rows[0]['id']) {

				foreach($rows as $field=>$record) {
					$imgUrl = 'images/pois/'.$record['id'].'.jpg';

					if (file_exists($imgUrl)) {
						$has_image = 'hasImg';
					} else {
						$has_image = 'noImg';
					}

					$camploc = strtolower($record['on_off_campus']).'camp';

					$rooms[] = '<li id="'.$record['id'].'"
						data-id="'.$record['id'].'"
						data-building="'.$record['bldg_abbre'].'"
						data-floor="'.$record['gk_floor_id'].'"
						data-recordId="'.$record['id'].'"
						class="list-group-item '.$imgUrl.' '.$has_image.'">';

					$rooms[] = '<div class="li-col li-label '.$camploc.'"><span>'.$record['room_name'].'</span></div>';
					$rooms[] = '<div class="li-col li-bldg '.$camploc.'"><span>'.$record['bldg_abbre'].'</span></div>';
					$rooms[] = '<div class="li-col li-room '.$camploc.'"><span>'.$record['new_room_no'].'</span></div></li>';

					$bldgs[$record['bldg_abbre']]['name'] = $record['bldg_name'];
					$bldgs[$record['bldg_abbre']]['gk_bldg_id'] = $record['gk_bldg_id'];
					$bldgs[$record['bldg_abbre']]['gk_floor_id'] = $record['gk_floor_id'];
					$bldgs[$record['bldg_abbre']]['camploc'] = $camploc;
					$bldgs[$record['bldg_abbre']]['latitude'] = $record['latitude'];
					$bldgs[$record['bldg_abbre']]['longitude'] = $record['longitude'];
					@$bldg_map[$record['bldg_abbre']] = $record['gk_bldg_id'];

					if (trim($record['gk_department'])!='') {
						$dept_exp = explode(',',$record['gk_department']);
						foreach($dept_exp as $dept) {
							$dept = trim($dept);
							if ($dept != '') {
								$offs[$dept] = "<span  class=\"fly-box $camploc\"  data-recordid=\"".$record['id']."\"  data-bldg=\"".$record['bldg_abbre']."\"  data-floor=\"".$record['gk_floor_id']."\"  data-cat=\"office\"  data-dept=\"$dept\"  data-office=\"$dept\" >$dept</span>";
							}
						}
					}
				}

				@natsort($bldgs);
				foreach($bldgs as $bldg_abbre=>$bldg_stuff){
					$bldgOpt[] = '<option value="'.$bldg_abbre.'" data-floor="'.$bldg_stuff['gk_floor_id'].'">'.$bldg_stuff['name'].'</option>';

					// 	$bldgMnu[] = '<span
					// 		class="fly-box dbtools"
					// 		data-cat="buildings"
					// 		data-buildingId="'.$bldg_abbre.'"
					// 		data-buildingAbrev="'.$bldg_abbre.'"
					// 		data-bldg="'.$bldg_abbre.'"
					// 		data-floor="'.$bldg_stuff['gk_floor_id'].'"
					// 		data-lat="'.$bldg_stuff['latitude'].'"
					// 		data-long="'.$bldg_stuff['longitude'].'">'.$bldg_stuff['name'].'</span>';

					$bldgMnu[] = '<span
						class="fly-box dbtools '.$bldg_stuff['camploc'].'"
						data-cat="buildings"
						data-bldg="'.$bldg_abbre.'"
						data-bldgid="'.$bldg_stuff['gk_bldg_id'].'"
						data-floorid="'.$bldg_stuff['gk_floor_id'].'"
						data-lat="'.$bldg_stuff['latitude'].'"
						data-long="'.$bldg_stuff['longitude'].'">'.$bldg_stuff['name'].'</span>';
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
			$rows = $stmt->fetchAll(PDO::FETCH_ASSOC);

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

	public function createBuildingMap() {

		try {
			$sql = "
				select * from facilities
				order by bldg_name asc, floor asc
				";
			$stmt = $this->dbh->prepare($sql);
			$stmt->execute();
			$rows = $stmt->fetchAll(PDO::FETCH_ASSOC);

			if ($rows[0]['id']) {
				foreach($rows as $field=>$record) {

					//$out[$record['gk_floor_id']] = $record;

					if (trim($record['bldg_name']) == 'HIGGINS') {
						$record['bldg_name'] = 'Higgins Hall';
					}

					$record['bldg_name']	= ucwords(strtolower(trim($record['bldg_name'])));
					$record['room_name']	= ucwords(strtolower(trim($record['room_name'])));
					$record['floor']		= strtolower(trim($record['floor']));

					// 	$map[$record['gk_bldg_id']][$record['gk_floor_id']]['recordId']		= $record['id'];
					// 	$map[$record['gk_bldg_id']][$record['gk_floor_id']]['bldg_name']	= $record['bldg_name'];
					// 	$map[$record['gk_bldg_id']][$record['gk_floor_id']]['floor']		= $record['floor'];
					// 	$map[$record['gk_bldg_id']][$record['gk_floor_id']]['bldgAbbr']		= $record['bldg_abbre'];

					// 	$map[$record['gk_floor_id']][$record['bldg_abbre']]['recordId']		= $record['id'];
					// 	$map[$record['gk_floor_id']][$record['bldg_abbre']]['bldg_name']	= $record['bldg_name'];
					// 	$map[$record['gk_floor_id']][$record['bldg_abbre']]['floor']		= $record['floor'];
					// 	$map[$record['gk_floor_id']][$record['bldg_abbre']]['bldgAbbr']		= $record['bldg_abbre'];

					//if (trim($record['bldg_name']) == 'STEUBEN') {
					if (trim($record['gk_bldg_id']) == '0018') {
						$record['bldg_name'] = 'Steuben Hall/Pratt Studios';
					}

					$map[$record['gk_floor_id']]['recordId']	= $record['id'];
					$map[$record['gk_floor_id']]['bldg_name']	= $record['bldg_name'];
					$map[$record['gk_floor_id']]['floor']		= $record['floor'];
					$map[$record['gk_floor_id']]['bldgAbbr']	= $record['bldg_abbre'];
				}

				// 	echo '<pre>';
				// 	print_r($out);
				// 	echo '</pre>';
				// 	die();

				echo json_encode($map);
			}

			return false;
		} catch(PDOException $e) {
			echo $sql . "<br>" . $e->getMessage();
		}

	}

}