<?php
class scClassEnrollmentGetList extends modObjectGetListProcessor {
    
    public $classKey = 'scClassEnrollment';
    public $languageTopics = array('studentcentre:default');
    public $defaultSortField = 'username';
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
		$c->innerJoin('scClassLevelCategory', 'ClassLevelCategory', array (
			'Class.class_level_category_id = ClassLevelCategory.id'
		));
		$c->innerJoin('scLocation', 'Location', array (
			'ScheduledClass.location_id = Location.id'
		));
		
		// To sort students by level, hours since leveling, and total hours
		// the scheduled_class_id must be present
		$sortStudents = $this->getProperty('sortStudents');
		$scheduledClassId = $this->getProperty('scheduled_class_id');
	    if (!empty($sortStudents) && !empty($scheduledClassId)) {
	    	$c->leftJoin('scClassProgress', 'ClassProgress', array (
				'Student.id = ClassProgress.student_id'
			));
			$c->leftJoin('scClassLevel', 'ClassLevel', array (
				'ClassProgress.level_id = ClassLevel.id'
			));
			
			// get the class_level_category_id
			$schedClassObj = $this->modx->getObject('scScheduledClass', $scheduledClassId);
			if (!$schedClassObj) {
				$this->modx->log(1,print_r('Could not get the scScheduledClass object with ID: ' . $scheduledClassId,true));
				return $this->failure($this->modx->lexicon('studentcentre.att_err_getting_students'));
			}
			$classObj = $schedClassObj->getOne('Class');
			if (!$classObj) {
				$this->modx->log(1,print_r('Could not get the scClass object with ID: ' . $schedClassObj->get('class_id'),true));
				return $this->failure($this->modx->lexicon('studentcentre.att_err_getting_students'));
			}
			$c->where(array(
				'ClassProgress.class_level_category_id' => $classObj->get('class_level_category_id')
			));
	    }
	    
	    /**
		 * Only get the active students. This is different
		 * than the active enrollments.
		 */
	    $c->where(array('Student.active' => 1));
	    
	    $query = $this->getProperty('query');
	    if (!empty($query)) {
	        $c->where(array(
	            'Student.username:LIKE' => '%'.$query.'%'
	            ,'OR:Class.name:LIKE' => '%'.$query.'%'
	            ,'OR:Location.name:LIKE' => '%'.$query.'%'
	        ));
	    }
	    
	    // if scheduled_class_id exists,
	    // then only get the enrollments with that ID
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
	    
	    // CONCAT(StudentProfile.firstname, " ", StudentProfile.lastname) AS `student_name`   	    
	    $c->select(array('
			scClassEnrollment.*
			,Student.username
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
				,ClassLevel.name
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