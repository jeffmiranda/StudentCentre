<?php
class scAssignmentLevelActiveGetList extends modObjectGetListProcessor {
    
    public $classKey = 'scAssignmentLevel';
    public $languageTopics = array('studentcentre:default');
    public $defaultSortField = 'name';
    public $defaultSortDirection = 'ASC';
    public $objectType = 'studentcentre.ass';

	public function prepareQueryBeforeCount(xPDOQuery $c) {
	    
        $programId = $this->getProperty('program_id');
        
        // if programId exists from cascading combobox
	    if (!empty($programId)) {
	    	// Join the program table to the level table
	    	$c->innerJoin('scAssignmentProgram', 'AssignmentProgram', array (
				'scAssignmentLevel.program_id = AssignmentProgram.id'
			));
			// Since a program ID exists, only grab the levels for that program
	        $c->where(array(
	            'scAssignmentLevel.program_id:=' => $programId
	        ));
	    }
        
        // Ensure you only grab active levels
        $c->where(array('scAssignmentLevel.active' => 1));
        
	    return $c;
	    
	}
    
}

return 'scAssignmentLevelActiveGetList';