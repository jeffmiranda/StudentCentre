<?php
class scAttendanceRemoveProcessor extends modObjectRemoveProcessor {
    public $classKey = 'scAttendance';
    public $languageTopics = array('studentcentre:default');
    public $objectType = 'studentcentre.att';
    
    public function beforeRemove() {
    
    	// Get the ClassProgress object, but we need the ScheduledClass object first
		$schedClass = $this->object->getOne('ScheduledClass');
		$progress = $this->modx->getObject('scClassProgress', array(
			'class_id' => $schedClass->get('class_id'),
			'student_id' => $this->object->get('student_id')
		));
		if (!$progress) {
			$this->modx->log(modX::LOG_LEVEL_ERROR, 'Could not get the associated ClassProgress of the Attendance object!');
			return $this->modx->error->failure($this->modx->lexicon('studentcentre.att_err_removing_attendance'));
		}
		
		$progress->deleteHours($this->object->get('hours'), $this->object->get('date'));
		
		// Recheck the threshold and update test_ready flag if necessary
		if ($progress->isTestReady()) {
			$progress->set('test_ready', 1);
		} else {
			$progress->set('test_ready', 0);
		}
		
		// Save ClassProgress object
		if (!$progress->save()) {
			$this->modx->log(modX::LOG_LEVEL_ERROR, 'Could not save the ClassProgress object!');
			return $this->modx->error->failure($this->modx->lexicon('studentcentre.att_err_removing_attendance'));
		}
    
    	return parent::beforeRemove();
    
    }
    
}
return 'scAttendanceRemoveProcessor';