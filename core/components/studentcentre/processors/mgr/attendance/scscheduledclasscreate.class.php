<?php
class scScheduledClassCreateProcessor extends modObjectCreateProcessor {
    public $classKey = 'scScheduledClass';
    public $languageTopics = array('studentcentre:default');
    public $objectType = 'studentcentre.att';
 
    public function beforeSet() {
    
		$date = date('Y-m-d');
		$this->setProperty('date_created',$date);
		
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
    
    public function beforeSave() {
        
        $classId = $this->getProperty('class_id');
        if (empty($classId)) {
            $this->addFieldError('class_id',$this->modx->lexicon('studentcentre.att_err_ns_class_id'));
        }
        
        $locationId = $this->getProperty('location_id');
        if (empty($locationId)) {
            $this->addFieldError('location_id',$this->modx->lexicon('studentcentre.att_err_ns_location_id'));
        }
        
        $duration = $this->getProperty('duration');
        if (empty($duration)) {
            $this->addFieldError('duration',$this->modx->lexicon('studentcentre.att_err_ns_duration'));
        }
                
        return parent::beforeSave();
        
    }
}
return 'scScheduledClassCreateProcessor';