<?php
class scAssignmentCreateProcessor extends modObjectCreateProcessor {
    public $classKey = 'scAssignment';
    public $languageTopics = array('studentcentre:default');
    public $objectType = 'studentcentre.ass';
 
    public function beforeSet() {
    
		$date = date('Y-m-d');
		$this->setProperty('date_created',$date);
		return parent::beforeSet();
    
    }
    
    public function beforeSave() {
        
        $name = $this->getProperty('name');
        $description = $this->getProperty('description');
        $program_id = $this->getProperty('program_id');
        $level_id = $this->getProperty('level_id');
        if (empty($name)) {
            $this->addFieldError('name',$this->modx->lexicon('studentcentre.ass_err_ns_ass_name'));
        }
        if (empty($description)) {
            $this->addFieldError('description',$this->modx->lexicon('studentcentre.ass_err_ns_ass_desc'));
        }
        if (empty($program_id)) {
            $this->addFieldError('program_id',$this->modx->lexicon('studentcentre.ass_err_ns_select_program'));
        }
        if (empty($level_id)) {
            $this->addFieldError('level_id',$this->modx->lexicon('studentcentre.ass_err_select_level'));
        }
        return parent::beforeSave();
        
    }
}
return 'scAssignmentCreateProcessor';