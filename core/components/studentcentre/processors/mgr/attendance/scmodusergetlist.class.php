<?php
class scModUserGetList extends modObjectGetListProcessor {
    
    public $classKey = 'scModUser';
    public $languageTopics = array('studentcentre:default');
    public $defaultSortField = 'student_name';
    public $defaultSortDirection = 'ASC';
    public $objectType = 'studentcentre.ass';
    
	public function prepareQueryBeforeCount(xPDOQuery $c) {
	    	    
	    $c->innerJoin('modUserProfile', 'Profile', array (
			'scModUser.id = Profile.internalKey'
		));
		$c->innerJoin('scStudentProfile', 'StudentProfile', array (
			'scModUser.id = StudentProfile.internalKey'
		));
		$scheduledClassId = $this->getProperty('scheduled_class_id');
		if (!empty($scheduledClassId)) {
	    	// Since a scheduled class ID exists, only grab the students for that class
	        $c->innerJoin('scClassEnrollment', 'ClassEnrollment', array(
	        	'scModUser.id = ClassEnrollment.student_id'
	        ));
	        $c->where(array(
	            'ClassEnrollment.scheduled_class_id:=' => $scheduledClassId
	        ));
	    }
	    // if activeOnly parameter exists and equals 1,
		// then only get the active records
		$activeOnly = $this->getProperty('activeOnly');
		if (!empty($activeOnly)) {
	        $c->where(array(
	            'scModUser.active' => 1
	        ));
	    }
		$c->select(array('
			scModUser.*
			,scModUser.id AS `student_id`
			,CONCAT(StudentProfile.firstname, " ", StudentProfile.lastname) AS `student_name`
		'));
		//$c->prepare();
		//$this->modx->log(1,print_r('SQL Statement: ' . $c->toSQL(),true));
	    return $c;
	    
	}
	      
}

return 'scModUserGetList';