<?php
class scClassEnrollmentCreateProcessor extends modObjectCreateProcessor {
    public $classKey = 'scClassEnrollment';
    public $languageTopics = array('studentcentre:default');
    public $objectType = 'studentcentre.att';
 
    public function beforeSave() {
        
        $studentId = $this->getProperty('student_id');
        if (empty($studentId)) {
            $this->addFieldError('student_id',$this->modx->lexicon('studentcentre.att_err_ns_student_id'));
        }

        $scheduledClassId = $this->getProperty('scheduled_class_id');
        if (empty($scheduledClassId)) {
            $this->addFieldError('scheduled_class_id',$this->modx->lexicon('studentcentre.att_err_ns_scheduled_class_id'));
        }
                
        return parent::beforeSave();
        
    }
}
return 'scClassEnrollmentCreateProcessor';