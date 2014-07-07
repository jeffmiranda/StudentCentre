<?php
class scClassLevelCreateProcessor extends modObjectCreateProcessor {
    public $classKey = 'scClassLevel';
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
        
        $hoursRequired = $this->getProperty('hours_required');
        if (empty($hoursRequired)) {
            $this->addFieldError('hours_required',$this->modx->lexicon('studentcentre.att_err_ns_hours_required'));
        }
        
        $testThreshold = $this->getProperty('test_threshold');
        if (empty($testThreshold)) {
            $this->addFieldError('test_threshold',$this->modx->lexicon('studentcentre.att_err_ns_test_threshold'));
        }
        
        $order = $this->getProperty('order');
        if (empty($order)) {
            $this->addFieldError('order',$this->modx->lexicon('studentcentre.att_err_ns_order'));
        }
        
        return parent::beforeSave();
        
    }
}
return 'scClassLevelCreateProcessor';