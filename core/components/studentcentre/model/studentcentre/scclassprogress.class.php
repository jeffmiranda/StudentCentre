<?php
class scClassProgress extends xPDOSimpleObject {
	
	public function __construct(& $xpdo) {
        parent :: __construct($xpdo);
    }
    
	/**
     * Adds the new hours to the hours_since_leveling
     * and total_hours properties of the object
     * @param $hours
     */
	public function addHours($hours) {
		
		$newHoursSinceLvl = $this->get('hours_since_leveling') + $hours;
		$newTotalHours = $this->get('total_hours') + $hours;
		$this->fromArray(array(
			'hours_since_leveling' => $newHoursSinceLvl,
			'total_hours' => $newTotalHours
		));
		
	}
	
	/**
     * Subtracts the hours from the hours_since_leveling
     * and total_hours properties of the object without going below 0
     * @param $hours
     */
	public function deleteHours($hours, $attDate) {
		
		/**
		 * We want to delete hours from the student's progress. To do that
		 * we need to first determine if the attendance record we're updating/deleting
		 * happens before or after the student's last successful test. If it happens
		 * after, then we need to delete hours from the student's total hours AND
		 * the hours since leveling. If it happens before, then simply delete hours
		 * from the student's total hours. If no previous test can be found,
		 * then the student is new so delete the hours from both.
		*/
				
		// Get the test object
		$c = $this->xpdo->newQuery('scStudentTest');
		$c->where(array(
		   'level_id' => $this->get('level_id')
		   ,'student_id' => $this->get('student_id')
		   ,'type' => 'Test'
		   ,'pass' => 1
		));
		$c->sortby('date_created','DESC');
		$c->limit(1);
		$lastTest = $this->xpdo->getObject('scStudentTest', $c);
		if ($lastTest) { // if last test exists
			//$this->xpdo->log(xPDO::LOG_LEVEL_ERROR, 'LastTest exists!');
			//return false;
			// Does the attendance date occur after the test?
			$testDate = $lastTest->get('date_created');
			if (strtotime($attDate) > strtotime($testDate)) {
				// attendance date occurs after the test date
				$newHoursSinceLvl = $this->get('hours_since_leveling') - $hours;
				$this->set('hours_since_leveling', $newHoursSinceLvl);
			}
		} else {
			// Must be a new student if there are no previously passed tests
			$newHoursSinceLvl = $this->get('hours_since_leveling') - $hours;
			$this->set('hours_since_leveling', $newHoursSinceLvl);
		}
				
		$newTotalHours = $this->get('total_hours') - $hours;
		$this->set('total_hours', $newTotalHours);
		return true;
		
	}
	
	/**
     * Checks to see if the student is at or passed
     * the required threshold to level up and returns
     * boolean true if he is
     */
	public function isTestReady() {
		
		$answer = false;
		
		// get the level object
		$classLevel = $this->getOne('ClassLevel');
		if (!$classLevel) {
			$this->xpdo->log(xPDO::LOG_LEVEL_ERROR, 'Could not get the associated class level of the scClassProgress object!');
		}
		
		// if hours since leveling / hours required is greater than test threshold
		// OR if testing checkbox has been checked
		$progressRatio = $this->get('hours_since_leveling') / $classLevel->get('hours_required');
		if ($progressRatio >= $classLevel->get('test_threshold')) {
			$answer = true;
		}
		
		return $answer;
		
	}
	
	/**
	 * Gets the next level of the student.
	 * Returns null if no level exists.
	 */
	public function getNextLevel() {
		
		$level = null;
		
		// Get the current level
		$currLevel = $this->getOne('ClassLevel');
		$currLevelOrder = $currLevel->get('order');

		// Get the next level
		$q = $this->xpdo->newQuery('scClassLevel');
		$q->where(array(
			'class_level_category_id' => $currLevel->get('class_level_category_id')
			,'`order`:>' => $currLevelOrder
			,'active' => 1
		));
		$q->sortby('`order`', 'ASC');
		$q->limit(1);
		//$q->prepare();
		//error_log(print_r('SQL Statement: ' . $q->toSQL(),true));
		$nextLevel = $this->xpdo->getObject('scClassLevel', $q);
		if ($nextLevel) {
			$level = $nextLevel;
		}
		
		return $level;
	}

