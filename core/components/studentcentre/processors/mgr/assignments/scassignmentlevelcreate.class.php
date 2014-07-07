<?php
class scAssignmentLevelCreateProcessor extends modObjectCreateProcessor {
    public $classKey = 'scAssignmentLevel';
    public $languageTopics = array('studentcentre:default');
    public $objectType = 'studentcentre.ass';
 
    public function beforeSet() {
    
		$date = date('Y-m-d');
		$this->setProperty('date_created',$date);
		return parent::beforeSet();
    
    }
    
    public function beforeSave() {
        
        $name = $this->getProperty('name');
        $program_id = $this->getProperty('program_id');
        if (empty($name)) {
            $this->addFieldError('name',$this->modx->lexicon('studentcentre.ass_err_ns_level'));
        }
        if (empty($program_id)) {
            $this->addFieldError('program_id',$this->modx->lexicon('studentcentre.ass_err_ns_select_program'));
        }
        return parent::beforeSave();
        
    }
}
return 'scAssignmentLevelCreateProcessor';