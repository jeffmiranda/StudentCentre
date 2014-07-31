<?php
class scStudentAssignmentEnrollmentGetListProcessor extends modObjectGetListProcessor {
    
    public $classKey = 'scAssignmentEnrollment';
    public $languageTopics = array('studentcentre:default');
    public $defaultSortField = 'student_name';
    public $defaultSortDirection = 'ASC';
    public $objectType = 'studentcentre.ass';
    
	public function prepareQueryBeforeCount(xPDOQuery $c) {
	    	    
/*
	    // commented out on 12/12/2013
	    $c->innerJoin('modUser', 'User', array (
			'scAssignmentEnrollment.student_id = User.id'
		));
		$c->innerJoin('modUserProfile', 'Profile', array (
			'User.id = Profile.id'
		));
*/
		$c->innerJoin('scModUser', 'Student', array (
			'scAssignmentEnrollment.student_id = Student.id'
		));
		$c->innerJoin('scModUserProfile', 'StudentProfile', array (
			'Student.id = StudentProfile.internalKey'
		));
		$c->innerJoin('scAssignmentProgram', 'AssignmentProgram', array (
			'scAssignmentEnrollment.program_id = AssignmentProgram.id'
		));
		$c->innerJoin('scAssignmentLevel', 'AssignmentLevel', array (
			'scAssignmentEnrollment.level_id = AssignmentLevel.id'
		));
		
		$query = $this->getProperty('query');
	    if (!empty($query)) {
	        $c->where(array(
	            'StudentProfile.firstname:LIKE' => '%'.$query.'%'
	            ,'OR:StudentProfile.lastname:LIKE' => '%'.$query.'%'
	            ,'OR:AssignmentProgram.name:LIKE' => '%'.$query.'%'
	            ,'OR:AssignmentLevel.name:LIKE' => '%'.$query.'%'
	        ));
	    }

		$c->select(array('
			scAssignmentEnrollment.*
			,CONCAT(StudentProfile.firstname, " ", StudentProfile.lastname) AS `student_name`
			,AssignmentProgram.name AS `program_name`
			,AssignmentLevel.name AS `level_name`
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

return 'scStudentAssignmentEnrollmentGetListProcessor';