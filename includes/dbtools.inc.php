<?php

include_once('includes/sitevars.inc.php');

	ini_set('error_reporting', E_ERROR);
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
					longitude,
					room_no,
					new_room_no
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

				if (trim($record['new_room_no']) != '') {
					$room_number = trim($record['new_room_no']);
				} else {
					$room_number = trim($record['room_no']);
				}

				foreach($exp as $gk_dept) {
					$gk_dept = trim($gk_dept);
					$out[$gk_dept] = "<span
						class=\"fly-box\"
						data-recordid=\"".$record['id']."\"
						data-bldg=\"".$record['bldg_abbre']."\"
						data-floorid=\"".$record['gk_floor_id']."\"
						data-cat=\"facility\"
						data-dept=\"$gk_dept\"
						data-facility=\"$gk_dept\"
						  data-roomno=\"$room_number\"
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

	private function runQuery() {

		$sql = " select * from facilities
			where department not in ('INACTIVE','UNUSABLE')
			and room_name not like '%inactive%'
			and department not like '%inactive%'
			and major_category not like '%inactive%'
			and functional_category not like '%inactive%'
			and gk_display != 'N'
			/*and gk_bldg_id != ''
			and gk_floor_id != ''*/
			and room_name != ''
			and room_name not like '%storage%'
			and room_name not like '%corr%'

			";

		//$sql .= " group by bldg_abbre, floor, gk_department, department, room_name, gk_sculpture_name ";
		//$sql .= " group by bldg_abbre, floor, room_name ";
		$sql .= " order by bldg_name asc, room_name asc, floor asc, new_room_no asc, department asc ";

		return $sql;

	}

	public function buildSearchList() {

		try {

			$stmt = $this->dbh->prepare($this->runQuery());
			$stmt->execute();
			$rows = $stmt->fetchAll(PDO::FETCH_ASSOC);

			// 	echo '<pre>';
			// 	print_r($rows);
			// 	echo '</pre>';

			if ($rows[0]['id']) {

				foreach($rows as $field=>$record) {

					# filter out points that havn't been geolocated yet
					// 	if (strlen(trim($record['latitude'])) < '13' && $value['gk_department'] == '') {
					// 		continue;
					// 	}

					foreach($record as $key=>$value) {
						if ($key == 'longitude') { continue; }
						$value = trim($value);
						$value = trim($value, '-');
						$record[$key] = $value;
					}

					if ($record['new_room_no'] != '') {
						$room_number = $record['new_room_no'];
					} else {
						$room_number = $record['room_no'];
					}

					$imgUrl = 'images/pois/'.$record['id'].'.jpg';

					if (file_exists($imgUrl)) {
						$has_image	= 'hasImg';
						$imgAttr	= 'Y';
					} else {
						$has_image	= 'noImg';
						$imgAttr	= 'N';
					}

					$camploc = strtolower($record['on_off_campus']).'camp';

					$record['bldg_name'] = strtoupper(trim($record['bldg_name']));

					//if ($record['on_off_campus'] == 'ON' && ( strlen(trim($record['latitude'])) > '11' || $value['gk_department'] != '') ) {
					if ($record['on_off_campus'] == 'ON') {

						$rooms[] = '<li id="'.$record['id'].'"
							data-id="'.$record['id'].'"
							data-building="'.$record['bldg_abbre'].'"
							data-floorid="'.$record['gk_floor_id'].'"
							data-recordId="'.$record['id'].'"
							data-lat="'.$record['latitude'].'"
							data-long="'.$record['longitude'].'"
							data-hasimage="'.$imgAttr.'"
							class="list-group-item '.$imgUrl.' '.$has_image.'">';


						if ($record['bldg_abbre'] == 'SG') {

							$rooms[] = '<div class="li-col li-sculpture '.$camploc.'"><span>'.$record['gk_sculpture_name'].' :: '.$record['gk_sculpture_artist'].'</span></div>';

						} else {

							$rooms[] = '<div class="li-col li-label '.$camploc.'"><span>'.$record['room_name'].'</span></div>';
							$rooms[] = '<div class="li-col li-bldg '.$camploc.'"><span>'.$record['bldg_abbre'].'</span></div>';
							$rooms[] = '<div class="li-col li-floor '.$camploc.'"><span>'.$record['floor'].'</span></div>';
							$rooms[] = '<div class="li-col li-room '.$camploc.'"><span>'.$room_number.'</span></div>';
							$rooms[] = '</li>';

						}

					}


					# assemble building menu info here
					$bldgs[$record['bldg_name']]['name'] = $record['bldg_name'];
					$bldgs[$record['bldg_name']]['bldg_abbre'] = $record['bldg_abbre'];
					$bldgs[$record['bldg_name']]['gk_bldg_id'] = $record['gk_bldg_id'];
					$bldgs[$record['bldg_name']]['gk_floor_id'] = $record['gk_floor_id'];
					$bldgs[$record['bldg_name']]['camploc'] = $camploc;
					$bldgs[$record['bldg_name']]['latitude'] = $record['latitude'];
					$bldgs[$record['bldg_name']]['longitude'] = $record['longitude'];
					$bldgs[$record['bldg_name']]['accessible'][] = $record['accessible'];
					$bldgs[$record['bldg_name']]['on_off_campus'] = $record['on_off_campus'];

					@$bldg_map[$record['bldg_abbre']] = $record['gk_bldg_id'];

					if (trim($record['gk_department'])!='') {
						$dept_exp = explode(',',$record['gk_department']);
						foreach($dept_exp as $dept) {
							$dept = trim($dept);
							if ($dept != '') {
								$offs[$dept] = "<span  class=\"fly-box $camploc\"  data-recordid=\"".$record['id']."\"  data-bldg=\"".$record['bldg_abbre']."\"  data-floorid=\"".$record['gk_floor_id']."\"  data-cat=\"office\"  data-dept=\"$dept\"  data-office=\"$dept\"  data-roomno=\"$room_number\">$dept</span>";
							}
						}
					}

					$record['gk_school']		= trim($record['gk_school']);
					$record['gk_department']	= trim($record['gk_department']);

					# assemble academics menu here
					if ($record['gk_school']!='' && $record['gk_department']!='') {

						$schl_exp = explode(',',$record['gk_school']);
						$dept_exp = explode(',',$record['gk_department']);

						if ($record['bldg_abbre'] == 'W14' || $record['bldg_abbre'] == 'W18' || $record['bldg_abbre'] == 'FLSH' || $record['bldg_abbre'] == 'CRR') {
							$campLoc = 'offcamp';
						} else {
							$campLoc = 'oncamp';
						}

						foreach($schl_exp as $gkschl) {

							$gkschl = trim($gkschl);

							foreach($dept_exp as $gkdept) {
								$gkdept = trim($gkdept);
								$acad[$gkschl.'-'.$gkdept] = "<span class=\"fly-box ".$campLoc."\" data-recordid=\"".$record['id']."\" data-floorid=\"".$record['gk_floor_id']."\" data-bldg=\"".$record['bldg_abbre']."\" data-cat=\"dept\" data-schl=\"".$gkschl."\" data-dept=\"".$gkdept."\"  data-roomno=\"$room_number\">".$gkdept."</span>";
							}
						}
					}

				}

				//echo '<pre>';
				//print_r($acad);
				//echo '</pre>';

				//@natsort($bldgs);
				@ksort($bldgs);
				foreach($bldgs as $bldg_name=>$bldg_stuff){

					$bldg_name = strtolower($bldg_name);
					$bldg_name = ucwords($bldg_name);

					if ($bldg_stuff['on_off_campus'] == 'ON') {

						$bldgOpt[] = '<option value="'.$bldg_stuff['bldg_abbre'].'" data-floorid="'.$bldg_stuff['gk_floor_id'].'">'.$bldg_name.'</option>';

					}

					if ($bldg_stuff['gk_bldg_id'] == '0000') {
						continue;
					}

					$accessible_str = implode('',$bldg_stuff['accessible']);
					$class_accessible = '';
					$accessible = 'N';
					$hide_this = 'hide-this';
					if (strpos('_'.$accessible_str, 'Y') !== false) {
						$accessible = 'Y';
						$class_accessible = 'accessible';
						$hide_this = '';
					}

					$bldgMnu[] = '<span
						class="fly-box dbtools '.$bldg_stuff['camploc'].' buildings '.$class_accessible.' '.$hide_this.' "
						data-cat="buildings"
						data-bldg="'.$bldg_stuff['bldg_abbre'].'"
						data-bldgid="'.$bldg_stuff['gk_bldg_id'].'"
						data-bldgname="'.$bldg_stuff['bldg_name'].'"
						data-floorid="'.$bldg_stuff['gk_floor_id'].'"
						data-lat="'.$bldg_stuff['latitude'].'"
						data-long="'.$bldg_stuff['longitude'].'"
						data-accessible="'.$accessible.'"
						>'.$bldg_name.'</span>';

				}

				ksort($acad);
				ksort($offs);

				$out['acad_menu']		= implode('',$acad);
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

	public function createHallMap() {

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

					if ($record['gk_floor_id'] < '1') {
						continue;
					}

					if (trim($record['bldg_name']) == 'HIGGINS') {
						$record['bldg_name'] = 'Higgins Hall';
					}

					$record['bldg_name']	= ucwords(strtolower(trim($record['bldg_name'])));
					$record['room_name']	= ucwords(strtolower(trim($record['room_name'])));
					$record['floor']		= strtolower(trim($record['floor']));

					//if (trim($record['bldg_name']) == 'STEUBEN') {
					if (trim($record['gk_bldg_id']) == '0018') {
						$record['bldg_name'] = 'Steuben Hall/Pratt Studios';
					}

					$map[$record['gk_bldg_id']]['recordId']		= $record['id'];
					$map[$record['gk_bldg_id']]['bldg_name']	= $record['bldg_name'];
					$map[$record['gk_bldg_id']]['floor']		= $record['floor'];
					$map[$record['gk_bldg_id']]['bldgAbbr']		= $record['bldg_abbre'];

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

					if ($record['gk_floor_id'] < '1') {
						continue;
					}

					if (trim($record['bldg_name']) == 'HIGGINS') {
						$record['bldg_name'] = 'Higgins Hall';
					}

					$record['bldg_name']	= ucwords(strtolower(trim($record['bldg_name'])));
					$record['room_name']	= ucwords(strtolower(trim($record['room_name'])));
					$record['floor']		= strtolower(trim($record['floor']));

					if (trim($record['gk_bldg_id']) == '0018') {
						$record['bldg_name'] = 'Steuben Hall/Pratt Studios';
					}

					$map[$record['gk_floor_id']]['recordId']	= $record['id'];
					$map[$record['gk_floor_id']]['buildingId']	= $record['gk_bldg_id'];
					$map[$record['gk_floor_id']]['bldg_name']	= $record['bldg_name'];
					$map[$record['gk_floor_id']]['floor']		= $record['floor'];
					$map[$record['gk_floor_id']]['bldgAbbr']	= $record['bldg_abbre'];

				}

				echo json_encode($map);
			}

			return false;
		} catch(PDOException $e) {
			echo $sql . "<br>" . $e->getMessage();
		}

	}

}