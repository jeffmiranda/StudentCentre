<?php
class scAttendanceCreateProcessor extends modObjectCreateProcessor {
    public $classKey = 'scAttendance';
    public $languageTopics = array('studentcentre:default');
    public $objectType = 'studentcentre.att';

    public function beforeSet() {
		
		// create and set date_created value
		$date = date('Y-m-d');
		$this->setProperty('date_created',$date);
		
		// if exists, properly format attendance date value
		$attDate = $this->getProperty('date');
        if (!empty($attDate)) {
	        $goodDate = date('Y-m-d', strtotime(str_replace('/','-',$attDate)));
	        $this->setProperty('date',$goodDate);
        }

		return parent::beforeSet();
		
    }

    public function beforeSave() {
        $schedClassId = $this->getProperty('scheduled_class_id');
        $studentId = $this->getProperty('student_id');
        $attDate = $this->getProperty('date');
        if (empty($attDate)) {
            $this->addFieldError('date',$this->modx->lexicon('studentcentre.att_err_ns_date'));
        } else {
	        $today = date('Y-m-d');
	        // ensure attendance date isn't in the future
	        if ($attDate > $today) {
	        	$this->addFieldError('date',$this->modx->lexicon('studentcentre.att_err_future_date'));
	        }
        }
        if (empty($schedClassId)) {
            $this->addFieldError('scheduled_class_id',$this->modx->lexicon('studentcentre.att_err_select_class'));
        }
        if (empty($studentId)) {
            $this->addFieldError('student_id',$this->modx->lexicon('studentcentre.ass_err_select_student'));
        }
        return parent::beforeSave();
    }

    public function afterSave() {
    	
    	// Get the sched class, class, and class level category
    	$schedClass = $this->object->getOne('ScheduledClass');
    	$class = $schedClass->getOne('Class');
    	$classLevelCategory = $class->getOne('ClassLevelCategory');

		// if class progress object exists grab it
		$classProgress = $this->modx->getObject('scClassProgress', array(
			'class_level_category_id' => $classLevelCategory->get('id'),
			'student_id' => $this->object->get('student_id')
		));

		// else create a new one and assign the first level to it
		if (!$classProgress) {
			// get the first level of the class
			$firstLevel = $classLevelCategory->getFirstLevel();
			if (!$firstLevel) {
				$this->modx->log(modX::LOG_LEVEL_ERROR, 'Could not get the first level of the class!');
				return $this->modx->error->failure($modx->lexicon('studentcentre.att_err_saving_stu_progress'));
			}
			$classProgress = $this->modx->newObject('scClassProgress', array(
				'class_level_category_id' => $classLevelCategory->get('id')
				,'student_id' => $this->object->get('student_id')
				,'level_id' => $firstLevel->get('id')
				,'hours_since_leveling' => 0
				,'total_hours' => 0
				,'test_ready' => 0
				,'date_created' => date('Y-m-d')
			));
		}
			
		// increment hours of class progress object
		$classProgress->addHours($this->object->get('hours'));
		
		// !Threshold Test
		if ($classProgress->isTestReady() || ($this->object->get('test') == 1)) {
			$classProgress->set('test_ready', 1);
		} else {
			$classProgress->set('test_ready', 0);
		}
		
		// save class progress object to db
		if (!$classProgress->save()) {
			$this->modx->log(modX::LOG_LEVEL_ERROR, 'Could not save the class progress object!');
			return $this->modx->error->failure($modx->lexicon('studentcentre.att_err_saving_att'));
		}	

	    return parent::afterSave();
    }
 
}
return 'scAttendanceCreateProcessor';