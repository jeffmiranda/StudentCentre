<?php
class scAttendanceRemoveProcessor extends modObjectRemoveProcessor {
    public $classKey = 'scAttendance';
    public $languageTopics = array('studentcentre:default');
    public $objectType = 'studentcentre.att';
    
    public function beforeRemove() {
    
    	// Get the ClassProgress object, but we need the ScheduledClass object first
		$schedClass = $this->object->getOne('ScheduledClass');
		$class = $schedClass->getOne('Class');
		$progress = $this->modx->getObject('scClassProgress', array(
			'class_level_category_id' => $class->get('class_level_category_id'),
			'student_id' => $this->object->get('student_id')
		));
		if (!$progress) {
			$this->modx->log(modX::LOG_LEVEL_ERROR, 'Could not get the associated ClassProgress of the Attendance object!');
			return $this->modx->error->failure($this->modx->lexicon('studentcentre.att_err_removing_attendance'));
		}
		
		if (!$progress->deleteHours($this->object->get('hours'), $this->object->get('date'))) {
			$this->modx->log(modX::LOG_LEVEL_ERROR, 'Could not remove the hours from the progress object!');
			return $this->modx->error->failure($this->modx->lexicon('studentcentre.att_err_removing_attendance'));
		}
		
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