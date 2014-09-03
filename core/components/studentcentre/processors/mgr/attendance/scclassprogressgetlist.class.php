<?php
class scClassProgressGetListProcessor extends modObjectGetListProcessor {
    
    public $classKey = 'scClassProgress';
    public $languageTopics = array('studentcentre:default');
    public $defaultSortField = 'total_hours';
    public $defaultSortDirection = 'DESC';
    public $objectType = 'studentcentre.att';
    
	public function prepareQueryBeforeCount(xPDOQuery $c) {
	    	    
	    $c->innerJoin('scModUser', 'Student', array (
			'scClassProgress.student_id = Student.id'
		));
		$c->innerJoin('scModUserProfile', 'StudentProfile', array (
			'Student.id = StudentProfile.internalKey'
		));
		$c->innerJoin('scClassLevelCategory', 'ClassLevelCategory', array (
			'scClassProgress.class_level_category_id = ClassLevelCategory.id'
		));
		$c->innerJoin('scClassLevel', 'ClassLevel', array (
			'scClassProgress.level_id = ClassLevel.id'
		));
		
		// if testReadyOnly parameter exists and equals 1,
		// then only get the progress object that are ready to test
		$testReadyOnly = $this->getProperty('testReadyOnly');
		if (!empty($testReadyOnly)) {
	        $c->where(array(
	            'scClassProgress.test_ready' => $testReadyOnly
	        ));
	    }
		
		$query = $this->getProperty('query');
	    if (!empty($query)) {
	        $c->where(array(
	            'StudentProfile.firstname:LIKE' => '%'.$query.'%'
	            ,'OR:StudentProfile.lastname:LIKE' => '%'.$query.'%'
	            ,'OR:ClassLevelCategory.name:LIKE' => '%'.$query.'%'
	            ,'OR:ClassLevel.name:LIKE' => '%'.$query.'%'
	        ));
	    }

		$c->select(array('
			scClassProgress.*
			,Student.id AS `student_id`
			,CONCAT(StudentProfile.firstname, " ", StudentProfile.lastname) AS `student_name`
			,ClassLevelCategory.id AS `class_level_category_id`
			,ClassLevelCategory.name AS `class_level_category_name`
			,ClassLevel.id AS `level_id`
			,ClassLevel.name AS `level_name`
		'));
		
		//$c->prepare();
		//$this->modx->log(1,print_r('SQL Statement: ' . $c->toSQL(),true));
	    return $c;
	    
	}
	
	public function prepareRow(xPDOObject $object) {
	
        $ta = $object->toArray('', false, true, true);
        //$this->modx->log(1,print_r($ta,true));
        $timePosted = strtotime($ta['last_modified']);
        $displayTime = date("M d, Y - g:i a", $timePosted);
        $ta['last_modified'] = $displayTime; //($ta['last_modified'] > 0) ? date('Y-m-d',$ta['last_modified']) : '';
        
        $testReadyOnly = $this->getProperty('testReadyOnly');
		if (!empty($testReadyOnly)) {
        	$nextLevel = $object->getNextLevel();
        	if ($nextLevel) {
	        	$ta['next_level_id'] = $nextLevel->get('id');
	        	$ta['next_level_name'] = $nextLevel->get('name');
        	}
        }
        return $ta;
        
    }  
      
}

return 'scClassProgressGetListProcessor';