	/**
	 * Gets the previous level of the student.
	 * Returns null if no level exists.
	 */
	public function getPrevLevel() {
		
		$level = null;
		
		// Get the current level
		$currLevel = $this->getOne('ClassLevel');
		$currLevelOrder = $currLevel->get('order');

		// Get the previous level
		$q = $this->xpdo->newQuery('scClassLevel');
		$q->where(array(
			'class_level_category_id' => $currLevel->get('class_level_category_id')
			,'`order`:<' => $currLevelOrder
			,'active' => 1
		));
		$q->sortby('`order`', 'DESC');
		$q->limit(1);
		$prevLevel = $this->xpdo->getObject('scClassLevel', $q);
		if ($prevLevel) {
			$level = $prevLevel;
		}
		
		return $level;
	}
	
	/**
	 * Gets the students total hours practiced
	 * from all rank categories
	 * returns float
	 */
	public function getGrandTotalHours() {
		
		$gt = null;
		
		$rankProgressCollection = $this->xpdo->getCollection('scClassProgress', array(
			'student_id' => $this->get('student_id')
		));
		
		if (!empty($rankProgressCollection)) {
			$gt = 0;
			foreach ($rankProgressCollection as $rankProgress) {
				$gt = $gt + $rankProgress->get('total_hours');
			}
		}
		
		return $gt;
	}

	/**
	 * Checks to see if an hourly milestone was reached
	 * when given an hour value. If so, will return the hourly milestone (even if the certificate already exists).
	 * If no milestone, it will return false.
	 * If an error occurred, NULL will be returned.
	 * @param $hours (float)
	 * returns mixed
	 */
	public function isHourlyMilestone($hours) {
		
		$milestoneResult = false;
		
		$gtHours = $this->getGrandTotalHours();
		// get the hourly milestones from the system settings
		$hourlyMilestones = $this->xpdo->getOption('studentcentre.hourly_milestones', $scriptProperties, '');
		if (empty($hourlyMilestones)) {
			$this->xpdo->log(xPDO::LOG_LEVEL_ERROR, 'Hourly milestones are empty! Please set them in System Settings.');
			return null;
		}
		// get the certificate tpl type for hourly milestones
		$certType = $this->xpdo->getObject('scCertificateType', array(
			'name' => 'Hour'
		));
		if (!$certType) {
			$this->xpdo->log(xPDO::LOG_LEVEL_ERROR, 'Could not get the certificate type object.');
			return null;
		}
		// loop through each hourly milestone and check if one was passed
		$arrHourlyMilestones = explode(',', str_replace(' ', '', $hourlyMilestones));
		foreach ($arrHourlyMilestones as $milestone) {
			if ($gtHours < $milestone && $milestone <= ($gtHours + $hours)) {
				if (!$this->createCertificate($this->get('student_id'), 'Hour', $milestone)) {
					$this->xpdo->log(xPDO::LOG_LEVEL_ERROR, 'Could not create the hourly milestone certificate. studentId: ' . $this->get('student_id') . ', type: Hour, value: ' . $milestone);
					return null;
				} else {
					$milestoneResult = $milestone;
				}
			}
		}
		return $milestoneResult;
	}
	
