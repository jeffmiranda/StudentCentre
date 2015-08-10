<?php
class scJournalGetList extends modObjectGetListProcessor {
    
    public $classKey = 'scJournal';
    public $languageTopics = array('studentcentre:default');
    public $defaultSortField = 'last_modified';
    public $defaultSortDirection = 'DESC';
    public $objectType = 'studentcentre.journal';
    
    public function prepareQueryBeforeCount(xPDOQuery $c) {
	    	    
	    $c->innerJoin('scClassProgress', 'ClassProgress', array (
			'scJournal.class_progress_id = ClassProgress.id'
		));
		$c->innerJoin('scModUser', 'Student', array (
			'ClassProgress.student_id = Student.id'
		));
		
		// get the scheduClassId
	    $schedClassId = $this->getProperty('schedClassId');
	    if ($schedClassId) {
		    
		    $schedClass = $this->modx->getObject('scScheduledClass', $schedClassId);
		    $class = $schedClass->getOne('Class');
		    $classCat = $class->getOne('ClassLevelCategory');
		    $enrolledStudents = $schedClass->getMany('ClassEnrollment');
		    
		    // create array for IN clause
		    // this array contains all the student IDs that are enrolled in the scheduled class
		    $arrEnrolledStudents = array();
		    foreach ($enrolledStudents as $enrolledStudent) {
				$arrEnrolledStudents[] = $enrolledStudent->get('student_id');
			}
		    
		    $c->where(array(
	            'ClassProgress.class_level_category_id' => $classCat->get('id')
	            ,'AND:scJournal.active:=' => 1
	            ,'AND:Student.id:IN' => $arrEnrolledStudents
	        ));

	    } else {
		    
		    // schedClassId doesn't exist so don't get anything (i.e. active = -1 doesn't exist)
		    $c->where(array('scJournal.active:=' => -1));

	    }
	    
	    $query = $this->getProperty('query');
	    if (!empty($query)) {
	        $c->where(array(
	            'scJournal.belt:LIKE' => '%'.$query.'%'
	            ,'OR:scJournal.certificate:LIKE' => '%'.$query.'%'
	            ,'OR:Student.username:LIKE' => '%'.$query.'%'
	        ));
	    }
	    	    
	    $c->select(array('
			scJournal.*
			,ClassProgress.hours_since_leveling
			,ClassProgress.level_id
			,Student.id AS `student_id`
			,Student.username AS `username`
		'));
	    
		//$c->prepare();
		//$this->modx->log(1,print_r('SQL Statement: ' . $c->toSQL(),true));
	    return $c;
	    
	}
	    
    public function prepareRow(xPDOObject $object) {
	
        $ta = $object->toArray();
        
        // add the latest journal comment to the row
        $q = $this->modx->newQuery('scJournalComment');
		$q->where(array(
			'journal_id:=' => $ta['id']
		));
		$q->sortby('last_modified','DESC');
		$q->limit(1);
		
		//$q->prepare();
		//$this->modx->log(1,print_r('SQL Statement: ' . $q->toSQL(),true));
		
		$journalComment = $this->modx->getObject('scJournalComment', $q);
		
		if ($journalComment) {
			$ta['last_comment'] = $journalComment->get('comment');
		} else {
			$ta['last_comment'] = '';
		}
		
		// add the next level and the hours required for next level
		$progress = $this->modx->getObject('scClassProgress', $ta['class_progress_id']);
		$nextLevel = $progress->getNextLevel();
		if ($nextLevel) {
			$ta['next_level'] = $nextLevel->get('name');
			$ta['next_level_hours_required'] = $nextLevel->get('hours_required');
		} else {
			$ta['next_level'] = '';
			$ta['next_level_hours_required'] = '';
		}
		
        return $ta;
        
    }  

    
}

return 'scJournalGetList';