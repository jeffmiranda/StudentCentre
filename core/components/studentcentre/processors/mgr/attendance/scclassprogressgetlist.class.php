<?php
class scClassProgressGetListProcessor extends modObjectGetListProcessor {
    
    public $classKey = 'scClassProgress';
    public $languageTopics = array('studentcentre:default');
    public $defaultSortField = 'last_modified';
    public $defaultSortDirection = 'DESC';
    public $objectType = 'studentcentre.att';
    
	public function prepareQueryBeforeCount(xPDOQuery $c) {
	    	    
	    $c->innerJoin('scModUser', 'Student', array (
			'scClassProgress.student_id = Student.id'
		));
		$c->innerJoin('modUserProfile', 'Profile', array (
			'Student.id = Profile.internalKey'
		));
		$c->innerJoin('scClass', 'Class', array (
			'scClassProgress.class_id = Class.id'
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
	            'Profile.fullname:LIKE' => '%'.$query.'%'
	            ,'OR:Class.name:LIKE' => '%'.$query.'%'
	            ,'OR:ClassLevel.name:LIKE' => '%'.$query.'%'
	        ));
	    }

		$c->select(array('
			scClassProgress.*,
			Student.id AS `student_id`,
			Profile.fullname AS `student_name`,
			Class.id AS `class_id`,
			Class.name AS `class_name`,
			ClassLevel.id AS `level_id`,
			ClassLevel.name AS `level_name`
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
        return $ta;
        
    }  
      
}

return 'scClassProgressGetListProcessor';