	/**
	 * Checks to see if a yearly anniversary milestone was reached
	 * when given a date value. If so, will return the anniversary number
	 * milestone (even if the certificate already exists).
	 * By default, $accuracy is set to month but the user can specify
	 * "day", "month", or "year" as the accuracy.
	 * If no milestone, it will return false.
	 * If an error occurred, NULL will be returned.
	 * @param $date (date)
	 * @param $accuracy (string)
	 * returns mixed
	 */
	public function isAnniversaryMilestone($date = null, $accuracy = 'month') {
		
		$result = false;
		if (is_null($date)) $date = time();
		
		// parse out the date, month, year
		$dateTimeStamp = strtotime($date);
		$d = (int) date('d', $dateTimeStamp);
		$m = (int) date('m', $dateTimeStamp);
		$y = (int) date('Y', $dateTimeStamp);

		// get the student's start date
		$student = $this->getOne('Student');
		$studentProfile = $student->getOne('StudentProfile');
		$startDate = $studentProfile->get('start_date');
		if (empty($startDate)) {
			// get earliest enrolled record
			$q = $this->xpdo->newQuery('scClassEnrollment');
			$q->where(array(
				'student_id' => $this->get('student_id')
				,'active' => 1
			));
			$q->sortby('date_created', 'ASC');
			$q->limit(1);
			$classEnrollment = $this->xpdo->getObject('scClassEnrollment', $q);
			if (!$classEnrollment) {
				$this->xpdo->log(xPDO::LOG_LEVEL_ERROR, 'Could not get the earliest class enrollment record to determine anniversary milestone.');
				return null;
			}
			$startDate = strtotime($classEnrollment->get('date_created'));
		}
		
		// parse out the start_date date, month, year
		$sd = (int) date('d', $startDate);
		$sm = (int) date('m', $startDate);
		$sy = (int) date('Y', $startDate);

		$isAnniversary = false;

		// only if the year is greater than the start_date year
		if ($y > $sy) {
			switch (strtolower($accuracy)) {
				case 'year':
					$isAnniversary = true;
				    break;
				case 'day':
					if ($m == $sm) {
						if ($d >= $sd) $isAnniversary = true;
					} elseif ($m > $sm) {
						$isAnniversary = true;
					}
					break;
				default:
					if ($m >= $sm) $isAnniversary = true;
			}
		}
		
		// create certificate if anniversary is true
		if ($isAnniversary) {
			$anniversary = $y - $sy;
			if (!$this->createCertificate($this->get('student_id'), 'Anniversary', $anniversary)) {
				$this->xpdo->log(xPDO::LOG_LEVEL_ERROR, 'Could not create the anniversary milestone certificate. studentId: ' . $this->get('student_id') . ', type: Anniversary, value: ' . $anniversary);
				return null;
			} else {
				$result = $anniversary;
			}
		}
		
		return $result;
		
	}
	
	/**
	 * Creates a student certificate based on supplied parameters.
	 * Will first check to see if certificate already exists.
	 * If so, the existing certificate will be returned.
	 * If it doesn't exist, a new certificate will be created and returned.
	 * If creation was unsuccessful, NULL will be returned.
	 * @param $studentId (int)
	 * @param $type (string)
	 * @param $value (mixed - depends on what $type is)
	 * returns mixed
	 */
	public function createCertificate($studentId, $type, $value) {
		
		$result = null;
		
		// get the certificate type
		$certType = $this->xpdo->getObject('scCertificateType', array('name' => $type));
		if (!$certType) {
			$this->xpdo->log(xPDO::LOG_LEVEL_ERROR, 'Could not get the certificate type object.');
			return $result;
		}
		
		// set the certificate properties
		$certProp = array(
			'student_id' => $studentId
			,'certificate_type_id' => $certType->get('id')
		);
		switch (strtolower($type)) {
		    case 'anniversary':
		        $certProp['anniversary'] = $value;
		        break;
		    case 'hour':
		        $certProp['hours'] = $value;
		        break;
		    case 'level':
		        $certProp['level_id'] = $value;
		        break;
		}
		
		// check to see if the certificate already exists
		$certificate = $this->xpdo->getObject('scCertificate', $certProp);
		if (!$certificate) {
			// Create certificate
			$certProp['flag'] = 1;
			$certProp['date_created'] = date('Y-m-d');
			$newCertificate = $this->xpdo->newObject('scCertificate', $certProp);
			if (!$newCertificate->save()) {
				$this->xpdo->log(xPDO::LOG_LEVEL_ERROR, 'Could not save the newly created certificate for studentId: ' . $studentId);
				return $result;
			} else {
				$result = $newCertificate;
			}
		} else {
			// Certificate exists
			$result = $certificate;
		}
		
		return $result;
		
	}

	
}