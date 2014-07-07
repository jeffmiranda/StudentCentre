<?php
class scModUserGetList extends modObjectGetListProcessor {
    
    public $classKey = 'scModUser';
    public $languageTopics = array('studentcentre:default');
    public $defaultSortField = 'username';
    public $defaultSortDirection = 'ASC';
    public $objectType = 'studentcentre.stu';
    
	public function prepareQueryBeforeCount(xPDOQuery $c) {
	    	    
	    $c->innerJoin('scStudentProfile', 'StudentProfile', array (
			'scModUser.id = StudentProfile.internalKey'
		));
		
		$query = $this->getProperty('query');
	    if (!empty($query)) {
	        $c->where(array(
	            'scModUser.username:LIKE' => '%'.$query.'%'
	            ,'OR:StudentProfile.firstname:LIKE' => '%'.$query.'%'
	            ,'OR:StudentProfile.lastname:LIKE' => '%'.$query.'%'
	        ));
	    }

		
		$activeOnly = $this->getProperty('activeOnly');
		if (!empty($activeOnly)) {
	        $c->where(array(
	            'scModUser.active' => $activeOnly
	        ));
	    }
	    
		$c->select(array('
			scModUser.*
			,StudentProfile.*
		'));
		//$c->prepare();
		//$this->modx->log(1,print_r('SQL Statement: ' . $c->toSQL(),true));
	    return $c;
	    
	}
	      
}

return 'scModUserGetList';