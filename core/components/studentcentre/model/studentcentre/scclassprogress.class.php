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
	 * when given an hour value. If so, will return the hourly milestone.
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
		$certType = $modx->getObject('scCertificateType', array(
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
				// create the certificate
				$newCertificate = $this->xpdo->newObject('scCertificate', array(
					'student_id' => $this->xpdo->get('student_id')
					,'certificate_type_id' => $certType->get('id')
					,'hours' => $milestone
					,'flag' => 1
					,'date_created' => date('Y-m-d')
				));
				if (!$newCertificate->save()) {
				   $this->xpdo->log(xPDO::LOG_LEVEL_ERROR, 'Could not save the newly created hourly certificate for studentId: ' . $this->xpdo->get('student_id'));
				   return null;
				}
				$milestoneResult = $milestone;
			}
		}
		return $milestoneResult;
	}
	
}