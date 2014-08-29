<?php
class scAttendanceCreateProcessor extends modObjectCreateProcessor {
    public $classKey = 'scAttendance';
    public $languageTopics = array('studentcentre:default');
    public $objectType = 'studentcentre.att';

    public function beforeSet() {
		
		// create and set date_created value
		$date = date('Y-m-d');
		$this->setProperty('date_created',$date);
		
		// if exists, properly format attendance date value
		$attDate = $this->getProperty('date');
        if (!empty($attDate)) {
	        $goodDate = date('Y-m-d', strtotime(str_replace('/','-',$attDate)));
	        $this->setProperty('date',$goodDate);
        }

		return parent::beforeSet();
		
    }

    public function beforeSave() {
        $schedClassId = $this->getProperty('scheduled_class_id');
        $studentId = $this->getProperty('student_id');
        $attDate = $this->getProperty('date');
        if (empty($attDate)) {
            $this->addFieldError('date',$this->modx->lexicon('studentcentre.att_err_ns_date'));
        } else {
	        $today = date('Y-m-d');
	        // ensure attendance date isn't in the future
	        if ($attDate > $today) {
	        	$this->addFieldError('date',$this->modx->lexicon('studentcentre.att_err_future_date'));
	        }
        }
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