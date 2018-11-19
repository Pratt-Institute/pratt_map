<?php

require('sitevars.inc.php');

ini_set('error_reporting', E_ERROR);
ini_set('display_errors', true);
ini_set('log_errors', 1);

class LdapTools {

	private $ldaphost = LDAP_HOST;///
	private $ldapuser = LDAP_USER;///
	private $ldappass = LDAP_PASS;///
	private $ldapport = LDAP_PORT;///
	private $conn;
	private $hall;
	private $buildingId;

	public $lookfor;

	public function __construct() {

		$this->conn = ldap_connect(LDAP_HOST, LDAP_PORT) or die('ldap connection error ' . LDAP_HOST . ' : ' . LDAP_PORT);

		$bind = ldap_bind($this->conn, LDAP_USER, LDAP_PASS);

		$this->justthese = array('ou', 'title', 'telephoneNumber', 'roomNumber', 'sn', 'givenName', 'mail', 'employeeType');

	}

	private function alignBuildings() {

		$arr['Information Science']			=  '0001';
		$arr['Pratt Library']				=  '0002';
		$arr['DeKalb Hall']					=  '0003';
		$arr['Higgins Hall']				=  '0004';
		$arr['North Hall']					=  '0005';
		$arr['Memorial Hall']				=  '0006'; /// ???
		$arr['Student Union']				=  '0007';
		$arr['Main Building']				=  '0008';
		$arr['East Hall']					=  '0009';
		$arr['South Hall']					=  '0010';
		$arr['Jones Hall']					=  '0011'; /// ???
		$arr['Thrift Hall']					=  '0012';
		$arr['Pantas Hall']					=  '0013'; /// ???
		$arr['Willoughby Hall']				=  '0014';
		$arr['Chemistry Building']			=  '0015';
		$arr['Machinery Building']			=  '0016';
		$arr['Engineering Building']		=  '0017';
		$arr['Design Center']				=  '0018'; /// ???
		$arr['Film Video']					=  '0019';
		$arr['Activity Resource']			=  '0021';
		$arr['Stabile Hall']				=  '0022'; /// ???
		$arr['Cannoneer Court']				=  '0023'; /// ???
		$arr['Myrtle Hall']					=  '0024';

		return $arr[$this->hall];

	}

	private function findCoords() {

		$arr['0021'] = '40.690893,-73.962043';						///'ARC'
		$arr['0023'] = '40.6910285949707,-73.96123504638672';		///'CC'
		$arr['0060'] = '40.691675,-73.963465';						///'CHEM'
		$arr['0003'] = '40.690072,-73.964735';						///'DEK'
		$arr['0009'] = '40.691230,-73.963968';						///'EAST'
		$arr['0017'] = '40.691282,-73.962845';						///'ENGR'
		$arr['0019'] = '40.693477630615234,-73.96247100830078';		///'FV'
		$arr['flsh'] = '40.699693,-73.948233';						///'FLSH'
		$arr['0004'] = '40.687801361083984,-73.9640884399414';		///'HH'
		$arr['0001'] = '40.691750,-73.965083';						///'ISC'
		$arr['0011'] = '40.690330505371094,-73.96407318115234';		///'ELJ'
		$arr['0002'] = '40.690799713134766,-73.96505737304688';		///'LIB'
		$arr['0016'] = '40.69172668457031,-73.96295166015625';		///'MACH'
		$arr['0008'] = '40.691342,-73.964296';						///'MAIN'
		$arr['0006'] = '40.69157028198242,-73.96427154541016';		///'MEM'
		$arr['0024'] = '40.693454,-73.963549';						///'MH'
		$arr['crr'] = '40.698393,-73.972519';						///'CRR'
		$arr['0005'] = '40.69179916381836,-73.96444702148438';		///'NH'
		$arr['0013'] = '40.690120697021484,-73.96381378173828';		///'LJP'
		$arr['w14'] = '40.738000,-73.998900';						///'W14'
		$arr['0018'] = '40.690250396728516,-73.96299743652344';		///'PS'
		$arr['0010'] = '40.691054,-73.964238';						///'SH'
		$arr['0022'] = '40.69165802001953,-73.96163940429688';		///'SBL'
		$arr['0018'] = '40.690377,-73.962631';						///'STEU'
		$arr['0007'] = '40.691599,-73.963907';						///'SU'
		$arr['0012'] = '40.69010925292969,-73.96412658691406';		///'TH'
		$arr['0014'] = '40.692935943603516,-73.9635009765625';		///'WILL'

		return $arr[$this->buildingId];

	}

	public function fetchLdapMatches() {

		try {

			$dn = 'o=My Company, c=US';
			//$filter='(&(|(cn='.$this->lookfor.'*)(mail='.$this->lookfor.'*)) (!(employeeType=Student))(!(employeeType=CEStudent))(!(employeeType=Alumni)) )';
			$filter='( & (|(cn='.$this->lookfor.'*)(mail='.$this->lookfor.'*)(givenname='.$this->lookfor.'*)(sn='.$this->lookfor.'*)) (|(employeeType=Staff)(employeeType=Faculty)) )';

			$sr = ldap_search($this->conn, LDAP_BASE, $filter, $this->justthese);

			$info = ldap_get_entries($this->conn, $sr);

			//echo $info['count'].' entries returned';

			if ($info['count'] > '0') {

				foreach($info as $key=>$val) {

					if ($val['roomnumber'][0] == '') {
						continue;
					}

					$exp1 = explode(',',$val['roomnumber'][0]);

					if ($exp1[0] != 'Brooklyn Campus') {
						continue;
					}
					if ($exp1[1] == '') {
						continue;
					}

					$hall = trim($exp1[1]);

					$exp2 = explode(' ',$hall);

					$this->hall = $exp2[0].' '.$exp2[1];
					$this->buildingId = $this->alignBuildings();

					if ($this->buildingId == '') {
						continue;
					}

					$coords = $this->findCoords();
					$coordsExp = explode(',',$coords);


					error_log(__FILE__.' -- '.__LINE__.' coords '.$coords);


					$dept	= $val['ou'][0];
					$title	= $val['title'][0];
					$fone	= $val['telephonenumber'][0];
					$office	= $val['roomnumber'][0];
					$lname	= $val['sn'][0];
					$fname	= $val['givenname'][0];
					$mail	= $val['mail'][0];

					$line[] = '<li id=""
						data-id=""
						data-building="'.$this->buildingId.'"
						data-floorid=""
						data-recordId=""
						data-lat="'.$coordsExp[0].'"
						data-long="'.$coordsExp[1].'"
						data-hasimage=""
						data-keywords=""
						data-dept="'.$dept.'"
						data-title="'.$title.'"
						data-phone="'.$fone.'"
						data-office="'.$office.'"
						data-person="'.$fname.' '.$lname.'"
						data-email="'.$mail.'"
						class=" list-group-item ldap-item ">';

					$line[] = '<div class="li-col li-label "><span class="list-group-point">'.$fname.' '.$lname.'</span></div>';
					$line[] = '<div class="li-col li-bldg "><span>'.$exp1[1].'</span></div>';
					$line[] = '</li>';

				}

				echo join('',$line);
			}

			return true;

		} catch (Exception $e) {

			echo $sql . '<br>' . $e->getMessage();
		}
	}
}

?>