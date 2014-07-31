 <?php
class scClassEnrollmentActiveGetList extends modObjectGetListProcessor {
    
    public $classKey = 'scClassEnrollment';
    public $languageTopics = array('studentcentre:default');
    public $defaultSortField = 'student_id';
    public $defaultSortDirection = 'ASC';
    public $objectType = 'studentcentre.att';

	public function prepareQueryBeforeCount(xPDOQuery $c) {
	    
        $scheduledClassId = $this->getProperty('scheduled_class_id');
        //$this->modx->log(1,print_r('Scheduled Class ID: ' . $scheduledClassId,true));
    	$c->innerJoin('scModUser', 'Student', array (
			'scClassEnrollment.student_id = Student.id'
		));
		$c->innerJoin('scModUserProfile', 'StudentProfile', array (
			'Student.id = StudentProfile.internalKey'
		));
        // if $scheduledClassId exists from cascading combobox
	    if (!empty($scheduledClassId)) {
			// Since $scheduledClassId exists, only grab the students for that scheduled class
			// and the class information
			$c->innerJoin('scScheduledClass', 'ScheduledClass', array (
				'scClassEnrollment.scheduled_class_id = ScheduledClass.id'
			));
			$c->innerJoin('scClass', 'Class', array (
				'ScheduledClass.class_id = Class.id'
			));
	        $c->where(array(
	            'scClassEnrollment.scheduled_class_id' => $scheduledClassId
	        ));
	    }
        
        // Ensure you only grab active enrollments
        $c->where(array('scClassEnrollment.active' => 1));
        
        $c->select(array('
			scClassEnrollment.*
			,ScheduledClass.id
			,Class.*
			,Student.id
			,CONCAT(StudentProfile.firstname, " ", StudentProfile.lastname) AS `student_name`
		'));
		//$c->prepare();
		//$this->modx->log(1,print_r('SQL Statement: ' . $c->toSQL(),true));
        
	    return $c;
	    
	}
    
}

return 'scClassEnrollmentActiveGetList';