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
		 * from the student's total hours.
		*/
				
		// First test to see if the student is higher than level 1
		$currLevel = $this->getOne('ClassLevel');
		$currLevelOrder = $currLevel->get('order');
		if ($currLevelOrder > 1) {
		
			// Student is higher than level 1,
			// so get the previous level ID
			$prevLevelOrder = $currLevelOrder - 1;
			$prevLevel = $this->xpdo->getObject('scClassLevel', array(
				'class_level_category_id' => $currLevel->get('class_level_category_id')
				,'order' => $prevLevelOrder
				,'active' => 1
			));
			if (!$prevLevel) {
				$this->xpdo->log(xPDO::LOG_LEVEL_ERROR, 'Could not get the previous class level object for the student!');
			}
			
			// Get the test object
			$c = $this->xpdo->newQuery('scTest');
			$c->where(array(
			   'level_id' => $prevLevel->get('id')
			   ,'student_id' => $this->get('student_id')
			   ,'pass' => 1
			));
			$c->sortby('date_created','DESC');
			$c->limit(1);
			$lastTest = $this->xpdo->getObject('scTest', $c);
			if (!$lastTest) {
				$this->xpdo->log(xPDO::LOG_LEVEL_ERROR, 'Could not get the last passed test of the student!');
			}
			
			// Does the attendance date occur after the test?
			$testDate = $lastTest->get('date_created');
			if (strtotime($attDate) > strtotime($testDate)) {
				$newHoursSinceLvl = $this->get('hours_since_leveling') - $hours;
				$this->set('hours_since_leveling', $newHoursSinceLvl);
			}
			
		}
		
		$newTotalHours = $this->get('total_hours') - $hours;
		$this->set('total_hours', $newTotalHours);
		
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
	
}