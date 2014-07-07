<?php
class scScheduledClassUpdateProcessor extends modObjectUpdateProcessor {

    public $classKey = 'scScheduledClass';
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
        
		// Properly format start date
		$startDate = $this->getProperty('start_date');
        if (!empty($startDate)) {
			$this->setProperty('start_date', date('Y-m-d', strtotime(str_replace('/','-',$startDate))));
		}
		
		// Properly format end date
		$endDate = $this->getProperty('end_date');
        if (!empty($endDate)) {
			$this->setProperty('end_date', date('Y-m-d', strtotime(str_replace('/','-',$endDate))));
		}
        
        return parent::beforeSet();
    }

}
return 'scScheduledClassUpdateProcessor';