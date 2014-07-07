<?php
class scAssignmentGetListProcessor extends modObjectGetListProcessor {
    
    public $classKey = 'scAssignment';
    public $languageTopics = array('studentcentre:default');
    public $defaultSortField = 'program_id';
    public $defaultSortDirection = 'ASC';
    public $objectType = 'studentcentre.ass';
    
	public function prepareQueryBeforeCount(xPDOQuery $c) {
	    	    
	    $c->innerJoin('scAssignmentLevel', 'Level', array (
			'scAssignment.level_id = Level.id'
		));
		$c->innerJoin('scAssignmentProgram', 'Program', array (
			'scAssignment.program_id = Program.id'
		));
		
		$query = $this->getProperty('query');
	    if (!empty($query)) {
	        $c->where(array(
	            'scAssignment.name:LIKE' => '%'.$query.'%',
	            'OR:scAssignment.description:LIKE' => '%'.$query.'%',
	            'OR:Level.name:LIKE' => '%'.$query.'%',
	            'OR:Program.name:LIKE' => '%'.$query.'%'
	        ));
	    }

		$c->select(array('
			scAssignment.*,
			Program.name AS `program_name`,
			Level.name AS `level_name`
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

return 'scAssignmentGetListProcessor';