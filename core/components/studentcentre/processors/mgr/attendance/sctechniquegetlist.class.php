<?php
class scTechniqueGetList extends modObjectGetListProcessor {
    
    public $classKey = 'scTechnique';
    public $languageTopics = array('studentcentre:default');
    public $defaultSortField = 'name';
    public $defaultSortDirection = 'ASC';
    public $objectType = 'studentcentre.att';
    
    public function prepareQueryBeforeCount(xPDOQuery $c) {
	    	    
	    $query = $this->getProperty('query');
	    if (!empty($query)) {
	        $c->where(array(
	            'scTechnique.name:LIKE' => '%'.$query.'%'
	            ,'OR:scTechnique.description:LIKE' => '%'.$query.'%'
	        ));
	    }
	    
	    // if activeOnly parameter exists and equals 1,
		// then only get the active records
		$activeOnly = $this->getProperty('activeOnly');
		if (!empty($activeOnly)) {
	        $c->where(array(
	            'scTechnique.active' => $activeOnly
	        ));
	    }
	    
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

return 'scTechniqueGetList';