<?php
class scScheduledClassGetList extends modObjectGetListProcessor {
    
    public $classKey = 'scScheduledClass';
    public $languageTopics = array('studentcentre:default');
    public $defaultSortField = 'class_id';
    public $defaultSortDirection = 'ASC';
    public $objectType = 'studentcentre.att';
    
    public function prepareQueryBeforeCount(xPDOQuery $c) {
	    	    
	    $c->innerJoin('scClass', 'Class', array (
			'scScheduledClass.class_id = Class.id'
		));
		$c->innerJoin('scLocation', 'Location', array (
			'scScheduledClass.location_id = Location.id'
		));
	    
	    $query = $this->getProperty('query');
	    if (!empty($query)) {
	        $c->where(array(
	            'scScheduledClass.description:LIKE' => '%'.$query.'%'
	            ,'OR:Class.name:LIKE' => '%'.$query.'%'
	            ,'OR:Location.name:LIKE' => '%'.$query.'%'
	        ));
	    }
	    
	    // if activeOnly parameter exists and equals 1,
		// then only get the active records
		$activeOnly = $this->getProperty('activeOnly');
		if (!empty($activeOnly)) {
	        $c->where(array(
	            'scScheduledClass.active' => $activeOnly
	        ));
	    }
	    
        // if location_id exists
	    $locationId = $this->getProperty('location_id');
	    if (!empty($locationId)) {
	    	// Since a location ID exists, only grab the scheduled classes for that location
	        $c->where(array(
	            'scScheduledClass.location_id:=' => $locationId
	        ));
	    }

        // if scheduled_class_id exists
	    $scheduledClassId = $this->getProperty('scheduled_class_id');
	    if (!empty($scheduledClassId)) {
	    	// Since a scheduled class ID exists, only grab that scheduled class
	        $c->where(array(
	            'scScheduledClass.id:=' => $scheduledClassId
	        ));
	    }
	    	    
	    $c->select(array('
			scScheduledClass.*
			,Class.name AS `class_name`
			,Location.name AS `location_name`
			,CONCAT(Class.name, IF(scScheduledClass.description = "", "", CONCAT(" (", scScheduledClass.description, ")"))) AS `class_name_description`
		'));
		
		$c->sortby('class_name','ASC');
		
		//$c->prepare();
		//$this->modx->log(1,print_r('SQL Statement: ' . $c->toSQL(),true));
	    return $c;
	    
	}
    
    public function prepareRow(xPDOObject $object) {
	
        $ta = $object->toArray('', false, true, true);
        
        $startDate = strtotime($ta['start_date']);
        if ($startDate) {
	        $displayStartDate = date("d/m/Y", $startDate);
	        $ta['start_date'] = $displayStartDate;
	    } else {
		    $ta['start_date'] = '';
	    }
        
        $endDate = strtotime($ta['end_date']);
        if ($endDate) {
	        $displayEndDate = date("d/m/Y", $endDate);
	        $ta['end_date'] = $displayEndDate;
	    } else {
		    $ta['end_date'] = '';
	    }

        return $ta;
        
    }
    
    public function getData() {
        $data = array();
        $limit = intval($this->getProperty('limit'));
        $start = intval($this->getProperty('start'));

        /* query for chunks */
        $c = $this->modx->newQuery($this->classKey);
        $c = $this->prepareQueryBeforeCount($c);
        //$data['total'] = $this->modx->getCount($this->classKey,$c);
        $totalResults = $this->modx->getCollection($this->classKey,$c);
        $data['total'] = (!empty($totalResults)) ? count($totalResults) : 0;
        $c = $this->prepareQueryAfterCount($c);

        $sortClassKey = $this->getSortClassKey();
        $sortKey = $this->modx->getSelectColumns($sortClassKey,$this->getProperty('sortAlias',$sortClassKey),'',array($this->getProperty('sort')));
        if (empty($sortKey)) $sortKey = $this->getProperty('sort');
        $c->sortby($sortKey,$this->getProperty('dir'));
        if ($limit > 0) {
            $c->limit($limit,$start);
        }

        $data['results'] = $this->modx->getCollection($this->classKey,$c);
        return $data;
    }

 
}

return 'scScheduledClassGetList';