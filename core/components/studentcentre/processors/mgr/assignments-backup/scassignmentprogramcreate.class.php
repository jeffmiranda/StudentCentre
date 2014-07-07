<?php
class scAssignmentProgramCreateProcessor extends modObjectCreateProcessor {
    public $classKey = 'scAssignmentProgram';
    public $languageTopics = array('studentcentre:default');
    public $objectType = 'studentcentre.ass';
 
    public function beforeSet() {
    
		$date = date('Y-m-d');
		$this->setProperty('date_created',$date);
		return parent::beforeSet();
    
    }
    
    public function beforeSave() {
        
        $name = $this->getProperty('name');
        if (empty($name)) {
            $this->addFieldError('name',$this->modx->lexicon('studentcentre.ass_err_ns_program'));
        }
        return parent::beforeSave();
        
    }
}
return 'scAssignmentProgramCreateProcessor';