<?php
class scAssignmentProgramGetList extends modObjectGetListProcessor {
    
    public $classKey = 'scAssignmentProgram';
    public $languageTopics = array('studentcentre:default');
    public $defaultSortField = 'name';
    public $defaultSortDirection = 'ASC';
    public $objectType = 'studentcentre.ass';
    
    public function prepareQueryBeforeCount(xPDOQuery $c) {
	    	    
	    $query = $this->getProperty('query');
	    if (!empty($query)) {
	        $c->where(array(
	            'scAssignmentProgram.name:LIKE' => '%'.$query.'%'
	        ));
	    }
	    
	    $activeOnly = $this->getProperty('activeOnly');
	    if (!empty($activeOnly)) {
		    $c->where(array(
		    	'scAssignmentProgram.active' => 1
		    ));
	    }

		//$c->prepare();
		//$this->modx->log(1,print_r('SQL Statement: ' . $c->toSQL(),true));
	    return $c;
	    
	}
    
    public function prepareRow(xPDOObject $object) {
	
        $ta = $object->toArray('', false, true, true);
        $timePosted = strtotime($ta['last_modified']);
        $displayTime = date("M d, Y - g:i a", $timePosted);
        $ta['last_modified'] = $displayTime; //($ta['last_modified'] > 0) ? date('Y-m-d',$ta['last_modified']) : '';
        return $ta;
        
    }  

    
}

return 'scAssignmentProgramGetList';