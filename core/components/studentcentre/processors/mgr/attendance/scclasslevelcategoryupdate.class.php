<?php
class scClassLevelCategoryUpdateProcessor extends modObjectUpdateProcessor {

    public $classKey = 'scClassLevelCategory';
    public $languageTopics = array('studentcentre:default');
    public $objectType = 'studentcentre.att';
    
    public function beforeSet() {
    
        $toggleActive = $this->getProperty('toggleActive');
        if (!empty($toggleActive)) {
	        if ($this->object->get('active') == 1) {
		        $this->setProperty('active', 0);
	        } else {
		        $this->setProperty('active', 1);
	        }
        }
        
        return parent::beforeSet();
    }
        
}
return 'scClassLevelCategoryUpdateProcessor';