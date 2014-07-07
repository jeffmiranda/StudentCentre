<?php
class scClassLevelCategoryCreateProcessor extends modObjectCreateProcessor {
    public $classKey = 'scClassLevelCategory';
    public $languageTopics = array('studentcentre:default');
    public $objectType = 'studentcentre.att';
 
    public function beforeSet() {
    
		$date = date('Y-m-d');
		$this->setProperty('date_created',$date);
		return parent::beforeSet();
    
    }
    
    public function beforeSave() {
        
        $name = $this->getProperty('name');
        if (empty($name)) {
            $this->addFieldError('name',$this->modx->lexicon('studentcentre.att_err_ns_category'));
        }
        return parent::beforeSave();
        
    }
}
return 'scClassLevelCategoryCreateProcessor';