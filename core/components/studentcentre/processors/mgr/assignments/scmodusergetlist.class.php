<?php
class scModUserGetList extends modObjectGetListProcessor {
    
    public $classKey = 'scModUser';
    public $languageTopics = array('studentcentre:default');
    public $defaultSortField = 'username';
    public $defaultSortDirection = 'ASC';
    public $objectType = 'studentcentre.ass';
    
	public function prepareQueryBeforeCount(xPDOQuery $c) {

	    // if activeOnly parameter exists and equals 1,
		// then only get the active records
		$activeOnly = $this->getProperty('activeOnly');
		if (!empty($activeOnly)) {
	        $c->where(array(
	            'scModUser.active' => 1
	        ));
	    }
	    	    
		$c->select(array('
			scModUser.*
			,scModUser.id AS `student_id`
		'));
		//$c->prepare();
		//$this->modx->log(1,print_r('SQL Statement: ' . $c->toSQL(),true));
	    return $c;
	    
	}
	      
}

return 'scModUserGetList';