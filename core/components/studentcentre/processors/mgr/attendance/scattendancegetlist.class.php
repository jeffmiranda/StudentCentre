<?php
class scAttendanceGetListProcessor extends modObjectGetListProcessor {
    
    public $classKey = 'scAttendance';
    public $languageTopics = array('studentcentre:default');
    public $defaultSortField = 'date';
    public $defaultSortDirection = 'DESC';
    public $objectType = 'studentcentre.att';
    
	public function prepareQueryBeforeCount(xPDOQuery $c) {
	    	    
	    $c->innerJoin('scModUser', 'Student', array (
			'scAttendance.student_id = Student.id'
		));
		$c->innerJoin('modUserProfile', 'Profile', array (
			'Student.id = Profile.internalKey'
		));
		$c->innerJoin('scScheduledClass', 'ScheduledClass', array (
			'scAttendance.scheduled_class_id = ScheduledClass.id'
		));
		$c->innerJoin('scLocation', 'Location', array (
			'ScheduledClass.location_id = Location.id'
		));
		$c->innerJoin('scClass', 'Class', array (
			'ScheduledClass.class_id = Class.id'
		));
		
		$query = $this->getProperty('query');
	    if (!empty($query)) {
	        $c->where(array(
	            'Profile.fullname:LIKE' => '%'.$query.'%',
	            'OR:Location.name:LIKE' => '%'.$query.'%',
	            'OR:Class.name:LIKE' => '%'.$query.'%'
	        ));
	    }

		$c->select(array('
			scAttendance.*,
			Student.id AS `student_id`,
			Profile.fullname AS `student_name`,
			Location.id AS `location_id`,
			Location.name AS `location_name`,
			Class.name AS `class_name`
		'));
		//$c->prepare();
		//$this->modx->log(1,print_r('SQL Statement: ' . $c->toSQL(),true));
	    return $c;
	    
	}
	
	public function prepareRow(xPDOObject $object) {
	
        $ta = $object->toArray('', false, true, true);
        //$this->modx->log(1,print_r($ta,true));
        $attDate = strtotime($ta['date']);
        $displayDate = date("d/m/Y", $attDate);
        $ta['date'] = $displayDate; //($ta['last_modified'] > 0) ? date('Y-m-d',$ta['last_modified']) : '';
        return $ta;
        
    }  
      
}

return 'scAttendanceGetListProcessor';