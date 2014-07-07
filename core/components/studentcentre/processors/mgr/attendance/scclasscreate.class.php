<?php
class scClassCreateProcessor extends modObjectCreateProcessor {
    public $classKey = 'scClass';
    public $languageTopics = array('studentcentre:default');
    public $objectType = 'studentcentre.att';
 
    public function beforeSet() {
    
		$date = date('Y-m-d');
		$this->setProperty('date_created',$date);
		return parent::beforeSet();
    
    }
    
    public function beforeSave() {
        
        $classLevelCategoryId = $this->getProperty('class_level_category_id');
        if (empty($classLevelCategoryId)) {
            $this->addFieldError('class_level_category_id',$this->modx->lexicon('studentcentre.att_err_ns_category_id'));
        }
        
        $name = $this->getProperty('name');
        if (empty($name)) {
            $this->addFieldError('name',$this->modx->lexicon('studentcentre.att_err_ns_level_name'));
        }
                
        return parent::beforeSave();
        
    }
}
return 'scClassCreateProcessor';