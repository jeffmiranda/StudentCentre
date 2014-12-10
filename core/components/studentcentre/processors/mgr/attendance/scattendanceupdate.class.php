<?php
class scAttendanceUpdateProcessor extends modObjectUpdateProcessor {

    public $classKey = 'scAttendance';
    public $languageTopics = array('studentcentre:default');
    public $objectType = 'studentcentre.att';
    public $prevAtt = null; // used to preserve the previous values of the attendance object after saving
    
    public function beforeSet() {
		
		// get the current attendance obj values
		$this->prevAtt = $this->object->toArray();
		return parent::beforeSet();
		
    }

    public function afterSave() {
		
		// if there was a change in hours do do something...
		if ($this->prevAtt['hours'] != $this->object->get('hours')) {
			
			// Get the ClassProgress object, but we need the ScheduledClass and class objects first
			$schedClass = $this->object->getOne('ScheduledClass');
			$class = $schedClass->getOne('Class');
			$progress = $this->modx->getObject('scClassProgress', array(
				'class_level_category_id' => $class->get('class_level_category_id')
				,'student_id' => $this->object->get('student_id')
			));
			if (!$progress) {
				$this->modx->log(modX::LOG_LEVEL_ERROR, 'Could not get the associated ClassProgress of the Attendance object!');
				return $this->modx->error->failure($this->modx->lexicon('studentcentre.att_err_saving_stu_progress'));
			}
			
			// Determine change in hours
			$hourDiff = $this->object->get('hours') - $this->prevAtt['hours'];
			
			// If hours have been removed...
			if ($hourDiff < 0) {
				// delete hours
				$progress->deleteHours(abs($hourDiff), $this->object->get('date'));
			} else { // hours have been added
			
				// Begin determining hourly milestone
				$hourlyMilestone = $progress->isHourlyMilestone($hourDiff);
				if (is_numeric($hourlyMilestone) && ($hourlyMilestone > 0)) {
					// Do something if you want (perhaps notify of milestone?)
				} elseif ($hourlyMilestone === false) {
					// A milestone does not exist. Do something if you want.
				} else {
					$this->modx->log(modX::LOG_LEVEL_ERROR, 'An error occurred while trying to determine hourly milestone');
				}
				
				// Begin determining anniversary milestone
				$annMilestone = $progress->isAnniversaryMilestone($this->object->get('date'));
				if (is_numeric($annMilestone) && ($annMilestone > 0)) {
					// A milestone was returned. Do something if you want (perhaps notify of milestone?).
				} elseif ($annMilestone === false) {
					// A milestone does not exist. Do something if you want.
				} else {
					// An error ocurred trying to determine if a milestone exists
					$this->modx->log(modX::LOG_LEVEL_ERROR, 'An error occurred while trying to determine anniversary milestone');
				}
				
				// increment hours
				$progress->addHours($hourDiff);
			}
			
			// Recheck the threshold and update test_ready flag if necessary
			if ($progress->isTestReady()) {
				$progress->set('test_ready', 1);
			} else {
				$progress->set('test_ready', 0);
			}
			
			// Save ClassProgress object
			if (!$progress->save()) {
				$this->modx->log(modX::LOG_LEVEL_ERROR, 'Could not save the class progress object!');
				return $this->modx->error->failure($this->modx->lexicon('studentcentre.att_err_saving_stu_progress'));
			}
			
		}
		
		return parent::afterSave();
		
    }

}
return 'scAttendanceUpdateProcessor';