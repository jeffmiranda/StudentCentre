<?php
class scStudentAssignmentGetListProcessor extends modObjectGetListProcessor {
    
    public $classKey = 'scStudentAssignment';
    public $languageTopics = array('studentcentre:default');
    public $defaultSortField = 'status';
    public $defaultSortDirection = 'DESC';
    public $objectType = 'studentcentre.ass';
    
	public function prepareQueryBeforeCount(xPDOQuery $c) {
	    	    
	    $c->innerJoin('scModUser', 'Student', array (
			'scStudentAssignment.student_id = Student.id'
		));
		$c->innerJoin('scAssignment', 'Assignment', array (
			'scStudentAssignment.assignment_id = Assignment.id'
		));
		$c->innerJoin('scAssignmentProgram', 'AssignmentProgram', array (
			'Assignment.program_id = AssignmentProgram.id'
		));
		$c->innerJoin('scAssignmentLevel', 'AssignmentLevel', array (
			'Assignment.level_id = AssignmentLevel.id'
		));
		$c->where(array(
            'scStudentAssignment.active' => true
        ));
		
		$query = $this->getProperty('query');
	    if (!empty($query)) {
	        $c->where(array(
	            'Student.username:LIKE' => '%'.$query.'%'
	            ,'OR:Assignment.name:LIKE' => '%'.$query.'%'
	            ,'OR:status:LIKE' => '%'.$query.'%'
	            ,'OR:AssignmentProgram.name:LIKE' => '%'.$query.'%'
	            ,'OR:AssignmentLevel.name:LIKE' => '%'.$query.'%'
	        ));
	    }

		$c->select(array('
			scStudentAssignment.*
			,Student.username
			,Assignment.name AS `assignment_name`
			,Assignment.description AS `assignment_desc`
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

return 'scStudentAssignmentGetListProcessor';