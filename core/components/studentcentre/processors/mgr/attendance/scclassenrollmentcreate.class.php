<?php
class scClassEnrollmentCreateProcessor extends modObjectCreateProcessor {
    public $classKey = 'scClassEnrollment';
    public $languageTopics = array('studentcentre:default');
    public $objectType = 'studentcentre.att';
 
    public function beforeSet() {
    
		$date = date('Y-m-d');
		$this->setProperty('date_created',$date);
		return parent::beforeSet();
    
    }
    
    public function beforeSave() {
        
        $studentId = $this->getProperty('student_id');
        if (empty($studentId)) {
            $this->addFieldError('student_id',$this->modx->lexicon('studentcentre.att_err_ns_student_id'));
        }

        $scheduledClassId = $this->getProperty('scheduled_class_id');
        if (empty($scheduledClassId)) {
            $this->addFieldError('scheduled_class_id',$this->modx->lexicon('studentcentre.att_err_ns_scheduled_class_id'));
        }
        
        // ensure that this student isn't already enrolled in this scheduled class
        $classes = $this->modx->getCount('scClassEnrollment', array(
        	'student_id' => $studentId
        	,'scheduled_class_id' => $scheduledClassId
        ));
        if ($classes > 0) {
	        $this->addFieldError('scheduled_class_id',$this->modx->lexicon('studentcentre.att_err_already_enrolled'));
        }
                
        return parent::beforeSave();
        
    }
    
    public function afterSave() {
	    
	    // Create the scClassProgress record
		$scheduledClass = $this->object->getOne('ScheduledClass');
		$class = $scheduledClass->getOne('Class');
		$classLevelCategory = $class->getOne('ClassLevelCategory');
		if (!$classLevelCategory) {
			$this->modx->log(modX::LOG_LEVEL_ERROR, 'Could not get the class level category object!');
			return $this->failure($this->modx->lexicon('studentcentre.att_err_creating_classprogress'));
		}
		$firstLevel = $classLevelCategory->getFirstLevel();
		if (!$firstLevel) {
			$this->modx->log(modX::LOG_LEVEL_ERROR, 'Could not get the first level of the class!');
			return $this->failure($this->modx->lexicon('studentcentre.att_err_creating_classprogress'));
		}
		// Check to see if ClassProgress object for this level category already exists.
		$classProgressCount = $this->modx->getCount('scClassProgress', array(
        	'class_level_category_id' => $classLevelCategory->get('id')
        	,'student_id' => $this->object->get('student_id')
        ));
        if ($classProgressCount < 1) {
        	// the ClassProgress object doesn't exist for this level category, so create it!
			$classProgress = $this->modx->newObject('scClassProgress', array(
				'class_level_category_id' => $classLevelCategory->get('id')
				,'student_id' => $this->object->get('student_id')
				,'level_id' => $firstLevel->get('id')
				,'hours_since_leveling' => 0
				,'total_hours' => 0
				,'test_ready' => 0
				,'date_created' => date('Y-m-d')
			));
			// save class progress object to db
			if (!$classProgress->save()) {
				$this->modx->log(modX::LOG_LEVEL_ERROR, 'Could not save the class progress object!');
				return $this->failure($this->modx->lexicon('studentcentre.att_err_creating_classprogress'));
			}
		}
		
		return parent::afterSave();
	    
    }
}
return 'scClassEnrollmentCreateProcessor';