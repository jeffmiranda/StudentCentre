<?php
class scClassProgress extends xPDOSimpleObject {
	
	public function __construct(& $xpdo) {
        parent :: __construct($xpdo);
    }
    
	public function save() {
		
		$this->updateJournalHrsSinceLvl();
		$this->activateJournal();
		
		return parent::save();
		
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
		
		// get the next level object
		$classLevel = $this->getNextLevel();
		if (!$classLevel) {
			$this->xpdo->log(xPDO::LOG_LEVEL_ERROR, 'Could not get the associated next class level of the scClassProgress object!');
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
	 * When given a date string in Y-m-d, checks to see if a 
	 * yearly anniversary milestone has passed or will pass
	 * and is within the day range (system setting).
	 * If so, will return the anniversary number
	 * milestone (even if the certificate already exists).
	 * If no milestone, it will return false.
	 * If an error occurred, NULL will be returned.
	 * 
	 * @param $date (Y-m-d)
	 * returns mixed
	 */
	public function isAnniversaryMilestone($date = null) {
		
		$result = false;
		
		// if $date is null, get today's date
		if (is_null($date)) $date = date('Y-m-d');
		// convert to DateTime object
		$date = new DateTime($date);
		
		// get the day range
		$range = (int) $this->xpdo->getOption('studentcentre.ann_day_range', null, 30);
		$range = abs($range);
		// $range can't be greater than 90. Don't want ranges to start overlapping!!!
		if ($range > 180) $range = 180;
		
		// get the student's start date
		$student = $this->getOne('Student');
		$studentProfile = $student->getOne('StudentProfile');
		$startDate = $studentProfile->get('start_date');
		if (empty($startDate)) {
			$this->xpdo->log(xPDO::LOG_LEVEL_ERROR, 'Could not get the student (ID: '.$this->get('student_id').') start_date to determine anniversary milestone.');
			return null;
		}
		$startDate = date('Ymd', $startDate);
		$startDate = new DateTime($startDate);
		
		$anniversary = null;

		// determine if an anniversary has passed or is coming and is within the day range
		$interval = $startDate->diff($date);
		if ($interval->invert === 1) {
			$this->xpdo->log(xPDO::LOG_LEVEL_ERROR, 'Negative time interval between startDate and given date!');
			return null;
		}
		// Create 0000-00-00 DateTime object
		$diff = new DateTime('0000-00-00');
		// Clone the zero DateTime object
		$zeroDate = clone $diff;
		// Add the $interval to it
		$diff->add($interval);
		// Subtract the years ($interval->y) if any
		$diff->sub(new DateInterval('P'.$interval->y.'Y'));
		// Find the absolute difference between the cloned DateTime object and the original DateTime object
		$remainder = $zeroDate->diff($diff, true);
		$days = (int) $remainder->format('%a');
		// If $days is less than the day range, an anniversary has just passed
		if ($days <= $range) {
			$anniversary = $interval->y;
		// If $days is greater than 365days - $range, an anniversary is coming
		} elseif ($days >= (365 - $range)) {
			$anniversary = $interval->y + 1;
		}
		
		// create certificate if anniversary is true
		if (!is_null($anniversary)) {
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
	
	/**
     * Sets the status of associated journal
     * Returns true on success. False on failure.
     */
	public function setJournalActive($value) {
		
		$success = false;
		$value = (int) $value;
		$value = ($value == 1) ? 1 : 0;
		
		$journal = $this->getOne('Journal');
		
		if ($journal) {
			
			$journal->set('active', $value);
			
			if ($journal->save()) {
				
				$success = true;
				
			} else {
				
				$this->xpdo->log(modX::LOG_LEVEL_ERROR, 'Could not save the journal object ID: ' . $journal->get('id'));
			
			}
			
		} else {
			
			$this->xpdo->log(xPDO::LOG_LEVEL_ERROR, 'Could not get the associated journal for scClassProgress object with ID: ' . $this->get('id'));
		
		}
		
		return $success;
		
	}
	
	/**
     * Updates the associated journal hours_since_leveling
     * so they stay in sync with each other.
     * Returns true on success. False on failure.
     */
	public function updateJournalHrsSinceLvl() {

		$success = false;
		$journal = $this->xpdo->getObject('scJournal', array('class_progress_id' => $this->get('id')));
		
		if (!$journal) {
			$journal = $this->_createJournal();
			return $journal ? true : false;
		}
		
		$nextLvl = $this->getNextLevel();

		if ($nextLvl) {
			
			if ($journal->get('next_level_id') == $nextLvl->get('id')) {
				
				$journal->set('hours_since_leveling', $this->get('hours_since_leveling'));
				if ($journal->save()) { $success = true; }
				
			}
			
		}

		return $success;

	}
	
	
	/**
     * Activate the journal if the classProgress is test ready.
     * Note that the journal doesn't deactivate if the classProgress
     * isn't test ready. Journal deactivation is only done when all
     * of the journal criteria are met or if manually done in the
     * journal grid.
     * Returns true on success. False on failure.
     */
	public function activateJournal() {

		$success = false;
		
		if ($this->get('test_ready') == 1) {
			
			$journal = $this->xpdo->getObject('scJournal', array('class_progress_id' => $this->get('id')));

			if (!$journal) {
				$journal = $this->_createJournal();
				return $journal ? true : false;
			}
			
			if ($journal->active != 1) {
				$journal->set('active', 1);
				$now = date('Y-m-d');
				$jComm = $this->xpdo->newObject('scJournalComment', array(
					'comment' => 'Journal reactivated on ' . $now
					,'date_created' => $now
				));
				$journal->addMany($jComm);
			}

			if ($journal->save()) { $success = true; }
			
		}
		
		return $success;
		
	}

	/**
     * Some classProgress records don't have an associated journal record.
     * They should! This function creates and attaches it.
     * Returns the newly created journal on success. False otherwise.
     */
	public function _createJournal() {
		
		$journal = $this->xpdo->newObject('scJournal', array(
			'hours_since_leveling' => $this->get('hours_since_leveling')
			,'active' => $this->get('test_ready')
			,'date_created' => date('Y-m-d')
		));
		$nextLevel = $this->getNextLevel();
		if ($nextLevel) { $journal->set('next_level_id', $nextLevel->get('id')); }
		if (!$this->addOne($journal)) { return false; }
		if (!$journal->save()) { return false; }
		
		return $journal;
		
	}

	
}