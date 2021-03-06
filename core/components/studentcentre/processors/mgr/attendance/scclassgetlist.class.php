<?php
class scClassGetList extends modObjectGetListProcessor {
    
    public $classKey = 'scClass';
    public $languageTopics = array('studentcentre:default');
    public $defaultSortField = 'class_level_category_id';
    public $defaultSortDirection = 'ASC';
    public $objectType = 'studentcentre.att';
    
    public function prepareQueryBeforeCount(xPDOQuery $c) {
	    	    
	    $c->innerJoin('scClassLevelCategory', 'ClassLevelCategory', array (
			'scClass.class_level_category_id = ClassLevelCategory.id'
		));
	    
	    $query = $this->getProperty('query');
	    if (!empty($query)) {
	        $c->where(array(
	            'scClass.name:LIKE' => '%'.$query.'%'
	            ,'OR:scClass.description:LIKE' => '%'.$query.'%'
	            ,'OR:ClassLevelCategory.name:LIKE' => '%'.$query.'%'
	        ));
	    }
	    
	    // if activeOnly parameter exists and equals 1,
		// then only get the active records
		$activeOnly = $this->getProperty('activeOnly');
		if (!empty($activeOnly)) {
	        $c->where(array(
	            'scClass.active' => $activeOnly
	        ));
	    }
	    
	    $c->select(array('
			scClass.*
			,ClassLevelCategory.name AS `category_name`
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

return 'scClassGetList';