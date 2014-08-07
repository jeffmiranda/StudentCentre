<?php
class scClassLevelGetList extends modObjectGetListProcessor {
    
    public $classKey = 'scClassLevel';
    public $languageTopics = array('studentcentre:default');
    public $defaultSortField = '`order`';
    public $defaultSortDirection = 'ASC';
    public $objectType = 'studentcentre.att';
    
/*
    public function beforeQuery() {
	    
	    $limit = $this->getProperty('limit');
	    if (!empty($limit)) {
		    $this->setProperty('limit', $limit);
		}
		$this->modx->log(1,print_r('Limit: ' . $limit,true));
	    return parent::beforeQuery();
	    
    }
*/

    public function prepareQueryBeforeCount(xPDOQuery $c) {
	    	    
	    $c->innerJoin('scClassLevelCategory', 'ClassLevelCategory', array (
			'scClassLevel.class_level_category_id = ClassLevelCategory.id'
		));
	    
	    $query = $this->getProperty('query');
	    if (!empty($query)) {
	        $c->where(array(
	            'scClassLevel.name:LIKE' => '%'.$query.'%'
	            ,'OR:scClassLevel.description:LIKE' => '%'.$query.'%'
	            ,'OR:ClassLevelCategory.name:LIKE' => '%'.$query.'%'
	        ));
	    }
	    
	    // if categoryId parameter exists,
		// then only get the levels for that category
		$categoryId = $this->getProperty('category_id');
		if (!empty($categoryId)) {
	        $c->where(array(
	            'scClassLevel.category_id' => $categoryId
	        ));
	    }
	    
	    // if activeOnly parameter exists and equals 1,
		// then only get the active records
		$activeOnly = $this->getProperty('activeOnly');
		if (!empty($activeOnly)) {
	        $c->where(array(
	            'scClassLevel.active' => $activeOnly
	        ));
	    }
	    
	    $c->select(array('
			scClassLevel.*
			,ClassLevelCategory.name AS `category_name`
		'));

		$c->sortby('category_name','ASC');
		$c->sortby('`order`','ASC');
			    
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

return 'scClassLevelGetList';