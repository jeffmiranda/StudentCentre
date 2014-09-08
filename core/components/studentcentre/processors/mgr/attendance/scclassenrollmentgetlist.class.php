<?php
class scClassEnrollmentGetList extends modObjectGetListProcessor {
    
    public $classKey = 'scClassEnrollment';
    public $languageTopics = array('studentcentre:default');
    public $defaultSortField = 'student_name';
    public $defaultSortDirection = 'ASC';
    public $objectType = 'studentcentre.att';
    
    public function beforeQuery() {
	    
	    $limit = $this->getProperty('limit');
	    if (!empty($limit)) {
		    $this->setProperty('limit', $limit);
		}
	    return parent::beforeQuery();
	    
    }
    
    public function prepareQueryBeforeCount(xPDOQuery $c) {
	    	    
	    $c->innerJoin('scModUser', 'Student', array (
			'scClassEnrollment.student_id = Student.id'
		));
		$c->innerJoin('scStudentProfile', 'StudentProfile', array (
			'Student.id = StudentProfile.internalKey'
		));
		$c->innerJoin('scScheduledClass', 'ScheduledClass', array (
			'scClassEnrollment.scheduled_class_id = ScheduledClass.id'
		));
		$c->innerJoin('scClass', 'Class', array (
			'ScheduledClass.class_id = Class.id'
		));
		$c->innerJoin('scLocation', 'Location', array (
			'ScheduledClass.location_id = Location.id'
		));
		
		$sortStudents = $this->getProperty('sortStudents');
	    if (!empty($sortStudents)) {
	    	$c->leftJoin('scClassProgress', 'ClassProgress', array (
				'Student.id = ClassProgress.student_id'
			));
			$c->leftJoin('scClassLevel', 'ClassLevel', array (
				'ClassProgress.level_id = ClassLevel.id'
			));
	    }
	    
	    $query = $this->getProperty('query');
	    if (!empty($query)) {
	        $c->where(array(
	            'StudentProfile.firstname:LIKE' => '%'.$query.'%'
	            ,'OR:StudentProfile.lastname:LIKE' => '%'.$query.'%'
	            ,'OR:Class.name:LIKE' => '%'.$query.'%'
	            ,'OR:Location.name:LIKE' => '%'.$query.'%'
	        ));
	    }
	    
	    // if scheduled_class_id exists,
	    // then only get the enrollments with that ID
	    $scheduledClassId = $this->getProperty('scheduled_class_id');
	    if (!empty($scheduledClassId)) {
	    	$c->where(array(
	            'scClassEnrollment.scheduled_class_id' => $scheduledClassId
	        ));
	    }
	    
	    // if activeOnly parameter exists and equals 1,
		// then only get the active records
		$activeOnly = $this->getProperty('activeOnly');
		if (!empty($activeOnly)) {
	        $c->where(array(
	            'scClassEnrollment.active' => $activeOnly
	        ));
	    }
	    	    	    
	    $c->select(array('
			scClassEnrollment.*
			,CONCAT(StudentProfile.firstname, " ", StudentProfile.lastname) AS `student_name`
			,Class.name AS `class_name`
			,Location.name AS `location_name`
			,ScheduledClass.description AS `description`
			,ScheduledClass.duration AS `duration`
		'));
		
		if (!empty($sortStudents)) {
			$c->select(array('
				ClassProgress.level_id
				,ClassProgress.hours_since_leveling
				,ClassProgress.total_hours
				,ClassLevel.`order`
			'));
			$c->groupby('scClassEnrollment.student_id');
			$c->sortby('ClassLevel.`order`', 'DESC');
			$c->sortby('ClassProgress.hours_since_leveling', 'DESC');
			$c->sortby('ClassProgress.total_hours', 'DESC');
		}
		
		//$c->prepare();
		//$this->modx->log(1,print_r('SQL Statement: ' . $c->toSQL(),true));
	    return $c;
	    
	}
	    
    public function prepareRow(xPDOObject $object) {
	
        $ta = $object->toArray('', false, true, true);
        $dateCreated = strtotime($ta['date_created']);
        $displayDateCreated = date("d/m/Y", $dateCreated);
        $ta['date_created'] = $displayDateCreated;
        return $ta;
        
    }  
 
}

return 'scClassEnrollmentGetList';