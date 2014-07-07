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
			
			// Get the ClassProgress object, but we need the ScheduledClass object first
			$schedClass = $this->object->getOne('ScheduledClass');
			$progress = $this->modx->getObject('scClassProgress', array(
				'class_id' => $schedClass->get('class_id'),
				'student_id' => $this->object->get('student_id')
			));
			if (!$progress) {
				$this->modx->log(modX::LOG_LEVEL_ERROR, 'Could not get the associated ClassProgress of the Attendance object!');
				return $this->modx->error->failure($this->modx->lexicon('studentcentre.att_err_saving_stu_progress'));
			}
			
			// Determine change in hours
			$hourDiff = $this->object->get('hours') - $this->prevAtt['hours'];
			
			// If hours have been removed...
			if ($hourDiff < 0) {
				$progress->deleteHours(abs($hourDiff), $this->object->get('date'));
			} else { // hours have been added
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