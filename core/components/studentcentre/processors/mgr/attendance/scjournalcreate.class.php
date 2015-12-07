<?php
class scJournalCreateProcessor extends modObjectCreateProcessor {
    public $classKey = 'scJournal';
    public $languageTopics = array('studentcentre:default');
    public $objectType = 'studentcentre.scjournal';
 
    public function beforeSet() {
    
		// set the date_created
		$date = date('Y-m-d');
		$this->setProperty('date_created',$date);
		
		// get the class_progress for the student for this scheduled class
		$student = $this->modx->getObject('scModUser', $this->getProperty('student_id'));
		$schedClass = $this->modx->getObject('scScheduledClass', $this->getProperty('class_id'));
		
		if ($student && $schedClass) {
			
			$class = $schedClass->getOne('Class');
			$classCat = $class->getOne('ClassLevelCategory');
			$progress = $this->modx->getObject('scClassProgress', array(
				'class_level_category_id' => $classCat->get('id')
				,'student_id' => $student->get('id')
			));
			
			if ($progress) {
				
				$count = $this->modx->getCount('scJournal', array('class_progress_id' => $progress->get('id')));
				if ($count == 0) {
					
					// set the next_level_id and the hours_since_leveling for the new journal object
					$nextLevel = $progress->getNextLevel();
					$this->setProperty('class_progress_id', $progress->get('id'));
					$this->setProperty('next_level_id', $nextLevel->get('id'));
					$this->setProperty('hours_since_leveling', $progress->get('hours_since_leveling'));
					
				} else {
					return $this->modx->lexicon('studentcentre.err_journal_ae');
				}
				
			} else {
				return $this->modx->lexicon('studentcentre.err_classprogress_de');
			}
			
			
		} else {
			return $this->modx->lexicon('studentcentre.err_ns_schedclass_student');
		}
		
		return parent::beforeSet();
    
    }
    
    public function beforeSave() {
        
/*
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
*/
        
        return parent::beforeSave();
        
    }
}
return 'scJournalCreateProcessor';