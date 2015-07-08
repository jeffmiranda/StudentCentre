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
			,Student.id AS `student_id`
			,Student.username AS `username`
		'));
	    
		//$c->prepare();
		//$this->modx->log(1,print_r('SQL Statement: ' . $c->toSQL(),true));
	    return $c;
	    
	}
	
/*
	public function afterIteration(array $list) {
		
		// grab all the journal IDs first
		$arrJournalIds = array();
		foreach ($list as $row) {
			$arrJournalIds[] = $row['id'];
		}
		
		// create the query to get the journal comments
		$q = $this->modx->newQuery('scJournalComment');
		$q->where(array(
			'journal_id:IN' => $arrJournalIds
		));
		$q->sortby('journal_id','ASC');
		$q->sortby('date_created','DESC');
		$q->groupby('journal_id');
		
		$q->prepare();
		$this->modx->log(1,print_r('SQL Statement: ' . $q->toSQL(),true));
		
		$journalComments = $this->modx->getCollection('scJournalComment', $q);
		
		$this->modx->log(1,print_r($list,true));
        return $list;
    }
*/
    
    public function prepareRow(xPDOObject $object) {
	
        $ta = $object->toArray();
        
        $q = $this->modx->newQuery('scJournalComment');
		$q->where(array(
			'journal_id:=' => $ta['id']
		));
		$q->sortby('date_created','DESC');
		$q->limit(1);
		
		$q->prepare();
		$this->modx->log(1,print_r('SQL Statement: ' . $q->toSQL(),true));
		
		$journalComment = $this->modx->getObject('scJournalComment', $q);
		
		if ($journalComment) {
			$ta['last_comment'] = $journalComment->get('comment');
		} else {
			$ta['last_comment'] = '';
		}
		
/*
        //$this->modx->log(1,print_r($ta,true));
        $timePosted = strtotime($ta['last_modified']);
        $displayTime = date("M d, Y - g:i a", $timePosted);
        $ta['last_modified'] = $displayTime; //($ta['last_modified'] > 0) ? date('Y-m-d',$ta['last_modified']) : '';
*/
        return $ta;
        
    }  

    
}

return 'scJournalGetList';