<?php
class scAttendanceCreateProcessor extends modObjectCreateProcessor {
    public $classKey = 'scAttendance';
    public $languageTopics = array('studentcentre:default');
    public $objectType = 'studentcentre.att';

    public function beforeSet() {
		
		// create and set date_created value
		$date = date('Y-m-d');
		$this->setProperty('date_created',$date);
		return parent::beforeSet();
		
    }

    public function beforeSave() {
        $schedClassId = $this->getProperty('scheduled_class_id');
        $studentId = $this->getProperty('student_id');
        if (empty($schedClassId)) {
            $this->addFieldError('scheduled_class_id',$this->modx->lexicon('studentcentre.att_err_select_class'));
        }
        if (empty($studentId)) {
            $this->addFieldError('student_id',$this->modx->lexicon('studentcentre.ass_err_select_student'));
        }
        return parent::beforeSave();
    }
 
}
return 'scAttendanceCreateProcessor';