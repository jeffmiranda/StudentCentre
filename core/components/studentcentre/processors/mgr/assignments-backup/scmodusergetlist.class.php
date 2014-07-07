<?php
class scModUserGetList extends modObjectGetListProcessor {
    
    public $classKey = 'scModUser';
    public $languageTopics = array('studentcentre:default');
    public $defaultSortField = 'student_name';
    public $defaultSortDirection = 'ASC';
    public $objectType = 'studentcentre.ass';
    
	public function prepareQueryBeforeCount(xPDOQuery $c) {
	    	    
	    $c->innerJoin('modUserProfile', 'Profile', array (
			'scModUser.id = Profile.internalKey'
		));
		$c->where(array(
            'scModUser.active' => 1
        ));
		$c->select(array('
			scModUser.*,
			scModUser.id AS `student_id`,
			Profile.fullname AS `student_name`
		'));
		//$c->prepare();
		//$this->modx->log(1,print_r('SQL Statement: ' . $c->toSQL(),true));
	    return $c;
	    
	}
	      
}

return 'scModUserGetList';