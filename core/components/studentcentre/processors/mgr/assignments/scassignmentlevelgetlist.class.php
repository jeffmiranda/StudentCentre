<?php
class scAssignmentLevelGetList extends modObjectGetListProcessor {
    
    public $classKey = 'scAssignmentLevel';
    public $languageTopics = array('studentcentre:default');
    public $defaultSortField = 'name';
    public $defaultSortDirection = 'ASC';
    public $objectType = 'studentcentre.ass';
    
    public function prepareQueryBeforeCount(xPDOQuery $c) {
	    	    
	    $c->innerJoin('scAssignmentProgram', 'AssignmentProgram', array (
			'scAssignmentLevel.program_id = AssignmentProgram.id'
		));
		
		$query = $this->getProperty('query');
		$programId = $this->getProperty('program_id');
		
		// if query exists from searching the grid create the where clause
	    if (!empty($query)) {
	        $c->where(array(
	            'name:LIKE' => '%'.$query.'%',
	            'OR:AssignmentProgram.name:LIKE' => '%'.$query.'%',
	        ));
	    }
	    
	    // if programId exists from cascading combobox
	    if (!empty($programId)) {
	        $c->where(array(
	            'scAssignmentLevel.program_id:=' => $programId
	        ));
	    }
	    
	    $c->select(array('
			scAssignmentLevel.*,
			AssignmentProgram.name AS `program_name`
		'));

		//$c->prepare();
		//error_log(print_r('SQL Statement: ' . $c->toSQL(),true));
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

return 'scAssignmentLevelGetList';